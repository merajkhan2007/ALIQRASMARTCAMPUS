"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/cloudinary";

const addTeacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  qualification: z.string().min(2, "Qualification is required"),
  experience: z.coerce.number().min(0, "Experience cannot be negative"),
  salary: z.coerce.number().min(0, "Salary cannot be negative"),
});

export async function addTeacher(prevState: unknown, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = addTeacherSchema.safeParse(data);

    if (!result.success) {
      return {
        error: "Validation failed: " + result.error.issues[0].message,
      };
    }

    const { name, email, phone, password, qualification, experience, salary } = result.data;

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "A user with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarUrl: string | null = null;
    const avatarFile = formData.get("avatar") as File | null;
    if (avatarFile && avatarFile.size > 0) {
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      avatarUrl = await uploadImage(buffer, "teachers");
    }

    // Create User and linked Teacher profile
    await db.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        avatar: avatarUrl,
        role: "TEACHER",
        teacherProfile: {
          create: {
            qualification,
            experience,
            salary,
          },
        },
      },
    });

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin/teachers");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Add Teacher Error:", error);
    return { error: "An unexpected error occurred while adding the teacher." };
  }
}

const editUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

export async function editUser(prevState: unknown, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = editUserSchema.safeParse(data);

    if (!result.success) {
      return {
        error: "Validation failed: " + result.error.issues[0].message,
      };
    }

    const { id, name, email, phone } = result.data;

    // Check if new email conflicts with another user
    const existing = await db.user.findUnique({ where: { email } });
    if (existing && existing.id !== id) {
      return { error: "This email is already in use by another account." };
    }

    await db.user.update({
      where: { id },
      data: { name, email, phone },
    });

    revalidatePath("/dashboard/admin/users");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Edit User Error:", error);
    return { error: "An unexpected error occurred while updating." };
  }
}

const editTeacherSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  qualification: z.string().min(2, "Qualification is required"),
  experience: z.coerce.number().min(0, "Experience cannot be negative"),
  salary: z.coerce.number().min(0, "Salary cannot be negative"),
});

export async function editTeacher(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = editTeacherSchema.safeParse(data);

    if (!result.success) {
      return {
        error: "Validation failed: " + result.error.issues[0].message,
      };
    }

    const { id, name, email, phone, qualification, experience, salary } = result.data;

    // Check if new email conflicts with another user
    const existing = await db.user.findUnique({ where: { email } });
    if (existing && existing.id !== id) {
      return { error: "This email is already in use by another account." };
    }

    let avatarUrl: string | undefined = undefined;
    const avatarFile = formData.get("avatar") as File | null;
    if (avatarFile && avatarFile.size > 0) {
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      avatarUrl = await uploadImage(buffer, "teachers");
    }

    await db.user.update({
      where: { id },
      data: { 
        name, 
        email, 
        phone,
        ...(avatarUrl && { avatar: avatarUrl }),
        teacherProfile: {
          update: {
            qualification,
            experience,
            salary
          }
        }
      },
    });

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin/teachers");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Edit Teacher Error:", error);
    return { error: "An unexpected error occurred while updating." };
  }
}

export async function deleteUser(userId: string) {
  try {
    if (!userId) return { error: "User ID is missing." };

    const targetUser = await db.user.findUnique({ where: { id: userId } });
    
    if (targetUser?.role === "SUPER_ADMIN" || targetUser?.email === "admin@aliqramodernmadrasa.com") {
      return { error: "System protects root administrators from deletion." };
    }

    await db.user.delete({
      where: { id: userId }
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete User Error:", error);
    return { error: "An error occurred. Check if user is linked to strict records." };
  }
}

const changePasswordSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export async function changeUserPassword(prevState: unknown, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = changePasswordSchema.safeParse(data);

    if (!result.success) {
      return {
        error: "Validation failed: " + result.error.issues[0].message,
      };
    }

    const { userId, newPassword } = result.data;

    // Prevent changing root super admin password via this route
    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return { error: "User not found." };
    }
    if (targetUser.email === "admin@aliqramodernmadrasa.com") {
      return { error: "Cannot change the root administrator's password from here." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    revalidatePath("/dashboard/admin/users");

    return { success: true };
  } catch (error: unknown) {
    console.error("Change Password Error:", error);
    return { error: "An unexpected error occurred while changing the password." };
  }
}

const addStaffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ACCOUNTANT", "COOK", "KHADIM", "HAFIZ", "ADMIN"]),
  baseSalary: z.coerce.number().min(0, "Salary cannot be negative"),
});

export async function addStaff(prevState: unknown, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = addStaffSchema.safeParse(data);

    if (!result.success) {
      return {
        error: "Validation failed: " + result.error.issues[0].message,
      };
    }

    const { name, email, phone, password, role, baseSalary } = result.data;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "A user with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarUrl: string | null = null;
    const avatarFile = formData.get("avatar") as File | null;
    if (avatarFile && avatarFile.size > 0) {
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      avatarUrl = await uploadImage(buffer, "staff");
    }

    await db.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        avatar: avatarUrl,
        role,
        baseSalary,
      },
    });

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin/salary");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Add Staff Error:", error);
    return { error: "An unexpected error occurred while adding the staff member." };
  }
}
