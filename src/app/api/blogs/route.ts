export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

// GET: Admin fetches all blogs, public fetches published ones
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const publishedOnly = searchParams.get("published") === "true";

        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        let userRole = "";
        if (token) {
            try {
                const { payload } = await jwtVerify(token, JWT_SECRET);
                userRole = payload.role as string;
            } catch { /* ignore invalid token */ }
        }

        const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

        const where: any = {};
        if (!isAdmin || publishedOnly) {
            where.published = true;
        }

        const blogs = await db.blog.findMany({
            where,
            include: {
                author: {
                    select: { name: true, role: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ blogs });
    } catch (error: any) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}

// POST: Admin creates a new blog
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let userId = "";
        let userRole = "";
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            userId = payload.id as string;
            userRole = payload.role as string;
        } catch {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { title, excerpt, content, image, published, authorId: customAuthorId, language } = body;

        if (!title || !excerpt || !content) {
            return NextResponse.json(
                { message: "Title, excerpt, and content are required" },
                { status: 400 }
            );
        }

        // Use custom authorId if provided, otherwise fall back to the logged-in user
        const authorId = customAuthorId || userId;

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const blog = await db.blog.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                image: image || null,
                published: published || false,
                authorId,
                language: language === "ur" ? "ur" : "en",
            },
            include: {
                author: {
                    select: { name: true, role: true },
                },
            },
        });

        return NextResponse.json(
            { message: "Blog created successfully", blog },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating blog:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}

// PATCH: Admin updates a blog
export async function PATCH(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let userRole = "";
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            userRole = payload.role as string;
        } catch {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { id, title, excerpt, content, image, published, authorId, language } = body;

        if (!id) {
            return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
        }

        const data: any = {};
        if (title !== undefined) {
            data.title = title;
            data.slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }
        if (excerpt !== undefined) data.excerpt = excerpt;
        if (content !== undefined) data.content = content;
        if (image !== undefined) data.image = image;
        if (published !== undefined) data.published = published;
        if (authorId !== undefined) data.authorId = authorId;
        if (language !== undefined) data.language = language === "ur" ? "ur" : "en";

        const blog = await db.blog.update({
            where: { id },
            data,
            include: {
                author: {
                    select: { name: true, role: true },
                },
            },
        });

        return NextResponse.json({ message: "Blog updated successfully", blog });
    } catch (error: any) {
        console.error("Error updating blog:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}

// DELETE: Admin deletes a blog
export async function DELETE(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let userRole = "";
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            userRole = payload.role as string;
        } catch {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
        }

        await db.blog.delete({ where: { id } });

        return NextResponse.json({ message: "Blog deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting blog:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}