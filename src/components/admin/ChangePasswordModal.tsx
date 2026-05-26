"use client";

import { useState, useTransition, FormEvent } from "react";
import { KeyRound, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changeUserPassword } from "@/app/dashboard/admin/users/actions";

interface ChangePasswordModalProps {
    userId: string;
    userName: string;
}

export function ChangePasswordModal({ userId, userName }: ChangePasswordModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        formData.append("userId", userId);

        startTransition(async () => {
            const res = await changeUserPassword(null, formData);
            if (res.error) {
                setError(res.error);
            } else {
                setSuccess("Password changed successfully!");
                // Reset form
                const form = e.currentTarget as HTMLFormElement;
                form.reset();
                setTimeout(() => {
                    setIsOpen(false);
                    setSuccess(null);
                }, 1500);
            }
        });
    };

    return (
        <>
            <Button 
                variant="outline" 
                size="sm" 
                className="h-8 shadow-sm hover:bg-amber-50 hover:text-amber-600 border-gray-200"
                onClick={() => setIsOpen(true)}
            >
                <KeyRound className="w-3.5 h-3.5 mr-1" /> Password
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white w-full max-w-sm shadow-2xl rounded-2xl flex flex-col relative animate-in zoom-in-95 duration-200 my-auto">
                        
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-amber-50/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                                    <KeyRound className="w-4 h-4 text-amber-600" />
                                    Change Password
                                </h2>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="bg-white hover:bg-gray-100 text-gray-500 rounded-full p-2 transition-colors border shadow-sm"
                                disabled={isPending}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                Changing password for: <span className="font-bold">{userName}</span>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-sm font-medium">
                                    {success}
                                </div>
                            )}

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">New Password</label>
                                    <Input 
                                        name="newPassword" 
                                        type="password" 
                                        required 
                                        placeholder="Enter new password"
                                        minLength={6}
                                    />
                                    <p className="text-[10px] text-gray-400">Minimum 6 characters</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Confirm Password</label>
                                    <Input 
                                        name="confirmPassword" 
                                        type="password" 
                                        required 
                                        placeholder="Re-enter new password"
                                        minLength={6}
                                        onChange={(e) => {
                                            // Basic client-side match check
                                            const newPass = (e.target.form?.elements.namedItem("newPassword") as HTMLInputElement)?.value;
                                            if (newPass && e.target.value !== newPass) {
                                                e.target.setCustomValidity("Passwords do not match");
                                            } else {
                                                e.target.setCustomValidity("");
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-5">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending} className="bg-amber-600 hover:bg-amber-700 font-semibold text-white">
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {isPending ? "Updating..." : "Change Password"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}