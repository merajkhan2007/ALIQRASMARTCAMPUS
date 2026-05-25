"use client";

import { useState, useEffect, useTransition, FormEvent } from "react";
import { format } from "date-fns";
import { 
    IndianRupee, Search, CheckCircle, Clock, AlertTriangle, 
    CreditCard, Loader2, X, Receipt, ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface Student {
    id: string;
    admissionNo: string;
    user: { name: string };
    class: { name: string; section: string | null } | null;
}

export default function AccountantFeeCollectionPage() {
    const [fees, setFees] = useState<FeeRecord[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    
    // Collect Payment Modal State
    const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Create Fee Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createPending, startCreateTransition] = useTransition();
    const [createError, setCreateError] = useState<string | null>(null);
    const [createSuccess, setCreateSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchFees();
        fetchStudents();
    }, []);

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

    const fetchStudents = async () => {
        try {
            const res = await fetch("/api/students");
            if (res.ok) {
                setStudents(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch students", err);
        }
    };

    const handleRecordPayment = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedFee) return;
        setError(null);
        setSuccessMsg(null);

        const formData = new FormData(e.currentTarget);
        const amount = parseFloat(formData.get("amount") as string);
        const method = formData.get("method") as string;
        const transactionId = formData.get("transactionId") as string;

        if (!amount || amount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        const totalPaid = selectedFee.payments.reduce((sum, p) => sum + p.amount, 0);
        if (amount > selectedFee.amount - totalPaid) {
            setError(`Amount exceeds remaining balance of ₹${(selectedFee.amount - totalPaid).toFixed(2)}`);
            return;
        }

        startTransition(async () => {
            try {
                // Create payment via API
                const res = await fetch("/api/fees", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        feeId: selectedFee.id,
                        amount,
                        method: method || "CASH",
                        transactionId: transactionId || null,
                    }),
                });

                if (res.ok) {
                    setSuccessMsg("Payment recorded successfully!");
                    setTimeout(() => {
                        setSelectedFee(null);
                        setSuccessMsg(null);
                        fetchFees();
                    }, 1500);
                } else {
                    const data = await res.json();
                    setError(data.message || "Failed to record payment.");
                }
            } catch {
                setError("An unexpected error occurred.");
            }
        });
    };

    const handleCreateFee = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreateError(null);
        setCreateSuccess(null);

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const amount = parseFloat(formData.get("amount") as string);
        const dueDate = formData.get("dueDate") as string;
        const studentId = formData.get("studentId") as string;

        if (!title || !amount || !dueDate || !studentId) {
            setCreateError("All fields are required.");
            return;
        }

        startCreateTransition(async () => {
            try {
                const res = await fetch("/api/fees", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, amount, dueDate, studentId }),
                });

                if (res.ok) {
                    setCreateSuccess("Fee record created successfully!");
                    setTimeout(() => {
                        setShowCreateModal(false);
                        setCreateSuccess(null);
                        setCreateError(null);
                        fetchFees();
                    }, 1500);
                } else {
                    const data = await res.json();
                    setCreateError(data.message || "Failed to create fee record.");
                }
            } catch {
                setCreateError("An unexpected error occurred.");
            }
        });
    };

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

    if (isLoading) {
        return (
            <div className="p-8 text-center text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
                <p>Loading fee records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <IndianRupee className="w-8 h-8 text-emerald-600" />
                        Fee Collection
                    </h1>
                    <p className="text-gray-500">Manage student fees, record payments, and track outstanding dues.</p>
                </div>
                <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Create Fee Record
                </Button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by student name, fee title, or admission no..." 
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

            {/* Fee Records Table */}
            <Card className="border-emerald-100 shadow-sm">
                <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
                    <CardTitle className="text-emerald-900">
                        Fee Records ({filteredFees.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Fee Title</th>
                                <th className="px-6 py-4 font-semibold">Student</th>
                                <th className="px-6 py-4 font-semibold">Class</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Paid</th>
                                <th className="px-6 py-4 font-semibold">Due Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {filteredFees.map((fee) => {
                                const totalPaid = fee.payments.reduce((sum, p) => sum + p.amount, 0);
                                const remaining = fee.amount - totalPaid;
                                return (
                                    <tr key={fee.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{fee.title}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{fee.student.user.name}</div>
                                            <div className="text-xs text-gray-500">{fee.student.admissionNo}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {fee.student.class ? `${fee.student.class.name} ${fee.student.class.section || ''}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">₹{fee.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            {totalPaid > 0 ? (
                                                <span className="text-emerald-600 font-medium">₹{totalPaid.toFixed(2)}</span>
                                            ) : (
                                                <span className="text-gray-400">₹0.00</span>
                                            )}
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
                                            {fee.status !== 'PAID' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => setSelectedFee(fee)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                                                >
                                                    <Receipt className="w-3.5 h-3.5 mr-1" />
                                                    Collect (₹{remaining.toFixed(0)})
                                                </Button>
                                            )}
                                            {fee.status === 'PAID' && (
                                                <span className="text-emerald-600 text-xs font-medium flex items-center justify-end gap-1">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Fully Paid
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredFees.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        <IndianRupee className="mx-auto h-8 w-8 text-gray-200 mb-3" />
                                        <p className="font-medium text-gray-900">No fee records found</p>
                                        <p className="text-xs mt-1">Create a new fee record to get started.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Collect Payment Modal */}
            {selectedFee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md shadow-2xl rounded-2xl flex flex-col relative animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-emerald-50/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                                    <Receipt className="w-5 h-5 text-emerald-600" />
                                    Record Payment
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    {selectedFee.student.user.name} — {selectedFee.title}
                                </p>
                            </div>
                            <button 
                                onClick={() => { setSelectedFee(null); setError(null); setSuccessMsg(null); }} 
                                className="bg-white hover:bg-gray-100 text-gray-500 rounded-full p-2 transition-colors border shadow-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Fee Summary */}
                        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Fee:</span>
                                <span className="font-bold text-gray-900">₹{selectedFee.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-500">Already Paid:</span>
                                <span className="font-medium text-emerald-600">
                                    ₹{selectedFee.payments.reduce((s, p) => s + p.amount, 0).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mt-1 pt-1 border-t border-gray-200">
                                <span className="text-gray-700 font-semibold">Remaining:</span>
                                <span className="font-bold text-red-600">
                                    ₹{(selectedFee.amount - selectedFee.payments.reduce((s, p) => s + p.amount, 0)).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                                    {error}
                                </div>
                            )}
                            {successMsg && (
                                <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-sm font-medium">
                                    {successMsg}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Amount Received (₹)</label>
                                <Input name="amount" type="number" min="1" step="0.01" required placeholder="Enter amount" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Payment Method</label>
                                <select name="method" required className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                                    <option value="CASH">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                    <option value="CHEQUE">Cheque</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Transaction ID (Optional)</label>
                                <Input name="transactionId" placeholder="e.g., TXN123456" />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-gray-100 pt-5">
                                <Button type="button" variant="outline" onClick={() => { setSelectedFee(null); setError(null); setSuccessMsg(null); }} disabled={isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 font-semibold">
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                    {isPending ? "Processing..." : "Confirm Payment"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Fee Record Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto pt-10 pb-10">
                    <div className="bg-white w-full max-w-lg shadow-2xl rounded-2xl flex flex-col relative animate-in zoom-in-95 duration-200 my-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-emerald-50/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-emerald-600" />
                                    Create Fee Record
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">Generate a new fee assessment for a student.</p>
                            </div>
                            <button 
                                onClick={() => { setShowCreateModal(false); setCreateError(null); setCreateSuccess(null); }} 
                                className="bg-white hover:bg-gray-100 text-gray-500 rounded-full p-2 transition-colors border shadow-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateFee} className="p-6 space-y-4">
                            {createError && (
                                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                                    {createError}
                                </div>
                            )}
                            {createSuccess && (
                                <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-sm font-medium">
                                    {createSuccess}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Fee Title</label>
                                <Input name="title" required placeholder="e.g., Term 2 Tuition Fee" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Amount (₹)</label>
                                <Input name="amount" type="number" min="1" step="0.01" required placeholder="5000" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Due Date</label>
                                <Input name="dueDate" type="date" required />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Student</label>
                                <select name="studentId" required className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                                    <option value="">Select a student...</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.user.name} ({s.admissionNo}) — {s.class ? `${s.class.name} ${s.class.section || ''}` : 'No Class'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-gray-100 pt-5">
                                <Button type="button" variant="outline" onClick={() => { setShowCreateModal(false); setCreateError(null); setCreateSuccess(null); }} disabled={createPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createPending} className="bg-emerald-600 hover:bg-emerald-700 font-semibold">
                                    {createPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                                    {createPending ? "Creating..." : "Create Fee"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}