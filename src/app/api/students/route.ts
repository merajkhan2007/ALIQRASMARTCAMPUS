import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createStudentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
    gender: z.string(),
    bloodGroup: z.string().optional(),
    address: z.string(),
    classId: z.string().optional(),
    parentId: z.string().optional(),
});

export async function GET(req: Request) {
    try {
        const students = await db.student.findMany({
            include: {
                user: {
                    select: { name: true, email: true, phone: true, avatar: true },
                },
                class: true,
                parent: {
                    include: {
                        user: { select: { name: true, phone: true } }
                    }
                },
            },
            orderBy: { admissionNo: "desc" },
        });

        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        console.error("GET Students error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = createStudentSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation error", errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = result.data;

        // Check if email is already taken in the global User pool
        const existingUser = await db.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "A user with this email already exists." },
                { status: 409 }
            );
        }

        // Hash password for the student login
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Auto-generate admission number: ADM-YYYY-XXXX (where XXXX is random)
        // For a real production app, use a sequence from the DB
        const year = new Date().getFullYear();
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const admissionNo = `ADM-${year}-${randomDigits}`;

        // Create User and linked StudentProfile in one transaction
        const newUser = await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: "STUDENT",
                studentProfile: {
                    create: {
                        admissionNo,
                        dob: new Date(data.dob),
                        gender: data.gender,
                        bloodGroup: data.bloodGroup,
                        address: data.address,
                        classId: data.classId,
                        parentId: data.parentId,
                    },
                },
            },
            include: {
                studentProfile: true,
            },
        });

        return NextResponse.json(
            { message: "Student admitted successfully", user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST Student error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
