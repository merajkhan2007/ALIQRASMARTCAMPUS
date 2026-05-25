"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { updateAdmission } from "@/app/dashboard/admin/admissions/actions";

export default function EditAdmissionForm({ admission }: { admission: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const calculateAge = (dob: string | Date) => {
        if (!dob) return "";
        const dobDate = new Date(dob);
        const diffMs = Date.now() - dobDate.getTime();
        const ageDate = new Date(diffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    const [dob, setDob] = useState(admission.dob ? new Date(admission.dob).toISOString().split('T')[0] : "");
    const [photoPreview, setPhotoPreview] = useState<string | null>(admission.studentPhoto || null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPhotoPreview(url);
        } else {
            setPhotoPreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const formData = new FormData(e.currentTarget);
            const res = await updateAdmission(admission.id, formData);

            if (res.error) throw new Error(res.error);
            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard/admin/admissions");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to update application");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                <div className="mx-auto bg-emerald-100 text-emerald-600 w-24 h-24 flex items-center justify-center rounded-full mb-6 shadow-sm">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl text-emerald-900 mb-2 font-bold">Application Updated Successfully!</h2>
                <p className="text-emerald-700 font-medium">
                    Redirecting back to admissions management...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/admissions">
                    <Button variant="outline" size="icon" className="h-10 w-10">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Edit Application</h1>
                    <p className="text-gray-500">Update the admission form details for this student.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:block w-64 shrink-0 sticky top-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm z-10">
                    <h4 className="font-bold text-emerald-950 mb-4 px-2 text-lg border-b border-gray-100 pb-2">Form Sections</h4>
                    <nav className="flex flex-col space-y-1.5">
                        <a href="#section-1" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">1. Basic Information</a>
                        <a href="#section-2" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">2. Islamic Details</a>
                        <a href="#section-3" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">3. Academic Background</a>
                        <a href="#section-4" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">4. Parent / Guardian</a>
                        <a href="#section-5" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">5. Address Details</a>
                        <a href="#section-6" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">6. Hostel & Transport</a>
                        <a href="#section-7" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">7. Document Uploads</a>
                    </nav>
                </aside>

                <div className="flex-1 w-full bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                            {error}
                        </div>
                    )}

                    <div id="section-1" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-6">1. Basic Information</h3>
                        
                        <div className="flex flex-col sm:flex-row gap-8 mb-6">
                            {/* Photo Upload Prominent Area */}
                            <div className="flex flex-col items-center justify-start space-y-3">
                                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-emerald-100 bg-emerald-50 flex items-center justify-center shadow-inner">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Student Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="text-emerald-300 flex flex-col items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <label htmlFor="studentPhotoInput" className="cursor-pointer text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 transition-colors">
                                        Change Photo
                                    </label>
                                    <input 
                                        id="studentPhotoInput" 
                                        name="studentPhoto" 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handlePhotoChange} 
                                    />
                                    <p className="text-[10px] text-gray-400 mt-2">Passport size. Max 2MB.</p>
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Full Name *</label>
                                <Input name="fullName" required placeholder="Ahmad Abdullah" defaultValue={admission.fullName} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Gender *</label>
                                <select name="gender" required defaultValue={admission.gender} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-700">Date of Birth *</label>
                                    <Input name="dob" type="date" required value={dob} onChange={(e) => setDob(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-700">Age</label>
                                    <Input readOnly value={calculateAge(dob)} disabled className="bg-slate-50" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Aadhaar Number</label>
                                <Input name="aadhaarNumber" placeholder="xxxx-xxxx-xxxx" defaultValue={admission.aadhaarNumber} />
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* --- STEP 2: ISLAMIC DETAILS --- */}
                    <div id="section-2" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-4">2. Islamic Academic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Course Applying For *</label>
                                <select name="courseApplyingFor" required defaultValue={admission.courseApplyingFor} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                                    <option value="">Select Course</option>
                                    <option value="Hifz">Hifz</option>
                                    <option value="Nazra">Nazra</option>
                                    <option value="Alim">Alim</option>
                                    <option value="Regular">Regular Only</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Hifz Status</label>
                                <select name="hifzStatus" defaultValue={admission.hifzStatus || "None"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                                    <option value="None">None</option>
                                    <option value="Partial">Partial</option>
                                    <option value="Complete">Complete Hafiz</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 3: ACADEMIC BACKGROUND --- */}
                    <div id="section-3" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-4">3. Academic Background</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Previous School Name</label>
                                <Input name="previousSchoolName" defaultValue={admission.previousSchoolName} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Board Name</label>
                                <Input name="boardName" placeholder="e.g. CBSE / State Board" defaultValue={admission.boardName} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Last Class Passed</label>
                                <Input name="lastClassPassed" defaultValue={admission.lastClassPassed} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Percentage / Grade</label>
                                <Input name="percentageOrGrade" defaultValue={admission.percentageOrGrade} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Medium of Study</label>
                                <Input name="mediumOfStudy" placeholder="e.g. English, Urdu" defaultValue={admission.mediumOfStudy} />
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 4: PARENTS --- */}
                    <div id="section-4" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-4">4. Parent / Guardian Details</h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border">
                                <h4 className="md:col-span-2 text-sm font-bold text-slate-800">Father's Details</h4>
                                <div className="space-y-1"><label className="text-xs font-medium">Father Name *</label><Input name="fatherName" required defaultValue={admission.fatherName} /></div>
                                <div className="space-y-1"><label className="text-xs font-medium">Mobile Number *</label><Input name="fatherMobile" required type="tel" defaultValue={admission.fatherMobile} /></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border">
                                <h4 className="md:col-span-2 text-sm font-bold text-slate-800">Mother's Details</h4>
                                <div className="space-y-1"><label className="text-xs font-medium">Mother Name</label><Input name="motherName" defaultValue={admission.motherName} /></div>
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 5: ADDRESS --- */}
                    <div id="section-5" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-4">5. Address Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-medium text-slate-700">Full Home Address *</label>
                                <textarea name="fullAddress" required rows={3} defaultValue={admission.fullAddress} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" placeholder="Street, Apt, Area..." />
                            </div>
                            <div className="space-y-1"><label className="text-xs font-medium text-slate-700">City</label><Input name="city" defaultValue={admission.city} /></div>
                            <div className="space-y-1"><label className="text-xs font-medium text-slate-700">District</label><Input name="district" defaultValue={admission.district} /></div>
                            <div className="space-y-1"><label className="text-xs font-medium text-slate-700">State</label><Input name="state" defaultValue={admission.state} /></div>
                            <div className="space-y-1"><label className="text-xs font-medium text-slate-700">Pincode</label><Input name="pincode" defaultValue={admission.pincode} /></div>
                        </div>
                    </div>

                    {/* --- STEP 6: HOSTEL & TRANSPORT --- */}
                    <div id="section-6" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-4">6. Hostel & Transport Facilities</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                                <input type="checkbox" name="hostelRequired" id="hostelReq" defaultChecked={admission.hostelRequired} className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                                <label htmlFor="hostelReq" className="text-sm font-medium text-slate-800">Do you require Hostel Accommodation?</label>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Local Guardian Name (For Hostel Students)</label>
                                <Input name="localGuardianForHostel" defaultValue={admission.localGuardianForHostel} />
                            </div>

                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50 mt-6">
                                <input type="checkbox" name="transportRequired" id="transReq" defaultChecked={admission.transportRequired} className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                                <label htmlFor="transReq" className="text-sm font-medium text-slate-800">Do you require Bus/Transport Facility?</label>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Pickup Location / Stop</label>
                                <Input name="pickupLocation" placeholder="Nearest Landmark" defaultValue={admission.pickupLocation} />
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 7: DOCUMENT UPLOAD --- */}
                    <div id="section-7" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-4">7. Document Uploads</h3>
                        <p className="text-xs text-slate-500 mb-6 pb-2 border-b">Please upload clear images or PDFs. Limit 5MB per file.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block mb-1">Birth Certificate</label>
                                <Input name="birthCertificate" type="file" accept=".pdf, image/*" className="file:text-emerald-700" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block mb-1">Aadhaar Card (Student)</label>
                                <Input name="aadhaarCard" type="file" accept=".pdf, image/*" className="file:text-emerald-700" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block mb-1">Transfer Certificate (TC)</label>
                                <Input name="transferCertificate" type="file" accept=".pdf, image/*" className="file:text-emerald-700" />
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
                            <strong>Declaration:</strong> I hereby declare that all information provided is true and correct. I agree to abide by the rules and regulations of Al-Iqra Modern Madrasa.
                        </div>
                    </div>

                    {/* --- SUBMIT BUTTON --- */}
                    <div className="pt-6 border-t border-slate-200 flex items-center justify-end mt-8">
                        <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold min-w-[140px]"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Application"}
                        </Button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}
