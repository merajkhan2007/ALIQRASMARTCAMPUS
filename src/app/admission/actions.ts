"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

// We'll write the uploaded files to public/uploads/admissions
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/admissions");

// Helper to save a file from FormData and return its public URL path
export async function saveFile(file: File | null): Promise<string | null> {
    if (!file || file.size === 0 || file.name === "undefined") return null;

    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        // Sanitize the filename to prevent path traversal or weird bugs
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const uniqueFilename = `${uuidv4()}-${cleanName}`;
        const filePath = path.join(UPLOAD_DIR, uniqueFilename);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await fs.writeFile(filePath, buffer);

        return `/uploads/admissions/${uniqueFilename}`;
    } catch (error) {
        console.error("Failed to save Admission file:", error);
        return null;
    }
}

export async function submitAdmission(formData: FormData) {
    try {
        // Step 1: Basic Info
        const fullName = formData.get("fullName") as string;
        const dobStr = formData.get("dob") as string;
        const gender = formData.get("gender") as string;

        if (!fullName || !dobStr || !gender) {
            return { error: "Missing required basic information." };
        }

        // Generate Admission Number
        const year = new Date().getFullYear();
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const admissionNumber = `APP-${year}-${randomDigits}`;

        // Process File Uploads concurrently to speed it up
        const [
            studentPhotoPath,
            transferCertificatePath,
            previousMarksheetPath,
            birthCertificatePath,
            aadhaarCardPath,
            guardianIdProofPath,
            incomeCertificatePath
        ] = await Promise.all([
            saveFile(formData.get("studentPhoto") as File),
            saveFile(formData.get("transferCertificate") as File),
            saveFile(formData.get("previousMarksheet") as File),
            saveFile(formData.get("birthCertificate") as File),
            saveFile(formData.get("aadhaarCard") as File),
            saveFile(formData.get("guardianIdProof") as File),
            saveFile(formData.get("incomeCertificate") as File),
        ]);

        // Save everything into the Admission staging table
        await db.admission.create({
            data: {
                admissionNumber,
                status: "PENDING",

                // STEP 1
                fullName,
                arabicName: formData.get("arabicName") as string || null,
                gender,
                dob: new Date(dobStr),
                placeOfBirth: formData.get("placeOfBirth") as string || null,
                nationality: formData.get("nationality") as string || null,
                aadhaarNumber: formData.get("aadhaarNumber") as string || null,
                bloodGroup: formData.get("bloodGroup") as string || null,
                religion: formData.get("religion") as string || "Islam",
                category: formData.get("category") as string || null,
                studentPhoto: studentPhotoPath,

                // STEP 2
                courseApplyingFor: formData.get("courseApplyingFor") as string || null,
                hifzStatus: formData.get("hifzStatus") as string || null,
                totalParasMemorized: formData.get("totalParasMemorized") ? parseInt(formData.get("totalParasMemorized") as string) : null,
                surahsMemorized: formData.get("surahsMemorized") as string || null,
                tajweedLevel: formData.get("tajweedLevel") as string || null,
                previousMadrasa: formData.get("previousMadrasa") as string || null,
                qariName: formData.get("qariName") as string || null,
                islamicStudiesLevel: formData.get("islamicStudiesLevel") as string || null,

                // STEP 3
                previousSchoolName: formData.get("previousSchoolName") as string || null,
                boardName: formData.get("boardName") as string || null,
                lastClassPassed: formData.get("lastClassPassed") as string || null,
                percentageOrGrade: formData.get("percentageOrGrade") as string || null,
                transferCertificate: transferCertificatePath,
                previousMarksheet: previousMarksheetPath,
                mediumOfStudy: formData.get("mediumOfStudy") as string || null,

                // STEP 4
                fatherName: formData.get("fatherName") as string || "",
                fatherOccupation: formData.get("fatherOccupation") as string || null,
                fatherMobile: formData.get("fatherMobile") as string || "",
                fatherEmail: formData.get("fatherEmail") as string || null,
                fatherAnnualIncome: formData.get("fatherAnnualIncome") as string || null,
                motherName: formData.get("motherName") as string || null,
                motherMobile: formData.get("motherMobile") as string || null,
                guardianName: formData.get("guardianName") as string || null,
                guardianRelationship: formData.get("guardianRelationship") as string || null,
                guardianMobile: formData.get("guardianMobile") as string || null,

                // STEP 5
                fullAddress: formData.get("fullAddress") as string || "",
                city: formData.get("city") as string || null,
                district: formData.get("district") as string || null,
                state: formData.get("state") as string || null,
                pincode: formData.get("pincode") as string || null,
                country: formData.get("country") as string || "India",

                // STEP 6
                medicalCondition: formData.get("medicalCondition") as string || null,
                allergies: formData.get("allergies") as string || null,
                disability: formData.get("disability") as string || null,
                regularMedication: formData.get("regularMedication") as string || null,
                emergencyContactName: formData.get("emergencyContactName") as string || null,
                emergencyContactNum: formData.get("emergencyContactNum") as string || null,

                // STEP 7
                hostelRequired: formData.get("hostelRequired") === "on",
                transportRequired: formData.get("transportRequired") === "on",
                pickupLocation: formData.get("pickupLocation") as string || null,
                localGuardianForHostel: formData.get("localGuardianForHostel") as string || null,

                // STEP 8
                birthCertificate: birthCertificatePath,
                aadhaarCard: aadhaarCardPath,
                guardianIdProof: guardianIdProofPath,
                incomeCertificate: incomeCertificatePath,
            }
        });

        // Revalidate the Admin Dashboard path so the new application appears instantly
        revalidatePath("/dashboard/admin/admissions");

        return { success: true, admissionNumber };

    } catch (error: any) {
        console.error("Admission Submission Error:", error);
        return { error: error.message || "An unexpected error occurred during submission." };
    }
}
