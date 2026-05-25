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

        let userRole = "";
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            userRole = payload.role as string;
        } catch (error) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
            return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
        }

        const body = await req.json();
        const { name, code, classId, teacherId } = body;

        if (!name || !code || !classId) {
            return NextResponse.json({ message: "Name, Code, and Target Class are required" }, { status: 400 });
        }

        // Check if code already exists
        const existingSubject = await db.subject.findUnique({
            where: { code }
        });

        if (existingSubject) {
            return NextResponse.json({ message: "Course Code already exists" }, { status: 400 });
        }

        const subject = await db.subject.create({
            data: {
                name,
                code,
                classId,
                teacherId: teacherId || null
            }
        });

        return NextResponse.json(
            { message: "Course created successfully", subject },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error creating course:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
