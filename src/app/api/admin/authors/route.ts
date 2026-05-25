import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-for-dev-only");

export async function GET() {
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
        } catch {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const authors = await db.user.findMany({
            where: {
                role: { in: ["ADMIN", "SUPER_ADMIN", "TEACHER", "HAFIZ"] },
            },
            select: {
                id: true,
                name: true,
                role: true,
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json({ authors });
    } catch (error: any) {
        console.error("Error fetching authors:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}