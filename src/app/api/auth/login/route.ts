export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { DEFAULT_ROLE_PERMISSIONS, isSuperAdmin } from "@/lib/permissions";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation error", errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { email, password } = result.data;

        // Find user
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Determine allowed features for the user's role
        let features: string[] = [];

        if (isSuperAdmin(user.role)) {
            // SUPER_ADMIN always gets all features
            features = ["__ALL__"];
        } else {
            // Try to fetch custom permissions from the DB
            const dbPermissions = await db.rolePermission.findMany({
                where: { role: user.role, enabled: true },
                select: { feature: true },
            });

            if (dbPermissions.length > 0) {
                features = dbPermissions.map(p => p.feature);
            } else {
                // Fall back to defaults if no DB entries exist yet
                features = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
            }
        }

        // Generate JWT
        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            features, // array of enabled feature keys
        };
        const token = signToken(tokenPayload, "7d");

        // Set cookie
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.set({
            name: "auth-token",
            value: token,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: "lax",
        });

        return NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    features,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined },
            { status: 500 }
        );
    }
}
