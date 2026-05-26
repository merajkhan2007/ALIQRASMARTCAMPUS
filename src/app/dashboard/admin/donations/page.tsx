"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Heart, Plus, XCircle, Trash2, Search, Download, IndianRupee, Building2, User, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DonationsPage() {
    const [donations, setDonations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [methodFilter, setMethodFilter] = useState("ALL");
    const [printReceipt, setPrintReceipt] = useState<any>(null);

    const [formData, setFormData] = useState({
        donorName: "",
        donorType: "INDIVIDUAL",
        donationType: "ZAKAT",
        amount: 0,
        date: format(new Date(), "yyyy-MM-dd"),
        method: "CASH",
        phone: "",
        email: "",
        address: "",
        message: "",
    });

    const fetchDonations = async () => {
        try {
            const res = await fetch("/api/donations");
            if (res.ok) {
                const data = await res.json();
                setDonations(data);
            }
        } catch (error) {
            console.error("Failed to fetch donations", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/donations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowAddModal(false);
                resetForm();
                fetchDonations();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to record donation");
            }
        } catch (error) {
            console.error(error);
            alert("Error recording donation");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this donation record?")) return;
        try {
            const res = await fetch(`/api/donations/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchDonations();
            } else {
                alert("Failed to delete donation");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({
            donorName: "",
            donorType: "INDIVIDUAL",
            donationType: "ZAKAT",
            amount: 0,
            date: format(new Date(), "yyyy-MM-dd"),
            method: "CASH",
            phone: "",
            email: "",
            address: "",
            message: "",
        });
    };

    const handlePrintReceipt = (donation: any) => {
        setPrintReceipt(donation);
        setTimeout(() => {
            window.print();
            setTimeout(() => setPrintReceipt(null), 1000);
        }, 100);
    };

    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
    const thisMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
    const thisMonthDonations = donations
        .filter(d => {
            const dDate = new Date(d.date);
            const now = new Date();
            return dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, d) => sum + d.amount, 0);

    const filteredDonations = donations.filter(d => {
        const matchesSearch =
            d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.phone && d.phone.includes(searchQuery)) ||
            (d.email && d.email.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesMethod = methodFilter === "ALL" || d.method === methodFilter;
        return matchesSearch && matchesMethod;
    });

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading donation records...</div>;
    }

    return (
        <>
            <div className={`space-y-6 animate-in fade-in duration-500 ${printReceipt ? "print:hidden" : ""}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                            <Heart className="w-8 h-8 text-rose-600" />
                            Donation Records
                        </h1>
                        <p className="text-gray-500">Track and manage all donations received by the institution.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => window.print()}
                            variant="outline"
                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 print:hidden"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print Report
                        </Button>
                        <Button
                            onClick={() => {
                                resetForm();
                                setShowAddModal(true);
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Record Donation
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-rose-500 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-rose-700 font-semibold text-sm uppercase tracking-wider mb-1">Total Donations</p>
                            <p className="text-3xl font-bold text-gray-900">₹{totalDonations.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-1">This Month ({thisMonth})</p>
                            <p className="text-3xl font-bold text-gray-900">₹{thisMonthDonations.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-1">Total Records</p>
                            <p className="text-3xl font-bold text-gray-900">{donations.length}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-emerald-100 shadow-sm">
                    <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle className="text-emerald-900">All Donations</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search donor, receipt, phone..."
                                    className="pl-9 pr-4 py-2 text-sm border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-3 py-2 text-sm border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                value={methodFilter}
                                onChange={(e) => setMethodFilter(e.target.value)}
                            >
                                <option value="ALL">All Methods</option>
                                <option value="CASH">Cash</option>
                                <option value="CHEQUE">Cheque</option>
                                <option value="BANK_TRANSFER">Bank Transfer</option>
                                <option value="ONLINE">Online</option>
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Receipt No</th>
                                    <th className="px-6 py-4 font-semibold">Donor</th>
                                    <th className="px-6 py-4 font-semibold">Type</th>
                                    <th className="px-6 py-4 font-semibold">Amount</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                    <th className="px-6 py-4 font-semibold">Method</th>
                                    <th className="px-6 py-4 font-semibold">Recorded By</th>
                                    <th className="px-6 py-4 font-semibold print:hidden text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {filteredDonations.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-emerald-700 font-medium">
                                                {donation.receiptNo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {donation.donorType === "ORGANIZATION" ? (
                                                    <Building2 className="w-4 h-4 text-blue-500" />
                                                ) : (
                                                    <User className="w-4 h-4 text-rose-500" />
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900">{donation.donorName}</div>
                                                    {donation.phone && (
                                                        <div className="text-xs text-gray-500">{donation.phone}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {donation.donationType ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                    {donation.donationType.replace(/_/g, " ")}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">₹{donation.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-xs">
                                            {format(new Date(donation.date), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                                ${donation.method === "CASH" ? "bg-green-100 text-green-800" : ""}
                                                ${donation.method === "CHEQUE" ? "bg-purple-100 text-purple-800" : ""}
                                                ${donation.method === "BANK_TRANSFER" ? "bg-blue-100 text-blue-800" : ""}
                                                ${donation.method === "ONLINE" ? "bg-orange-100 text-orange-800" : ""}
                                            `}>
                                                {donation.method.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-xs">
                                            {donation.recordedBy?.name || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 text-right print:hidden">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handlePrintReceipt(donation)}
                                                    className="text-gray-500 hover:text-emerald-600 p-1.5 rounded-md hover:bg-emerald-50 transition-colors"
                                                    title="Print Receipt"
                                                >
                                                    <Printer className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(donation.id)}
                                                    className="text-gray-500 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredDonations.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                            <Heart className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                                            <p className="font-medium text-gray-900">No donation records found</p>
                                            <p className="text-sm mt-1">
                                                {searchQuery || methodFilter !== "ALL"
                                                    ? "Try adjusting your filters."
                                                    : "Click 'Record Donation' to add the first one."}
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Add Donation Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-rose-600" />
                                    Record New Donation
                                </h2>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            value={formData.donorName}
                                            onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                                            placeholder="Full name or organization name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Donor Type</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            value={formData.donorType}
                                            onChange={(e) => setFormData({ ...formData, donorType: e.target.value })}
                                        >
                                            <option value="INDIVIDUAL">Individual</option>
                                            <option value="ORGANIZATION">Organization</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Donation Type</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            value={formData.donationType || ""}
                                            onChange={(e) => setFormData({ ...formData, donationType: e.target.value })}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="ZAKAT">Zakat</option>
                                            <option value="SADAQAH">Sadaqah</option>
                                            <option value="SADAQAH_JARIYAH">Sadaqah Jariyah</option>
                                            <option value="ZAKAT_AL_FITR">Zakat al-Fitr</option>
                                            <option value="KAFFARAH">Kaffarah</option>
                                            <option value="FIDYA">Fidya</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            value={formData.amount || ""}
                                            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            value={formData.method}
                                            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                        >
                                            <option value="CASH">Cash</option>
                                            <option value="CHEQUE">Cheque</option>
                                            <option value="BANK_TRANSFER">Bank Transfer</option>
                                            <option value="ONLINE">Online</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="donor@example.com"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            rows={2}
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="Donor address (optional)"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message / Note</label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            rows={2}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Purpose of donation or any note (optional)"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white" disabled={isSubmitting}>
                                        {isSubmitting ? "Recording..." : "Record Donation"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Printable Receipt */}
            {printReceipt && (
                <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999] p-8 text-black">
                    <div className="max-w-3xl mx-auto border-2 border-gray-800 p-8">
                        <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
                            <img src="/images/madrasa_logo.png" alt="Madrasa Logo" className="h-20 mx-auto mb-3" />
                            <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">AL-IQRA MODERN MADRASA</h1>
                            <p className="text-gray-600 text-lg">Donation Receipt</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Receipt Number</p>
                                <p className="font-bold text-xl text-emerald-700">{printReceipt.receiptNo}</p>
                                <p className="text-gray-600 mt-1">Date: {format(new Date(printReceipt.date), "MMMM dd, yyyy")}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Donor Details</p>
                                <p className="font-bold text-lg">{printReceipt.donorName}</p>
                                <p className="text-gray-600">{printReceipt.donorType === "ORGANIZATION" ? "Organization" : "Individual"}{printReceipt.donationType ? ` · ${printReceipt.donationType.replace(/_/g, " ")}` : ""}</p>
                                {printReceipt.phone && <p className="text-gray-600">Phone: {printReceipt.phone}</p>}
                                {printReceipt.email && <p className="text-gray-600">Email: {printReceipt.email}</p>}
                                {printReceipt.address && <p className="text-gray-600 text-sm mt-1">{printReceipt.address}</p>}
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
                                    <td className="py-4">
                                        <p className="font-medium">Donation{printReceipt.donationType ? ` (${printReceipt.donationType.replace(/_/g, " ")})` : ""}</p>
                                        <p className="text-sm text-gray-500">Payment Method: {printReceipt.method.replace("_", " ")}</p>
                                        {printReceipt.message && (
                                            <p className="text-sm text-gray-500 mt-1">Note: {printReceipt.message}</p>
                                        )}
                                    </td>
                                    <td className="py-4 text-right">₹{printReceipt.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr className="border-b-2 border-gray-800">
                                    <td className="py-4 font-bold text-right uppercase tracking-wider text-sm">Total</td>
                                    <td className="py-4 text-right font-bold text-xl">₹{printReceipt.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="text-sm text-gray-600 mb-6">
                            <p className="font-semibold">Amount in Words:</p>
                            <p className="italic">{numberToWords(printReceipt.amount)} Rupees Only</p>
                        </div>

                        <div className="flex justify-between mt-16 pt-8">
                            <div className="border-t border-gray-400 w-48 text-center pt-2 text-sm text-gray-600">
                                Donor Signature
                            </div>
                            <div className="border-t border-gray-400 w-48 text-center pt-2 text-sm text-gray-600">
                                Authorized Signatory
                            </div>
                        </div>

                        <div className="text-center mt-12 text-xs text-gray-400">
                            This is a computer generated receipt. No signature is required.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function numberToWords(num: number): string {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (num === 0) return "Zero";

    function convert(n: number): string {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
        if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convert(n % 100) : "");
        if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convert(n % 1000) : "");
        if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convert(n % 100000) : "");
        return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + convert(n % 10000000) : "");
    }

    return convert(Math.floor(num));
}