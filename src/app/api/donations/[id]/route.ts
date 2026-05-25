export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const donation = await db.donation.findUnique({ where: { id } });
        if (!donation) {
            return NextResponse.json({ message: "Donation not found" }, { status: 404 });
        }
        await db.donation.delete({ where: { id } });
        return NextResponse.json({ message: "Donation deleted successfully" });
    } catch (error) {
        console.error("Delete donation error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}