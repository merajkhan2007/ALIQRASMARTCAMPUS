import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Calendar, Bell, Book, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

export default async function TeacherDashboard() {
    // 1. Authenticate user
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

    // 2. Fetch Teacher Profile and relationships
    const teacher = await db.teacher.findUnique({
        where: { userId },
        include: {
            user: true,
            classes: {
                include: {
                    students: true
                }
            },
            subjects: {
                include: {
                    class: true,
                    exams: {
                        where: {
                            date: {
                                gte: new Date()
                            }
                        }
                    }
                }
            }
        }
    });

    if (!teacher) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-red-600">Teacher Profile Not Found</h2>
                <p className="text-gray-500 mt-2">Please contact the administrator to set up your profile.</p>
            </div>
        );
    }

    // 3. Compute Metrics
    // My Students (count across all assigned classes)
    const totalStudents = teacher.classes.reduce((sum, cls) => sum + cls.students.length, 0);

    // Today's Attendance
    const studentIds = teacher.classes.flatMap(cls => cls.students.map(s => s.id));
    
    let attendancePercentage = 0;
    let presentCount = 0;
    let absentCount = 0;
    
    if (studentIds.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const attendances = await db.attendance.findMany({
            where: {
                studentId: { in: studentIds },
                date: { gte: today }
            }
        });

        presentCount = attendances.filter(a => a.status === 'PRESENT').length;
        absentCount = attendances.filter(a => a.status === 'ABSENT').length;
        const totalMarked = attendances.length;

        attendancePercentage = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;
    }

    // Upcoming Exams
    const upcomingExams = teacher.subjects.flatMap(s => s.exams);
    const examsCount = upcomingExams.length;

    // New Notices (Targeted at TEACHER or ALL, recent 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const noticesCount = await db.notice.count({
        where: {
            date: { gte: sevenDaysAgo },
            OR: [
                { targetRoles: { contains: "TEACHER" } },
                { targetRoles: { contains: "ALL" } },
                { targetRoles: null }
            ]
        }
    });

    // 4. Render
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Teacher Dashboard</h1>
                <p className="text-gray-500">Welcome back, {teacher.user.name.split(' ')[0]}! Here's your class overview.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex w-full flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-900">My Students</CardTitle>
                        <Users className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{totalStudents}</div>
                        <p className="text-xs text-gray-500">Across {teacher.classes.length} assigned classes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex w-full flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-900">Today's Attendance</CardTitle>
                        <UserCheck className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{attendancePercentage}%</div>
                        <p className="text-xs text-gray-500">{presentCount} present, {absentCount} absent</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-900">Upcoming Exams</CardTitle>
                        <Calendar className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{examsCount}</div>
                        <p className="text-xs text-gray-500">Scheduled for your subjects</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-900">New Notices</CardTitle>
                        <Bell className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{noticesCount}</div>
                        <p className="text-xs text-gray-500">Recent announcements</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1 border-t-4 border-t-emerald-600 shadow-sm">
                    <CardHeader>
                        <CardTitle>Assigned Subjects (Schedule)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {teacher.subjects.length > 0 ? (
                                teacher.subjects.map((subject, index) => (
                                    <div key={subject.id} className={`flex items-center gap-4 rounded-lg border p-3 shadow-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <div className="bg-emerald-100 p-2 rounded-md font-bold text-emerald-800 text-xs w-16 text-center">
                                            {subject.code}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{subject.name}</p>
                                            <p className="text-sm text-gray-500">{subject.class.name}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <Book className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p>No subjects assigned yet.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center justify-center p-6 bg-emerald-50 text-emerald-900 rounded-lg hover:bg-emerald-100 transition shadow-sm border border-emerald-100">
                            <UserCheck className="w-8 h-8 mb-2" />
                            <span className="font-medium text-sm">Mark Attendance</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-6 bg-amber-50 text-amber-900 rounded-lg hover:bg-amber-100 transition shadow-sm border border-amber-100">
                            <Calendar className="w-8 h-8 mb-2" />
                            <span className="font-medium text-sm">Add Marks</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-6 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100 transition shadow-sm border border-blue-100">
                            <Book className="w-8 h-8 mb-2" />
                            <span className="font-medium text-sm">Assign Homework</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-6 bg-purple-50 text-purple-900 rounded-lg hover:bg-purple-100 transition shadow-sm border border-purple-100">
                            <Bell className="w-8 h-8 mb-2" />
                            <span className="font-medium text-sm">Send Notice</span>
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
