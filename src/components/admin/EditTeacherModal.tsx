"use client";

import { useState, useTransition, FormEvent } from "react";
import { Edit2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { editTeacher } from "@/app/dashboard/admin/users/actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditTeacherModal({ teacher }: { teacher: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        
        const formData = new FormData(e.currentTarget);
        
        startTransition(async () => {
            const res = await editTeacher(formData);
            if (res.error) {
                setError(res.error);
            } else {
                setIsOpen(false);
                setError(null);
            }
        });
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                title="Edit staff details"
            >
                <Edit2 className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh]">
                        
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-emerald-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                                    <Edit2 className="w-5 h-5 text-emerald-600" />
                                    Edit Teacher Profile
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Update professional and account details.</p>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="bg-white hover:bg-gray-100 text-gray-500 rounded-full p-2 transition-colors border shadow-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="hidden" name="id" value={teacher.user.id} />
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
                                            <Input name="name" required defaultValue={teacher.user.name} />
                                        </div>
                                        <div className="space-y-1 col-span-2 sm:col-span-1">
                                            <label className="text-xs font-semibold text-gray-600">Email Address</label>
                                            <Input name="email" type="email" required defaultValue={teacher.user.email} />
                                        </div>
                                        <div className="space-y-1 col-span-2 sm:col-span-1">
                                            <label className="text-xs font-semibold text-gray-600">Phone Number</label>
                                            <Input name="phone" required defaultValue={teacher.user.phone || ''} />
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <label className="text-xs font-semibold text-gray-600">Update Profile Photo (Optional)</label>
                                            <Input name="avatar" type="file" accept="image/*" className="cursor-pointer file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-l-2 pl-2 border-emerald-500">Professional Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1 col-span-2">
                                            <label className="text-xs font-semibold text-gray-600">Qualification</label>
                                            <Input name="qualification" required defaultValue={teacher.qualification || ''} />
                                        </div>
                                        <div className="space-y-1 col-span-2 sm:col-span-1">
                                            <label className="text-xs font-semibold text-gray-600">Experience (Years)</label>
                                            <Input name="experience" type="number" min="0" required defaultValue={teacher.experience} />
                                        </div>
                                        <div className="space-y-1 col-span-2 sm:col-span-1">
                                            <label className="text-xs font-semibold text-gray-600">Salary Monthly (₹)</label>
                                            <Input name="salary" type="number" min="0" step="0.01" required defaultValue={teacher.salary || 0} />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 font-semibold min-w-[120px]">
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                                        {isPending ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
