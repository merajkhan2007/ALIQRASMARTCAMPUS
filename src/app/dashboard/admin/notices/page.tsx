import { db } from "@/lib/db";
import { format } from "date-fns";
import { BellRing, PlusCircle, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NoticesManagementPage() {
    const notices = await db.notice.findMany({
        include: { author: true, class: true },
        orderBy: { date: 'desc' }
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <BellRing className="w-8 h-8 text-emerald-600" />
                        Communications
                    </h1>
                    <p className="text-gray-500">System-wide notices, announcements and alerts.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all font-semibold active:scale-95">
                    <PlusCircle className="w-5 h-5" />
                    Post Notice
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search notices..." className="w-full pl-9 pr-4 py-2 text-sm border-gray-300 rounded-md focus:ring-emerald-500 border outline-none" disabled />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-emerald-900/5 text-emerald-900 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 w-1/3">Message Details</th>
                                <th className="px-6 py-4 w-1/3">Content Preview</th>
                                <th className="px-6 py-4">Posted By</th>
                                <th className="px-6 py-4">Target Audience</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {notices.map((notice) => (
                                <tr key={notice.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 text-base">{notice.title}</div>
                                        <div className="text-xs text-gray-500 mt-1">{format(new Date(notice.date), 'MMM dd, yyyy h:mm a')}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600 italic line-clamp-2 max-w-sm">"{notice.content}"</div>
                                    </td>
                                    <td className="px-6 py-4 text-emerald-700 font-medium">
                                        {notice.author.name}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold">
                                        {notice.class ? (
                                            <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">Class: {notice.class.name}</span>
                                        ) : (
                                            <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">Global / {notice.targetRoles || 'All'}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {notices.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <BellRing className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                                        <p className="font-medium text-gray-900">No notices broadcasted.</p>
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
