import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { canAccessRoute, FEATURE_ROUTE_MAP, type FeatureKey } from "@/lib/permissions";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

// Define allowed roles for base path segments
const rolePaths: Record<string, string[]> = {
    "/dashboard/admin": ["SUPER_ADMIN", "ADMIN"],
    "/dashboard/teacher": ["SUPER_ADMIN", "ADMIN", "TEACHER"],
    "/dashboard/student": ["SUPER_ADMIN", "ADMIN", "STUDENT", "PARENT"],
    "/dashboard/parent": ["SUPER_ADMIN", "ADMIN", "PARENT"],
    "/dashboard/accountant": ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"],
};

// We dynamically import the DB to avoid bundling issues in edge runtime
// Instead rely on the token payload which carries permissions

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isApiRoute = path.startsWith("/api");
    const isDashboardRoute = path.startsWith("/dashboard");

    // Bypass auth checks for auth API routes (login/register)
    if (path.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // Public APIs we don't need to protect with permission checks
    if (isApiRoute && (
        path.startsWith("/api/blogs") ||
        path.startsWith("/api/donations") ||
        path.startsWith("/api/contact") ||
        path.startsWith("/api/admission")
    )) {
        return NextResponse.next();
    }

    // Need auth for /dashboard and protected /api routes
    if (isDashboardRoute || isApiRoute) {
        const token = req.cookies.get("auth-token")?.value;

        if (!token) {
            if (isApiRoute) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            } else {
                return NextResponse.redirect(new URL("/login", req.url));
            }
        }

        try {
            // Verify token
            const { payload } = await jwtVerify(token, JWT_SECRET);

            const userRole = payload.role as string;
            const allowedFeatures = (payload.features as string[]) || [];

            if (isDashboardRoute) {
                // Step 1: Role-based base path access
                let hasRoleAccess = true;
                for (const [route, allowedRoles] of Object.entries(rolePaths)) {
                    if (path.startsWith(route)) {
                        if (!allowedRoles.includes(userRole)) {
                            hasRoleAccess = false;
                            break;
                        }
                    }
                }

                if (!hasRoleAccess) {
                    return NextResponse.redirect(new URL("/dashboard/unauthorized", req.url));
                }

                // Step 2: Feature-level permission check (skip for SUPER_ADMIN)
                if (userRole !== "SUPER_ADMIN") {
                    const canAccess = canAccessRoute(path, userRole, allowedFeatures as FeatureKey[]);
                    if (!canAccess) {
                        return NextResponse.redirect(new URL("/dashboard/unauthorized", req.url));
                    }
                }
            }

            // For protected API routes, also check feature permissions
            if (isApiRoute && userRole !== "SUPER_ADMIN") {
                // Map API paths to features for permission checking
                const apiFeatureMap: Record<string, string> = {
                    "/api/admin/salary": "salary",
                    "/api/admin/classes": "classes",
                    "/api/admin/courses": "courses",
                    "/api/admin/authors": "blogs",
                    "/api/admin/settings": "settings",
                    "/api/students": "students",
                    "/api/attendance": "attendance",
                    "/api/teacher/attendance": "attendance",
                    "/api/teacher/exams": "exams",
                    "/api/teacher/notices": "notices",
                    "/api/teacher/results": "exams",
                    "/api/exams": "exams",
                    "/api/fees": "fees",
                    "/api/staff/salary": "salary",
                    "/api/messages": "messages",
                    "/api/islamic-progress": "students",
                    "/api/teachers": "teachers",
                };

                for (const [apiPrefix, feature] of Object.entries(apiFeatureMap)) {
                    if (path.startsWith(apiPrefix)) {
                        if (!allowedFeatures.includes(feature)) {
                            return NextResponse.json(
                                { message: "Forbidden: feature not available for your role" },
                                { status: 403 }
                            );
                        }
                        break;
                    }
                }
            }

            // Pass user info to downstream handlers
            const requestHeaders = new Headers(req.headers);
            requestHeaders.set("x-user", JSON.stringify(payload));

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        } catch (error) {
            // Token is invalid/expired
            const response = isApiRoute
                ? NextResponse.json({ message: "Unauthorized OR token expired" }, { status: 401 })
                : NextResponse.redirect(new URL("/login", req.url));
            response.cookies.delete("auth-token");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
