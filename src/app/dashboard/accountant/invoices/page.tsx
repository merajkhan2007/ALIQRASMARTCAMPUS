"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
    FileText, Search, Download, Printer, IndianRupee, 
    Loader2, CheckCircle, Clock, AlertTriangle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FeeRecord {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
    status: string;
    student: {
        admissionNo: string;
        class: { name: string; section: string | null } | null;
        user: { name: string };
    };
    payments: Payment[];
}

interface Payment {
    id: string;
    amount: number;
    date: string;
    method: string;
    transactionId: string | null;
}

export default function AccountantInvoicesPage() {
    const [fees, setFees] = useState<FeeRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const res = await fetch("/api/fees");
                if (res.ok) {
                    const data = await res.json();
                    setFees(data);
                }
            } catch (err) {
                console.error("Failed to fetch fees", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFees();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PAID': return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case 'PARTIAL': return "bg-blue-100 text-blue-800 border-blue-200";
            case 'OVERDUE': return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-amber-100 text-amber-800 border-amber-200";
        }
    };

    const filteredFees = fees.filter(fee => {
        const matchesStatus = statusFilter === "ALL" || fee.status === statusFilter;
        const matchesSearch = !search || 
            fee.student.user.name.toLowerCase().includes(search.toLowerCase()) ||
            fee.title.toLowerCase().includes(search.toLowerCase()) ||
            fee.student.admissionNo.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalInvoiced = filteredFees.reduce((sum, f) => sum + f.amount, 0);
    const totalCollected = filteredFees.reduce((sum, f) => sum + f.payments.reduce((s, p) => s + p.amount, 0), 0);
    const totalOutstanding = totalInvoiced - totalCollected;

    const handlePrintInvoice = (fee: FeeRecord) => {
        const totalPaid = fee.payments.reduce((sum, p) => sum + p.amount, 0);
        const remaining = fee.amount - totalPaid;
        
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
            <head>
                <title>Invoice - ${fee.student.user.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }
                    .header { text-align: center; border-bottom: 2px solid #047857; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { color: #047857; font-size: 24px; margin: 0; }
                    .header p { color: #666; margin: 5px 0 0 0; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
                    .info-box h3 { color: #047857; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0; }
                    .info-box p { margin: 3px 0; font-size: 14px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th { background: #f0fdf4; color: #047857; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
                    td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
                    .total-row td { font-weight: bold; font-size: 16px; border-top: 2px solid #047857; }
                    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; }
                    .status-paid { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
                    .status-pending { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
                    .status-overdue { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 20px; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>AL-IQRA MODERN MADRASA</h1>
                    <p>Fee Invoice</p>
                </div>
                
                <div class="info-grid">
                    <div class="info-box">
                        <h3>Student Details</h3>
                        <p><strong>Name:</strong> ${fee.student.user.name}</p>
                        <p><strong>Admission No:</strong> ${fee.student.admissionNo}</p>
                        <p><strong>Class:</strong> ${fee.student.class ? fee.student.class.name + ' ' + (fee.student.class.section || '') : 'N/A'}</p>
                    </div>
                    <div class="info-box">
                        <h3>Invoice Details</h3>
                        <p><strong>Invoice #:</strong> INV-${fee.id.substring(0, 8).toUpperCase()}</p>
                        <p><strong>Date:</strong> ${format(new Date(), 'MMMM dd, yyyy')}</p>
                        <p><strong>Due Date:</strong> ${format(new Date(fee.dueDate), 'MMMM dd, yyyy')}</p>
                        <p><strong>Status:</strong> <span class="status-badge status-${fee.status.toLowerCase()}">${fee.status}</span></p>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${fee.title}</td>
                            <td>₹${fee.amount.toFixed(2)}</td>
                        </tr>
                        ${totalPaid > 0 ? `<tr>
                            <td style="color:#047857;">Amount Paid</td>
                            <td style="color:#047857;">- ₹${totalPaid.toFixed(2)}</td>
                        </tr>` : ''}
                        <tr class="total-row">
                            <td>${fee.status === 'PAID' ? 'Total Paid' : 'Balance Due'}</td>
                            <td>₹${remaining.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                ${fee.payments.length > 0 ? `
                <h3 style="color:#047857;margin-top:30px;">Payment History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fee.payments.map(p => `
                        <tr>
                            <td>${format(new Date(p.date), 'MMM dd, yyyy')}</td>
                            <td>₹${p.amount.toFixed(2)}</td>
                            <td>${p.method}</td>
                            <td>${p.transactionId || 'N/A'}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                ` : ''}

                <div class="footer">
                    <p>This is a computer-generated invoice. For queries, contact the accounts office.</p>
                    <p>AL-IQRA MODERN MADRASA | Accounts Department</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    };

    if (isLoading) {
        return (
            <div className="p-8 text-center text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
                <p>Loading invoices...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <FileText className="w-8 h-8 text-emerald-600" />
                        Invoices
                    </h1>
                    <p className="text-gray-500">View, print, and manage all fee invoices.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-emerald-600 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
                        <IndianRupee className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalInvoiced.toFixed(2)}</div>
                        <p className="text-xs text-gray-500">{filteredFees.length} invoices</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-600 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700">₹{totalCollected.toFixed(2)}</div>
                        <p className="text-xs text-gray-500">Payments received</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{totalOutstanding.toFixed(2)}</div>
                        <p className="text-xs text-gray-500">Balance remaining</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search invoices by student name, title..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    {["ALL", "PENDING", "PARTIAL", "PAID", "OVERDUE"].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                                statusFilter === s 
                                    ? 'bg-emerald-600 text-white border-emerald-600' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Invoices Table */}
            <Card className="border-emerald-100 shadow-sm">
                <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 flex flex-row items-center justify-between">
                    <CardTitle className="text-emerald-900">
                        Invoice Records ({filteredFees.length})
                    </CardTitle>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.print()}
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Print All
                    </Button>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Invoice #</th>
                                <th className="px-6 py-4 font-semibold">Fee Title</th>
                                <th className="px-6 py-4 font-semibold">Student</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Paid</th>
                                <th className="px-6 py-4 font-semibold">Balance</th>
                                <th className="px-6 py-4 font-semibold">Due Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {filteredFees.map((fee) => {
                                const totalPaid = fee.payments.reduce((sum, p) => sum + p.amount, 0);
                                const balance = fee.amount - totalPaid;
                                return (
                                    <tr key={fee.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            INV-{fee.id.substring(0, 8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{fee.title}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{fee.student.user.name}</div>
                                            <div className="text-xs text-gray-500">{fee.student.admissionNo}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">₹{fee.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={totalPaid > 0 ? 'text-emerald-600 font-medium' : 'text-gray-400'}>
                                                ₹{totalPaid.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={balance > 0 ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium'}>
                                                ₹{balance.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {format(new Date(fee.dueDate), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-semibold text-xs ${getStatusStyle(fee.status)}`}>
                                                {fee.status === 'PAID' && <CheckCircle className="w-3.5 h-3.5" />}
                                                {fee.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                                                {fee.status === 'OVERDUE' && <AlertTriangle className="w-3.5 h-3.5" />}
                                                {fee.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handlePrintInvoice(fee)}
                                                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                                                >
                                                    <Printer className="w-3.5 h-3.5 mr-1" />
                                                    Print
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handlePrintInvoice(fee)}
                                                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                >
                                                    <Download className="w-3.5 h-3.5 mr-1" />
                                                    PDF
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredFees.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                                        <FileText className="mx-auto h-8 w-8 text-gray-200 mb-3" />
                                        <p className="font-medium text-gray-900">No invoices found</p>
                                        <p className="text-xs mt-1">Fee records will appear here.</p>
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