import { db } from "@/lib/db";
import BlogFormClient from "@/components/admin/BlogForm";

export default async function NewBlogPage() {
    const authors = await db.user.findMany({
        where: {
            role: { in: ["ADMIN", "SUPER_ADMIN", "TEACHER", "HAFIZ"] },
        },
        select: { id: true, name: true, role: true },
        orderBy: { name: "asc" },
    });

    return <BlogFormClient authors={authors} />;
}