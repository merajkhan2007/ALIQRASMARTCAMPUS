export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

async function getCurrentUser(request: Request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as { id: string; role: string; name: string; email: string };
    } catch {
        return null;
    }
}

export async function GET(request: Request) {
    try {
        const donations = await db.donation.findMany({
            include: {
                recordedBy: {
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy: { date: "desc" }
        });
        return NextResponse.json(donations);
    } catch (error) {
        console.error("Fetch donations error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

const createDonationSchema = z.object({
    donorName: z.string().min(1, "Donor name is required"),
    donorType: z.enum(["INDIVIDUAL", "ORGANIZATION"]).default("INDIVIDUAL"),
    donationType: z.enum(["ZAKAT", "SADAQAH", "SADAQAH_JARIYAH", "ZAKAT_AL_FITR", "KAFFARAH", "FIDYA"]).optional().nullable(),
    amount: z.number().positive("Amount must be positive"),
    date: z.string().optional(),
    method: z.enum(["CASH", "CHEQUE", "BANK_TRANSFER", "ONLINE"]).default("CASH"),
    phone: z.string().optional().nullable(),
    email: z.union([z.literal(""), z.string().email()]).optional().nullable(),
    address: z.string().optional().nullable(),
    message: z.string().optional().nullable(),
});

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = createDonationSchema.parse(body);

        // Generate a unique receipt number: DON-YYYYMMDD-XXXX
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
        const count = await db.donation.count();
        const receiptNo = `DON-${dateStr}-${String(count + 1).padStart(4, "0")}`;

        const donation = await db.donation.create({
            data: {
                donorName: parsed.donorName,
                donorType: parsed.donorType,
                donationType: parsed.donationType || null,
                amount: parsed.amount,
                date: parsed.date ? new Date(parsed.date) : new Date(),
                method: parsed.method,
                phone: parsed.phone || null,
                email: parsed.email || null,
                address: parsed.address || null,
                message: parsed.message || null,
                receiptNo,
                recordedById: user.id,
            },
            include: {
                recordedBy: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        return NextResponse.json({ message: "Donation recorded successfully", donation }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid input", errors: error.issues }, { status: 400 });
        }
        console.error("Create donation error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}