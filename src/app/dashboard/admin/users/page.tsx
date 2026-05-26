import { db } from "@/lib/db";
import { format } from "date-fns";
import { Shield, Mail, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AddTeacherModal } from "@/components/admin/AddTeacherModal";
import { AddStaffModal } from "@/components/admin/AddStaffModal";
import { AssignHafizModal } from "@/components/admin/AssignHafizModal";
import { EditUserModal } from "@/components/admin/EditUserModal";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";

import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminUsersPage({
    searchParams
}: {
    searchParams: Promise<{ role?: string, q?: string }>
}) {
    const params = await searchParams;
    const roleFilter = params.role || "ALL";
    const searchQuery = params.q || "";

    // Fetch filtered users
    const users = await db.user.findMany({
        where: {
            ...(roleFilter !== "ALL" ? { role: roleFilter as Role } : {}),
            ...(searchQuery ? {
                OR: [
                    { name: { contains: searchQuery, mode: "insensitive" } },
                    { email: { contains: searchQuery, mode: "insensitive" } },
                ]
            } : {})
        },
        orderBy: { createdAt: "desc" },
    });

    // We can also fetch some basic aggregate stats beautifully
    const totalUsers = await db.user.count();
    const adminCount = await db.user.count({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } });
    const teacherCount = await db.user.count({ where: { role: 'TEACHER' } });
    const studentCount = await db.user.count({ where: { role: 'STUDENT' } });

    const getRoleBadgeStyle = (role: string) => {
        switch (role) {
            case "SUPER_ADMIN": return "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200";
            case "ADMIN": return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
            case "TEACHER": return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200";
            case "STUDENT": return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200";
            case "PARENT": return "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200";
            case "ACCOUNTANT": return "bg-cyan-100 text-cyan-800 hover:bg-cyan-200 border-cyan-200";
            case "COOK": return "bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200";
            case "KHADIM": return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200";
            case "HAFIZ": return "bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none" />
                
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight flex items-center gap-3">
                        <Shield className="w-8 h-8 text-emerald-600" />
                        User Management
                    </h1>
                    <p className="text-emerald-700/80 mt-1 font-medium">
                        Centrally manage staff, teachers, students, and system access.
                    </p>
                </div>

                <div className="flex gap-2 relative z-10">
                    <AddStaffModal />
                    <AddTeacherModal />
                    <AssignHafizModal />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Users</p>
                    <p className="text-3xl font-bold tracking-tight text-gray-900 mt-1">{totalUsers}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Staff / Admins</p>
                    <p className="text-3xl font-bold tracking-tight text-emerald-950 mt-1">{adminCount}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Teachers</p>
                    <p className="text-3xl font-bold tracking-tight text-blue-950 mt-1">{teacherCount}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Students</p>
                    <p className="text-3xl font-bold tracking-tight text-amber-950 mt-1">{studentCount}</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-3 rounded-xl border border-gray-200/60 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                    <Link href="/dashboard/admin/users" className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${roleFilter === 'ALL' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>All Users</Link>
                    <Link href="/dashboard/admin/users?role=ADMIN" className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${roleFilter === 'ADMIN' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>Admins</Link>
                    <Link href="/dashboard/admin/users?role=TEACHER" className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${roleFilter === 'TEACHER' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>Teachers</Link>
                    <Link href="/dashboard/admin/users?role=STUDENT" className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${roleFilter === 'STUDENT' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>Students</Link>
                    <Link href="/dashboard/admin/users?role=PARENT" className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${roleFilter === 'PARENT' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>Parents</Link>
                </div>

                <div className="relative w-full lg:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-emerald-500" />
                    </div>
                    {/* Since this is a server component, standard forms submitting a GET request update the URL naturally */}
                    <form action="/dashboard/admin/users" method="GET">
                        {roleFilter !== "ALL" && <input type="hidden" name="role" value={roleFilter} />}
                        <input
                            type="text"
                            name="q"
                            defaultValue={searchQuery}
                            placeholder="Search name or email..."
                            className="block w-full pl-10 pr-3 py-2 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-emerald-50/30 text-gray-900 transition-shadow"
                        />
                    </form>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="h-10 w-10 text-gray-200 mb-3" />
                                            <p className="text-base font-medium text-gray-900">No users found</p>
                                            <p className="text-sm mt-1">We couldn&apos;t find anyone matching your search criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-emerald-50/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
                                                <AvatarImage src={user.avatar || ""} />
                                                <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-base">{user.name}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    ID: 
                                                    <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-[10px]">
                                                        {user.id.substring(0, 8)}...
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="px-6 py-4">
                                        <Badge className={`font-semibold border shadow-sm ${getRoleBadgeStyle(user.role)}`}>
                                            {user.role}
                                        </Badge>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            {user.email}
                                        </div>
                                        {user.phone && (
                                            <div className="text-xs text-gray-500 mt-1 pl-6">
                                                Ph: {user.phone}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600 font-medium tracking-tight">
                                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 lg:opacity-100 group-hover:opacity-100 transition-opacity">
                                            <EditUserModal user={user} />
                                            <ChangePasswordModal userId={user.id} userName={user.name} />
                                            <DeleteUserButton userId={user.id} disabled={user.role === "SUPER_ADMIN" || user.email === "admin@aliqramodernmadrasa.com"} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Footer (Placeholder) */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        Showing <span className="font-semibold text-gray-900">{users.length}</span> of <span className="font-semibold text-gray-900">{totalUsers}</span> users
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled className="bg-white">Previous</Button>
                        <Button variant="outline" size="sm" disabled className="bg-white">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
