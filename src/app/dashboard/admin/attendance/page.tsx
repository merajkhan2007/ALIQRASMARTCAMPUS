import { db } from "@/lib/db";
import { format } from "date-fns";
import { UserCheck, Search, Check, X, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AttendanceManagementPage() {
    // Fetch recent attendance records
    const attendances = await db.attendance.findMany({
        include: {
            student: {
                include: { user: true, class: true }
            }
        },
        orderBy: { date: 'desc' },
        take: 100 // limit for rendering efficiency in this view
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <UserCheck className="w-8 h-8 text-emerald-600" />
                        Attendance Roster
                    </h1>
                    <p className="text-gray-500">Monitor and manage daily attendance records for students.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search roster..." className="w-full pl-9 pr-4 py-2 text-sm border-gray-300 rounded-md focus:ring-emerald-500 border outline-none" disabled />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Last 100 Records</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-emerald-900/5 text-emerald-900 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Class</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {attendances.map((rec) => (
                                <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {format(new Date(rec.date), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{rec.student.user.name}</div>
                                        <div className="text-xs text-gray-500">Roll: {rec.student.rollNo || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-emerald-700 font-medium text-xs">
                                        {rec.student.class?.name || 'No Class'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {rec.status === 'PRESENT' && <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md text-xs font-semibold"><Check className="w-3 h-3"/> PRESENT</span>}
                                        {rec.status === 'ABSENT' && <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2.5 py-1 rounded-md text-xs font-semibold"><X className="w-3 h-3"/> ABSENT</span>}
                                        {rec.status === 'LATE' && <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-xs font-semibold"><Clock className="w-3 h-3"/> LATE</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs italic">
                                        {rec.remarks || '-'}
                                    </td>
                                </tr>
                            ))}

                            {attendances.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <UserCheck className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                                        <p className="font-medium text-gray-900">No attendance entries recorded</p>
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
