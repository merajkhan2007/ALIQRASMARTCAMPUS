"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function addStudent(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const phone = formData.get("phone") as string;
        const admissionNo = formData.get("admissionNo") as string;
        const dob = formData.get("dob") as string;
        const gender = formData.get("gender") as string;
        const bloodGroup = formData.get("bloodGroup") as string;
        const address = formData.get("address") as string;
        const classId = formData.get("classId") as string;
        const avatarFile = formData.get("avatar") as File | null;

        if (!name || !email || !password || !admissionNo || !dob || !gender || !address) {
            return { error: "Missing required fields." };
        }

        // Check if email or admissionNo already exists
        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) return { error: "A user with this email already exists." };

        const existingStudent = await db.student.findUnique({ where: { admissionNo } });
        if (existingStudent) return { error: "A student with this admission number already exists." };

        // Process optional avatar upload
        let avatarUrl = null;
        if (avatarFile && avatarFile.size > 0) {
            const bytes = await avatarFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Clean extension from original name
            const extension = avatarFile.name.split('.').pop() || 'jpg';
            const filename = `${uuidv4()}.${extension}`;

            // Save to the public directory
            const filepath = path.join(process.cwd(), "public", "uploads", "avatars", filename);
            await writeFile(filepath, buffer);

            // Database stores public URL
            avatarUrl = `/uploads/avatars/${filename}`;
        }

        // Transaction to enforce both are created
        await db.$transaction(async (tx) => {
            let rollNoStr = null;
            if (classId) {
                const studentsInClass = await tx.student.findMany({
                    where: { classId },
                    select: { rollNo: true }
                });
                
                let maxRoll = 0;
                for (const s of studentsInClass) {
                    if (s.rollNo) {
                        const num = parseInt(s.rollNo, 10);
                        if (!isNaN(num) && num > maxRoll) {
                            maxRoll = num;
                        }
                    }
                }
                rollNoStr = (maxRoll + 1).toString();
            }

            const newUser = await tx.user.create({
                data: {
                    name,
                    email,
                    password, // In a true prod app, this should be bcrypt-hashed!
                    phone: phone || null,
                    avatar: avatarUrl,
                    role: "STUDENT",
                }
            });

            await tx.student.create({
                data: {
                    userId: newUser.id,
                    admissionNo,
                    rollNo: rollNoStr,
                    dob: new Date(dob),
                    gender,
                    bloodGroup: bloodGroup || null,
                    address,
                    classId: classId || null,
                }
            });
        });

        revalidatePath("/dashboard/admin/students");
        return { success: true };

    } catch (error) {
        console.error("Error adding student:", error);
        return { error: "An unexpected error occurred while adding the student." };
    }
}

export async function deleteStudent(userId: string) {
    try {
        if (!userId) {
            return { error: "No user ID provided for deletion." };
        }

        // The Prisma schema specifies onDelete: Cascade from User -> Student
        // and Student -> Attendance, Results, Fees. 
        // Deleting the core User record obliterates all trace safely.
        await db.user.delete({
            where: { id: userId }
        });

        revalidatePath("/dashboard/admin/students");
        return { success: true };
    } catch (error) {
        console.error("Error deleting student:", error);
        return { error: "Failed to delete the student record." };
    }
}

export async function editStudent(formData: FormData) {
    try {
        const userId = formData.get("userId") as string;
        const studentId = formData.get("studentId") as string;

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const admissionNo = formData.get("admissionNo") as string;
        const dob = formData.get("dob") as string;
        const gender = formData.get("gender") as string;
        const address = formData.get("address") as string;
        const classId = formData.get("classId") as string;
        const avatarFile = formData.get("avatar") as File | null;

        if (!userId || !studentId || !name || !email || !admissionNo || !dob || !gender || !address) {
            return { error: "Missing required fields." };
        }

        // Process optional avatar upload if a new one is provided
        let avatarUrl = undefined; // undefined ignores the field in Prisma update
        if (avatarFile && avatarFile.size > 0) {
            const bytes = await avatarFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const extension = avatarFile.name.split('.').pop() || 'jpg';
            const filename = `${uuidv4()}.${extension}`;

            const filepath = path.join(process.cwd(), "public", "uploads", "avatars", filename);
            await writeFile(filepath, buffer);

            avatarUrl = `/uploads/avatars/${filename}`;
        }

        // Transaction to update both tables securely
        await db.$transaction(async (tx) => {
            // Prioritize manual roll number from form, otherwise auto-calculate
            const manualRollNo = formData.get("rollNo") as string;
            const currentStudent = await tx.student.findUnique({ where: { id: studentId } });
            let rollNoStr = currentStudent?.rollNo;

            if (manualRollNo && manualRollNo.trim() !== "") {
                // Admin manually set a roll number
                rollNoStr = manualRollNo.trim();
            } else if (classId && (!currentStudent?.classId || currentStudent.classId !== classId)) {
                // If class changed, or if they were added to a class for the first time, auto-assign
                const studentsInClass = await tx.student.findMany({
                    where: { classId },
                    select: { rollNo: true }
                });
                
                let maxRoll = 0;
                for (const s of studentsInClass) {
                    if (s.rollNo) {
                        const num = parseInt(s.rollNo, 10);
                        if (!isNaN(num) && num > maxRoll) {
                            maxRoll = num;
                        }
                    }
                }
                rollNoStr = (maxRoll + 1).toString();
            } else if (!classId) {
                // If removed from class, remove roll number
                rollNoStr = null;
            }

            await tx.user.update({
                where: { id: userId },
                data: {
                    name,
                    email,
                    phone: phone || null,
                    ...(avatarUrl && { avatar: avatarUrl }),
                }
            });

            await tx.student.update({
                where: { id: studentId },
                data: {
                    admissionNo,
                    rollNo: rollNoStr,
                    dob: new Date(dob),
                    gender,
                    address,
                    classId: classId || null,
                }
            });
        });

        revalidatePath("/dashboard/admin/students");
        return { success: true };

    } catch (error) {
        console.error("Error editing student:", error);
        return { error: "An unexpected error occurred while updating." };
    }
}
