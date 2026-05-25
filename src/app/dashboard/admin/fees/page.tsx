import { db } from "@/lib/db";
import { format } from "date-fns";
import { IndianRupee, Search, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FeesManagementPage() {
    // Fetch all fees with related student and payment info representing real time ledger
    const fees = await db.fee.findMany({
        include: {
            student: {
                include: { user: true, class: true }
            },
            payments: true
        },
        orderBy: { dueDate: 'asc' }
    });

    const totalCollected = await db.payment.aggregate({ _sum: { amount: true } });
    const outstandingFees = fees.filter(f => f.status !== 'PAID').reduce((acc, curr) => {
        const paidSoFar = curr.payments.reduce((sum, p) => sum + p.amount, 0);
        return acc + (curr.amount - paidSoFar);
    }, 0);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PAID': return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case 'PARTIAL': return "bg-blue-100 text-blue-800 border-blue-200";
            case 'OVERDUE': return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-amber-100 text-amber-800 border-amber-200";
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <IndianRupee className="w-8 h-8 text-emerald-600" />
                        Fee Management
                    </h1>
                    <p className="text-gray-500">Real-time ledger of all student fee assessments and payments.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-xl p-5 flex flex-col justify-center border-l-4 border-l-emerald-500">
                    <span className="text-emerald-700 font-semibold mb-1 text-sm uppercase tracking-wider">Total Received</span>
                    <span className="text-4xl font-bold text-gray-900">₹{totalCollected._sum.amount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="bg-white border rounded-xl p-5 flex flex-col justify-center border-l-4 border-l-red-500">
                    <span className="text-red-700 font-semibold mb-1 text-sm uppercase tracking-wider">Total Outstanding</span>
                    <span className="text-4xl font-bold text-gray-900">₹{outstandingFees.toFixed(2)}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search fee records..." className="w-full pl-9 pr-4 py-2 text-sm border-gray-300 rounded-md focus:ring-emerald-500 border outline-none" disabled />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{fees.length} Total Records</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-emerald-900/5 text-emerald-900 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Title / Assessment</th>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {fees.map((fee) => {
                                const totalPaid = fee.payments.reduce((acc, p) => acc + p.amount, 0);
                                return (
                                    <tr key={fee.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{fee.title}</div>
                                            <div className="text-xs text-gray-500">ID: {fee.id.substring(0,8)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{fee.student.user.name}</div>
                                            <div className="text-xs text-blue-600">{fee.student.class?.name || 'No Class'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">₹{fee.amount.toFixed(2)}</div>
                                            {totalPaid > 0 && <div className="text-xs text-emerald-600">Paid: ₹{totalPaid.toFixed(2)}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium text-xs">
                                            {format(new Date(fee.dueDate), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-semibold text-xs ${getStatusStyle(fee.status)}`}>
                                                {fee.status === 'PAID' && <CheckCircle className="w-3.5 h-3.5" />}
                                                {fee.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                                                {fee.status === 'OVERDUE' && <AlertTriangle className="w-3.5 h-3.5" />}
                                                {fee.status}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            
                            {fees.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <IndianRupee className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                                        <p className="font-medium text-gray-900">No fee records found</p>
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
