import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { IslamicStar } from "@/components/sections/IslamicIcons";
import { db } from "@/lib/db";

async function getBlogs() {
    try {
        const blogs = await db.blog.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
            take: 3,
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                image: true,
                language: true,
                createdAt: true,
            },
        });
        return blogs;
    } catch {
        return [];
    }
}

export async function Blog() {
    const posts = await getBlogs();

    if (posts.length === 0) return null;

    return (
        <section id="news" className="py-8 md:py-10 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-7 max-w-2xl mx-auto">
                    <span className="inline-block bg-emerald-50 text-brand-green font-semibold px-3 py-1 rounded-full text-xs tracking-wide mb-3">
                        Latest Updates
                    </span>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <IslamicStar className="w-5 h-5 text-brand-gold" />
                        <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark leading-tight">
                            News & Articles
                        </h2>
                        <IslamicStar className="w-5 h-5 text-brand-gold" />
                    </div>
                    <p className="text-gray-500 text-sm">
                        Insights, tips, and updates from our madrasa community.
                    </p>
                </div>

                {/* Blog cards */}
                <div className="grid md:grid-cols-3 gap-4">
                    {posts.map((post) => {
                        const isUrdu = post.language === "ur";
                        return (
                        <article key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col" dir={isUrdu ? "rtl" : "ltr"}>
                            <div
                                className="h-36 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105 bg-gray-200"
                                style={{ backgroundImage: post.image ? `url(${post.image})` : undefined }}
                            ></div>

                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                                    <Calendar className="w-3 h-3 text-brand-gold" />
                                    {new Date(post.createdAt).toLocaleDateString(isUrdu ? "ur" : "en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>

                                <h3
                                    className="font-bold text-brand-dark mb-2 leading-snug text-sm group-hover:text-brand-green transition-colors line-clamp-2"
                                    style={isUrdu ? { fontFamily: "var(--font-urdu)", fontSize: "1rem" } : undefined}
                                >
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h3>

                                <p
                                    className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed flex-1"
                                    style={isUrdu ? { fontFamily: "var(--font-urdu)" } : undefined}
                                >
                                    {post.excerpt}
                                </p>

                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green hover:text-brand-gold transition-colors mt-auto"
                                >
                                    {isUrdu ? "مزید پڑھیں" : "Read Article"} <ArrowRight className={`w-3 h-3 ${isUrdu ? "rotate-180" : ""}`} />
                                </Link>
                            </div>
                        </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
