import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { verifyToken } from "@/lib/jwt";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { AdminTopbar } from "@/components/dashboard/AdminTopbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { db } from "@/lib/db";
import { isSuperAdmin } from "@/lib/permissions";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

interface TokenPayload {
    id: string;
    email: string;
    role: string;
    name: string;
    features?: string[];
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
        redirect("/login");
    }

    // Use jose to decode so we can extract the features array
    let payload: TokenPayload;
    try {
        const { payload: josePayload } = await jwtVerify(token, JWT_SECRET);
        payload = josePayload as unknown as TokenPayload;
    } catch {
        // Fallback to jsonwebtoken verify
        const fallback = verifyToken<TokenPayload>(token);
        if (!fallback) redirect("/login");
        payload = fallback;
    }

    if (!payload) {
        redirect("/login");
    }

    const isAdmin = payload.role === "ADMIN" || payload.role === "SUPER_ADMIN";

    // Fetch LIVE permissions from DB instead of relying on stale JWT features
    let allowedFeatures: string[] = [];
    if (isSuperAdmin(payload.role)) {
        allowedFeatures = ["__ALL__"];
    } else {
        try {
            const dbPermissions = await db.rolePermission.findMany({
                where: { role: payload.role as any, enabled: true },
                select: { feature: true },
            });
            allowedFeatures = dbPermissions.map((p) => p.feature);
        } catch {
            // Fall back to JWT features if DB query fails
            allowedFeatures = payload.features || [];
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900 print:block print:min-h-0 print:bg-white">
            <div className="print:hidden flex shrink-0">
                {isAdmin ? (
                    <AdminSidebar role={payload.role} allowedFeatures={allowedFeatures} />
                ) : (
                    <Sidebar userRole={payload.role} allowedFeatures={allowedFeatures} />
                )}
            </div>

            <div className="flex flex-1 flex-col min-w-0 print:block">
                <div className="print:hidden">
                    {isAdmin ? <AdminTopbar /> : <Header user={payload} />}
                </div>

                <main className="flex-1 p-4 md:p-8 bg-slate-50 print:p-0 print:bg-white print:block">
                    {children}
                </main>
            </div>
        </div>
    );
}
