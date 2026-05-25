import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { IslamicStar } from "@/components/sections/IslamicIcons";
import { db } from "@/lib/db";

export const metadata: Metadata = {
    title: "Blog & Articles | Al-Iqra Modern Madrasa",
    description:
        "Read the latest news, articles, and insights from Al-Iqra Modern Madrasa. Stay updated with our community events, Islamic education tips, and more.",
    openGraph: {
        title: "Blog & Articles | Al-Iqra Modern Madrasa",
        description:
            "Read the latest news, articles, and insights from Al-Iqra Modern Madrasa. Stay updated with our community events, Islamic education tips, and more.",
        type: "website",
        siteName: "Al-Iqra Modern Madrasa",
    },
};

async function getPublishedBlogs() {
    try {
        const blogs = await db.blog.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                image: true,
                language: true,
                createdAt: true,
                author: {
                    select: { name: true },
                },
            },
        });
        return blogs;
    } catch {
        return [];
    }
}

export default async function BlogListingPage() {
    const blogs = await getPublishedBlogs();

    return (
        <main>
            {/* Hero Banner */}
            <section className="bg-brand-dark py-16 md:py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/slide1.jpg')] bg-cover bg-center opacity-15" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-block bg-emerald-50/20 text-brand-gold font-semibold px-3 py-1 rounded-full text-xs tracking-wide mb-4">
                        News & Articles
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Our Blog
                    </h1>
                    <p className="text-gray-300 max-w-xl mx-auto text-base">
                        Insights, tips, and updates from our madrasa community.
                    </p>
                </div>
            </section>

            {/* Breadcrumb JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            {
                                "@type": "ListItem",
                                position: 1,
                                name: "Home",
                                item: process.env.NEXT_PUBLIC_SITE_URL || "https://aliqra.edu.in",
                            },
                            {
                                "@type": "ListItem",
                                position: 2,
                                name: "Blog",
                                item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://aliqra.edu.in"}/blog`,
                            },
                        ],
                    }),
                }}
            />

            {/* Blog Grid */}
            <section className="py-14 md:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {blogs.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No articles published yet. Check back soon!</p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 mt-6 text-brand-green hover:text-brand-gold font-semibold transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Home
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blogs.map((blog) => {
                                const isUrdu = blog.language === "ur";
                                return (
                                <article
                                    key={blog.id}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col"
                                    itemScope
                                    itemType="https://schema.org/BlogPosting"
                                    dir={isUrdu ? "rtl" : "ltr"}
                                >
                                    <Link
                                        href={`/blog/${blog.slug}`}
                                        className="block h-48 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105 bg-gray-200"
                                        style={{
                                            backgroundImage: blog.image
                                                ? `url(${blog.image})`
                                                : undefined,
                                        }}
                                        aria-label={`Read ${blog.title}`}
                                    />
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                                            <Calendar className="w-3 h-3 text-brand-gold" />
                                            <time
                                                dateTime={new Date(blog.createdAt).toISOString()}
                                                itemProp="datePublished"
                                            >
                                                {new Date(blog.createdAt).toLocaleDateString(
                                                    isUrdu ? "ur" : "en-US",
                                                    {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    }
                                                )}
                                            </time>
                                        </div>
                                        <h2
                                            className="font-bold text-brand-dark mb-2 leading-snug text-base group-hover:text-brand-green transition-colors line-clamp-2"
                                            style={isUrdu ? { fontFamily: "var(--font-urdu)", fontSize: "1.1rem" } : undefined}
                                        >
                                            <Link href={`/blog/${blog.slug}`} itemProp="url">
                                                <span itemProp="headline">{blog.title}</span>
                                            </Link>
                                        </h2>
                                        <p
                                            className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed flex-1"
                                            itemProp="description"
                                            style={isUrdu ? { fontFamily: "var(--font-urdu)" } : undefined}
                                        >
                                            {blog.excerpt}
                                        </p>
                                        {blog.author && (
                                            <p className="text-xs text-gray-400 mb-3">
                                                {isUrdu ? "از: " : "By "}
                                                <span itemProp="author" itemScope itemType="https://schema.org/Person">
                                                    <span itemProp="name">{blog.author.name}</span>
                                                </span>
                                            </p>
                                        )}
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-green hover:text-brand-gold transition-colors mt-auto"
                                        >
                                            {isUrdu ? "مزید پڑھیں" : "Read Article"} <ArrowRight className={`w-3.5 h-3.5 ${isUrdu ? "rotate-180" : ""}`} />
                                        </Link>
                                    </div>
                                </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}