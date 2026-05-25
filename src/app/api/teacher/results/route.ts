export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

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
        const { results } = body;

        if (!results || !Array.isArray(results)) {
            return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
        }

        // Use Prisma transaction to upsert all results
        const transactionResult = await db.$transaction(
            results.map((record: any) => 
                db.result.upsert({
                    where: {
                        examId_studentId: {
                            examId: record.examId,
                            studentId: record.studentId
                        }
                    },
                    update: {
                        obtainedMarks: record.obtainedMarks
                    },
                    create: {
                        examId: record.examId,
                        studentId: record.studentId,
                        obtainedMarks: record.obtainedMarks
                    }
                })
            )
        );

        return NextResponse.json(
            { message: "Results saved successfully", count: transactionResult.length },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error saving results:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
