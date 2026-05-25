"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { saveFile } from "@/app/admission/actions";

export async function rejectAdmission(admissionId: string) {
    try {
        await db.admission.update({
            where: { id: admissionId },
            data: { status: "REJECTED" }
        });

        revalidatePath("/dashboard/admin/admissions");
        return { success: true };
    } catch (error) {
        console.error("Error rejecting admission:", error);
        return { error: "Failed to reject application." };
    }
}

export async function approveAdmission(admissionId: string) {
    try {
        const admission = await db.admission.findUnique({
            where: { id: admissionId }
        });

        if (!admission || admission.status !== "PENDING") {
            return { error: "Invalid application or already processed." };
        }

        // We need an email and password to create a User. 
        // If the father provided an email, we'll use that, otherwise generate a placeholder.
        const defaultEmail = admission.fatherEmail || `student_${admission.admissionNumber.toLowerCase()}@aliqramodernmadrasa.com`;

        // Double check no active User exists with this email
        const existingUser = await db.user.findUnique({ where: { email: defaultEmail } });
        if (existingUser) {
            return { error: `A user account with email ${defaultEmail} already exists. Please reject or resolve manually.` };
        }

        // Parent login generation
        let parentUserId = null;
        let parentId = null;

        // If father provided an email, create a Parent Role account for them
        if (admission.fatherEmail) {
            const hashedParentPass = await bcrypt.hash(admission.fatherMobile, 10); // Default parent pass = Mobile Number
            const parentUser = await db.user.create({
                data: {
                    name: admission.fatherName,
                    email: `parent_${admission.fatherEmail}`, // Unique suffix just in case
                    password: hashedParentPass,
                    phone: admission.fatherMobile,
                    role: "PARENT",
                    parentProfile: {
                        create: {
                            occupation: admission.fatherOccupation,
                            address: admission.fullAddress
                        }
                    }
                },
                include: { parentProfile: true }
            });
            parentUserId = parentUser.id;
            parentId = parentUser.parentProfile?.id;
        }

        // Create the active STUDENT account
        // Default password for the student is their Admission Number
        const hashedStudentPass = await bcrypt.hash(admission.admissionNumber, 10);

        await db.user.create({
            data: {
                name: admission.fullName,
                email: defaultEmail,
                password: hashedStudentPass,
                role: "STUDENT",
                avatar: admission.studentPhoto,
                studentProfile: {
                    create: {
                        admissionNo: admission.admissionNumber,
                        dob: admission.dob,
                        gender: admission.gender,
                        bloodGroup: admission.bloodGroup,
                        address: admission.fullAddress,
                        parentId: parentId, // Link to the newly generated Father Parent account if it exists
                    }
                }
            }
        });

        // Finally, update the staging admission status to APPROVED
        await db.admission.update({
            where: { id: admission.id },
            data: { status: "APPROVED" }
        });

        revalidatePath("/dashboard/admin/admissions");
        revalidatePath("/dashboard/admin/students");
        return { success: true };

    } catch (error: any) {
        console.error("Error approving admission:", error);
        return { error: error.message || "Failed to process approval." };
    }
}

export async function deleteAdmission(admissionId: string) {
    try {
        await db.admission.delete({
            where: { id: admissionId }
        });

        revalidatePath("/dashboard/admin/admissions");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting admission:", error);
        return { error: "Failed to delete application." };
    }
}

export async function updateAdmission(admissionId: string, formData: FormData) {
    try {
        const fullName = formData.get("fullName") as string;
        const dobStr = formData.get("dob") as string;
        const gender = formData.get("gender") as string;

        if (!fullName || !dobStr || !gender) {
            return { error: "Missing required basic information." };
        }

        // Optional File Uploads
        const studentPhotoFile = formData.get("studentPhoto") as File;
        const studentPhotoPath = studentPhotoFile?.size > 0 ? await saveFile(studentPhotoFile) : undefined;
        
        const birthCertificateFile = formData.get("birthCertificate") as File;
        const birthCertificatePath = birthCertificateFile?.size > 0 ? await saveFile(birthCertificateFile) : undefined;
        
        const aadhaarCardFile = formData.get("aadhaarCard") as File;
        const aadhaarCardPath = aadhaarCardFile?.size > 0 ? await saveFile(aadhaarCardFile) : undefined;
        
        const transferCertificateFile = formData.get("transferCertificate") as File;
        const transferCertificatePath = transferCertificateFile?.size > 0 ? await saveFile(transferCertificateFile) : undefined;

        await db.admission.update({
            where: { id: admissionId },
            data: {
                // STEP 1
                fullName,
                arabicName: (formData.get("arabicName") as string) || undefined,
                gender,
                dob: new Date(dobStr),
                aadhaarNumber: (formData.get("aadhaarNumber") as string) || undefined,
                ...(studentPhotoPath && { studentPhoto: studentPhotoPath }),

                // STEP 2
                courseApplyingFor: (formData.get("courseApplyingFor") as string) || undefined,
                hifzStatus: (formData.get("hifzStatus") as string) || undefined,

                // STEP 3
                previousSchoolName: (formData.get("previousSchoolName") as string) || undefined,
                boardName: (formData.get("boardName") as string) || undefined,
                lastClassPassed: (formData.get("lastClassPassed") as string) || undefined,
                percentageOrGrade: (formData.get("percentageOrGrade") as string) || undefined,
                mediumOfStudy: (formData.get("mediumOfStudy") as string) || undefined,

                // STEP 4
                fatherName: (formData.get("fatherName") as string) || undefined,
                fatherMobile: (formData.get("fatherMobile") as string) || undefined,
                motherName: (formData.get("motherName") as string) || undefined,

                // STEP 5
                fullAddress: (formData.get("fullAddress") as string) || undefined,
                city: (formData.get("city") as string) || undefined,
                district: (formData.get("district") as string) || undefined,
                state: (formData.get("state") as string) || undefined,
                pincode: (formData.get("pincode") as string) || undefined,

                // STEP 6
                hostelRequired: formData.get("hostelRequired") === "on",
                localGuardianForHostel: (formData.get("localGuardianForHostel") as string) || undefined,
                transportRequired: formData.get("transportRequired") === "on",
                pickupLocation: (formData.get("pickupLocation") as string) || undefined,

                // STEP 7 Docs
                ...(birthCertificatePath && { birthCertificate: birthCertificatePath }),
                ...(aadhaarCardPath && { aadhaarCard: aadhaarCardPath }),
                ...(transferCertificatePath && { transferCertificate: transferCertificatePath }),
            }
        });

        revalidatePath("/dashboard/admin/admissions");
        revalidatePath(`/dashboard/admin/admissions/${admissionId}/edit`);
        
        return { success: true };
    } catch (error: any) {
        console.error("Error updating admission:", error);
        return { error: error.message || "Failed to update application." };
    }
}
