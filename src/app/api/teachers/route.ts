import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createTeacherSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
    qualification: z.string().optional(),
    experience: z.number().min(0).default(0),
    salary: z.number().optional(),
});

export async function GET(req: Request) {
    try {
        const teachers = await db.teacher.findMany({
            include: {
                user: {
                    select: { name: true, email: true, phone: true, avatar: true },
                },
                classes: true,
                subjects: true,
            },
            orderBy: { joiningDate: "desc" },
        });

        return NextResponse.json(teachers, { status: 200 });
    } catch (error) {
        console.error("GET Teachers error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = createTeacherSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation error", errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = result.data;

        const existingUser = await db.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "A user with this email already exists." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: hashedPassword,
                role: "TEACHER",
                teacherProfile: {
                    create: {
                        qualification: data.qualification,
                        experience: data.experience,
                        salary: data.salary,
                    },
                },
            },
            include: {
                teacherProfile: true,
            },
        });

        return NextResponse.json(
            { message: "Teacher added successfully", user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST Teacher error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
