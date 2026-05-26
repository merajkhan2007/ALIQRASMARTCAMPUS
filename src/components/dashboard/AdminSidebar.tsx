"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    CreditCard,
    MessageSquare,
    GraduationCap,
    UserCheck,
    ClipboardList,
    Banknote,
    FileText,
    Heart,
    Shield
} from "lucide-react";
import { isSuperAdmin } from "@/lib/permissions";

interface AdminSidebarProps {
    role?: string;
    allowedFeatures?: string[];
}

export function AdminSidebar({ role, allowedFeatures = [] }: AdminSidebarProps) {
    const pathname = usePathname();
    const superAdmin = role ? isSuperAdmin(role) : false;

    // If superadmin or no features provided, treat as __ALL__
    const hasFeature = (feature: string) => {
        if (superAdmin) return true;
        if (allowedFeatures.length === 0) return true; // no restrictions loaded yet
        return allowedFeatures.includes(feature);
    };

    const allNavItems = [
        { name: "Overview", href: "/dashboard/admin", icon: <LayoutDashboard className="w-5 h-5 mr-3" />, feature: "overview" },
        { name: "Users", href: "/dashboard/admin/users", icon: <Users className="w-5 h-5 mr-3" />, feature: "users" },
        { name: "Admissions", href: "/dashboard/admin/admissions", icon: <ClipboardList className="w-5 h-5 mr-3" />, feature: "admissions" },
        { name: "Students", href: "/dashboard/admin/students", icon: <GraduationCap className="w-5 h-5 mr-3" />, feature: "students" },
        { name: "Attendance", href: "/dashboard/admin/attendance", icon: <UserCheck className="w-5 h-5 mr-3" />, feature: "attendance" },
        { name: "Teachers", href: "/dashboard/admin/teachers", icon: <UserCheck className="w-5 h-5 mr-3" />, feature: "teachers" },
        { name: "Salary Management", href: "/dashboard/admin/salary", icon: <Banknote className="w-5 h-5 mr-3" />, feature: "salary" },
        { name: "Donations", href: "/dashboard/admin/donations", icon: <Heart className="w-5 h-5 mr-3" />, feature: "donations" },
        { name: "Class Management", href: "/dashboard/admin/classes", icon: <BookOpen className="w-5 h-5 mr-3" />, feature: "classes" },
        { name: "Courses Manager", href: "/dashboard/admin/courses", icon: <BookOpen className="w-5 h-5 mr-3" />, feature: "courses" },
        { name: "Payments", href: "/dashboard/admin/payments", icon: <CreditCard className="w-5 h-5 mr-3" />, feature: "payments" },
        { name: "Exams & Results", href: "/dashboard/admin/exams", icon: <GraduationCap className="w-5 h-5 mr-3" />, feature: "exams" },
        { name: "Fees Management", href: "/dashboard/admin/fees", icon: <CreditCard className="w-5 h-5 mr-3" />, feature: "fees" },
        { name: "Library", href: "/dashboard/admin/library", icon: <BookOpen className="w-5 h-5 mr-3" />, feature: "library" },
        { name: "Notices", href: "/dashboard/admin/notices", icon: <MessageSquare className="w-5 h-5 mr-3" />, feature: "notices" },
        { name: "Blogs", href: "/dashboard/admin/blogs", icon: <FileText className="w-5 h-5 mr-3" />, feature: "blogs" },
        { name: "Messages", href: "/dashboard/admin/messages", icon: <MessageSquare className="w-5 h-5 mr-3" />, feature: "messages" },
        { name: "Settings", href: "/dashboard/admin/settings", icon: <Settings className="w-5 h-5 mr-3" />, feature: "settings" },
    ];

    // Super admin only item
    const superAdminItems = [
        { name: "Permissions", href: "/dashboard/admin/permissions", icon: <Shield className="w-5 h-5 mr-3" />, feature: "permissions" },
    ];

    const navItems = allNavItems.filter(item => hasFeature(item.feature));
    const extraItems = superAdmin ? superAdminItems : [];

    return (
        <aside className="w-64 bg-brand-dark text-white min-h-screen flex flex-col hidden md:flex sticky top-0 h-screen">
            <div className="p-6 border-b border-gray-800">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center text-white font-bold">
                        E
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-white leading-tight mt-1">Admin Panel</span>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard" && item.href !== "/dashboard/admin");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? "bg-brand-green text-white font-medium shadow-md border-l-4 border-brand-gold"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                            }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    );
                })}

                {/* Super Admin exclusive items */}
                {extraItems.length > 0 && (
                    <>
                        <div className="border-t border-gray-700 my-2 pt-2">
                            <span className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Super Admin</span>
                        </div>
                        {extraItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? "bg-purple-700 text-white font-medium shadow-md border-l-4 border-purple-300"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                                    }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            );
                        })}
                    </>
                )}
            </nav>
        </aside>
    );
}
