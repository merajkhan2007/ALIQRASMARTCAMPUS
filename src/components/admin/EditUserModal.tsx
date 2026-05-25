"use client";

import { useState, useTransition, FormEvent } from "react";
import { Edit, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { editUser } from "@/app/dashboard/admin/users/actions";

interface EditUserModalProps {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: string;
    };
}

export function EditUserModal({ user }: EditUserModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        
        const formData = new FormData(e.currentTarget);
        formData.append("id", user.id);
        
        startTransition(async () => {
            const res = await editUser(null, formData);
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
            <Button 
                variant="outline" 
                size="sm" 
                className="h-8 shadow-sm hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                onClick={() => setIsOpen(true)}
            >
                <Edit className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white w-full max-w-sm shadow-2xl rounded-2xl flex flex-col relative animate-in zoom-in-95 duration-200 my-auto">
                        
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-blue-50/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                                    <Edit className="w-4 h-4 text-blue-600" />
                                    Edit User
                                </h2>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="bg-white hover:bg-gray-100 text-gray-500 rounded-full p-2 transition-colors border shadow-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Full Name</label>
                                    <Input name="name" required defaultValue={user.name} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Email Address</label>
                                    <Input name="email" type="email" required defaultValue={user.email} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Phone Number</label>
                                    <Input name="phone" required defaultValue={user.phone || ""} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Role</label>
                                    <Input value={user.role} disabled className="bg-gray-100 text-gray-500" title="Roles cannot be edited here." />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-5">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 font-semibold text-white">
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
