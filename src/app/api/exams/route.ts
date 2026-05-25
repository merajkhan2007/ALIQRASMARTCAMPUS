export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createExamSchema = z.object({
    title: z.string().min(1, "Title is required"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    maxMarks: z.number().min(1),
    subjectId: z.string(),
});

export async function GET(req: Request) {
    try {
        const exams = await db.exam.findMany({
            include: {
                subject: {
                    include: { class: true },
                },
            },
            orderBy: { date: "desc" },
        });

        return NextResponse.json(exams, { status: 200 });
    } catch (error) {
        console.error("GET Exams error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = createExamSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation error", errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { title, date, maxMarks, subjectId } = result.data;

        const newExam = await db.exam.create({
            data: {
                title,
                date: new Date(date),
                maxMarks,
                subjectId,
            },
            include: {
                subject: { select: { name: true, class: { select: { name: true } } } },
            },
        });

        return NextResponse.json(
            { message: "Exam created successfully", exam: newExam },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST Exam error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
