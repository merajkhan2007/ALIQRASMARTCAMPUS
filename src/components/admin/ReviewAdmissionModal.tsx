"use client";

import { useState, useTransition } from "react";
import { Eye, X, CheckCircle, XCircle, FileText, Download, Loader2, Printer } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { approveAdmission, rejectAdmission } from "@/app/dashboard/admin/admissions/actions";
import { useRouter } from "next/navigation";

export function ReviewAdmissionModal({ admission }: { admission: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleApprove = () => {
        startTransition(async () => {
            const res = await approveAdmission(admission.id);
            if (res.error) alert(res.error);
            else setIsOpen(false); // Close on success
        });
    }

const handleReject = () => {
    if (!confirm("Are you sure you want to reject this applicant?")) return;
    startTransition(async () => {
        const res = await rejectAdmission(admission.id);
        if (res.error) alert(res.error);
        else setIsOpen(false);
    });
}

// Quick helper to render a document row securely
const DocumentRow = ({ title, url }: { title: string, url: string | null }) => {
    if (!url) return null;
    const isImage = url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg mb-2">
            <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500">{isImage ? "Image Document" : "PDF/File"}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 print:hidden">
                <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors text-xs font-semibold flex items-center gap-1">
                    <Eye className="w-4 h-4" /> View
                </a>
                <a href={url} download className="p-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors">
                    <Download className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}

// Quick helper for info rows
const InfoRow = ({ label, value }: { label: string, value: any }) => {
    if (!value) return null;
    return (
        <div className="border-b border-gray-100 py-3 print:py-[2px] flex justify-between items-center break-words print:border-dashed">
            <span className="text-sm print:text-[9px] font-medium text-gray-500 w-1/2 print:w-[35%]">{label}</span>
            <span className="text-sm print:text-[9px] font-semibold text-gray-900 text-right w-1/2 print:w-[65%]">{value.toString()}</span>
        </div>
    );
}

return (
    <>
        <button
            onClick={() => setIsOpen(true)}
            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
            title="Review Detailed Application"
        >
            <Eye className="w-4 h-4" />
        </button>

        {isOpen && (
            <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 print:bg-transparent print:backdrop-blur-none">
                <style>{`
                    @media print {
                        @page { margin: 5mm; size: A4; }
                        html, body {
                            height: auto !important;
                            overflow: visible !important;
                            background-color: white !important;
                        }
                        /* Hide all elements initially */
                        body * { visibility: hidden !important; }
                        /* Show only the print section */
                        #print-section {
                            visibility: visible !important;
                            position: absolute !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        #print-section * { visibility: visible !important; }

                        /* Force hide the screen layout and actions */
                        .screen-layout, .print\\:hidden { display: none !important; }
                        
                        /* Ensure all table headings are strictly left aligned */
                        #print-section th { text-align: left !important; }
                        /* Ensure images render in print (especially Chrome) */
                        img { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    }
                `}</style>
                {/* Sliding panel on the right side */}
                <div id="print-section" className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 print:shadow-none print:max-w-full print:w-full print:border-none print:h-auto">
                    {/* Action Bar (Sticky) */}
                    <div className="px-6 py-3 border-b border-emerald-100 bg-emerald-50 flex justify-between items-center sticky top-0 z-10 print:hidden">
                        <span className="text-sm font-bold text-emerald-800 tracking-wide uppercase">Application Review</span>
                        <div className="flex items-center gap-2">
                            {admission.status === 'APPROVED' && (
                                <button onClick={() => window.print()} className="bg-white hover:bg-emerald-100 text-emerald-700 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors flex items-center gap-2 border border-emerald-200 shadow-sm">
                                    <Printer className="w-4 h-4" /> Print
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="bg-white hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-md p-1.5 border border-gray-200 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content (SCREEN ONLY) */}
                    <div className="screen-layout flex-1 overflow-y-auto p-6 space-y-8 print:hidden bg-white">
                        
                        {/* Official Form Header */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between border-b-4 border-emerald-800 pb-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-4 sm:mb-0">
                                <Image src="/images/madrasa_logo.png" alt="Al-Iqra Logo" width={90} height={110} className="object-contain drop-shadow-sm" />
                                <Image src="/images/madrasa_name.png" alt="Al-Iqra Name" width={280} height={90} className="object-contain drop-shadow-sm" />
                            </div>
                            <div className="flex flex-col items-center sm:items-end text-center sm:text-right mt-2 sm:mt-0">
                                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-emerald-950">Student Admission Form</h1>
                                <p className="text-sm font-semibold text-gray-600 mt-2 bg-gray-100 px-4 py-1 rounded-full border border-gray-200 inline-block">Application No: {admission.admissionNumber}</p>
                            </div>
                        </div>

                        {/* Applicant Summary (Photo and Details Beneath Logo) */}
                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-emerald-50/50 p-6 rounded-xl border border-emerald-100 mt-4 mb-8">
                            <div className="shrink-0 flex flex-col items-center">
                                {admission.studentPhoto ? (
                                    <Image src={admission.studentPhoto} alt={admission.fullName} width={120} height={150} className="rounded-md object-cover border-4 border-white shadow-md h-36 w-28" />
                                ) : (
                                    <div className="h-36 w-28 rounded-md bg-emerald-200 flex items-center justify-center text-emerald-800 text-4xl font-bold border-4 border-white shadow-md">
                                        {admission.fullName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-3xl font-extrabold text-emerald-950 mb-2">{admission.fullName}</h2>
                                <div className="space-y-1.5">
                                    <p className="text-sm text-gray-700"><span className="font-semibold text-emerald-800">Applied for:</span> {admission.courseApplyingFor || "Regular"}</p>
                                    <p className="text-sm text-gray-700"><span className="font-semibold text-emerald-800">Date of Birth:</span> {format(new Date(admission.dob), "MMMM d, yyyy")}</p>
                                    <p className="text-sm text-gray-700"><span className="font-semibold text-emerald-800">Father's Name:</span> {admission.fatherName}</p>
                                    <p className="text-sm text-gray-700"><span className="font-semibold text-emerald-800">Submission Date:</span> {format(new Date(admission.appliedAt), "MMM d, yyyy")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 1 */}
                        <section>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-l-2 pl-2 border-emerald-500">1. Basic Information</h3>
                            <div className="bg-white rounded-lg border px-4">
                                <InfoRow label="Arabic Name" value={admission.arabicName} />
                                <InfoRow label="Gender" value={admission.gender} />
                                <InfoRow label="Date of Birth" value={format(new Date(admission.dob), "MMMM d, yyyy")} />
                                <InfoRow label="Aadhaar" value={admission.aadhaarNumber} />
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-l-2 pl-2 border-emerald-500">2. Islamic Academics</h3>
                            <div className="bg-white rounded-lg border px-4">
                                <InfoRow label="Hifz Status" value={admission.hifzStatus} />
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-l-2 pl-2 border-emerald-500">3. Background & Parents</h3>
                            <div className="bg-white rounded-lg border px-4">
                                <InfoRow label="Father Mobile" value={admission.fatherMobile} />
                                <InfoRow label="Mother Details" value={`${admission.motherName || 'N/A'} - ${admission.motherMobile || ''}`} />
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-l-2 pl-2 border-emerald-500">4. Address & Logistics</h3>
                            <div className="bg-white rounded-lg border px-4">
                                <InfoRow label="Full Address" value={`${admission.fullAddress}, ${admission.city || '-'}, ${admission.state || '-'} - ${admission.pincode || '-'}`} />
                                <InfoRow label="Hostel Required" value={admission.hostelRequired ? "YES" : "NO"} />
                                <InfoRow label="Transport Required" value={admission.transportRequired ? `YES (${admission.pickupLocation || 'No location'})` : "NO"} />
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-l-2 pl-2 border-emerald-500">5. Uploaded Documents</h3>
                            <div className="pt-2">
                                {(!admission.birthCertificate && !admission.aadhaarCard && !admission.transferCertificate) && (
                                    <p className="text-sm text-gray-500 italic px-4">No documents were uploaded by the applicant.</p>
                                )}
                                <DocumentRow title="Birth Certificate" url={admission.birthCertificate} />
                                <DocumentRow title="Transfer Certificate (TC)" url={admission.transferCertificate} />
                                <DocumentRow title="Aadhaar Card" url={admission.aadhaarCard} />
                            </div>
                        </section>
                    </div>

                    {/* DEDICATED PRINT LAYOUT (PRINT ONLY) */}
                    <div className="hidden print:block w-full text-black bg-white">
                        {/* Print Header - Logo and Name on Left */}
                        <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-2">
                            <div className="flex items-center gap-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/madrasa_logo.png" alt="Logo" width={80} height={90} className="object-contain" />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/madrasa_name.png" alt="Al-Iqra Name" width={240} height={70} className="object-contain" />
                            </div>
                            <div className="text-right">
                                <h1 className="text-sm font-black uppercase tracking-widest">Student Admission Form</h1>
                            </div>
                        </div>

                        {/* Application Number and Photo Box */}
                        <div className="flex justify-between items-start mb-2">
                            <div className="border border-black p-1.5 text-[11px] font-bold inline-block h-fit bg-gray-100">
                                APPLICATION NO: {admission.admissionNumber}
                            </div>
                            <div className="w-20 h-24 border border-black flex items-center justify-center overflow-hidden bg-gray-50">
                                {admission.studentPhoto ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={admission.studentPhoto} alt="Photo" width={80} height={96} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[9px] text-center text-gray-500">Passport<br/>Size<br/>Photo</span>
                                )}
                            </div>
                        </div>

                        {/* Print Sections using dense tables */}
                        <div className="space-y-2 text-[10px]">
                            
                            {/* 1. Basic Info */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">1. Basic Information</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black w-1/4">Full Name</th>
                                            <td className="p-1 border-r border-black font-semibold">{admission.fullName}</td>
                                            <th className="p-1 border-r border-black w-1/6">Arabic Name</th>
                                            <td className="p-1 font-semibold">{admission.arabicName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-1 border-r border-black">Gender</th>
                                            <td className="p-1 border-r border-black font-semibold">{admission.gender}</td>
                                            <th className="p-1 border-r border-black">Date of Birth</th>
                                            <td className="p-1 font-semibold">{format(new Date(admission.dob), "dd/MM/yyyy")}</td>
                                        </tr>
                                        <tr className="border-t border-black">
                                            <th className="p-1 border-r border-black">Aadhaar Number</th>
                                            <td colSpan={3} className="p-1 font-semibold">{admission.aadhaarNumber || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 2. Islamic Details */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">2. Islamic Details</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr>
                                            <th className="p-1 border-r border-black w-1/4">Course Applying For</th>
                                            <td className="p-1 border-r border-black font-semibold">{admission.courseApplyingFor || 'Regular'}</td>
                                            <th className="p-1 border-r border-black w-1/6">Hifz Status</th>
                                            <td className="p-1 font-semibold">{admission.hifzStatus || 'None'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 3. Academic Background */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">3. Academic Background</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black w-1/4">Previous School</th>
                                            <td className="p-1 border-r border-black font-semibold">{admission.previousSchoolName || '-'}</td>
                                            <th className="p-1 border-r border-black w-1/6">Board</th>
                                            <td className="p-1 font-semibold">{admission.boardName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-1 border-r border-black">Last Class Passed</th>
                                            <td className="p-1 border-r border-black font-semibold">{admission.lastClassPassed || '-'}</td>
                                            <th className="p-1 border-r border-black">Grade / %</th>
                                            <td className="p-1 font-semibold">{admission.percentageOrGrade || '-'}</td>
                                        </tr>
                                        <tr className="border-t border-black">
                                            <th className="p-1 border-r border-black">Medium of Study</th>
                                            <td colSpan={3} className="p-1 font-semibold">{admission.mediumOfStudy || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 4. Parent / Guardian */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">4. Parent / Guardian</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black w-1/4">Father's Name</th>
                                            <td className="p-1 border-r border-black font-semibold">{admission.fatherName}</td>
                                            <th className="p-1 border-r border-black w-1/6">Father's Mobile</th>
                                            <td className="p-1 font-semibold">{admission.fatherMobile}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-1 border-r border-black">Mother's Name</th>
                                            <td colSpan={3} className="p-1 font-semibold">{admission.motherName || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 5. Address Details */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">5. Address Details</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black w-1/4">Full Address</th>
                                            <td colSpan={3} className="p-1 font-semibold">{admission.fullAddress}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-1 border-r border-black">City</th>
                                            <td className="p-1 border-r border-black font-semibold">{admission.city || '-'}</td>
                                            <th className="p-1 border-r border-black">State & Pincode</th>
                                            <td className="p-1 font-semibold">{admission.state || '-'} - {admission.pincode || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 6. Hostel & Transport */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">6. Hostel & Transport</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-black">
                                            <th className="p-1 border-r border-black w-1/4">Hostel Required?</th>
                                            <td className="p-1 border-r border-black font-semibold">{admission.hostelRequired ? "YES" : "NO"}</td>
                                            <th className="p-1 border-r border-black w-1/6">Local Guardian</th>
                                            <td className="p-1 font-semibold">{admission.localGuardianForHostel || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-1 border-r border-black">Transport Required?</th>
                                            <td className="p-1 border-r border-black font-semibold">{admission.transportRequired ? "YES" : "NO"}</td>
                                            <th className="p-1 border-r border-black">Pickup Location</th>
                                            <td className="p-1 font-semibold">{admission.pickupLocation || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 7. Document Uploads */}
                            <div>
                                <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">7. Document Uploads</h3>
                                <table className="w-full border-x border-b border-black text-left border-collapse">
                                    <tbody>
                                        <tr>
                                            <th className="p-1 border-r border-black w-[33%]">Birth Certificate: {admission.birthCertificate ? "✅ Yes" : "❌ No"}</th>
                                            <th className="p-1 border-r border-black w-[33%]">Aadhaar Card: {admission.aadhaarCard ? "✅ Yes" : "❌ No"}</th>
                                            <th className="p-1">Transfer Certificate: {admission.transferCertificate ? "✅ Yes" : "❌ No"}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        {/* Official Print Signature Block */}
                        <div className="mt-4 pt-2 border-t border-black">
                            <h3 className="text-center font-bold text-[11px] mb-1 uppercase tracking-wider">Declaration & Signatures</h3>
                            <p className="text-center text-[9px] mb-12 italic text-gray-800 px-4">
                                "I hereby declare that all information provided is true and correct. I agree to abide by the rules and regulations of Al-Iqra Modern Madrasa."
                            </p>
                            <div className="flex justify-between items-end px-4">
                                <div className="text-center">
                                    <div className="w-40 border-b border-black mb-1"></div>
                                    <p className="font-bold text-[9px]">Signature of Parent / Guardian</p>
                                    <p className="text-[9px] mt-1">Date: ___/___/20__</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-40 border-b border-black mb-1"></div>
                                    <p className="font-bold text-[9px]">Seal & Signature of Principal</p>
                                    <p className="text-[9px] mt-1">Al-Iqra Modern Madrasa</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-4 border-t bg-gray-50 flex gap-3 justify-end sticky bottom-0 print:hidden">
                        {admission.status === 'PENDING' ? (
                            <>
                                <button
                                    onClick={handleReject}
                                    disabled={isPending}
                                    className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-semibold transition-colors border border-red-200 disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                                    Reject
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={isPending}
                                    className="flex items-center gap-2 px-8 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-bold shadow-md transition-colors disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                    Approve Registration
                                </button>
                            </>
                        ) : (
                            <div className="px-4 py-2 font-medium text-gray-600 bg-gray-100 rounded-lg select-none w-full text-center">
                                Application has already been {admission.status}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
    </>
);
}
