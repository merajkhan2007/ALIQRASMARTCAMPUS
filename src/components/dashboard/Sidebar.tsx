"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home, Users, BookOpen, UserCheck, GraduationCap,
    CreditCard, Calendar, Book, Bell, Settings, Banknote
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isSuperAdmin } from "@/lib/permissions";

// Mapping roles to their distinct routes (with feature keys for filtering)
const roleNavGroups: Record<string, { title: string; href: string; icon: React.ReactNode; feature?: string }[]> = {
    SUPER_ADMIN: [
        { title: "Dashboard", href: "/dashboard/admin", icon: <Home className="w-5 h-5" />, feature: "overview" },
        { title: "Admissions", href: "/dashboard/admin/admissions", icon: <UserCheck className="w-5 h-5" />, feature: "admissions" },
        { title: "Students", href: "/dashboard/admin/students", icon: <GraduationCap className="w-5 h-5" />, feature: "students" },
        { title: "Teachers", href: "/dashboard/admin/teachers", icon: <Users className="w-5 h-5" />, feature: "teachers" },
        { title: "Classes", href: "/dashboard/admin/classes", icon: <BookOpen className="w-5 h-5" />, feature: "classes" },
        { title: "Attendance", href: "/dashboard/admin/attendance", icon: <UserCheck className="w-5 h-5" />, feature: "attendance" },
        { title: "Exams", href: "/dashboard/admin/exams", icon: <Calendar className="w-5 h-5" />, feature: "exams" },
        { title: "Fees", href: "/dashboard/admin/fees", icon: <CreditCard className="w-5 h-5" />, feature: "fees" },
        { title: "Library", href: "/dashboard/admin/library", icon: <Book className="w-5 h-5" />, feature: "library" },
        { title: "Notices", href: "/dashboard/admin/notices", icon: <Bell className="w-5 h-5" />, feature: "notices" },
    ],
    TEACHER: [
        { title: "Dashboard", href: "/dashboard/teacher", icon: <Home className="w-5 h-5" />, feature: "overview" },
        { title: "My Classes", href: "/dashboard/teacher/classes", icon: <BookOpen className="w-5 h-5" />, feature: "classes" },
        { title: "Mark Attendance", href: "/dashboard/teacher/attendance", icon: <UserCheck className="w-5 h-5" />, feature: "attendance" },
        { title: "Exams & Results", href: "/dashboard/teacher/exams", icon: <Calendar className="w-5 h-5" />, feature: "exams" },
        { title: "My Salary", href: "/dashboard/teacher/salary", icon: <Banknote className="w-5 h-5" />, feature: "salary" },
        { title: "Notices", href: "/dashboard/teacher/notices", icon: <Bell className="w-5 h-5" />, feature: "notices" },
    ],
    STUDENT: [
        { title: "Dashboard", href: "/dashboard/student", icon: <Home className="w-5 h-5" />, feature: "overview" },
        { title: "My Profile", href: "/dashboard/student/profile", icon: <Users className="w-5 h-5" />, feature: "overview" },
        { title: "Attendance", href: "/dashboard/student/attendance", icon: <UserCheck className="w-5 h-5" />, feature: "attendance" },
        { title: "Exams & Results", href: "/dashboard/student/results", icon: <Calendar className="w-5 h-5" />, feature: "exams" },
        { title: "Fees", href: "/dashboard/student/fees", icon: <CreditCard className="w-5 h-5" />, feature: "fees" },
        { title: "Islamic Progress", href: "/dashboard/student/islamic", icon: <Book className="w-5 h-5" />, feature: "overview" },
        { title: "Notices", href: "/dashboard/student/notices", icon: <Bell className="w-5 h-5" />, feature: "notices" },
    ],
    PARENT: [
        { title: "Dashboard", href: "/dashboard/parent", icon: <Home className="w-5 h-5" />, feature: "overview" },
        { title: "My Children", href: "/dashboard/parent/children", icon: <Users className="w-5 h-5" />, feature: "overview" },
        { title: "Fees & Payments", href: "/dashboard/parent/fees", icon: <CreditCard className="w-5 h-5" />, feature: "fees" },
        { title: "Notices", href: "/dashboard/parent/notices", icon: <Bell className="w-5 h-5" />, feature: "notices" },
    ],
    ACCOUNTANT: [
        { title: "Dashboard", href: "/dashboard/accountant", icon: <Home className="w-5 h-5" />, feature: "overview" },
        { title: "Fee Collection", href: "/dashboard/accountant/fees", icon: <CreditCard className="w-5 h-5" />, feature: "fees" },
        { title: "Invoices", href: "/dashboard/accountant/invoices", icon: <BookOpen className="w-5 h-5" />, feature: "fees" },
        { title: "My Salary", href: "/dashboard/accountant/salary", icon: <Banknote className="w-5 h-5" />, feature: "salary" },
    ]
};

// Map ADMIN to SUPER_ADMIN to reuse nav links
roleNavGroups["ADMIN"] = roleNavGroups["SUPER_ADMIN"];

interface SidebarProps {
    userRole: string;
    allowedFeatures?: string[];
}

export function Sidebar({ userRole, allowedFeatures = [] }: SidebarProps) {
    const pathname = usePathname();
    const allItems = roleNavGroups[userRole] || [];
    const superAdmin = isSuperAdmin(userRole);

    // Filter nav items by allowed features
    const filteredItems = allItems.filter(item => {
        if (superAdmin) return true;
        if (allowedFeatures.length === 0) return true; // no restrictions loaded yet
        if (!item.feature) return true; // items without a feature tag are always shown
        return allowedFeatures.includes(item.feature);
    });

    return (
        <div className="flex shrink-0 flex-col w-64 bg-emerald-900 text-emerald-50 h-screen sticky top-0 overflow-y-auto">
            <div className="flex h-16 items-center border-b border-emerald-800 px-6">
                <h2 className="text-lg font-bold tracking-tight text-white line-clamp-1">AL-IQRA MODERN MADRASA</h2>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                                isActive
                                    ? "bg-emerald-800 text-white"
                                    : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
                            )}
                        >
                            <span className="mr-3 shrink-0 text-emerald-300">
                                {item.icon}
                            </span>
                            {item.title}
                        </Link>
                    );
                })}
                {filteredItems.length === 0 && (
                    <p className="text-emerald-300/50 text-sm text-center py-8">
                        No features available for your role.
                    </p>
                )}
            </nav>
            <div className="p-4 border-t border-emerald-800 space-y-2">
                <button className="flex w-full items-center px-3 py-2 text-sm font-medium text-emerald-100 rounded-md hover:bg-emerald-800 hover:text-white group">
                    <Settings className="mr-3 w-5 h-5 text-emerald-300" />
                    Settings
                </button>
                <button 
                    onClick={async () => {
                        try {
                            await fetch("/api/auth/logout", { method: "POST" });
                        } catch (e) {
                            console.error("Logout failed", e);
                        }
                        window.location.href = "/login";
                    }}
                    className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-300 rounded-md hover:bg-red-900/50 hover:text-red-100 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                </button>
            </div>
        </div>
    );
}
