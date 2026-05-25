"use client";

import { useState } from "react";
import { Eye, X, GraduationCap, Phone, Mail, MapPin, Calendar, Activity, Printer, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ViewStudentModal({ student }: { student: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [printing, setPrinting] = useState(false);
    const [printData, setPrintData] = useState<any>(null);

    const handlePrint = async () => {
        setPrinting(true);
        try {
            const res = await fetch(`/api/students/print?admissionNo=${encodeURIComponent(student.admissionNo)}`);
            if (!res.ok) throw new Error("Failed to fetch full student data");
            const data = await res.json();
            setPrintData(data);

            // Preload the student photo before triggering print
            const photoUrl = data?.admission?.studentPhoto;
            if (photoUrl) {
                const img = new window.Image();
                img.src = photoUrl;
                await new Promise<void>((resolve, reject) => {
                    img.onload = () => resolve();
                    img.onerror = () => resolve(); // proceed even on error
                    // Timeout safeguard: don't wait more than 5 seconds
                    setTimeout(() => resolve(), 5000);
                });
            }

            // Small delay to let React re-render the print-only DOM, then trigger print
            setTimeout(() => {
                window.print();
                setPrinting(false);
            }, 200);
        } catch (err) {
            console.error("Print data fetch error:", err);
            setPrinting(false);
            setPrintData({ student, admission: null });
            setTimeout(() => {
                window.print();
            }, 200);
        }
    };

    // Helper to render info rows in screen view
    const InfoRow = ({ label, value }: { label: string; value: any }) => {
        if (!value) return null;
        return (
            <div className="border-b border-gray-100 py-3 print:py-[2px] flex justify-between items-center break-words print:border-dashed">
                <span className="text-sm print:text-[9px] font-medium text-gray-500 w-1/2 print:w-[35%]">{label}</span>
                <span className="text-sm print:text-[9px] font-semibold text-gray-900 text-right w-1/2 print:w-[65%]">{value.toString()}</span>
            </div>
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                title="View student details"
            >
                <Eye className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 print:bg-transparent print:backdrop-blur-none print:p-0">
                    <style>{`
                        @media print {
                            @page { margin: 8mm; size: A4; }
                            html, body {
                                height: auto !important;
                                overflow: visible !important;
                                background-color: white !important;
                            }
                            /* Hide all elements initially */
                            body * { visibility: hidden !important; }
                            /* Show only the print section */
                            #student-print-root {
                                visibility: visible !important;
                                position: absolute !important;
                                left: 0 !important;
                                top: 0 !important;
                                width: 100% !important;
                            }
                            #student-print-root * { visibility: visible !important; }
                            .screen-layout, .print\\:hidden { display: none !important; }
                            #student-print-section th, #student-print-section td { text-align: left !important; }
                            /* Ensure images render in print (especially Chrome) */
                            img { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                        }
                    `}</style>

                    <div id="student-print-root" className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh] print:shadow-none print:max-w-full print:w-full print:border-none print:max-h-none">
                        {/* SCREEN VIEW: Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-emerald-50/50 print:hidden">
                            <h3 className="font-semibold text-lg text-emerald-950 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-emerald-600" />
                                Student Profile
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrint}
                                    disabled={printing}
                                    className="bg-white hover:bg-emerald-100 text-emerald-700 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors flex items-center gap-2 border border-emerald-200 shadow-sm disabled:opacity-60"
                                >
                                    {printing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                                    Print
                                </button>
                                <button onClick={() => { setIsOpen(false); setPrintData(null); }} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* SCREEN VIEW: Content */}
                        <div className="screen-layout p-6 overflow-y-auto">
                            <div className="flex items-start gap-6 mb-8">
                                {student.user.avatar ? (
                                    <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-emerald-100 flex-shrink-0 shadow-sm">
                                        <Image src={student.user.avatar} alt={student.user.name} fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl font-bold flex-shrink-0 shadow-sm border-2 border-emerald-200">
                                        {student.user.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{student.user.name}</h2>
                                    <p className="text-emerald-600 font-medium">Admission No: {student.admissionNo}</p>
                                    <span className="inline-flex items-center mt-2 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                        Class: {student.class ? student.class.name : 'Unassigned'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Personal Information</h4>

                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Date of Birth</p>
                                            <p className="font-medium text-gray-900">{format(new Date(student.dob), 'MMMM dd, yyyy')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <Activity className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Gender & Blood Group</p>
                                            <p className="font-medium text-gray-900 capitalize">{student.gender.toLowerCase()} {student.bloodGroup ? `• ${student.bloodGroup}` : ''}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Contact Details</h4>

                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Email Address</p>
                                            <p className="font-medium text-gray-900">{student.user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Phone Number</p>
                                            <p className="font-medium text-gray-900">{student.user.phone || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Home Address</p>
                                            <p className="font-medium text-gray-900 leading-relaxed">{student.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t flex justify-end">
                                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                                    Close Profile
                                </button>
                            </div>
                        </div>

                        {/* PRINT VIEW: A4-formatted Student Profile */}
                        <div id="student-print-section" className="hidden print:block w-full text-black bg-white">
                            {/* Header: Logo + Madrasa Name */}
                            <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-2">
                                <div className="flex items-center gap-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/images/madrasa_logo.png" alt="Logo" width={80} height={90} className="object-contain" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/images/madrasa_name.png" alt="Al-Iqra Name" width={240} height={70} className="object-contain" />
                                </div>
                                <div className="text-right">
                                    <h1 className="text-sm font-black uppercase tracking-widest">Student Profile</h1>
                                    <p className="text-[9px] text-gray-600">Academic Record</p>
                                </div>
                            </div>

                            {/* Admission No + Photo */}
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="border border-black p-1.5 text-[11px] font-bold inline-block bg-gray-100">
                                        ADMISSION NO: {student.admissionNo}
                                    </div>
                                    {student.rollNo && (
                                        <div className="border border-black p-1.5 text-[11px] font-bold inline-block bg-gray-100 ml-2">
                                            ROLL NO: {student.rollNo}
                                        </div>
                                    )}
                                </div>
                                <div className="w-20 h-24 border border-black flex items-center justify-center overflow-hidden bg-gray-50">
                                    {printData?.admission?.studentPhoto ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={printData.admission.studentPhoto} alt="Student Photo" className="w-full h-full object-cover" />
                                    ) : student.user.avatar ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={student.user.avatar} alt="Photo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[9px] text-center text-gray-500">Passport<br/>Size<br/>Photo</span>
                                    )}
                                </div>
                            </div>

                            {/* Section 1: Student Identity */}
                            <div className="space-y-2 text-[10px]">
                                <div>
                                    <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">1. Student Identity</h3>
                                    <table className="w-full border-x border-b border-black text-left border-collapse">
                                        <tbody>
                                            <tr className="border-b border-black">
                                                <th className="p-1 border-r border-black w-1/4">Full Name</th>
                                                <td className="p-1 border-r border-black font-semibold">{student.user.name}</td>
                                                <th className="p-1 border-r border-black w-1/6">Gender</th>
                                                <td className="p-1 font-semibold">{student.gender}</td>
                                            </tr>
                                            <tr className="border-b border-black">
                                                <th className="p-1 border-r border-black">Date of Birth</th>
                                                <td className="p-1 border-r border-black font-semibold">{format(new Date(student.dob), "dd/MM/yyyy")}</td>
                                                <th className="p-1 border-r border-black">Blood Group</th>
                                                <td className="p-1 font-semibold">{student.bloodGroup || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th className="p-1 border-r border-black">Class / Section</th>
                                                <td className="p-1 border-r border-black font-semibold">{student.class ? `${student.class.name}${student.class.section ? ` - ${student.class.section}` : ''}` : 'Unassigned'}</td>
                                                <th className="p-1 border-r border-black">Roll No</th>
                                                <td className="p-1 font-semibold">{student.rollNo || '-'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Section 2: Contact Details */}
                                <div>
                                    <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">2. Contact Details</h3>
                                    <table className="w-full border-x border-b border-black text-left border-collapse">
                                        <tbody>
                                            <tr className="border-b border-black">
                                                <th className="p-1 border-r border-black w-1/4">Email</th>
                                                <td className="p-1 border-r border-black font-semibold">{student.user.email}</td>
                                                <th className="p-1 border-r border-black w-1/6">Phone</th>
                                                <td className="p-1 font-semibold">{student.user.phone || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th className="p-1 border-r border-black">Address</th>
                                                <td colSpan={3} className="p-1 font-semibold">{student.address}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Section 3: Parent / Guardian — from admission data if available */}
                                {printData?.admission ? (
                                    <div>
                                        <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">3. Parent / Guardian Details</h3>
                                        <table className="w-full border-x border-b border-black text-left border-collapse">
                                            <tbody>
                                                <tr className="border-b border-black">
                                                    <th className="p-1 border-r border-black w-1/4">Father's Name</th>
                                                    <td className="p-1 border-r border-black font-semibold">{printData.admission.fatherName || '-'}</td>
                                                    <th className="p-1 border-r border-black w-1/6">Father's Mobile</th>
                                                    <td className="p-1 font-semibold">{printData.admission.fatherMobile || '-'}</td>
                                                </tr>
                                                {printData.admission.fatherOccupation && (
                                                    <tr className="border-b border-black">
                                                        <th className="p-1 border-r border-black">Father's Occupation</th>
                                                        <td colSpan={3} className="p-1 font-semibold">{printData.admission.fatherOccupation}</td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <th className="p-1 border-r border-black">Mother's Name</th>
                                                    <td colSpan={3} className="p-1 font-semibold">{printData.admission.motherName || '-'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">3. Parent / Guardian Details</h3>
                                        <table className="w-full border-x border-b border-black text-left border-collapse">
                                            <tbody>
                                                <tr>
                                                    <td colSpan={4} className="p-2 text-center text-gray-500 italic">Additional parent details not available. Please refer to the admission record.</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Section 4: Academic Info — from admission */}
                                {printData?.admission && (printData.admission.courseApplyingFor || printData.admission.previousSchoolName) && (
                                    <div>
                                        <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">4. Academic Information</h3>
                                        <table className="w-full border-x border-b border-black text-left border-collapse">
                                            <tbody>
                                                {printData.admission.courseApplyingFor && (
                                                    <tr className="border-b border-black">
                                                        <th className="p-1 border-r border-black w-1/4">Course</th>
                                                        <td className="p-1 border-r border-black font-semibold">{printData.admission.courseApplyingFor}</td>
                                                        <th className="p-1 border-r border-black w-1/6">Hifz Status</th>
                                                        <td className="p-1 font-semibold">{printData.admission.hifzStatus || 'None'}</td>
                                                    </tr>
                                                )}
                                                {printData.admission.previousSchoolName && (
                                                    <tr className="border-b border-black">
                                                        <th className="p-1 border-r border-black">Previous School</th>
                                                        <td className="p-1 border-r border-black font-semibold">{printData.admission.previousSchoolName}</td>
                                                        <th className="p-1 border-r border-black">Board</th>
                                                        <td className="p-1 font-semibold">{printData.admission.boardName || '-'}</td>
                                                    </tr>
                                                )}
                                                {printData.admission.lastClassPassed && (
                                                    <tr>
                                                        <th className="p-1 border-r border-black">Last Class</th>
                                                        <td className="p-1 border-r border-black font-semibold">{printData.admission.lastClassPassed}</td>
                                                        <th className="p-1 border-r border-black">Grade / %</th>
                                                        <td className="p-1 font-semibold">{printData.admission.percentageOrGrade || '-'}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Section 5: Address Details — from admission */}
                                {printData?.admission && (
                                    <div>
                                        <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">5. Address Details</h3>
                                        <table className="w-full border-x border-b border-black text-left border-collapse">
                                            <tbody>
                                                <tr className="border-b border-black">
                                                    <th className="p-1 border-r border-black w-1/4">Full Address</th>
                                                    <td colSpan={3} className="p-1 font-semibold">{printData.admission.fullAddress || student.address}</td>
                                                </tr>
                                                <tr>
                                                    <th className="p-1 border-r border-black">City</th>
                                                    <td className="p-1 border-r border-black font-semibold">{printData.admission.city || '-'}</td>
                                                    <th className="p-1 border-r border-black">State & Pincode</th>
                                                    <td className="p-1 font-semibold">{printData.admission.state || '-'} - {printData.admission.pincode || '-'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Section 6: Hostel & Transport — from admission */}
                                {printData?.admission && (printData.admission.hostelRequired || printData.admission.transportRequired) && (
                                    <div>
                                        <h3 className="font-bold bg-gray-200 border border-black px-2 py-0.5 uppercase text-left">6. Hostel & Transport</h3>
                                        <table className="w-full border-x border-b border-black text-left border-collapse">
                                            <tbody>
                                                <tr className="border-b border-black">
                                                    <th className="p-1 border-r border-black w-1/4">Hostel Required?</th>
                                                    <td className="p-1 border-r border-black font-semibold">{printData.admission.hostelRequired ? "YES" : "NO"}</td>
                                                    <th className="p-1 border-r border-black w-1/6">Local Guardian</th>
                                                    <td className="p-1 font-semibold">{printData.admission.localGuardianForHostel || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <th className="p-1 border-r border-black">Transport Required?</th>
                                                    <td className="p-1 border-r border-black font-semibold">{printData.admission.transportRequired ? "YES" : "NO"}</td>
                                                    <th className="p-1 border-r border-black">Pickup Location</th>
                                                    <td className="p-1 font-semibold">{printData.admission.pickupLocation || '-'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
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
                    </div>
                </div>
            )}
        </>
    );
}
