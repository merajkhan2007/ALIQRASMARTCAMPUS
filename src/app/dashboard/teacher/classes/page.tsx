import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

export default async function TeacherClassesPage() {
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
                    students: true
                }
            },
            subjects: {
                include: {
                    class: {
                        include: {
                            students: true
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

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950">My Classes</h1>
                <p className="text-gray-500">Manage the classes you are assigned to as a Class Teacher or Subject Teacher.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-emerald-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-emerald-600" />
                        Class Teacher For
                    </h2>
                    {teacher.classes.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {teacher.classes.map((cls) => (
                                <Card key={cls.id} className="border-t-4 border-t-emerald-600 hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-bold text-gray-900 flex justify-between items-center">
                                            {cls.name} {cls.section ? `- ${cls.section}` : ''}
                                            <span className="text-xs font-normal px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                                                Class Teacher
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                            <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {cls.students.length} Students</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Link href={`/dashboard/teacher/attendance?classId=${cls.id}`} className="text-sm font-medium text-emerald-700 hover:text-emerald-800 flex items-center justify-between p-2 rounded-md hover:bg-emerald-50 transition">
                                                Mark Attendance <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-gray-50 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center p-6 text-gray-500">
                                <Users className="w-8 h-8 mb-2 text-gray-400" />
                                <p>You are not assigned as a Class Teacher for any class.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-emerald-900 mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                        Subject Teacher For
                    </h2>
                    {teacher.subjects.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {teacher.subjects.map((subject) => (
                                <Card key={subject.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-bold text-gray-900 flex justify-between items-center">
                                            {subject.name}
                                            <span className="text-xs font-mono px-2 py-1 bg-gray-100 text-gray-800 rounded-md">
                                                {subject.code}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Class: {subject.class.name} {subject.class.section ? `- ${subject.class.section}` : ''}
                                        </p>
                                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                            <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {subject.class.students.length} Students</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Link href={`/dashboard/teacher/exams?subjectId=${subject.id}`} className="text-sm font-medium text-blue-700 hover:text-blue-800 flex items-center justify-between p-2 rounded-md hover:bg-blue-50 transition">
                                                Manage Exams & Marks <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-gray-50 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center p-6 text-gray-500">
                                <BookOpen className="w-8 h-8 mb-2 text-gray-400" />
                                <p>You are not assigned as a Subject Teacher for any subjects.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
