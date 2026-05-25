export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { z } from "zod";

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
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
        const result = passwordSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Validation error", errors: result.error.flatten().fieldErrors }, { status: 400 });
        }

        const { currentPassword, newPassword } = result.data;

        // Get current user from DB
        const user = await db.user.findUnique({ where: { id: payload.id } });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.user.update({
            where: { id: payload.id },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Password change error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}