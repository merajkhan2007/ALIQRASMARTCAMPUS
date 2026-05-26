"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { submitAdmission } from "@/app/admission/actions";
import { format } from "date-fns";
import Image from "next/image";

export default function AdminEnrollStudentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [admissionNumber, setAdmissionNumber] = useState("");
    const [printData, setPrintData] = useState<any>(null);

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
            if (res.admissionNumber) {
                setAdmissionNumber(res.admissionNumber);
            }
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    const handlePrintAdmission = async () => {
        if (!admissionNumber) return;
        try {
            const res = await fetch(`/api/students/print?admissionNo=${encodeURIComponent(admissionNumber)}`);
            if (res.ok) {
                const data = await res.json();
                setPrintData(data);
            }
        } catch (err) {
            console.error("Print data fetch error:", err);
        }
        setTimeout(() => {
            window.print();
        }, 400);
    };

    if (success) {
        return (
            <>
                <style>{`
                    @media print {
                        @page { margin: 8mm; size: A4; }
                        body * { visibility: hidden; }
                        html, body {
                            height: 100vh !important;
                            max-height: 100vh !important;
                            overflow: hidden !important;
                            background-color: white !important;
                        }
                        #enroll-print-section {
                            position: absolute !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            visibility: visible !important;
                        }
                        #enroll-print-section * { visibility: visible; }
                        .print\\:hidden { display: none !important; }
                        .fixed { position: absolute !important; }
                        #enroll-print-section th, #enroll-print-section td { text-align: left !important; }
                    }
                `}</style>

                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500 print:hidden">
                    <div className="mx-auto bg-emerald-100 text-emerald-600 w-24 h-24 flex items-center justify-center rounded-full mb-6 shadow-sm">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl text-emerald-900 mb-2 font-bold">طالب علم کا اندراج کامیاب! / Student Enrolled Successfully!</h2>
                    {admissionNumber && (
                        <p className="text-emerald-700 font-medium mb-2">
                            داخلہ نمبر / Admission No: <span className="font-bold font-mono text-lg">{admissionNumber}</span>
                        </p>
                    )}
                    <div className="flex items-center gap-3 mt-4">
                        <button
                            onClick={handlePrintAdmission}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-colors"
                        >
                            <Printer className="w-5 h-5" /> داخلہ فارم پرنٹ کریں (A4) / Print Admission Form (A4)
                        </button>
                        <button
                            onClick={() => router.push("/dashboard/admin/students")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" /> طلباء پر واپس جائیں / Back to Students
                        </button>
                    </div>
                </div>

                {/* PRINT VIEW: A4 Admission Form */}
                {printData && printData.admission && (
                    <div id="enroll-print-section" className="hidden print:block w-full text-black bg-white">
                        {/* Header: Logo + Madrasa Name */}
                        <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-2">
                            <div className="flex items-center gap-4">
                                <Image src="/images/madrasa_logo.png" alt="Logo" width={80} height={90} className="object-contain" />
                                <Image src="/images/madrasa_name.png" alt="Al-Iqra Name" width={240} height={70} className="object-contain" />
                            </div>
                            <div className="text-right">
                                <h1 className="text-sm font-black uppercase tracking-widest">طالب علم داخلہ فارم / Student Admission Form</h1>
                                <p className="text-[9px] text-gray-600">نیا داخلہ ریکارڈ / New Enrollment Record</p>
                            </div>
                        </div>

                        {/* Application Number + Photo */}
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="border border-black p-1.5 text-[11px] font-bold inline-block bg-gray-100">
                                    داخلہ نمبر / ADMISSION NO: {printData.admission.admissionNumber}
                                </div>
                                <div className="border border-black p-1.5 text-[11px] font-bold inline-block bg-gray-100 ml-2">
                                    تاریخ / DATE: {format(new Date(printData.admission.appliedAt), "dd/MM/yyyy")}
                                </div>
                            </div>
                            <div className="w-20 h-24 border border-black flex items-center justify-center overflow-hidden bg-gray-50">
                                {printData.admission.studentPhoto ? (
                                    <Image src={printData.admission.studentPhoto} alt="Photo" width={80} height={96} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[9px] text-center text-gray-500">پاسپورٹ<br/>سائز<br/>تصویر</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 text-[10px]">
                            {/* 1. Basic Info */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">1. بنیادی معلومات / Basic Information</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black w-1/4">پورا نام / Full Name</th>
                                            <td className="p-1 border-r border-black font-semibold">{printData.admission.fullName}</td>
                                            <th className="p-1 border-r border-black w-1/6">عربی نام / Arabic Name</th>
                                            <td className="p-1 font-semibold">{printData.admission.arabicName || '-'}</td>
                                        </tr>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black">جنس / Gender</th>
                                            <td className="p-1 border-r border-black font-semibold">{printData.admission.gender}</td>
                                            <th className="p-1 border-r border-black">تاریخ پیدائش / Date of Birth</th>
                                            <td className="p-1 font-semibold">{format(new Date(printData.admission.dob), "dd/MM/yyyy")}</td>
                                        </tr>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black">آدھار نمبر / Aadhaar Number</th>
                                            <td className="p-1 border-r border-black font-semibold">{printData.admission.aadhaarNumber || '-'}</td>
                                            <th className="p-1 border-r border-black">بلڈ گروپ / Blood Group</th>
                                            <td className="p-1 font-semibold">{printData.admission.bloodGroup || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-1 border-r border-black">مذہب / Religion</th>
                                            <td className="p-1 border-r border-black font-semibold">{printData.admission.religion || 'Islam'}</td>
                                            <th className="p-1 border-r border-black">زمرہ / Category</th>
                                            <td className="p-1 font-semibold">{printData.admission.category || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 2. Islamic Details */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">2. اسلامی تعلیمی تفصیلات / Islamic Academic Details</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black w-1/4">داخلہ برائے کورس / Course Applying For</th>
                                            <td className="p-1 border-r border-black font-semibold">{printData.admission.courseApplyingFor || 'Regular'}</td>
                                            <th className="p-1 border-r border-black w-1/6">حفظ کی حیثیت / Hifz Status</th>
                                            <td className="p-1 font-semibold">{printData.admission.hifzStatus || 'None'}</td>
                                        </tr>
                                        {printData.admission.totalParasMemorized && (
                                            <tr className="border-b border-black">
                                                <th className="p-1 border-r border-black">پارے یاد / Paras Memorized</th>
                                                <td className="p-1 border-r border-black font-semibold">{printData.admission.totalParasMemorized}</td>
                                                <th className="p-1 border-r border-black">تجوید کی سطح / Tajweed Level</th>
                                                <td className="p-1 font-semibold">{printData.admission.tajweedLevel || '-'}</td>
                                            </tr>
                                        )}
                                        {printData.admission.previousMadrasa && (
                                            <tr>
                                                <th className="p-1 border-r border-black">پچھلا مدرسہ / Previous Madrasa</th>
                                                <td className="p-1 border-r border-black font-semibold">{printData.admission.previousMadrasa}</td>
                                                <th className="p-1 border-r border-black">قاری صاحب کا نام / Qari Name</th>
                                                <td className="p-1 font-semibold">{printData.admission.qariName || '-'}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* 3. Academic Background */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">3. تعلیمی پس منظر / Academic Background</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black w-1/4">پچھلا اسکول / Previous School</th>
                                            <td className="p-1 border-r border-black font-semibold">{printData.admission.previousSchoolName || '-'}</td>
                                            <th className="p-1 border-r border-black w-1/6">بورڈ / Board</th>
                                            <td className="p-1 font-semibold">{printData.admission.boardName || '-'}</td>
                                        </tr>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black">آخری کلاس پاس / Last Class Passed</th>
                                            <td className="p-1 border-r border-black font-semibold">{printData.admission.lastClassPassed || '-'}</td>
                                            <th className="p-1 border-r border-black">گریڈ / فیصد / Grade / %</th>
                                            <td className="p-1 font-semibold">{printData.admission.percentageOrGrade || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-1 border-r border-black">تعلیم کا ذریعہ / Medium of Study</th>
                                            <td colSpan={3} className="p-1 font-semibold">{printData.admission.mediumOfStudy || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 4. Parent / Guardian */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">4. والدین / سرپرست کی تفصیلات / Parent / Guardian Details</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black w-1/4">والد کا نام / Father's Name</th>
                                            <td className="p-1 border-r border-black font-semibold">{printData.admission.fatherName || '-'}</td>
                                            <th className="p-1 border-r border-black w-1/6">والد کا موبائل / Father's Mobile</th>
                                            <td className="p-1 font-semibold">{printData.admission.fatherMobile || '-'}</td>
                                        </tr>
                                        {printData.admission.fatherOccupation && (
                                            <tr className="border-b border-black">
                                                <th className="p-1 border-r border-black">والد کا پیشہ / Father's Occupation</th>
                                                <td className="p-1 border-r border-black font-semibold">{printData.admission.fatherOccupation}</td>
                                                <th className="p-1 border-r border-black">سالانہ آمدنی / Annual Income</th>
                                                <td className="p-1 font-semibold">{printData.admission.fatherAnnualIncome || '-'}</td>
                                            </tr>
                                        )}
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black">والدہ کا نام / Mother's Name</th>
                                            <td className="p-1 border-r border-black font-semibold">{printData.admission.motherName || '-'}</td>
                                            <th className="p-1 border-r border-black">والدہ کا موبائل / Mother's Mobile</th>
                                            <td className="p-1 font-semibold">{printData.admission.motherMobile || '-'}</td>
                                        </tr>
                                        {printData.admission.guardianName && (
                                            <tr>
                                                <th className="p-1 border-r border-black">سرپرست / Guardian</th>
                                                <td className="p-1 border-r border-black font-semibold">{printData.admission.guardianName} ({printData.admission.guardianRelationship || 'N/A'})</td>
                                                <th className="p-1 border-r border-black">سرپرست کا موبائل / Guardian Mobile</th>
                                                <td className="p-1 font-semibold">{printData.admission.guardianMobile || '-'}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* 5. Address Details */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">5. پتے کی تفصیلات / Address Details</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black w-1/4">مکمل پتہ / Full Address</th>
                                            <td colSpan={3} className="p-1 font-semibold">{printData.admission.fullAddress || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-1 border-r border-black">شہر / City</th>
                                            <td className="p-1 border-r border-black font-semibold">{printData.admission.city || '-'}</td>
                                            <th className="p-1 border-r border-black">ریاست اور پن کوڈ / State & Pincode</th>
                                            <td className="p-1 font-semibold">{printData.admission.state || '-'} - {printData.admission.pincode || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 6. Hostel & Transport */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">6. ہاسٹل اور ٹرانسپورٹ / Hostel & Transport</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black w-1/4">ہاسٹل درکار؟ / Hostel Required?</th>
                                            <td className="p-1 border-r border-black font-semibold">{printData.admission.hostelRequired ? "YES" : "NO"}</td>
                                            <th className="p-1 border-r border-black w-1/6">مقامی سرپرست / Local Guardian</th>
                                            <td className="p-1 font-semibold">{printData.admission.localGuardianForHostel || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-1 border-r border-black">ٹرانسپورٹ درکار؟ / Transport Required?</th>
                                            <td className="p-1 border-r border-black font-semibold">{printData.admission.transportRequired ? "YES" : "NO"}</td>
                                            <th className="p-1 border-r border-black">پک اپ کی جگہ / Pickup Location</th>
                                            <td className="p-1 font-semibold">{printData.admission.pickupLocation || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 7. Medical Information */}
                            {(printData.admission.medicalCondition || printData.admission.allergies || printData.admission.emergencyContactName) && (
                                <div>
                                    <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">7. طبی معلومات / Medical Information</h3>
                                    <table className="w-full border-x border-b border-black text-left border-collapse">
                                        <tbody>
                                            {printData.admission.medicalCondition && (
                                                <tr className="border-b border-black">
                                                    <th className="p-1 border-r border-black w-1/4">طبی حالت / Medical Condition</th>
                                                    <td className="p-1 border-r border-black font-semibold">{printData.admission.medicalCondition}</td>
                                                    <th className="p-1 border-r border-black w-1/6">الرجی / Allergies</th>
                                                    <td className="p-1 font-semibold">{printData.admission.allergies || '-'}</td>
                                                </tr>
                                            )}
                                            {printData.admission.emergencyContactName && (
                                                <tr>
                                                    <th className="p-1 border-r border-black">ہنگامی رابطہ / Emergency Contact</th>
                                                    <td className="p-1 border-r border-black font-semibold">{printData.admission.emergencyContactName}</td>
                                                    <th className="p-1 border-r border-black">ہنگامی نمبر / Emergency No.</th>
                                                    <td className="p-1 font-semibold">{printData.admission.emergencyContactNum || '-'}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* 8. Document Uploads */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">8. دستاویزات / Document Uploads</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr>
                                            <th className="p-1 border-r border-black w-[33%]">پیدائش سرٹیفکیٹ / Birth Cert: {printData.admission.birthCertificate ? "✅ ہاں" : "❌ نہیں"}</th>
                                            <th className="p-1 border-r border-black w-[33%]">آدھار کارڈ / Aadhaar: {printData.admission.aadhaarCard ? "✅ ہاں" : "❌ نہیں"}</th>
                                            <th className="p-1">ٹرانسفر سرٹیفکیٹ / TC: {printData.admission.transferCertificate ? "✅ ہاں" : "❌ نہیں"}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Signature Block */}
                        <div className="mt-4 pt-2 border-t border-black">
                            <h3 className="text-center font-bold text-[11px] mb-1 uppercase tracking-wider">اقرار نامہ اور دستخط / Declaration & Signatures</h3>
                            <p className="text-center text-[9px] mb-12 italic text-gray-800 px-4">
                                "میں اقرار کرتا/کرتی ہوں کہ فراہم کردہ تمام معلومات درست ہیں۔ میں الاقراء ماڈرن مدرسہ کے قوانین کی پابندی کروں گا/کروں گی۔"
                            </p>
                            <div className="flex justify-between items-end px-4">
                                <div className="text-center">
                                    <div className="w-40 border-b border-black mb-1"></div>
                                    <p className="font-bold text-[9px]">والدین / سرپرست کے دستخط / Signature of Parent / Guardian</p>
                                    <p className="text-[9px] mt-1">Date: ___/___/20__</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-40 border-b border-black mb-1"></div>
                                    <p className="font-bold text-[9px]">پرنسپل کی مہر اور دستخط / Seal & Signature of Principal</p>
                                    <p className="text-[9px] mt-1">Al-Iqra Modern Madrasa</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/students">
                    <Button variant="outline" size="icon" className="h-10 w-10">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950">نیا طالب علم داخل کریں / Enroll New Student</h1>
                    <p className="text-gray-500">نئے طالب علم کے اندراج کے لیے داخلہ فارم مکمل کریں۔ / Complete the admission form to register a new student.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:block w-64 shrink-0 sticky top-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm z-10">
                    <h4 className="font-bold text-emerald-950 mb-4 px-2 text-lg border-b border-gray-100 pb-2">فارم کے حصے / Form Sections</h4>
                    <nav className="flex flex-col space-y-1.5">
                        <a href="#section-1" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">1. بنیادی معلومات / Basic Information</a>
                        <a href="#section-2" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">2. اسلامی تفصیلات / Islamic Details</a>
                        <a href="#section-3" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">3. تعلیمی پس منظر / Academic Background</a>
                        <a href="#section-4" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">4. والدین / سرپرست / Parent/Guardian</a>
                        <a href="#section-5" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">5. پتے کی تفصیلات / Address Details</a>
                        <a href="#section-6" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">6. ہاسٹل اور ٹرانسپورٹ / Hostel & Transport</a>
                        <a href="#section-7" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2.5 rounded-lg transition-all">7. دستاویزات اپ لوڈ / Document Uploads</a>
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
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-6">1. بنیادی معلومات / Basic Information</h3>
                        
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
                                        تصویر اپ لوڈ کریں * / Upload Photo *
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
                                    <p className="text-[10px] text-gray-400 mt-2">پاسپورٹ سائز۔ زیادہ سے زیادہ 2MB / Passport size. Max 2MB.</p>
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">پورا نام * / Full Name *</label>
                                <Input name="fullName" required placeholder="احمد عبداللہ / Ahmad Abdullah" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">جنس * / Gender *</label>
                                <select name="gender" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                                    <option value="">جنس منتخب کریں / Select Gender</option>
                                    <option value="Male">مرد / Male</option>
                                    <option value="Female">خاتون / Female</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-700">تاریخ پیدائش * / Date of Birth *</label>
                                    <Input name="dob" type="date" required onChange={(e) => setDob(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-700">عمر / Age</label>
                                    <Input readOnly value={calculateAge(dob)} disabled className="bg-slate-50" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">آدھار نمبر / Aadhaar Number</label>
                                <Input name="aadhaarNumber" placeholder="xxxx-xxxx-xxxx" />
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* --- STEP 2: ISLAMIC DETAILS --- */}
                    <div id="section-2" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-4">2. اسلامی تعلیمی تفصیلات / Islamic Academic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">داخلہ برائے کورس * / Course Applying For *</label>
                                <select name="courseApplyingFor" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                                    <option value="">کورس منتخب کریں / Select Course</option>
                                    <option value="Hifz">حفظ / Hifz</option>
                                    <option value="Nazra">ناظرہ / Nazra</option>
                                    <option value="Alim">عالم / Alim</option>
                                    <option value="Regular">صرف ریگولر / Regular Only</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">حفظ کی حیثیت / Hifz Status</label>
                                <select name="hifzStatus" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                                    <option value="None">کوئی نہیں / None</option>
                                    <option value="Partial">جزوی / Partial</option>
                                    <option value="Complete">مکمل حافظ / Complete Hafiz</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 3: ACADEMIC BACKGROUND --- */}
                    <div id="section-3" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-4">3. تعلیمی پس منظر / Academic Background</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">پچھلے اسکول کا نام / Previous School Name</label>
                                <Input name="previousSchoolName" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">بورڈ کا نام / Board Name</label>
                                <Input name="boardName" placeholder="مثلاً CBSE / اسٹیٹ بورڈ" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">آخری کلاس پاس / Last Class Passed</label>
                                <Input name="lastClassPassed" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">فیصد / گریڈ / Percentage / Grade</label>
                                <Input name="percentageOrGrade" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">تعلیم کا ذریعہ / Medium of Study</label>
                                <Input name="mediumOfStudy" placeholder="مثلاً انگریزی، اردو" />
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 4: PARENTS --- */}
                    <div id="section-4" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-4">4. والدین / سرپرست کی تفصیلات / Parent / Guardian Details</h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border">
                                <h4 className="md:col-span-2 text-sm font-bold text-slate-800">والد کی تفصیلات / Father's Details</h4>
                                <div className="space-y-1"><label className="text-xs font-medium">والد کا نام * / Father Name *</label><Input name="fatherName" required /></div>
                                <div className="space-y-1"><label className="text-xs font-medium">موبائل نمبر * / Mobile Number *</label><Input name="fatherMobile" required type="tel" /></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border">
                                <h4 className="md:col-span-2 text-sm font-bold text-slate-800">والدہ کی تفصیلات / Mother's Details</h4>
                                <div className="space-y-1"><label className="text-xs font-medium">والدہ کا نام / Mother Name</label><Input name="motherName" /></div>
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 5: ADDRESS --- */}
                    <div id="section-5" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-4">5. پتے کی تفصیلات / Address Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-medium text-slate-700">مکمل گھر کا پتہ * / Full Home Address *</label>
                                <textarea name="fullAddress" required rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" placeholder="گلی، اپارٹمنٹ، علاقہ..." />
                            </div>
                            <div className="space-y-1"><label className="text-xs font-medium text-slate-700">شہر / City</label><Input name="city" /></div>
                            <div className="space-y-1"><label className="text-xs font-medium text-slate-700">ضلع / District</label><Input name="district" /></div>
                            <div className="space-y-1"><label className="text-xs font-medium text-slate-700">ریاست / State</label><Input name="state" /></div>
                            <div className="space-y-1"><label className="text-xs font-medium text-slate-700">پن کوڈ / Pincode</label><Input name="pincode" /></div>
                        </div>
                    </div>

                    {/* --- STEP 6: HOSTEL & TRANSPORT --- */}
                    <div id="section-6" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-4">6. ہاسٹل اور ٹرانسپورٹ کی سہولیات / Hostel & Transport Facilities</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                                <input type="checkbox" name="hostelRequired" id="hostelReq" className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                                <label htmlFor="hostelReq" className="text-sm font-medium text-slate-800">کیا آپ کو ہاسٹل کی رہائش درکار ہے؟ / Do you require Hostel Accommodation?</label>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">مقامی سرپرست کا نام (ہاسٹل کے طلباء کے لیے) / Local Guardian Name (For Hostel Students)</label>
                                <Input name="localGuardianForHostel" />
                            </div>

                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50 mt-6">
                                <input type="checkbox" name="transportRequired" id="transReq" className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                                <label htmlFor="transReq" className="text-sm font-medium text-slate-800">کیا آپ کو بس / ٹرانسپورٹ کی سہولت درکار ہے؟ / Do you require Bus/Transport Facility?</label>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">پک اپ کی جگہ / اسٹاپ / Pickup Location / Stop</label>
                                <Input name="pickupLocation" placeholder="قریبی نشان / Nearest Landmark" />
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 7: DOCUMENT UPLOAD --- */}
                    <div id="section-7" className="scroll-mt-8 mb-8">
                        <h3 className="text-lg font-bold text-emerald-900 border-b pb-2 mb-4">7. دستاویزات اپ لوڈ / Document Uploads</h3>
                        <p className="text-xs text-slate-500 mb-6 pb-2 border-b">براہ کرم واضح تصاویر یا PDF اپ لوڈ کریں۔ ہر فائل کی حد 5MB ہے۔ / Please upload clear images or PDFs. Limit 5MB per file.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block mb-1">پیدائش کا سرٹیفکیٹ / Birth Certificate</label>
                                <Input name="birthCertificate" type="file" accept=".pdf, image/*" className="file:text-emerald-700" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block mb-1">آدھار کارڈ (طالب علم) / Aadhaar Card (Student)</label>
                                <Input name="aadhaarCard" type="file" accept=".pdf, image/*" className="file:text-emerald-700" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block mb-1">ٹرانسفر سرٹیفکیٹ (TC) / Transfer Certificate (TC)</label>
                                <Input name="transferCertificate" type="file" accept=".pdf, image/*" className="file:text-emerald-700" />
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
                            <strong>اقرار نامہ / Declaration:</strong> میں اقرار کرتا/کرتی ہوں کہ فراہم کردہ تمام معلومات درست اور صحیح ہیں۔ میں الاقراء ماڈرن مدرسہ کے قوانین و ضوابط کی پابندی کرنے پر رضامند ہوں۔ / I hereby declare that all information provided is true and correct. I agree to abide by the rules and regulations of Al-Iqra Modern Madrasa.
                        </div>
                    </div>

                    {/* --- SUBMIT BUTTON --- */}
                    <div className="pt-6 border-t border-slate-200 flex items-center justify-end mt-8">
                        <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold min-w-[140px]"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "درخواست جمع کرائیں / Submit Application"}
                        </Button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}
