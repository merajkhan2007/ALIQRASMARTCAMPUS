import { Users, Trash2, PlusCircle, Search } from "lucide-react";
import { db } from "@/lib/db";
import { addStudent, deleteStudent } from "./actions";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { EditStudentModal } from "@/components/admin/EditStudentModal";
import { ViewStudentModal } from "@/components/admin/ViewStudentModal";

import { DeleteStudentActionButton } from "@/components/admin/DeleteStudentActionButton";

export default async function StudentsManagementPage() {
    // 1. Fetch Students
    const students = await db.student.findMany({
        include: {
            user: true,
            class: true
        },
        orderBy: { user: { name: 'asc' } }
    });

    const admissions = await db.admission.findMany({
        where: { admissionNumber: { in: students.map(s => s.admissionNo) } },
        select: { admissionNumber: true, courseApplyingFor: true }
    });
    const admissionMap = new Map(admissions.map(a => [a.admissionNumber, a.courseApplyingFor]));

    const classes = await db.class.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Students Management</h1>
                    <p className="text-gray-500">View, add, and manage student enrollments across all classes.</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-4 items-start">

                {/* 2. ENROLL STUDENT WIZARD TRIGGER */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
                    <div className="mb-6">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <PlusCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-emerald-900 mb-2">
                            Enroll Student
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Use the 8-step wizard to register a new student comprehensively.
                        </p>
                    </div>

                    <Link href="/dashboard/admin/students/enroll" className="w-full">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2">
                            <PlusCircle className="h-4 w-4" /> Enroll New Student
                        </button>
                    </Link>
                </div>

                {/* 3. STUDENT DATATABLE BLOCK */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="relative w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Search students..." className="w-full pl-9 pr-4 py-2 text-sm border-gray-300 rounded-md focus:ring-emerald-500 border outline-none" disabled />
                        </div>
                        <span className="text-sm text-gray-500 font-medium">Total: {students.length} record(s)</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-emerald-900/5 text-emerald-900 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Student Identity</th>
                                    <th className="px-6 py-4">Adm. No</th>
                                    <th className="px-6 py-4">Class</th>
                                    <th className="px-6 py-4">Contact Detail</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {student.user.avatar ? (
                                                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200">
                                                        <Image src={student.user.avatar} alt={student.user.name} fill className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                                        {student.user.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900">{student.user.name}</div>
                                                    <div className="text-xs text-gray-500">{student.gender} • {format(new Date(student.dob), 'dd MMM yyyy')}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs font-semibold text-emerald-700">
                                            {student.admissionNo}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {student.class ? student.class.name : (admissionMap.get(student.admissionNo) || 'Unassigned')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-xs">
                                            <div className="font-medium text-gray-900">{student.user.phone || 'No phone provided'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <ViewStudentModal student={student} />
                                                <EditStudentModal student={student} classes={classes} />

                                                <DeleteStudentActionButton 
                                                    userId={student.user.id} 
                                                    disabled={student.user.email.includes("admin")} 
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <Users className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                                            <p className="font-medium text-gray-900">No students recorded</p>
                                            <p className="text-xs mt-1">Enroll your first student using the form.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
