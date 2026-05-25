import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Book, Calendar, CreditCard, Award, Clock, ChevronRight, Bell, Activity, TrendingUp, Sparkles, AlertCircle, CheckCircle2, FileText, PlusCircle } from "lucide-react";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Link from "next/link";
import { redirect } from "next/navigation";


const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

export default async function StudentDashboard() {
    // 1. Authenticate and get user
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

    // 2. Fetch Student Data
    const student = await db.student.findUnique({
        where: { userId },
        include: {
            user: true,
            class: true,
            attendances: {
                where: {
                    date: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // This month
                    }
                }
            },
            islamicProgress: true,
            results: {
                orderBy: {
                    exam: { date: 'desc' }
                },
                take: 1,
                include: {
                    exam: { include: { subject: true } }
                }
            },
            fees: {
                where: { status: { in: ['PENDING', 'OVERDUE', 'PARTIAL'] } }
            }
        }
    });

    if (!student) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-red-600">Student Profile Not Found</h2>
                <p className="text-gray-500 mt-2">Please contact the administrator to link your account to a student profile.</p>
            </div>
        );
    }

    // 3. Process Data for UI

    // Attendance Calculation (Current Month)
    const totalDays = student.attendances.length;
    const presentDays = student.attendances.filter(a => a.status === 'PRESENT').length;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    // Fees Calculation
    const totalPendingFees = student.fees.reduce((sum, fee) => sum + fee.amount, 0);
    const nextDueFee = student.fees.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];
    const daysUntilDue = nextDueFee ? Math.ceil((nextDueFee.dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null;

    // Latest Result
    const latestResult = student.results[0];

    // Islamic Progress
    const islamData = student.islamicProgress || {
        surah: "Not Started",
        juz: 0,
        tajweedGrade: "N/A",
        dailyHadith: false
    };

    // Calculate dummy juz percentage based on juz number (just for visuals)
    const juzPercentage = Math.min(Math.round(((islamData.juz || 0) / 30) * 100), 100);
    const circleDashOffset = 251.2 - (251.2 * juzPercentage) / 100;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section with Glassmorphism & Gradients */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 p-8 text-white shadow-2xl">
                <div className="absolute -right-10 -top-24 opacity-20 transition-transform duration-700 hover:rotate-12 hover:scale-110 pointer-events-none">
                    <Book className="h-64 w-64" />
                </div>
                <div className="absolute -left-10 -bottom-10 opacity-10 pointer-events-none">
                    <Sparkles className="h-40 w-40" />
                </div>

                <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-md border border-white/20 mb-4 transition-all hover:bg-white/30">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-pulse"></span>
                            {student.class ? student.class.name : 'Unassigned Class'}
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-2 drop-shadow-md">
                            Welcome back, <span className="text-emerald-200">{student.user.name.split(' ')[0]}</span>
                        </h1>
                        <p className="max-w-xl text-emerald-100/90 text-lg">
                            &quot;Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise.&quot;
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards */}
                <Card className="group overflow-hidden rounded-2xl border-none bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
                        <CardTitle className="text-sm font-medium text-emerald-900/70 dark:text-emerald-100/70">Attendance (Month)</CardTitle>
                        <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 transition-transform duration-300 group-hover:scale-110 dark:bg-emerald-900/30">
                            <UserCheck className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="z-10 relative">
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{attendancePercentage}%</div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{presentDays} Present / {totalDays} Total</p>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-zinc-800">
                            <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${attendancePercentage}%` }} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="group overflow-hidden rounded-2xl border-none bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
                        <CardTitle className="text-sm font-medium text-amber-900/70 dark:text-amber-100/70">Library Books</CardTitle>
                        <div className="rounded-full bg-amber-100 p-2 text-amber-600 transition-transform duration-300 group-hover:scale-110 dark:bg-amber-900/30">
                            <Book className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="z-10 relative">
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">0</div>
                        <p className="mt-1 text-xs text-amber-600 flex items-center gap-1 font-medium">
                            <AlertCircle className="h-3 w-3" /> No pending returns
                        </p>
                    </CardContent>
                </Card>

                <Card className="group overflow-hidden rounded-2xl border-none bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
                        <CardTitle className="text-sm font-medium text-blue-900/70 dark:text-blue-100/70">Latest Exam</CardTitle>
                        <div className="rounded-full bg-blue-100 p-2 text-blue-600 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-900/30">
                            <Calendar className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="z-10 relative">
                        {latestResult ? (
                            <>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{latestResult.obtainedMarks} / {latestResult.exam.maxMarks}</div>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{latestResult.exam.title} ({latestResult.exam.subject.name})</p>
                            </>
                        ) : (
                            <>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">N/A</div>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">No exams recorded yet</p>
                            </>
                        )}

                    </CardContent>
                </Card>

                <Card className="group overflow-hidden rounded-2xl border-none bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
                        <CardTitle className="text-sm font-medium text-red-900/70 dark:text-red-100/70">Pending Fees</CardTitle>
                        <div className="rounded-full bg-red-100 p-2 text-red-600 transition-transform duration-300 group-hover:scale-110 dark:bg-red-900/30">
                            <CreditCard className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="z-10 relative">
                        <div className="text-2xl font-bold text-red-600">${totalPendingFees.toFixed(2)}</div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {daysUntilDue !== null
                                ? (daysUntilDue < 0 ? `Overdue by ${Math.abs(daysUntilDue)} days` : `Due in ${daysUntilDue} days`)
                                : "All clear!"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Islamic Journey Section */}
                <Card className="col-span-1 lg:col-span-2 overflow-hidden rounded-2xl border-none shadow-md bg-white dark:bg-zinc-900 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                            <Award className="h-5 w-5 text-amber-500" />
                            Islamic Journey & Hifz
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            {/* Circular Progress */}
                            <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/20 shadow-inner">
                                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                    <circle className="text-emerald-100 dark:text-zinc-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                    <circle className="text-emerald-500 drop-shadow-md transition-all duration-1000 ease-out" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={circleDashOffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                </svg>
                                <div className="absolute flex flex-col items-center justify-center text-center">
                                    <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Juz {islamData.juz || 0}</span>
                                    <span className="text-xs text-emerald-600/70 dark:text-emerald-500/70">{juzPercentage}% Done</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 w-full">
                                <div className="rounded-xl bg-emerald-50/50 p-4 border border-emerald-100 dark:bg-zinc-800/50 dark:border-zinc-700">
                                    <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">Current Surah: {islamData.surah || "Not Started"}</h4>
                                    <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 mt-1">Keep up the dedicated memorization routine.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1 rounded-xl bg-amber-50 p-3 text-center border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30">
                                        <div className="text-sm font-medium text-amber-800 dark:text-amber-500">Tajweed</div>
                                        <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{islamData.tajweedGrade || "-"}</div>
                                    </div>
                                    <div className="flex-1 rounded-xl bg-blue-50 p-3 text-center border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30">
                                        <div className="text-sm font-medium text-blue-800 dark:text-blue-500">Daily Hadith</div>
                                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{islamData.dailyHadith ? "Yes" : "No"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Today's Schedule (Static Placeholder) */}
                <Card className="col-span-1 rounded-2xl border-none shadow-md bg-white dark:bg-zinc-900">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-emerald-500" />
                            Today&apos;s Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="relative border-l-2 border-emerald-100 dark:border-emerald-900/30 ml-3 space-y-6 pl-5">
                            <div className="relative">
                                <span className="absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white dark:ring-zinc-900"></span>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">09:00 AM</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mathematics (Room 204)</p>
                            </div>

                            <div className="relative">
                                <span className="absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-200 ring-4 ring-white dark:ring-zinc-900"></span>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">10:30 AM</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Arabic Language (Room 102)</p>
                            </div>

                            <div className="relative">
                                <span className="absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-700 ring-4 ring-white dark:ring-zinc-900"></span>
                                <h4 className="font-semibold text-gray-500 dark:text-gray-400">01:00 PM</h4>
                                <p className="text-sm text-gray-400 mt-1">Science Lab</p>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/40">
                            Full Timetable <ChevronRight className="h-4 w-4" />
                        </button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions & Announcements */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="rounded-2xl border-none shadow-md bg-white dark:bg-zinc-900">
                    <CardHeader>
                        <CardTitle className="text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-emerald-500" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Profile Verified</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Your student account has been updated.</p>
                                <span className="text-[10px] text-gray-400 mt-1 block">Recently</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <div className="rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/30">
                                <Bell className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Welcome to Portal</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Explore your new dashboard features.</p>
                                <span className="text-[10px] text-gray-400 mt-1 block">Recently</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 grid-cols-2">
                    <Link href="/admission" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-center text-center cursor-pointer">
                        <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
                        <PlusCircle className="mb-3 h-8 w-8 opacity-80" />
                        <h4 className="font-semibold">New Enrollment</h4>
                        <p className="text-xs text-indigo-100 mt-1 opacity-80">Apply for a sibling</p>
                    </Link>
                    <Link href="/dashboard/student/results" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-6 text-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-center text-center cursor-pointer">
                        <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
                        <FileText className="mb-3 h-8 w-8 opacity-80" />
                        <h4 className="font-semibold">Results</h4>
                        <p className="text-xs text-rose-100 mt-1 opacity-80">View all report cards</p>
                    </Link>
                    <Link href="/dashboard/student/library" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-6 text-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-center text-center cursor-pointer col-span-2">
                        <div className="absolute inset-0 flex items-center justify-end pr-8">
                            <ChevronRight className="h-10 w-10 opacity-20 transition-transform group-hover:translate-x-2" />
                        </div>
                        <div className="relative z-10 w-full flex items-center justify-between text-left">
                            <div>
                                <h4 className="font-bold text-lg">Library Portal</h4>
                                <p className="text-sm text-emerald-100 mt-1">Browse, borrow, and read books online.</p>
                            </div>
                            <Book className="h-8 w-8 opacity-80 mr-4" />
                        </div>
                    </Link>
                </div>
            </div>

        </div>
    );
}
