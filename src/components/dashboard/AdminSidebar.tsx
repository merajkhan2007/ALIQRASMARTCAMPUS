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
    Heart
} from "lucide-react";

export function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Overview", href: "/dashboard/admin", icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
        { name: "Users", href: "/dashboard/admin/users", icon: <Users className="w-5 h-5 mr-3" /> },
        { name: "Admissions", href: "/dashboard/admin/admissions", icon: <ClipboardList className="w-5 h-5 mr-3" /> },
        { name: "Students", href: "/dashboard/admin/students", icon: <GraduationCap className="w-5 h-5 mr-3" /> },
        { name: "Attendance", href: "/dashboard/admin/attendance", icon: <UserCheck className="w-5 h-5 mr-3" /> },
        { name: "Teachers", href: "/dashboard/admin/teachers", icon: <UserCheck className="w-5 h-5 mr-3" /> },
        { name: "Salary Management", href: "/dashboard/admin/salary", icon: <Banknote className="w-5 h-5 mr-3" /> },
        { name: "Donations", href: "/dashboard/admin/donations", icon: <Heart className="w-5 h-5 mr-3" /> },
        { name: "Class Management", href: "/dashboard/admin/classes", icon: <BookOpen className="w-5 h-5 mr-3" /> },
        { name: "Courses Manager", href: "/dashboard/admin/courses", icon: <BookOpen className="w-5 h-5 mr-3" /> },
        { name: "Payments", href: "/dashboard/admin/payments", icon: <CreditCard className="w-5 h-5 mr-3" /> },
        { name: "Blogs", href: "/dashboard/admin/blogs", icon: <FileText className="w-5 h-5 mr-3" /> },
        { name: "Messages", href: "/dashboard/admin/messages", icon: <MessageSquare className="w-5 h-5 mr-3" /> },
        { name: "Settings", href: "/dashboard/admin/settings", icon: <Settings className="w-5 h-5 mr-3" /> },
    ];

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

            <nav className="flex-1 py-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard" && item.href !== "/dashboard/admin");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-brand-green text-white font-medium shadow-md border-l-4 border-brand-gold"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                                }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

        </aside>
    );
}
