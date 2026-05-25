export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
    status: z.enum(["PENDING", "PAID"]),
    amount: z.number().positive().optional(),
    month: z.string().min(2).optional()
});

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        
        const body = await req.json();
        const { status, amount, month } = updateSchema.parse(body);

        const updateData: any = { status };
        if (amount !== undefined) updateData.amount = amount;
        if (month !== undefined) updateData.month = month;
        
        if (status === "PAID") {
            // Check existing salary first to not overwrite original payment date if already paid
            const existingSalary = await db.staffSalary.findUnique({ where: { id } });
            if (!existingSalary?.paymentDate) {
                updateData.paymentDate = new Date();
            }
        } else {
            updateData.paymentDate = null;
        }

        const salary = await db.staffSalary.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ message: "Salary updated successfully", salary });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid input", errors: error.issues }, { status: 400 });
        }
        console.error("Update salary error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        
        await db.staffSalary.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Salary record deleted successfully" });
    } catch (error) {
        console.error("Delete salary error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
