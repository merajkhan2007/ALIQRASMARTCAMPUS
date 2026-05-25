import { db } from "@/lib/db";
import { format } from "date-fns";
import { Users, Briefcase, Search } from "lucide-react";
import Image from "next/image";
import { AddTeacherModal } from "@/components/admin/AddTeacherModal";
import { AssignHafizModal } from "@/components/admin/AssignHafizModal";
import { EditTeacherModal } from "@/components/admin/EditTeacherModal";
import { DeleteTeacherActionButton } from "@/components/admin/DeleteTeacherActionButton";

export const dynamic = "force-dynamic";

export default async function TeachersManagementPage() {
    // Fetch all teachers attached to their core user data
    const teachers = await db.teacher.findMany({
        include: {
            user: true,
            classes: true, // Classes they are acting as Class Teacher for
        },
        orderBy: {
            user: { name: 'asc' }
        }
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <Briefcase className="w-8 h-8 text-emerald-600" />
                        Faculty Directory
                    </h1>
                    <p className="text-gray-500">Manage teaching staff qualifications, assignments, and records.</p>
                </div>
                
                <div className="flex gap-2">
                    <AddTeacherModal />
                    <AssignHafizModal />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search staff..." className="w-full pl-9 pr-4 py-2 text-sm border-gray-300 rounded-md focus:ring-emerald-500 border outline-none" disabled />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Total Staff: {teachers.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-emerald-900/5 text-emerald-900 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Staff Member</th>
                                <th className="px-6 py-4">Academics</th>
                                <th className="px-6 py-4">Assigned Classes</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {teachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {teacher.user.avatar ? (
                                                <a href={teacher.user.avatar} target="_blank" rel="noopener noreferrer" className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 block transition-transform hover:scale-105 hover:shadow-md cursor-pointer">
                                                    <Image src={teacher.user.avatar} alt={teacher.user.name} fill className="object-cover" />
                                                </a>
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                                    {teacher.user.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{teacher.user.name}</div>
                                                <div className="text-xs text-gray-500">{teacher.user.email} • {teacher.user.phone || 'No phone'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 font-medium text-xs bg-gray-100 inline-block px-2 py-1 rounded">
                                            {teacher.qualification || "Not specified"}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {teacher.experience} years exp.
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {teacher.classes.length > 0 ? (
                                            <div className="flex gap-1 flex-wrap">
                                                {teacher.classes.map(c => (
                                                    <span key={c.id} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        {c.name} {c.section}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">No active class assignments</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-xs font-medium">
                                        {format(new Date(teacher.joiningDate), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <EditTeacherModal teacher={teacher} />

                                            <DeleteTeacherActionButton 
                                                userId={teacher.user.id} 
                                                disabled={teacher.user.email.includes("admin")} 
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {teachers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <Users className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                                        <p className="font-medium text-gray-900">No teachers found</p>
                                        <p className="text-xs mt-1">Use the Users dashboard to invite staff with the Teacher role.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
