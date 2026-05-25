import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
    try {
        // Fetch all staff users (TEACHER and ACCOUNTANT) and their recent salaries
        const staff = await db.user.findMany({
            where: {
                role: { in: ["TEACHER", "ACCOUNTANT", "ADMIN", "COOK", "KHADIM", "HAFIZ"] }
            },
            include: {
                salaries: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                teacherProfile: true,
                accountant: true
            },
            orderBy: { name: 'asc' }
        });

        // Map to standard response format
        const staffWithSalary = staff.map(user => {
            let baseSalary = user.baseSalary || 0;
            // Fallback to teacherProfile salary if baseSalary isn't explicitly set yet
            if (baseSalary === 0 && user.teacherProfile?.salary) {
                baseSalary = user.teacherProfile.salary;
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                baseSalary,
                salaries: user.salaries
            };
        });

        return NextResponse.json(staffWithSalary);
    } catch (error) {
        console.error("Fetch salaries error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

const generateSchema = z.object({
    userId: z.string(),
    amount: z.number().positive(),
    month: z.string()
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, amount, month } = generateSchema.parse(body);

        // Check if salary for this month already exists
        const existing = await db.staffSalary.findFirst({
            where: { userId, month }
        });

        if (existing) {
            return NextResponse.json({ message: "Salary already generated for this month" }, { status: 400 });
        }

        const salary = await db.staffSalary.create({
            data: {
                userId,
                amount,
                month,
                status: "PENDING"
            }
        });

        return NextResponse.json({ message: "Salary generated successfully", salary });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid input", errors: error.issues }, { status: 400 });
        }
        console.error("Generate salary error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
