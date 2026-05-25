import { db } from "@/lib/db";
import { format } from "date-fns";
import { Eye, CheckCircle, XCircle, Pencil } from "lucide-react";
import Image from "next/image";
import { ReviewAdmissionModal } from "@/components/admin/ReviewAdmissionModal";
import { DeleteAdmissionButton } from "@/components/admin/DeleteAdmissionButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";

export default async function AdminAdmissionsPage({
    searchParams
}: {
    searchParams: Promise<{ status?: string, course?: string }>
}) {
    const params = await searchParams;
    const statusFilter = params.status || "ALL";
    const courseFilter = params.course || "ALL";

    // Fetch all pending and historical admissions, newest first
    const admissions = await db.admission.findMany({
        where: {
            ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
            ...(courseFilter !== "ALL" ? { courseApplyingFor: courseFilter } : {})
        },
        orderBy: { appliedAt: "desc" },
    });

    console.log("ADMIN READ COUNT:", admissions.length);

    const pendingCount = admissions.filter(a => a.status === 'PENDING').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admission Applications</h1>
                    <p className="text-sm text-gray-500 mt-1">Review, approve, or reject student applications across all 8 steps.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border rounded-md px-3 py-1.5 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="font-medium">{pendingCount} Pending</span>
                    </div>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 text-sm">
                <Link href="/dashboard/admin/admissions" className={`px-4 py-2 font-medium rounded-lg border transition-colors ${statusFilter === 'ALL' && courseFilter === 'ALL' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>All</Link>
                <Link href="/dashboard/admin/admissions?status=PENDING" className={`px-4 py-2 font-medium rounded-lg border transition-colors ${statusFilter === 'PENDING' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Pending Review</Link>
                <Link href="/dashboard/admin/admissions?status=APPROVED" className={`px-4 py-2 font-medium rounded-lg border transition-colors ${statusFilter === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Approved</Link>
                <Link href="/dashboard/admin/admissions?status=REJECTED" className={`px-4 py-2 font-medium rounded-lg border transition-colors ${statusFilter === 'REJECTED' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Rejected</Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium">Applicant</th>
                                <th className="px-6 py-4 font-medium">Applied For</th>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {admissions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No admission applications found.
                                    </td>
                                </tr>
                            ) : admissions.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {app.studentPhoto ? (
                                                <Image
                                                    src={app.studentPhoto}
                                                    alt={app.fullName}
                                                    width={36}
                                                    height={36}
                                                    className="rounded-full object-cover border border-gray-200 h-9 w-9"
                                                />
                                            ) : (
                                                <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                                                    {app.fullName.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{app.fullName}</div>
                                                <div className="text-xs text-gray-500">{app.admissionNumber}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="text-gray-900">{app.courseApplyingFor || "Regular"}</div>
                                        {app.lastClassPassed && <div className="text-xs text-gray-500">Prev: {app.lastClassPassed}</div>}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="text-gray-900">{app.fatherMobile}</div>
                                        {app.city && <div className="text-xs text-gray-500">{app.city}, {app.state}</div>}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                        {format(new Date(app.appliedAt), "MMM d, yyyy")}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <ReviewAdmissionModal admission={app} />
                                            <Link href={`/dashboard/admin/admissions/${app.id}/edit`}>
                                                <button className="p-2 bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm transition-all" title="Edit Application">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <DeleteAdmissionButton admissionId={app.id} studentName={app.fullName} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
