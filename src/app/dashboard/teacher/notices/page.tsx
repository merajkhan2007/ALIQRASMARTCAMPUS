import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { NoticesClient } from "./NoticesClient";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

export default async function TeacherNoticesPage() {
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
            classes: true,
            subjects: {
                include: {
                    class: true
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

    // Get all unique classes this teacher interacts with
    const classMap = new Map();
    teacher.classes.forEach(c => classMap.set(c.id, { id: c.id, name: c.name }));
    teacher.subjects.forEach(s => classMap.set(s.class.id, { id: s.class.id, name: s.class.name }));
    const myClasses = Array.from(classMap.values());
    const myClassIds = myClasses.map(c => c.id);

    // Fetch notices:
    // 1. Target roles includes TEACHER or ALL
    // 2. Or author is this user
    // 3. Or targeted to one of their classes
    const notices = await db.notice.findMany({
        where: {
            OR: [
                { targetRoles: { contains: "TEACHER" } },
                { targetRoles: { contains: "ALL" } },
                { authorId: userId },
                { classId: { in: myClassIds } }
            ]
        },
        include: {
            author: {
                select: {
                    name: true,
                    role: true
                }
            },
            class: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            date: 'desc'
        },
        take: 50 // Limit to recent 50
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Notices & Announcements</h1>
                <p className="text-gray-500">Stay updated and communicate with your classes.</p>
            </div>

            <NoticesClient classes={myClasses} initialNotices={notices} />
        </div>
    );
}
