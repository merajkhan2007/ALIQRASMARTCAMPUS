"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Login failed");
            }

            const { user } = await res.json();
            // Map roles to their dashboard base paths
            const roleDashboardMap: Record<string, string> = {
                SUPER_ADMIN: "admin",
                ADMIN: "admin",
                TEACHER: "teacher",
                STUDENT: "student",
                PARENT: "parent",
                ACCOUNTANT: "accountant",
                HAFIZ: "accountant",
                COOK: "accountant",
                KHADIM: "accountant",
            };
            const dashboardPath = roleDashboardMap[user.role] || user.role.toLowerCase();
            router.push(`/dashboard/${dashboardPath}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-emerald-950 px-4">
            {/* Background patterned decoration for Islamic Theme */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />

            <Card className="relative z-10 w-full max-w-md border-emerald-800 shadow-2xl">
                <CardHeader className="space-y-2 text-center">
                    {/* Madrasa Logo */}
                    <div className="flex justify-center">
                        <img
                            src="/images/madrasa_logo.png"
                            alt="Al Iqra Madrasa Logo"
                            className="h-24 w-auto object-contain"
                        />
                    </div>
                    {/* Madrasa Name in Urdu */}
                    <div className="flex justify-center">
                        <img
                            src="/images/madrasa_name.png"
                            alt="المدرسہ العصریہ الاسلامیہ"
                            className="h-16 w-auto object-contain"
                        />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-emerald-900">
                        AL-IQRA MODERN MADRASA
                    </CardTitle>
                    <CardDescription className="text-emerald-700">
                        Sign in to access your portal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-emerald-900">
                                Email / Admission No
                            </label>
                            <Input
                                name="email"
                                type="text"
                                required
                                className="focus-visible:ring-emerald-500"
                                placeholder="admin@aliqramodernmadrasa.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none text-emerald-900">
                                    Password
                                </label>
                                <a href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-500">
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                name="password"
                                type="password"
                                required
                                className="focus-visible:ring-emerald-500"
                                placeholder="••••••••"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
