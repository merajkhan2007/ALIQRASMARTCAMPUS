import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import BlogFormClient from "@/components/admin/BlogForm";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [blog, authors] = await Promise.all([
        db.blog.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, role: true },
                },
            },
        }),
        db.user.findMany({
            where: {
                role: { in: ["ADMIN", "SUPER_ADMIN", "TEACHER", "HAFIZ"] },
            },
            select: { id: true, name: true, role: true },
            orderBy: { name: "asc" },
        }),
    ]);

    if (!blog) {
        notFound();
    }

    const blogData = {
        ...blog,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
    };

    return <BlogFormClient blog={blogData} authors={authors} />;
}