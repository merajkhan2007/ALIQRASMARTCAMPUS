"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Banknote, Plus, CheckCircle2, XCircle, Printer, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminSalaryPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [generateData, setGenerateData] = useState({ month: "", amount: 0 });
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [printData, setPrintData] = useState<{ user: any, salary: any } | null>(null);
    const [editingSalaryId, setEditingSalaryId] = useState<string | null>(null);
    const [editData, setEditData] = useState({ month: "", amount: 0, status: "PENDING" });

    const fetchSalaries = async () => {
        try {
            const res = await fetch("/api/admin/salary");
            if (res.ok) {
                const data = await res.json();
                setStaff(data);
            }
        } catch (error) {
            console.error("Failed to fetch salaries", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSalaries();
    }, []);

    const handleGenerateSalary = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) return;

        setIsGenerating(true);
        try {
            const res = await fetch("/api/admin/salary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedUserId,
                    amount: Number(generateData.amount),
                    month: generateData.month
                })
            });

            if (res.ok) {
                alert("Salary generated successfully");
                setSelectedUserId(null);
                fetchSalaries();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to generate salary");
            }
        } catch (error) {
            console.error(error);
            alert("Error generating salary");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUpdateStatus = async (salaryId: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/salary/${salaryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                fetchSalaries();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateSalary = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSalaryId) return;

        setIsGenerating(true);
        try {
            const res = await fetch(`/api/admin/salary/${editingSalaryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    month: editData.month,
                    amount: Number(editData.amount),
                    status: editData.status
                })
            });

            if (res.ok) {
                setEditingSalaryId(null);
                fetchSalaries();
            } else {
                alert("Failed to update salary");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating salary");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteSalary = async (salaryId: string) => {
        if (!confirm("Are you sure you want to delete this salary record?")) return;
        try {
            const res = await fetch(`/api/admin/salary/${salaryId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchSalaries();
            } else {
                alert("Failed to delete salary");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePrintSlip = (user: any, salary: any) => {
        setPrintData({ user, salary });
        setTimeout(() => {
            window.print();
            // We can optionally clear it after, but window.print blocks JS in many browsers. 
            // Setting a timeout to clear it usually works.
            setTimeout(() => setPrintData(null), 1000);
        }, 100);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading salary data...</div>;
    }

    const filteredStaff = staff.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <>
        {/* The main dashboard view */}
        <div className={`space-y-6 animate-in fade-in duration-500 ${printData ? 'print:hidden' : ''}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <Banknote className="w-8 h-8 text-emerald-600 print:hidden" />
                        Salary Management
                    </h1>
                    <p className="text-gray-500 print:hidden">Manage and track staff salaries and payments.</p>
                </div>
                <Button 
                    onClick={() => window.print()} 
                    variant="outline" 
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 print:hidden"
                >
                    <Printer className="w-4 h-4 mr-2" />
                    Print to PDF
                </Button>
            </div>

            <Card className="border-emerald-100 shadow-sm">
                <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="text-emerald-900">Staff Salaries</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                        <input 
                            type="text" 
                            placeholder="Search name or email..." 
                            className="px-3 py-1.5 text-sm border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select 
                            className="px-3 py-1.5 text-sm border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="ALL">All Roles</option>
                            <option value="TEACHER">Teachers</option>
                            <option value="ACCOUNTANT">Accountants</option>
                            <option value="ADMIN">Admins</option>
                            <option value="COOK">Cooks</option>
                            <option value="KHADIM">Khadims</option>
                            <option value="HAFIZ">Hafiz</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Staff Member</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Base Salary</th>
                                <th className="px-6 py-4 font-semibold">Recent Salaries</th>
                                <th className="px-6 py-4 font-semibold print:hidden text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {filteredStaff.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-emerald-950">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        ₹{user.baseSalary || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.salaries && user.salaries.length > 0 ? (
                                            <div className="space-y-2">
                                                {user.salaries.map((sal: any) => (
                                                    <div key={sal.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100 min-w-[250px]">
                                                        <div>
                                                            <div className="font-medium text-sm">{sal.month} - ₹{sal.amount}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {sal.status === 'PAID' ? `Paid on ${format(new Date(sal.paymentDate), 'MMM dd, yyyy')}` : 'Awaiting Payment'}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {sal.status === 'PENDING' ? (
                                                                <Button 
                                                                    size="sm" 
                                                                    className="bg-amber-500 hover:bg-amber-600 h-7 text-xs"
                                                                    onClick={() => handleUpdateStatus(sal.id, "PAID")}
                                                                >
                                                                    Mark Paid
                                                                </Button>
                                                            ) : (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="flex items-center text-emerald-600 text-xs font-bold px-1">
                                                                        <CheckCircle2 className="w-4 h-4 mr-1" /> PAID
                                                                    </span>
                                                                    <button 
                                                                        onClick={() => handlePrintSlip(user, sal)}
                                                                        className="text-gray-500 hover:text-emerald-600 p-1 rounded-md hover:bg-emerald-50 transition-colors print:hidden"
                                                                        title="Print Payslip"
                                                                    >
                                                                        <Printer className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center border-l border-gray-200 pl-2 ml-1">
                                                                <button 
                                                                    onClick={() => {
                                                                        setEditingSalaryId(sal.id);
                                                                        setEditData({ month: sal.month, amount: sal.amount, status: sal.status });
                                                                    }}
                                                                    className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 transition-colors print:hidden"
                                                                    title="Edit Salary"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteSalary(sal.id)}
                                                                    className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors print:hidden"
                                                                    title="Delete Salary"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">No records</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right print:hidden">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                setGenerateData({ month: format(new Date(), 'MMMM yyyy'), amount: user.baseSalary || 0 });
                                            }}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Generate
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredStaff.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No staff members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Generate Salary Modal */}
            {selectedUserId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-emerald-950">Generate Salary</h2>
                            <button onClick={() => setSelectedUserId(null)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleGenerateSalary} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Month/Year</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., May 2026"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={generateData.month}
                                    onChange={(e) => setGenerateData({ ...generateData, month: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={generateData.amount}
                                    onChange={(e) => setGenerateData({ ...generateData, amount: Number(e.target.value) })}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setSelectedUserId(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isGenerating}>
                                    {isGenerating ? "Generating..." : "Generate Record"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Salary Modal */}
            {editingSalaryId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-emerald-950">Edit Salary Record</h2>
                            <button onClick={() => setEditingSalaryId(null)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSalary} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Month/Year</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={editData.month}
                                    onChange={(e) => setEditData({ ...editData, month: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={editData.amount}
                                    onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={editData.status}
                                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="PAID">PAID</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setEditingSalaryId(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isGenerating}>
                                    {isGenerating ? "Updating..." : "Update Record"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

        {/* The Printable Payslip (Only visible during print when printData is set) */}
        {printData && (
            <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999] p-8 text-black">
                <div className="max-w-3xl mx-auto border-2 border-gray-800 p-8">
                    <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
                        <img src="/images/madrasa_logo.png" alt="Madrasa Logo" className="h-20 mx-auto mb-3" />
                        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">AL-IQRA MODERN MADRASA</h1>
                        <p className="text-gray-600">Salary Slip - {printData.salary.month}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Employee Details</p>
                            <p className="font-bold text-lg">{printData.user.name}</p>
                            <p className="text-gray-600 mt-1">Role: <span className="font-medium">{printData.user.role}</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Payment Details</p>
                            <p className="text-gray-600">Status: <span className="font-bold text-emerald-600 uppercase">Paid</span></p>
                            <p className="text-gray-600">Paid On: {format(new Date(printData.salary.paymentDate), 'MMMM dd, yyyy')}</p>
                            <p className="text-gray-600 mt-1">Transaction ID: {printData.salary.id.split('-')[0].toUpperCase()}</p>
                        </div>
                    </div>

                    <table className="w-full mb-8">
                        <thead>
                            <tr className="border-y-2 border-gray-800">
                                <th className="text-left py-3 font-bold uppercase tracking-wider text-sm">Description</th>
                                <th className="text-right py-3 font-bold uppercase tracking-wider text-sm">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-4">Basic Salary for {printData.salary.month}</td>
                                <td className="py-4 text-right">₹{printData.salary.amount.toFixed(2)}</td>
                            </tr>
                            <tr className="border-b-2 border-gray-800">
                                <td className="py-4 font-bold text-right uppercase tracking-wider text-sm">Net Pay</td>
                                <td className="py-4 text-right font-bold text-xl">₹{printData.salary.amount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="flex justify-between mt-16 pt-8">
                        <div className="border-t border-gray-400 w-48 text-center pt-2 text-sm text-gray-600">
                            Employee Signature
                        </div>
                        <div className="border-t border-gray-400 w-48 text-center pt-2 text-sm text-gray-600">
                            Authorized Signatory
                        </div>
                    </div>
                    
                    <div className="text-center mt-12 text-xs text-gray-400">
                        This is a computer generated document. No signature is required.
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
