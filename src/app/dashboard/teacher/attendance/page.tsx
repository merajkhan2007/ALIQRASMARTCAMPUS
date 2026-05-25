import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { AttendanceClient } from "./AttendanceClient";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

export default async function TeacherAttendancePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
        redirect("/login");
    }

    let userId = "";
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        userId = payload.id as string;
    } catch (error) {
        redirect("/login");
    }

    const teacher = await db.teacher.findUnique({
        where: { userId },
        include: {
            classes: {
                include: {
                    students: {
                        select: {
                            id: true,
                            userId: true,
                            admissionNo: true,
                            rollNo: true,
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        },
                        orderBy: {
                            rollNo: 'asc'
                        }
                    }
                }
            }
        }
    });

    if (!teacher) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-red-600">Profile Not Found</h2>
                <p className="text-gray-500 mt-2">Could not load your teacher profile.</p>
            </div>
        );
    }

    // Transform students to match the expected interface, as Student model uses `userId` to map to `User` table for `name`.
    // Wait, the Student schema does not have `fullName`, it has `User` table for name. 
    // Actually, Admission has `fullName`, but the current Student might have its own name, let's look at schema.
    // The `Student` model does NOT have `fullName`. It relates to `User`. Oh wait, let's look at how we did it.
    // In schema.prisma: `model Student { ... user User @relation(...) }`
    // And `User` has `name`. So `fullName` would be `student.user.name`.

    const transformedClasses = teacher.classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        section: cls.section,
        students: cls.students.map(s => ({
            id: s.id,
            fullName: s.user.name,
            admissionNo: s.admissionNo,
            rollNo: s.rollNo,
        }))
    }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Mark Attendance</h1>
                <p className="text-gray-500">Select a class and date to manage student attendance.</p>
            </div>

            <AttendanceClient classes={transformedClasses} />
        </div>
    );
}
