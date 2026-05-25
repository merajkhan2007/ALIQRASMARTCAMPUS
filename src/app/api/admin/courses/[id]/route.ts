export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const role = payload.role as string;
        if (role !== "ADMIN" && role !== "SUPER_ADMIN") return null;
        return role;
    } catch {
        return null;
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { name, code, classId, teacherId } = body;

        if (!name || !code || !classId) {
            return NextResponse.json({ message: "Name, Code, and Target Class are required" }, { status: 400 });
        }

        // Check code uniqueness excluding current course
        const existing = await db.subject.findFirst({
            where: { code, id: { not: id } }
        });
        if (existing) {
            return NextResponse.json({ message: "Course Code already exists" }, { status: 400 });
        }

        const updated = await db.subject.update({
            where: { id },
            data: {
                name,
                code,
                classId,
                teacherId: teacherId || null,
            },
            include: {
                class: true,
                teacher: { include: { user: true } },
            },
        });

        return NextResponse.json({ message: "Course updated successfully", subject: updated });
    } catch (error: any) {
        console.error("Error updating course:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await db.subject.delete({ where: { id } });

        return NextResponse.json({ message: "Course deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting course:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}