export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email").optional(),
    phone: z.string().optional(),
});

export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const payload = verifyToken<{ id: string; role: string }>(token);
        if (!payload || (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN")) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const result = profileSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Validation error", errors: result.error.flatten().fieldErrors }, { status: 400 });
        }

        const { name, email, phone } = result.data;

        // If email is changing, check uniqueness
        if (email) {
            const existing = await db.user.findFirst({
                where: { email, id: { not: payload.id } },
            });
            if (existing) {
                return NextResponse.json({ message: "Email already in use" }, { status: 409 });
            }
        }

        const updated = await db.user.update({
            where: { id: payload.id },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(phone !== undefined && { phone }),
            },
            select: { id: true, name: true, email: true, phone: true, role: true },
        });

        return NextResponse.json({ message: "Profile updated", user: updated });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}