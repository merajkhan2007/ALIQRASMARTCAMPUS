import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const updateProcessSchema = z.object({
    studentId: z.string(),
    surah: z.string().optional(),
    juz: z.number().optional(),
    tajweedGrade: z.string().optional(),
    dailyHadith: z.boolean().optional(),
    ramzanFasting: z.number().optional(),
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get("studentId");

        if (!studentId) {
            return NextResponse.json(
                { message: "studentId query parameter is required" },
                { status: 400 }
            );
        }

        const progress = await db.islamicProgress.findUnique({
            where: { studentId },
            include: {
                student: { select: { admissionNo: true, user: { select: { name: true } } } },
            },
        });

        if (!progress) {
            return NextResponse.json(
                { message: "No Islamic progress found for this student" },
                { status: 404 }
            );
        }

        return NextResponse.json(progress, { status: 200 });
    } catch (error) {
        console.error("GET Islamic Progress error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = updateProcessSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation error", errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = result.data;

        const progress = await db.islamicProgress.upsert({
            where: { studentId: data.studentId },
            update: {
                surah: data.surah,
                juz: data.juz,
                tajweedGrade: data.tajweedGrade,
                dailyHadith: data.dailyHadith,
                ramzanFasting: data.ramzanFasting,
                lastUpdated: new Date(),
            },
            create: {
                studentId: data.studentId,
                surah: data.surah,
                juz: data.juz,
                tajweedGrade: data.tajweedGrade,
                dailyHadith: data.dailyHadith || false,
                ramzanFasting: data.ramzanFasting,
            },
        });

        return NextResponse.json(
            { message: "Islamic progress updated successfully", progress },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST Islamic Progress error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
