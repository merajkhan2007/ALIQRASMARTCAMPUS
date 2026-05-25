"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import {
    FileText,
    PlusCircle,
    Search,
    Loader2,
    Edit3,
    Trash2,
    Eye,
    EyeOff,
    RefreshCw,
} from "lucide-react";

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string | null;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    author: { name: string; role: string };
}

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/blogs");
            if (!res.ok) throw new Error("Failed to fetch blogs");
            const data = await res.json();
            setBlogs(data.blogs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;
        try {
            const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            fetchBlogs();
        } catch (err) {
            console.error(err);
        }
    };

    const togglePublish = async (blog: Blog) => {
        try {
            const res = await fetch("/api/blogs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: blog.id, published: !blog.published }),
            });
            if (!res.ok) throw new Error("Failed to toggle");
            fetchBlogs();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredBlogs = blogs.filter(
        (b) =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.excerpt.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <FileText className="w-8 h-8 text-emerald-600" />
                        Blog Management
                    </h1>
                    <p className="text-gray-500">
                        Create, edit, and manage blog posts
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {blogs.filter((b) => b.published).length} published
                        </span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchBlogs}
                        className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <Link
                        href="/dashboard/admin/blogs/new"
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all font-semibold active:scale-95"
                    >
                        <PlusCircle className="w-5 h-5" />
                        New Blog
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <FileText className="w-16 h-16 mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-gray-600">No blog posts found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {search ? "Try a different search term" : "Click 'New Blog' to create your first post"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-emerald-900/5 text-emerald-900 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Preview</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredBlogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{blog.title}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">/{blog.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600 line-clamp-2 max-w-sm italic">
                                                {blog.excerpt}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {blog.published ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    <Eye className="w-3 h-3" /> Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                    <EyeOff className="w-3 h-3" /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                                            {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => togglePublish(blog)}
                                                    title={blog.published ? "Unpublish" : "Publish"}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                >
                                                    {blog.published ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <Link
                                                    href={`/dashboard/admin/blogs/${blog.id}/edit`}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}