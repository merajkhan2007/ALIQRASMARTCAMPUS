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
        const { name, section, capacity, classTeacherId } = body;

        if (!name || !capacity) {
            return NextResponse.json({ message: "Name and capacity are required" }, { status: 400 });
        }

        // Check if class with same name and section already exists
        const existingClass = await db.class.findFirst({
            where: {
                name,
                section: section || null
            }
        });

        if (existingClass) {
            return NextResponse.json({ message: "Class with this name and section already exists" }, { status: 400 });
        }

        const newClass = await db.class.create({
            data: {
                name,
                section: section || null,
                capacity: parseInt(capacity, 10),
                classTeacherId: classTeacherId || null
            }
        });

        return NextResponse.json(
            { message: "Class created successfully", class: newClass },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error creating class:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
