"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Banknote, CheckCircle2, Clock, IndianRupee, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StaffSalaryPage() {
    const [salaries, setSalaries] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [printData, setPrintData] = useState<any | null>(null);

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const res = await fetch("/api/staff/salary");
                if (res.ok) {
                    const data = await res.json();
                    setSalaries(data.salaries || []);
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Failed to fetch salaries", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSalaries();
    }, []);

    const totalPaid = salaries.filter(s => s.status === 'PAID').reduce((sum, s) => sum + s.amount, 0);
    const totalPending = salaries.filter(s => s.status === 'PENDING').reduce((sum, s) => sum + s.amount, 0);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading your salary history...</div>;
    }

    const handlePrintSlip = (salary: any) => {
        setPrintData(salary);
        setTimeout(() => {
            window.print();
            setTimeout(() => setPrintData(null), 1000);
        }, 100);
    };

    return (
        <>
        <div className={`space-y-6 animate-in fade-in duration-500 ${printData ? 'print:hidden' : ''}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <Banknote className="w-8 h-8 text-emerald-600 print:hidden" />
                        My Salary History
                    </h1>
                    <p className="text-gray-500 print:hidden">View your salary records and payment status.</p>
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

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-l-4 border-l-emerald-600 shadow-sm transition-transform hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Received</CardTitle>
                        <IndianRupee className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-950">₹{totalPaid.toFixed(2)}</div>
                        <p className="text-xs text-gray-500">Total salary paid to date</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 shadow-sm transition-transform hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-950">₹{totalPending.toFixed(2)}</div>
                        <p className="text-xs text-gray-500">Salaries awaiting processing</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-emerald-100 shadow-sm">
                <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
                    <CardTitle className="text-emerald-900">Salary Records</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Month/Year</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Payment Date</th>
                                <th className="px-6 py-4 font-semibold print:hidden text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {salaries.map((salary) => (
                                <tr key={salary.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-emerald-950">
                                        {salary.month}
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        ₹{salary.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {salary.status === 'PAID' ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                                <Clock className="w-3 h-3 mr-1" /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {salary.paymentDate ? format(new Date(salary.paymentDate), 'MMM dd, yyyy') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right print:hidden">
                                        {salary.status === 'PAID' && (
                                            <button 
                                                onClick={() => handlePrintSlip(salary)}
                                                className="text-emerald-600 hover:text-emerald-800 p-1 rounded-md hover:bg-emerald-50 transition-colors"
                                                title="Print Payslip"
                                            >
                                                <Printer className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {salaries.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No salary records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>

        {/* The Printable Payslip */}
        {printData && user && (
            <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999] p-8 text-black">
                <div className="max-w-3xl mx-auto border-2 border-gray-800 p-8">
                    <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
                        <img src="/images/madrasa_logo.png" alt="Madrasa Logo" className="h-20 mx-auto mb-3" />
                        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">AL-IQRA MODERN MADRASA</h1>
                        <p className="text-gray-600">Salary Slip - {printData.month}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Employee Details</p>
                            <p className="font-bold text-lg">{user.name}</p>
                            <p className="text-gray-600 mt-1">Role: <span className="font-medium">{user.role}</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Payment Details</p>
                            <p className="text-gray-600">Status: <span className="font-bold text-emerald-600 uppercase">Paid</span></p>
                            <p className="text-gray-600">Paid On: {format(new Date(printData.paymentDate), 'MMMM dd, yyyy')}</p>
                            <p className="text-gray-600 mt-1">Transaction ID: {printData.id.split('-')[0].toUpperCase()}</p>
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
                                <td className="py-4">Basic Salary for {printData.month}</td>
                                <td className="py-4 text-right">₹{printData.amount.toFixed(2)}</td>
                            </tr>
                            <tr className="border-b-2 border-gray-800">
                                <td className="py-4 font-bold text-right uppercase tracking-wider text-sm">Net Pay</td>
                                <td className="py-4 text-right font-bold text-xl">₹{printData.amount.toFixed(2)}</td>
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
