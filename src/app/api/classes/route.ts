import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createClassSchema = z.object({
    name: z.string().min(1, "Class name is required"),
    section: z.string().optional(),
    capacity: z.number().min(1).default(30),
    classTeacherId: z.string().optional(),
});

export async function GET(req: Request) {
    try {
        const classes = await db.class.findMany({
            include: {
                classTeacher: {
                    include: {
                        user: { select: { name: true, email: true } },
                    },
                },
                _count: {
                    select: { students: true },
                },
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(classes, { status: 200 });
    } catch (error) {
        console.error("GET Classes error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = createClassSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation error", errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = result.data;

        const newClass = await db.class.create({
            data: {
                name: data.name,
                section: data.section,
                capacity: data.capacity,
                classTeacherId: data.classTeacherId,
            },
            include: {
                classTeacher: {
                    include: { user: { select: { name: true } } },
                },
            },
        });

        return NextResponse.json(
            { message: "Class created successfully", class: newClass },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST Class error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
