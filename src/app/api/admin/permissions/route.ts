import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { ALL_FEATURES, isSuperAdmin } from "@/lib/permissions";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

// GET: Fetch all permissions grouped by role (Super Admin only)
export async function GET(req: Request) {
    try {
        const token = (await cookies()).get("auth-token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (!isSuperAdmin(payload.role as string)) {
            return NextResponse.json({ message: "Forbidden: Super Admin only" }, { status: 403 });
        }

        // Fetch all existing permissions
        const permissions = await db.rolePermission.findMany({
            orderBy: [{ role: "asc" }, { feature: "asc" }],
        });

        // Group by role
        const grouped: Record<string, { feature: string; enabled: boolean }[]> = {};
        for (const p of permissions) {
            if (!grouped[p.role]) grouped[p.role] = [];
            grouped[p.role].push({ feature: p.feature, enabled: p.enabled });
        }

        return NextResponse.json({
            features: ALL_FEATURES.map(f => f.key),
            featureLabels: Object.fromEntries(ALL_FEATURES.map(f => [f.key, f.label])),
            permissions: grouped,
        });
    } catch (error) {
        console.error("GET Permissions Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// PUT: Update permissions for a role (Super Admin only) 
// Body: { role: string, permissions: { feature: string, enabled: boolean }[] }
export async function PUT(req: Request) {
    try {
        const token = (await cookies()).get("auth-token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (!isSuperAdmin(payload.role as string)) {
            return NextResponse.json({ message: "Forbidden: Super Admin only" }, { status: 403 });
        }

        const body = await req.json();
        const { role, permissions } = body as {
            role: string;
            permissions: { feature: string; enabled: boolean }[];
        };

        if (!role || !permissions || !Array.isArray(permissions)) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        // Don't allow modifying SUPER_ADMIN permissions (always has everything)
        if (role === "SUPER_ADMIN") {
            return NextResponse.json({ message: "Cannot modify SUPER_ADMIN permissions" }, { status: 400 });
        }

        // Upsert each permission for the role
        for (const perm of permissions) {
            await db.rolePermission.upsert({
                where: {
                    role_feature: {
                        role: role as any,
                        feature: perm.feature,
                    },
                },
                create: {
                    role: role as any,
                    feature: perm.feature,
                    enabled: perm.enabled,
                },
                update: {
                    enabled: perm.enabled,
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT Permissions Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}