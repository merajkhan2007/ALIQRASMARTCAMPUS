"use client";

import { useState } from "react";
import { Edit2, X } from "lucide-react";
import { editStudent } from "@/app/dashboard/admin/students/actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditStudentModal({ student, classes }: { student: any, classes: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Quick helper to format dates securely for input value mappings
    const defaultDate = student.dob ? new Date(student.dob).toISOString().split('T')[0] : "";

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        // Add hidden identifiers to the formData to tell the backend who we are updating
        formData.append("userId", student.userId);
        formData.append("studentId", student.id);

        await editStudent(formData);

        setIsSubmitting(false);
        setIsOpen(false);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                title="Edit student details"
            >
                <Edit2 className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-emerald-50/50">
                            <h3 className="font-semibold text-lg text-emerald-950 flex items-center gap-2">
                                <Edit2 className="h-4 w-4 text-emerald-600" />
                                Edit Student Record
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form action={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700">Full Name *</label>
                                        <input name="name" type="text" defaultValue={student.user.name} required className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700">Admission No *</label>
                                        <input name="admissionNo" type="text" defaultValue={student.admissionNo} required className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700">Email Address *</label>
                                        <input name="email" type="email" defaultValue={student.user.email} required className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700">Phone Number</label>
                                        <input name="phone" type="tel" defaultValue={student.user.phone || ''} className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Update Passport Photo (Leaves current if empty)</label>
                                    <input name="avatar" type="file" accept="image/*" className="w-full text-sm p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700">Date of Birth *</label>
                                        <input name="dob" type="date" defaultValue={defaultDate} required className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700">Gender *</label>
                                        <select name="gender" defaultValue={student.gender} required className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none">
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700">Class Assignment</label>
                                        <select name="classId" defaultValue={student.classId || ""} className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none">
                                            <option value="">-- No Class Selected --</option>
                                            {classes.map(cls => (
                                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700">Roll Number</label>
                                        <input name="rollNo" type="text" defaultValue={student.rollNo || ""} placeholder="e.g. 1" className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Home Address *</label>
                                    <textarea name="address" defaultValue={student.address} required className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none resize-none" rows={2}></textarea>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t mt-6">
                                    <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
