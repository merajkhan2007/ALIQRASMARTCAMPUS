import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, IndianRupee, BookOpen, UserCheck, BellRing } from "lucide-react";
import { db } from "@/lib/db";
import { format } from "date-fns";

export default async function AdminDashboard() {
    // Fetch counts from database
    const [totalStudents, totalTeachers, totalClasses] = await Promise.all([
        db.student.count(),
        db.teacher.count(),
        db.class.count(),
    ]);

    // Aggregate paid fees this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const paidFeesThisMonth = await db.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            date: {
                gte: startOfMonth
            }
        }
    });

    const totalIncome = paidFeesThisMonth._sum.amount || 0;

    // Fetch recent activity (mix of latest payments, notices, and students for demo)
    const latestNotices = await db.notice.findMany({
        take: 3,
        orderBy: { date: 'desc' },
        include: { author: true }
    });
    // Fetch real-time attendance stats (last 7 days)
    const last7Days = new Date(new Date().setDate(new Date().getDate() - 7));
    const attendanceStats = await db.attendance.groupBy({
        by: ['status'],
        _count: { status: true },
        where: { date: { gte: last7Days } }
    });
    const presentCount = attendanceStats.find(a => a.status === 'PRESENT')?._count.status || 0;
    const absentCount = attendanceStats.find(a => a.status === 'ABSENT')?._count.status || 0;
    const lateCount = attendanceStats.find(a => a.status === 'LATE')?._count.status || 0;
    const totalRecorded = presentCount + absentCount + lateCount || 1; // avoid div by zero
    
    // Calculate CSS widths for the bar graph
    const presentRatio = Math.round((presentCount / totalRecorded) * 100);
    const absentRatio = Math.round((absentCount / totalRecorded) * 100);
    const lateRatio = Math.round((lateCount / totalRecorded) * 100);

    // Dynamic Daily Hadiths
    const hadiths = [
        { text: "The best among you are those who learn the Quran and teach it.", source: "Sahih al-Bukhari 5027" },
        { text: "He who does not show mercy to others, will not be shown mercy.", source: "Sahih al-Bukhari 7376" },
        { text: "A good word is charity.", source: "Sahih al-Bukhari 2989" },
        { text: "The strong man is not the one who can wrestle, but the one who controls himself in anger.", source: "Sahih al-Bukhari 6114" },
        { text: "Seeking knowledge is an obligation upon every Muslim.", source: "Sunan Ibn Majah 224" },
        { text: "None of you truly believes until he loves for his brother what he loves for himself.", source: "Sahih al-Bukhari 13" },
        { text: "God does not look at your forms and possessions but he looks at your hearts and your deeds.", source: "Sahih Muslim 2564" }
    ];
    const todayHadith = hadiths[new Date().getDay()];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Overview</h1>
                    <p className="text-gray-500">Welcome to Al-Iqra Modern Madrasa Admin Portal.</p>
                </div>

                <div className="flex items-center gap-2 bg-emerald-800 text-emerald-50 px-4 py-2 rounded-lg shadow-sm border border-emerald-900">
                    <span className="font-semibold">{format(new Date(), 'MMM dd, yyyy')}</span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-emerald-600 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-gray-500">Enrolled across all classes</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-600 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                        <Users className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTeachers}</div>
                        <p className="text-xs text-gray-500">Active faculty members</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
                        <IndianRupee className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalIncome.toFixed(2)}</div>
                        <p className="text-xs text-gray-500">Collected this month</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-600 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
                        <BookOpen className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalClasses}</div>
                        <p className="text-xs text-gray-500">Configured in system</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle>Attendance Last 7 Days</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center m-6 mt-0">
                        {totalRecorded === 1 && presentCount === 0 && absentCount === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <UserCheck className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                <p className="text-gray-500 text-sm">No attendance records found for the past week.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-end mb-2">
                                    <h4 className="text-3xl font-extrabold text-emerald-900">{presentRatio}%</h4>
                                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Overall Present</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold text-emerald-700 hover:text-emerald-800">Present ({presentCount})</span>
                                            <span className="text-gray-500">{presentRatio}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                                            <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${presentRatio}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold text-amber-600">Late ({lateCount})</span>
                                            <span className="text-gray-500">{lateRatio}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                                            <div className="bg-amber-400 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${lateRatio}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold text-red-600">Absent ({absentCount})</span>
                                            <span className="text-gray-500">{absentRatio}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                                            <div className="bg-red-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${absentRatio}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3 shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle>Recent Notices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {latestNotices.length > 0 ? latestNotices.map((notice) => (
                                <div key={notice.id} className="flex items-start gap-4">
                                    <div className="bg-amber-100 p-2 rounded-full text-amber-700">
                                        <BellRing className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{notice.title}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">{notice.content}</p>
                                        <p className="text-xs text-emerald-600 mt-1">{format(new Date(notice.date), 'MMM dd, yyyy')}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-sm text-gray-500 italic">No recent notices found.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Daily Hadith / Islamic Reminder Section */}
            <div className="w-full bg-emerald-900 rounded-xl p-6 text-emerald-50 relative overflow-hidden shadow-lg border border-emerald-800">
                <div className="absolute top-0 right-0 opacity-10">
                    <BookOpen className="w-48 h-48 -mt-8 -mr-8" />
                </div>
                <h3 className="text-emerald-300 font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Daily Hadith
                </h3>
                <p className="text-lg italic font-medium leading-relaxed max-w-4xl relative z-10 transition-opacity">
                    &quot;{todayHadith.text}&quot;
                </p>
                <p className="text-sm text-emerald-400 mt-2 relative z-10">— {todayHadith.source}</p>
            </div>

        </div>
    );
}
