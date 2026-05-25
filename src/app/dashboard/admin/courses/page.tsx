import { db } from "@/lib/db";
import CoursesClient from "./CoursesClient";

export const dynamic = "force-dynamic";

export default async function CoursesManagementPage() {
    const courses = await db.subject.findMany({
        include: {
            class: true,
            teacher: {
                include: {
                    user: true
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    const [classes, teachers] = await Promise.all([
        db.class.findMany({ orderBy: { name: 'asc' } }),
        db.teacher.findMany({ include: { user: true }, orderBy: { user: { name: 'asc' } } })
    ]);

    const transformedClasses = classes.map(c => ({
        id: c.id,
        name: c.name,
        section: c.section
    }));

    const transformedTeachers = teachers.map(t => ({
        id: t.id,
        name: t.user.name
    }));

    return <CoursesClient courses={courses} classes={transformedClasses} teachers={transformedTeachers} />;
}
