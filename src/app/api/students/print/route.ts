export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const admissionNo = searchParams.get("admissionNo");

        if (!admissionNo) {
            return NextResponse.json({ error: "Missing admissionNo parameter" }, { status: 400 });
        }

        // Fetch student with related data
        const student = await db.student.findUnique({
            where: { admissionNo },
            include: {
                user: true,
                class: true,
                parent: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        // Fetch admission data for full details
        const admission = await db.admission.findUnique({
            where: { admissionNumber: admissionNo },
        });

        return NextResponse.json({
            student: {
                id: student.id,
                admissionNo: student.admissionNo,
                rollNo: student.rollNo,
                dob: student.dob.toISOString(),
                gender: student.gender,
                bloodGroup: student.bloodGroup,
                address: student.address,
                class: student.class ? { id: student.class.id, name: student.class.name, section: student.class.section } : null,
                user: {
                    id: student.user.id,
                    name: student.user.name,
                    email: student.user.email,
                    phone: student.user.phone,
                    avatar: student.user.avatar,
                },
                parent: student.parent ? {
                    id: student.parent.id,
                    occupation: student.parent.occupation,
                    address: student.parent.address,
                    user: {
                        name: student.parent.user.name,
                        phone: student.parent.user.phone,
                    },
                } : null,
            },
            admission: admission ? {
                id: admission.id,
                admissionNumber: admission.admissionNumber,
                status: admission.status,
                appliedAt: admission.appliedAt.toISOString(),
                fullName: admission.fullName,
                arabicName: admission.arabicName,
                placeOfBirth: admission.placeOfBirth,
                nationality: admission.nationality,
                aadhaarNumber: admission.aadhaarNumber,
                religion: admission.religion,
                category: admission.category,
                studentPhoto: admission.studentPhoto,
                courseApplyingFor: admission.courseApplyingFor,
                hifzStatus: admission.hifzStatus,
                totalParasMemorized: admission.totalParasMemorized,
                surahsMemorized: admission.surahsMemorized,
                tajweedLevel: admission.tajweedLevel,
                previousMadrasa: admission.previousMadrasa,
                qariName: admission.qariName,
                islamicStudiesLevel: admission.islamicStudiesLevel,
                previousSchoolName: admission.previousSchoolName,
                boardName: admission.boardName,
                lastClassPassed: admission.lastClassPassed,
                percentageOrGrade: admission.percentageOrGrade,
                mediumOfStudy: admission.mediumOfStudy,
                fatherName: admission.fatherName,
                fatherOccupation: admission.fatherOccupation,
                fatherMobile: admission.fatherMobile,
                fatherEmail: admission.fatherEmail,
                fatherAnnualIncome: admission.fatherAnnualIncome,
                motherName: admission.motherName,
                motherMobile: admission.motherMobile,
                guardianName: admission.guardianName,
                guardianRelationship: admission.guardianRelationship,
                guardianMobile: admission.guardianMobile,
                fullAddress: admission.fullAddress,
                city: admission.city,
                district: admission.district,
                state: admission.state,
                pincode: admission.pincode,
                country: admission.country,
                medicalCondition: admission.medicalCondition,
                allergies: admission.allergies,
                disability: admission.disability,
                regularMedication: admission.regularMedication,
                emergencyContactName: admission.emergencyContactName,
                emergencyContactNum: admission.emergencyContactNum,
                hostelRequired: admission.hostelRequired,
                transportRequired: admission.transportRequired,
                pickupLocation: admission.pickupLocation,
                localGuardianForHostel: admission.localGuardianForHostel,
                birthCertificate: admission.birthCertificate,
                aadhaarCard: admission.aadhaarCard,
                guardianIdProof: admission.guardianIdProof,
                incomeCertificate: admission.incomeCertificate,
                transferCertificate: admission.transferCertificate,
                previousMarksheet: admission.previousMarksheet,
            } : null,
        });
    } catch (error: any) {
        console.error("Error fetching student print data:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}