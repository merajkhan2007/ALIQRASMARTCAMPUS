import { db } from "@/lib/db";
import { format } from "date-fns";
import { IndianRupee, Search, CreditCard, Banknote, Building2, Smartphone, ArrowUpDown, CalendarDays, Receipt, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

const methodIcons: Record<string, React.ReactNode> = {
    CASH: <Banknote className="w-4 h-4" />,
    CHEQUE: <Building2 className="w-4 h-4" />,
    BANK_TRANSFER: <Building2 className="w-4 h-4" />,
    ONLINE: <Smartphone className="w-4 h-4" />,
};

const methodColors: Record<string, string> = {
    CASH: "bg-green-100 text-green-800 border-green-200",
    CHEQUE: "bg-blue-100 text-blue-800 border-blue-200",
    BANK_TRANSFER: "bg-purple-100 text-purple-800 border-purple-200",
    ONLINE: "bg-orange-100 text-orange-800 border-orange-200",
};

export default async function AdminPaymentsPage() {
    const payments = await db.payment.findMany({
        include: {
            fee: {
                include: {
                    student: {
                        include: {
                            user: { select: { name: true } },
                            class: { select: { name: true, section: true } },
                        },
                    },
                },
            },
        },
        orderBy: { date: "desc" },
        take: 200,
    });

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    const byMethod = payments.reduce((acc, p) => {
        acc[p.method] = (acc[p.method] || 0) + p.amount;
        return acc;
    }, {} as Record<string, number>);

    const today = new Date();
    const thisMonth = payments.filter(p => {
        const d = new Date(p.date);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });
    const thisMonthTotal = thisMonth.reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <Receipt className="w-8 h-8 text-emerald-600" />
                        Payments
                    </h1>
                    <p className="text-gray-500">All payment transactions across the institution.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border rounded-xl p-5 flex flex-col justify-center shadow-sm border-l-4 border-l-emerald-500">
                    <span className="text-emerald-700 font-semibold mb-1 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Total Collected
                    </span>
                    <span className="text-3xl font-bold text-gray-900">₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    <span className="text-xs text-gray-400 mt-1">{payments.length} transactions</span>
                </div>

                <div className="bg-white border rounded-xl p-5 flex flex-col justify-center shadow-sm border-l-4 border-l-blue-500">
                    <span className="text-blue-700 font-semibold mb-1 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" /> This Month
                    </span>
                    <span className="text-3xl font-bold text-gray-900">₹{thisMonthTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    <span className="text-xs text-gray-400 mt-1">{thisMonth.length} transactions</span>
                </div>

                <div className="bg-white border rounded-xl p-5 flex flex-col justify-center shadow-sm border-l-4 border-l-purple-500">
                    <span className="text-purple-700 font-semibold mb-1 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" /> Cash Payments
                    </span>
                    <span className="text-3xl font-bold text-gray-900">₹{(byMethod["CASH"] || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="bg-white border rounded-xl p-5 flex flex-col justify-center shadow-sm border-l-4 border-l-orange-500">
                    <span className="text-orange-700 font-semibold mb-1 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" /> Online Payments
                    </span>
                    <span className="text-3xl font-bold text-gray-900">₹{(byMethod["ONLINE"] || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-gray-500" />
                        Recent Transactions
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left p-4 font-semibold text-gray-600 w-28">
                                    <span className="inline-flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
                                </th>
                                <th className="text-left p-4 font-semibold text-gray-600">Student</th>
                                <th className="text-left p-4 font-semibold text-gray-600">Class</th>
                                <th className="text-left p-4 font-semibold text-gray-600">Fee Title</th>
                                <th className="text-left p-4 font-semibold text-gray-600">Method</th>
                                <th className="text-left p-4 font-semibold text-gray-600">Transaction ID</th>
                                <th className="text-right p-4 font-semibold text-gray-600">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id} className="border-b border-gray-100 hover:bg-emerald-50/30 transition-colors">
                                    <td className="p-4 whitespace-nowrap">
                                        <span className="text-gray-900 font-medium">
                                            {format(new Date(payment.date), "dd MMM yyyy")}
                                        </span>
                                        <br />
                                        <span className="text-xs text-gray-400">
                                            {format(new Date(payment.date), "hh:mm a")}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <span className="font-semibold text-gray-900">
                                                {payment.fee.student.user.name}
                                            </span>
                                            <br />
                                            <span className="text-xs text-gray-400 font-mono">
                                                {payment.fee.student.admissionNo}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                            {payment.fee.student.class?.name || "—"}
                                            {payment.fee.student.class?.section ? ` - ${payment.fee.student.class.section}` : ""}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-gray-900">{payment.fee.title}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border ${methodColors[payment.method] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
                                            {methodIcons[payment.method]}
                                            {payment.method.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {payment.transactionId ? (
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{payment.transactionId}</code>
                                        ) : (
                                            <span className="text-gray-400 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="font-bold text-emerald-700 text-base">
                                            ₹{payment.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-gray-500">
                                        <Receipt className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p className="font-semibold text-gray-900 text-lg">No payments yet</p>
                                        <p className="text-sm mt-1">Payment records will appear here once fees are collected.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Method Breakdown Footer */}
                {Object.keys(byMethod).length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Method Breakdown</h3>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(byMethod).map(([method, amount]) => (
                                <div key={method} className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${method === "CASH" ? "bg-green-100 text-green-700" : method === "ONLINE" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                                        {methodIcons[method]}
                                    </span>
                                    <div>
                                        <span className="text-xs text-gray-500">{method.replace("_", " ")}</span>
                                        <br />
                                        <span className="font-bold text-sm text-gray-900">
                                            ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {payments.length >= 200 && (
                    <div className="p-4 text-center text-sm text-gray-400 border-t border-gray-100">
                        Showing the latest 200 transactions. Use filters for older records.
                    </div>
                )}
            </div>
        </div>
    );
}