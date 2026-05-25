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
        const { title, content, classId, targetRoles } = body;

        if (!title || !content) {
            return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
        }

        const notice = await db.notice.create({
            data: {
                title,
                content,
                classId: classId || null,
                targetRoles: targetRoles || null,
                authorId: userId
            },
            include: {
                author: {
                    select: {
                        name: true,
                        role: true
                    }
                },
                class: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return NextResponse.json(
            { message: "Notice created successfully", notice },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error creating notice:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
