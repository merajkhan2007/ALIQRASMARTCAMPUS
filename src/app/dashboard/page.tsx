import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

interface TokenPayload {
    id: string;
    email: string;
    role: string;
    name: string;
}

export default async function DashboardRedirect() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
        redirect("/login");
    }

    const payload = verifyToken<TokenPayload>(token);

    if (!payload) {
        redirect("/login");
    }

    // Redirect to the appropriate dashboard based on role
    switch (payload.role) {
        case "SUPER_ADMIN":
        case "ADMIN":
            redirect("/dashboard/admin");
        case "TEACHER":
            redirect("/dashboard/teacher");
        case "STUDENT":
            redirect("/dashboard/student");
        case "PARENT":
            redirect("/dashboard/parent");
        case "ACCOUNTANT":
        case "HAFIZ":
        case "COOK":
        case "KHADIM":
            redirect("/dashboard/accountant");
        default:
            redirect("/login");
    }
}
