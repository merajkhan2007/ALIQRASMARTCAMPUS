import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, ChevronRight, UserPlus } from "lucide-react";
import { db } from "@/lib/db";
import "../blog-content.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aliqra.edu.in";

// ─── Static Generation ────────────────────────────────────────────
export async function generateStaticParams() {
    try {
        const blogs = await db.blog.findMany({
            where: { published: true },
            select: { slug: true },
        });
        return blogs.map((blog) => ({ slug: blog.slug }));
    } catch {
        return [];
    }
}

// ─── Dynamic Metadata ─────────────────────────────────────────────
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    const blog = await db.blog.findUnique({
        where: { slug },
        select: { title: true, excerpt: true, image: true, createdAt: true },
    });

    if (!blog) {
        return { title: "Blog Post Not Found | Al-Iqra Modern Madrasa" };
    }

    const title = `${blog.title} | Al-Iqra Modern Madrasa Blog`;
    const description = blog.excerpt;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            publishedTime: blog.createdAt.toISOString(),
            images: blog.image ? [{ url: blog.image, width: 1200, height: 630 }] : [],
            siteName: "Al-Iqra Modern Madrasa",
        },
        alternates: {
            canonical: `${SITE_URL}/blog/${slug}`,
        },
    };
}

// ─── Page Component ───────────────────────────────────────────────
export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const blog = await db.blog.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            content: true,
            image: true,
            published: true,
            language: true,
            createdAt: true,
            updatedAt: true,
            authorId: true,
            author: {
                select: { name: true, avatar: true },
            },
        },
    });

    if (!blog || !blog.published) {
        notFound();
    }

    // Fetch recent posts for sidebar
    const recentPosts = await db.blog.findMany({
        where: { published: true, slug: { not: slug } },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { title: true, slug: true, createdAt: true },
    });

    const isUrdu = blog.language === "ur";

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.excerpt,
        image: blog.image || undefined,
        datePublished: blog.createdAt.toISOString(),
        dateModified: blog.updatedAt.toISOString(),
        inLanguage: blog.language || "en",
        author: {
            "@type": "Person",
            name: blog.author?.name || "Al-Iqra Madrasa",
        },
        publisher: {
            "@type": "Organization",
            name: "Al-Iqra Modern Madrasa",
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/blog/${slug}`,
        },
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: `${SITE_URL}/blog`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: blog.title,
                item: `${SITE_URL}/blog/${slug}`,
            },
        ],
    };

    return (
        <main>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {/* Hero Banner */}
            <section className="bg-brand-dark py-12 md:py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/slide1.jpg')] bg-cover bg-center opacity-10" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" className="mb-4">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-400">
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </li>
                            <li className="text-brand-gold truncate max-w-[200px]">
                                {blog.title}
                            </li>
                        </ol>
                    </nav>
                    <span className="inline-block bg-emerald-50/20 text-brand-gold font-semibold px-3 py-1 rounded-full text-xs tracking-wide mb-3">
                        {new Date(blog.createdAt).toLocaleDateString(isUrdu ? "ur" : "en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                    <h1
                        className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-4xl"
                        style={isUrdu ? { fontFamily: "var(--font-urdu)" } : undefined}
                    >
                        {blog.title}
                    </h1>
                </div>
            </section>

            {/* Content Area */}
            <section className="py-10 md:py-14 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-[minmax(0,720px)_320px] gap-8 lg:justify-center lg:gap-12">
                        {/* Main Article */}
                        <article
                            itemScope
                            itemType="https://schema.org/Article"
                            className="w-full min-w-0"
                            dir={isUrdu ? "rtl" : "ltr"}
                            data-language={blog.language || "en"}
                        >
                            {/* Featured Image */}
                            {blog.image && (
                                <div className="mb-8 rounded-2xl overflow-hidden shadow-md aspect-[3/1] max-h-80">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        itemProp="image"
                                    />
                                </div>
                            )}

                            {/* Article Meta */}
                            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 text-brand-gold" />
                                    <time
                                        dateTime={blog.createdAt.toISOString()}
                                        itemProp="datePublished"
                                    >
                                        {new Date(blog.createdAt).toLocaleDateString(
                                            "en-US",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )}
                                    </time>
                                </div>
                                {blog.author && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <User className="w-4 h-4 text-brand-gold" />
                                        <span
                                            itemProp="author"
                                            itemScope
                                            itemType="https://schema.org/Person"
                                        >
                                            <span itemProp="name">{blog.author.name}</span>
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Article Content (rendered as HTML) */}
                            <div
                                className="max-w-none break-words overflow-hidden"
                                itemProp="articleBody"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />

                            {/* Back Link */}
                            <div className="mt-10 pt-6 border-t border-gray-200">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-2 text-brand-green hover:text-brand-gold font-semibold transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to All Articles
                                </Link>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {/* Recent Posts */}
                            {recentPosts.length > 0 && (
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <h3 className="font-bold text-brand-dark mb-4 text-lg">
                                        Recent Articles
                                    </h3>
                                    <ul className="space-y-3">
                                        {recentPosts.map((post) => (
                                            <li key={post.slug}>
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="block group"
                                                >
                                                    <h4 className="text-sm font-semibold text-brand-dark group-hover:text-brand-green transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h4>
                                                    <time className="text-xs text-gray-500 mt-1 block">
                                                        {new Date(
                                                            post.createdAt
                                                        ).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </time>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="bg-brand-dark rounded-2xl p-6 text-center text-white">
                                <h3 className="font-bold text-lg mb-2">
                                    Interested in Admission?
                                </h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Learn more about our programs and how to enroll.
                                </p>
                                <Link
                                    href="/admission"
                                    className="inline-flex items-center justify-center gap-1.5 bg-brand-gold text-brand-dark font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-brand-gold/90 transition-colors group"
                                >
                                    New Admission
                                    <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}