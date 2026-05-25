import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { AdminTopbar } from "@/components/dashboard/AdminTopbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

interface TokenPayload {
    id: string;
    email: string;
    role: string;
    name: string;
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

    const payload = verifyToken<TokenPayload>(token);

    if (!payload) {
        redirect("/login");
    }

    const isAdmin = payload.role === "ADMIN" || payload.role === "SUPER_ADMIN";

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900 print:block print:min-h-0 print:bg-white">
            <div className="print:hidden flex shrink-0">
                {isAdmin ? <AdminSidebar /> : <Sidebar userRole={payload.role} />}
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
