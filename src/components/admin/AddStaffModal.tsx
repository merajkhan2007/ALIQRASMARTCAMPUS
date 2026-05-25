"use client";

import { useState, useTransition, FormEvent } from "react";
import { UserPlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addStaff } from "@/app/dashboard/admin/users/actions";

export function AddStaffModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        
        const formData = new FormData(e.currentTarget);
        
        startTransition(async () => {
            const res = await addStaff(null, formData);
            if (res.error) {
                setError(res.error);
            } else {
                setIsOpen(false);
                // Clear the error gracefully
                setError(null);
            }
        });
    };

    return (
        <>
            <Button 
                onClick={() => setIsOpen(true)}
                className="relative z-10 bg-blue-600 hover:bg-blue-700 text-white shadow-md font-semibold px-6 transition-all active:scale-95"
            >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Staff
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto pt-10 pb-10">
                    <div className="bg-white w-full max-w-lg shadow-2xl rounded-2xl flex flex-col relative animate-in zoom-in-95 duration-200 my-auto">
                        
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-emerald-50/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-emerald-600" />
                                    Add New Staff Member
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">Create a profile for Cooks, Khadims, Hafiz, etc.</p>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="bg-white hover:bg-gray-100 text-gray-500 rounded-full p-2 transition-colors border shadow-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-l-2 pl-2 border-emerald-500">Account Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 col-span-2 sm:col-span-1">
                                        <label className="text-xs font-semibold text-gray-600">Full Name</label>
                                        <Input name="name" required placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-1 col-span-2 sm:col-span-1">
                                        <label className="text-xs font-semibold text-gray-600">Email Address</label>
                                        <Input name="email" type="email" required placeholder="teacher@aliqra.edu" />
                                    </div>
                                    <div className="space-y-1 col-span-2 sm:col-span-1">
                                        <label className="text-xs font-semibold text-gray-600">Phone Number</label>
                                        <Input name="phone" required placeholder="+91 9876543210" />
                                    </div>
                                    <div className="space-y-1 col-span-2 sm:col-span-1">
                                        <label className="text-xs font-semibold text-gray-600">Secure Password</label>
                                        <Input name="password" type="password" required placeholder="Min 6 chars" minLength={6} />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-xs font-semibold text-gray-600">Profile Photo</label>
                                        <Input name="avatar" type="file" accept="image/*" className="cursor-pointer file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-l-2 pl-2 border-emerald-500">Employment Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 col-span-2 sm:col-span-1">
                                        <label className="text-xs font-semibold text-gray-600">Role</label>
                                        <select name="role" required className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                                            <option value="COOK">Cook</option>
                                            <option value="KHADIM">Khadim</option>
                                            <option value="HAFIZ">Hafiz</option>
                                            <option value="ACCOUNTANT">Accountant</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1 col-span-2 sm:col-span-1">
                                        <label className="text-xs font-semibold text-gray-600">Base Salary Monthly (₹)</label>
                                        <Input name="baseSalary" type="number" min="0" step="0.01" required placeholder="15000" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-gray-100 pt-5">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 font-semibold min-w-[120px]">
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                                    {isPending ? "Adding..." : "Add Staff"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
