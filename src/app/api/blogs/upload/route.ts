export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { uploadImage } from "@/lib/cloudinary";

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
        } catch {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file || file.size === 0) {
            return NextResponse.json(
                { message: "No image file provided" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const imageUrl = await uploadImage(buffer, "al-iqra-blogs");

        return NextResponse.json({ url: imageUrl });
    } catch (error: any) {
        console.error("Error uploading blog image:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}