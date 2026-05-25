import { db } from "@/lib/db";
import { format } from "date-fns";
import { GraduationCap, Search, FileEdit, PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExamsManagementPage() {
    const exams = await db.exam.findMany({
        include: { subject: { include: { class: true } } },
        orderBy: { date: 'asc' }
    });

    const upcomingExams = exams.filter(e => new Date(e.date) > new Date());

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <FileEdit className="w-8 h-8 text-emerald-600" />
                        Examinations
                    </h1>
                    <p className="text-gray-500">Manage term exams, subjects, and grading parameters.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all font-semibold active:scale-95">
                    <PlusCircle className="w-5 h-5" />
                    Schedule Exam
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search exams..." className="w-full pl-9 pr-4 py-2 text-sm border-gray-300 rounded-md focus:ring-emerald-500 border outline-none" disabled />
                    </div>
                    <span className="text-sm text-emerald-600 font-semibold">{upcomingExams.length} Upcoming</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-emerald-900/5 text-emerald-900 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Subject & Class</th>
                                <th className="px-6 py-4">Max Marks</th>
                                <th className="px-6 py-4">Scheduled Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {exams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-emerald-950">
                                        {exam.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{exam.subject.name}</div>
                                        <div className="text-xs text-blue-600">Class: {exam.subject.class.name} {exam.subject.class.section}</div>
                                    </td>
                                    <td className="px-6 py-4 text-emerald-700 font-bold">
                                        {exam.maxMarks}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-600">
                                        {format(new Date(exam.date), 'MMMM dd, yyyy')}
                                    </td>
                                </tr>
                            ))}

                            {exams.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <GraduationCap className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                                        <p className="font-medium text-gray-900">No exams scheduled yet.</p>
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
