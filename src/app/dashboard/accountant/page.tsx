import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, FileText, ArrowUpRight, CreditCard, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AccountantDashboard() {
    // Fetch aggregate stats
    const totalCollected = await db.payment.aggregate({ _sum: { amount: true } });
    
    const fees = await db.fee.findMany({
        include: { payments: true },
    });
    
    const outstandingFees = fees.filter(f => f.status !== 'PAID').reduce((acc, curr) => {
        const paidSoFar = curr.payments.reduce((sum, p) => sum + p.amount, 0);
        return acc + (curr.amount - paidSoFar);
    }, 0);

    const pendingFeeCount = fees.filter(f => f.status === 'PENDING').length;
    const overdueFeeCount = fees.filter(f => f.status === 'OVERDUE').length;
    
    // Recent payments
    const recentPayments = await db.payment.findMany({
        include: {
            fee: {
                include: {
                    student: {
                        include: { user: { select: { name: true } } }
                    }
                }
            }
        },
        orderBy: { date: 'desc' },
        take: 5,
    });

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
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Financial Dashboard</h1>
                    <p className="text-gray-500">Manage Madrasa revenue, collections, and pending fees.</p>
                </div>
                <Link 
                    href="/dashboard/accountant/fees" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors"
                >
                    <CreditCard className="w-4 h-4" /> Collect Payment
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-emerald-600 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalCollected._sum.amount?.toFixed(2) || '0.00'}</div>
                        <p className="text-xs text-emerald-600 flex items-center font-medium mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> All-time collections
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outstanding Dues</CardTitle>
                        <FileText className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{outstandingFees.toFixed(2)}</div>
                        <p className="text-xs text-red-600 font-medium mt-1">
                            {pendingFeeCount + overdueFeeCount} records pending
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingFeeCount}</div>
                        <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                        <FileText className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{fees.length}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Fee records generated
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions Table */}
            <Card className="shadow-sm border border-gray-200">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <CardTitle className="text-emerald-900">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Transaction ID</th>
                                <th className="px-6 py-3 font-semibold">Student</th>
                                <th className="px-6 py-3 font-semibold">Fee Title</th>
                                <th className="px-6 py-3 font-semibold">Date</th>
                                <th className="px-6 py-3 font-semibold">Amount</th>
                                <th className="px-6 py-3 font-semibold">Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentPayments.length > 0 ? recentPayments.map((payment) => (
                                <tr key={payment.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs">
                                        {payment.transactionId || payment.id.substring(0, 8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {payment.fee.student.user.name}
                                    </td>
                                    <td className="px-6 py-4">{payment.fee.title}</td>
                                    <td className="px-6 py-4">{format(new Date(payment.date), 'MMM dd, yyyy')}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">₹{payment.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            {payment.method}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <IndianRupee className="mx-auto h-8 w-8 text-gray-200 mb-3" />
                                        <p className="font-medium text-gray-900">No transactions recorded yet</p>
                                        <p className="text-xs mt-1">Payments will appear here once collected.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Fee Status Summary */}
            <Card className="shadow-sm border border-gray-200">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <CardTitle className="text-emerald-900">Fee Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-emerald-900/5 text-emerald-900 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Count</th>
                                <th className="px-6 py-4">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { status: 'PAID', label: 'Paid', icon: <CheckCircle className="w-4 h-4 text-emerald-600" />, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                                { status: 'PENDING', label: 'Pending', icon: <Clock className="w-4 h-4 text-amber-600" />, color: 'text-amber-700', bg: 'bg-amber-50' },
                                { status: 'OVERDUE', label: 'Overdue', icon: <AlertTriangle className="w-4 h-4 text-red-600" />, color: 'text-red-700', bg: 'bg-red-50' },
                            ].map(({ status, label, icon, color, bg }) => {
                                const statusFees = fees.filter(f => f.status === status);
                                const totalAmount = statusFees.reduce((sum, f) => sum + f.amount, 0);
                                return (
                                    <tr key={status} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-semibold text-xs ${getStatusStyle(status)}`}>
                                                {icon} {label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{statusFees.length}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">₹{totalAmount.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                            {fees.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                        No fee records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
