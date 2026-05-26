import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { getRolePermissions, seedDefaultPermissions } from "./actions";
import { PermissionsClient } from "./PermissionsClient";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PermissionsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) redirect("/login");

  const payload = verifyToken<TokenPayload>(token);
  if (!payload || payload.role !== "SUPER_ADMIN") {
    redirect("/dashboard/unauthorized");
  }

  const data = await getRolePermissions();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-purple-950 tracking-tight flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Role Permissions
          </h1>
          <p className="text-purple-700/80 mt-1 font-medium">
            Super Admin: Control which features each role can access in the dashboard.
          </p>
        </div>
      </div>

      <PermissionsClient
        features={data.features}
        featureLabels={data.featureLabels}
        initialPermissions={data.permissions}
      />
    </div>
  );
}