import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { ExamsClient } from "./ExamsClient";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

export default async function TeacherExamsPage() {
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
            subjects: {
                include: {
                    class: {
                        include: {
                            students: {
                                select: {
                                    id: true,
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
                    },
                    exams: {
                        include: {
                            results: true
                        },
                        orderBy: {
                            date: 'desc'
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

    const transformedSubjects = teacher.subjects.map(subject => ({
        id: subject.id,
        name: subject.name,
        code: subject.code,
        class: {
            id: subject.class.id,
            name: subject.class.name,
            students: subject.class.students.map(s => ({
                id: s.id,
                fullName: s.user.name,
                admissionNo: s.admissionNo,
                rollNo: s.rollNo,
            }))
        },
        exams: subject.exams.map(e => ({
            id: e.id,
            title: e.title,
            date: e.date,
            maxMarks: e.maxMarks,
            results: e.results.map(r => ({
                studentId: r.studentId,
                obtainedMarks: r.obtainedMarks,
                grade: r.grade,
                remarks: r.remarks
            }))
        }))
    }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Exams & Results</h1>
                <p className="text-gray-500">Create exams and enter marks for your assigned subjects.</p>
            </div>

            <ExamsClient subjects={transformedSubjects} />
        </div>
    );
}
