import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

// Define allowed roles for certain paths using a simple map
const rolePaths: Record<string, string[]> = {
    "/dashboard/admin": ["SUPER_ADMIN", "ADMIN"],
    "/dashboard/teacher": ["SUPER_ADMIN", "ADMIN", "TEACHER"],
    "/dashboard/student": ["SUPER_ADMIN", "ADMIN", "STUDENT", "PARENT"],
    "/dashboard/parent": ["SUPER_ADMIN", "ADMIN", "PARENT"],
    "/dashboard/accountant": ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"],
};

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isApiRoute = path.startsWith("/api");
    const isDashboardRoute = path.startsWith("/dashboard");

    // Bypass auth checks for specific API routes (login/register)
    if (path.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // Need auth for /dashboard and some /api routes (unless public)
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

            // Role Based Access Control for Dashboard
            if (isDashboardRoute) {
                let hasAccess = true;

                for (const [route, allowedRoles] of Object.entries(rolePaths)) {
                    if (path.startsWith(route)) {
                        if (!allowedRoles.includes(userRole)) {
                            hasAccess = false;
                            break;
                        }
                    }
                }

                if (!hasAccess) {
                    return NextResponse.redirect(new URL("/dashboard/unauthorized", req.url));
                }
            }

            // We clone the request headers to pass the user info to API routes if needed
            const requestHeaders = new Headers(req.headers);
            requestHeaders.set("x-user", JSON.stringify(payload));

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        } catch (error) {
            // Token is invalid/expired
            req.cookies.delete("auth-token");
            if (isApiRoute) {
                return NextResponse.json({ message: "Unauthorized OR token expired" }, { status: 401 });
            } else {
                return NextResponse.redirect(new URL("/login", req.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
