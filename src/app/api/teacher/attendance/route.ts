import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let userRole = "";
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            userRole = payload.role as string;
        } catch (error) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (userRole !== "TEACHER" && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const url = new URL(req.url);
        const classId = url.searchParams.get("classId");
        const dateStr = url.searchParams.get("date");

        if (!classId || !dateStr) {
            return NextResponse.json({ message: "Missing classId or date parameters" }, { status: 400 });
        }

        // Use a date range to match records regardless of stored time component
        const startOfDay = new Date(dateStr);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(dateStr);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const records = await db.attendance.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                student: {
                    classId: classId
                }
            },
            select: {
                studentId: true,
                status: true
            }
        });

        return NextResponse.json({ records }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching attendance:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let userId = "";
        let userRole = "";
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            userId = payload.id as string;
            userRole = payload.role as string;
        } catch (error) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (userRole !== "TEACHER" && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { attendanceRecords } = body;

        if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
            return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
        }

        // Normalize all dates to midday UTC (matching the admin attendance API convention)
        // to avoid timezone edge-case mismatches in the @@unique([studentId, date]) constraint
        const normalizeDate = (dateStr: string) => {
            const d = new Date(dateStr);
            d.setUTCHours(12, 0, 0, 0);
            return d;
        };

        // Use Prisma transaction to upsert all attendance records
        const result = await db.$transaction(
            attendanceRecords.map((record: any) => {
                const normalizedDate = normalizeDate(record.date);
                return db.attendance.upsert({
                    where: {
                        studentId_date: {
                            studentId: record.studentId,
                            date: normalizedDate
                        }
                    },
                    update: {
                        status: record.status
                    },
                    create: {
                        studentId: record.studentId,
                        date: normalizedDate,
                        status: record.status
                    }
                });
            })
        );

        return NextResponse.json(
            { message: "Attendance saved successfully", count: result.length },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error saving attendance:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
