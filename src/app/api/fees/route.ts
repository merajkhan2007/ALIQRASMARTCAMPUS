import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createFeeSchema = z.object({
    title: z.string().min(1, "Fee title is required"),
    amount: z.number().min(0, "Amount must be positive"),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    studentId: z.string(),
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get("studentId");

        // If studentId is provided, filter by it. Otherwise return latest 50 fees.
        const where = studentId ? { studentId } : {};

        const fees = await db.fee.findMany({
            where,
            include: {
                student: {
                    include: {
                        user: { select: { name: true } },
                        class: true,
                    },
                },
                payments: true,
            },
            orderBy: { dueDate: "desc" },
            take: studentId ? undefined : 50,
        });

        return NextResponse.json(fees, { status: 200 });
    } catch (error) {
        console.error("GET Fees error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

const recordPaymentSchema = z.object({
    feeId: z.string(),
    amount: z.number().min(0.01, "Amount must be positive"),
    method: z.string().default("CASH"),
    transactionId: z.string().nullable().optional(),
});

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const result = recordPaymentSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation error", errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { feeId, amount, method, transactionId } = result.data;

        // Find the fee record
        const fee = await db.fee.findUnique({
            where: { id: feeId },
            include: { payments: true },
        });

        if (!fee) {
            return NextResponse.json({ message: "Fee record not found." }, { status: 404 });
        }

        if (fee.status === "PAID") {
            return NextResponse.json({ message: "This fee is already fully paid." }, { status: 400 });
        }

        const totalPaid = fee.payments.reduce((sum, p) => sum + p.amount, 0);
        const remaining = fee.amount - totalPaid;

        if (amount > remaining) {
            return NextResponse.json({ message: `Amount exceeds remaining balance of ₹${remaining.toFixed(2)}` }, { status: 400 });
        }

        // Create the payment
        await db.payment.create({
            data: {
                amount,
                method,
                transactionId: transactionId || null,
                feeId,
            },
        });

        // Update fee status
        const newTotalPaid = totalPaid + amount;
        let newStatus = "PENDING";
        if (newTotalPaid >= fee.amount) {
            newStatus = "PAID";
        } else if (newTotalPaid > 0) {
            newStatus = "PARTIAL";
        }

        await db.fee.update({
            where: { id: feeId },
            data: { status: newStatus },
        });

        return NextResponse.json(
            { message: "Payment recorded successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("PUT Fee payment error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = createFeeSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation error", errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { title, amount, dueDate, studentId } = result.data;

        const newFee = await db.fee.create({
            data: {
                title,
                amount,
                dueDate: new Date(dueDate),
                status: "PENDING",
                studentId,
            },
            include: {
                student: { select: { admissionNo: true, user: { select: { name: true } } } },
            },
        });

        return NextResponse.json(
            { message: "Fee record created successfully", fee: newFee },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST Fee error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
