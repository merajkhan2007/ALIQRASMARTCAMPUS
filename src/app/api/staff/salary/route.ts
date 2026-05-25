import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

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

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.id as string;

        const user = await db.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true, role: true }
        });

        const salaries = await db.staffSalary.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ user, salaries });
    } catch (error) {
        console.error("Staff fetch salaries error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
