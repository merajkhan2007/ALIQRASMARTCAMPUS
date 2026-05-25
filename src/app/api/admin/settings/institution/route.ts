import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const payload = verifyToken<{ id: string; role: string }>(token);
        if (!payload || (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN")) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        // Institution settings are stored client-side for now;
        // this endpoint validates the admin is authenticated and returns success.
        // For production, these could be persisted to a Settings table in the DB.

        console.log("Institution settings updated by:", payload.id, body);

        return NextResponse.json({
            message: "Institution settings saved successfully",
            settings: body,
        });
    } catch (error) {
        console.error("Institution settings error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}