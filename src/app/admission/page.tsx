"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { submitAdmission } from "./actions"; // We'll create this next



export default function AdmissionWizard() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Auto-calculate Age helper
    const calculateAge = (dob: string) => {
        if (!dob) return "";
        const diffMs = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(diffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    const [dob, setDob] = useState("");
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
            const res = await submitAdmission(formData);

            if (res.error) throw new Error(res.error);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-emerald-50 px-4">
                <Card className="w-full max-w-md border-emerald-500 shadow-xl text-center py-10">
                    <CardHeader>
                        <div className="mx-auto bg-emerald-100 text-emerald-600 w-16 h-16 flex items-center justify-center rounded-full mb-4 shadow-sm">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-2xl text-emerald-900 mb-2">Application Submitted!</CardTitle>
                        <CardDescription className="text-emerald-700 font-medium">
                            Alhamdulillah! Your detailed admission request has been received. Our administration will review your documents and contact you shortly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="mt-4 bg-emerald-700 hover:bg-emerald-800 w-full text-white">
                            <Link href="/">Return to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 font-sans selection:bg-emerald-200 selection:text-emerald-900">
            {/* Glassmorphism Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-emerald-950/80 backdrop-blur-md px-4 py-4 shadow-lg shadow-emerald-900/10">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
                        <div className="p-2 bg-emerald-400/20 rounded-xl">
                            <BookOpen className="h-6 w-6 text-emerald-300" />
                        </div>
                        <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 to-teal-100 tracking-tight">AL-IQRA MODERN MADRASA</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-12 relative">
                {/* Decorative background blobs (Subtle glow effects) */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar Navigation */}
                    <aside className="hidden lg:block w-64 shrink-0 sticky top-28 bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-emerald-100 shadow-lg shadow-emerald-900/5 z-10">
                        <h4 className="font-bold text-emerald-950 mb-4 px-2 text-lg border-b border-emerald-100 pb-2">Form Sections</h4>
                        <nav className="flex flex-col space-y-1.5">
                            <a href="#section-1" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-xl transition-all">1. Basic Information</a>
                            <a href="#section-2" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-xl transition-all">2. Islamic Details</a>
                            <a href="#section-3" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-xl transition-all">3. Academic Background</a>
                            <a href="#section-4" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-xl transition-all">4. Parent / Guardian</a>
                            <a href="#section-5" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-xl transition-all">5. Address Details</a>
                            <a href="#section-6" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-xl transition-all">6. Medical Information</a>
                            <a href="#section-7" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-xl transition-all">7. Hostel & Transport</a>
                            <a href="#section-8" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-xl transition-all">8. Document Uploads</a>
                        </nav>
                    </aside>

                    <div className="flex-1 w-full">
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-950 tracking-tight drop-shadow-sm mb-4">
                                Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Admission</span>
                            </h1>
                        </div>

                    <Card className="shadow-2xl shadow-emerald-900/5 border-white/60 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden print:shadow-none print:bg-white print:border-none">
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {error && (
                                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                                        {error}
                                    </div>
                                )}

                                <div id="section-1" className="scroll-mt-32 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 border-b border-emerald-100 pb-4 mb-6">
                                        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                                        <h3 className="text-xl font-bold text-emerald-950">1. Basic Information</h3>
                                    </div>
                                    
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
                                                    Upload Photo *
                                                </label>
                                                <input 
                                                    id="studentPhotoInput" 
                                                    name="studentPhoto" 
                                                    type="file" 
                                                    accept="image/*" 
                                                    required
                                                    className="hidden" 
                                                    onChange={handlePhotoChange} 
                                                />
                                                <p className="text-[10px] text-gray-400 mt-2">Passport size. Max 2MB.</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-700">Full Name *</label>
                                            <Input name="fullName" required placeholder="Ahmad Abdullah" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-700">Gender *</label>
                                            <select name="gender" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-emerald-900/80 ml-1">Date of Birth *</label>
                                                <Input name="dob" type="date" required onChange={(e) => setDob(e.target.value)} className="rounded-xl border-emerald-100 shadow-sm focus-visible:ring-emerald-500 transition-shadow bg-white/50" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-emerald-900/80 ml-1">Age</label>
                                                <Input readOnly value={calculateAge(dob)} disabled className="rounded-xl bg-emerald-50/50 border-emerald-100 shadow-inner text-emerald-800 font-semibold" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-700">Aadhaar Number</label>
                                            <Input name="aadhaarNumber" placeholder="xxxx-xxxx-xxxx" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                                {/* --- STEP 2: ISLAMIC DETAILS --- */}
                                <div id="section-2" className="scroll-mt-32 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 border-b border-emerald-100 pb-4 mb-6">
                                        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                                        <h3 className="text-xl font-bold text-emerald-950">2. Islamic Academic Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-700">Course Applying For *</label>
                                            <select name="courseApplyingFor" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                                                <option value="">Select Course</option>
                                                <option value="Hifz">Hifz</option>
                                                <option value="Nazra">Nazra</option>
                                                <option value="Alim">Alim</option>
                                                <option value="Regular">Regular Only</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-700">Hifz Status</label>
                                            <select name="hifzStatus" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                                                <option value="None">None</option>
                                                <option value="Partial">Partial</option>
                                                <option value="Complete">Complete Hafiz</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* --- STEP 3: ACADEMIC BACKGROUND --- */}
                                <div id="section-3" className="scroll-mt-32 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 border-b border-emerald-100 pb-4 mb-6">
                                        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                                        <h3 className="text-xl font-bold text-emerald-950">3. Academic Background</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-700">Previous School Name</label>
                                            <Input name="previousSchoolName" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-700">Board Name</label>
                                            <Input name="boardName" placeholder="e.g. CBSE / State Board" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-700">Last Class Passed</label>
                                            <Input name="lastClassPassed" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-700">Percentage / Grade</label>
                                            <Input name="percentageOrGrade" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-700">Medium of Study</label>
                                            <Input name="mediumOfStudy" placeholder="e.g. English, Urdu" />
                                        </div>
                                    </div>
                                </div>

                                {/* --- STEP 4: PARENTS --- */}
                                <div id="section-4" className="scroll-mt-32 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 border-b border-emerald-100 pb-4 mb-6">
                                        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                                        <h3 className="text-xl font-bold text-emerald-950">4. Parent / Guardian Details</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border">
                                            <h4 className="md:col-span-2 text-sm font-bold text-slate-800">Father's Details</h4>
                                            <div className="space-y-1"><label className="text-xs font-medium">Father Name *</label><Input name="fatherName" required /></div>
                                            <div className="space-y-1"><label className="text-xs font-medium">Mobile Number *</label><Input name="fatherMobile" required type="tel" /></div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border">
                                            <h4 className="md:col-span-2 text-sm font-bold text-slate-800">Mother's Details</h4>
                                            <div className="space-y-1"><label className="text-xs font-medium">Mother Name</label><Input name="motherName" /></div>
                                        </div>
                                    </div>
                                </div>

                                {/* --- STEP 5: ADDRESS --- */}
                                <div id="section-5" className="scroll-mt-32 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 border-b border-emerald-100 pb-4 mb-6">
                                        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                                        <h3 className="text-xl font-bold text-emerald-950">5. Address Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-xs font-medium text-slate-700">Full Home Address *</label>
                                            <textarea name="fullAddress" required rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" placeholder="Street, Apt, Area..." />
                                        </div>
                                        <div className="space-y-1"><label className="text-xs font-medium text-slate-700">City</label><Input name="city" /></div>
                                        <div className="space-y-1"><label className="text-xs font-medium text-slate-700">District</label><Input name="district" /></div>
                                        <div className="space-y-1"><label className="text-xs font-medium text-slate-700">State</label><Input name="state" /></div>
                                        <div className="space-y-1"><label className="text-xs font-medium text-slate-700">Pincode</label><Input name="pincode" /></div>
                                    </div>
                                </div>

                                {/* --- STEP 6: HOSTEL & TRANSPORT --- */}
                                <div id="section-6" className="scroll-mt-32 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 border-b border-emerald-100 pb-4 mb-6">
                                        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                                        <h3 className="text-xl font-bold text-emerald-950">6. Hostel & Transport Facilities</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                                            <input type="checkbox" name="hostelRequired" id="hostelReq" className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                                            <label htmlFor="hostelReq" className="text-sm font-medium text-slate-800">Do you require Hostel Accommodation?</label>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-700">Local Guardian Name (For Hostel Students)</label>
                                            <Input name="localGuardianForHostel" />
                                        </div>

                                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50 mt-6">
                                            <input type="checkbox" name="transportRequired" id="transReq" className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                                            <label htmlFor="transReq" className="text-sm font-medium text-slate-800">Do you require Bus/Transport Facility?</label>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-700">Pickup Location / Stop</label>
                                            <Input name="pickupLocation" placeholder="Nearest Landmark" />
                                        </div>
                                    </div>
                                </div>

                                {/* --- STEP 7: DOCUMENT UPLOAD --- */}
                                <div id="section-7" className="scroll-mt-32 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 border-b border-emerald-100 pb-4 mb-2">
                                        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                                        <h3 className="text-xl font-bold text-emerald-950">7. Document Uploads</h3>
                                    </div>
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
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold min-w-[150px] rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Application"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
