import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const markAttendanceSchema = z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    records: z.array(
        z.object({
            studentId: z.string(),
            status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY"]),
            remarks: z.string().optional(),
        })
    ),
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");
        const classId = searchParams.get("classId");

        if (!date || !classId) {
            return NextResponse.json(
                { message: "Date and classId are required query parameters" },
                { status: 400 }
            );
        }

        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const attendances = await db.attendance.findMany({
            where: {
                date: { gte: startOfDay, lte: endOfDay },
                student: { classId },
            },
            include: {
                student: {
                    include: { user: { select: { name: true, email: true } } },
                },
            },
        });

        return NextResponse.json(attendances, { status: 200 });
    } catch (error) {
        console.error("GET Attendance error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = markAttendanceSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation error", errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { date, records } = result.data;
        const attendanceDate = new Date(date);
        attendanceDate.setUTCHours(12, 0, 0, 0); // Normalize time to midday to avoid timezone edge case drops

        const operations = records.map((record) =>
            db.attendance.upsert({
                where: {
                    studentId_date: {
                        studentId: record.studentId,
                        date: attendanceDate,
                    },
                },
                update: {
                    status: record.status,
                    remarks: record.remarks,
                },
                create: {
                    studentId: record.studentId,
                    date: attendanceDate,
                    status: record.status,
                    remarks: record.remarks,
                },
            })
        );

        const completed = await db.$transaction(operations);

        return NextResponse.json(
            { message: "Attendance saved successfully", count: completed.length },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST Attendance error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
