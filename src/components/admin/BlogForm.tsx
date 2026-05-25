"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImageIcon, Upload, CheckCircle, Loader2 } from "lucide-react";
import RichTextEditor from "@/components/ui/rich-text-editor";

interface BlogData {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string | null;
    published: boolean;
    language?: string;
    createdAt: string;
    updatedAt: string;
    author: { name: string; role: string; id?: string };
}

interface AuthorOption {
    id: string;
    name: string;
    role: string;
}

interface BlogFormClientProps {
    blog?: BlogData;
    authors: AuthorOption[];
}

export default function BlogFormClient({ blog, authors }: BlogFormClientProps) {
    const router = useRouter();
    const isEditing = !!blog;

    const [title, setTitle] = useState(blog?.title ?? "");
    const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
    const [content, setContent] = useState(blog?.content ?? "");
    const [image, setImage] = useState(blog?.image ?? "");
    const [published, setPublished] = useState(blog?.published ?? false);
    const [authorId, setAuthorId] = useState(blog?.author?.id ?? (authors.length > 0 ? authors[0].id : ""));
    const [language, setLanguage] = useState<"en" | "ur">(blog?.language === "ur" ? "ur" : "en");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const method = isEditing ? "PATCH" : "POST";
            const body: Record<string, unknown> = {
                title,
                excerpt,
                content,
                image: image || null,
                published,
                authorId: authorId || undefined,
                language,
            };
            if (isEditing) body.id = blog!.id;

            const res = await fetch("/api/blogs", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to save blog");
            }

            router.push("/dashboard/admin/blogs");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Breadcrumb & Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <nav className="mb-1 text-sm text-gray-400">
                        <Link href="/dashboard/admin/blogs" className="hover:text-emerald-600 transition-colors">
                            Blog Management
                        </Link>
                        <span className="mx-1.5">/</span>
                        <span className="text-emerald-700 font-medium">
                            {isEditing ? `Edit: ${blog!.title}` : "New Blog Post"}
                        </span>
                    </nav>
                    <h1 className="text-2xl font-bold tracking-tight text-emerald-950">
                        {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
                    </h1>
                </div>
                <Link
                    href="/dashboard/admin/blogs"
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-emerald-700 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg shadow-sm transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blogs
                </Link>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            dir={language === "ur" ? "rtl" : "ltr"}
                            placeholder={language === "ur" ? "بلاگ کا عنوان درج کریں" : "Enter blog title"}
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                            style={language === "ur" ? { fontFamily: "var(--font-urdu)", fontSize: "1.125rem" } : undefined}
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Excerpt <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            required
                            rows={3}
                            dir={language === "ur" ? "rtl" : "ltr"}
                            placeholder={language === "ur" ? "بلاگ کا مختصر خلاصہ" : "Brief summary of the blog post"}
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none transition-shadow"
                            style={language === "ur" ? { fontFamily: "var(--font-urdu)", fontSize: "1.125rem" } : undefined}
                        />
                    </div>

                    {/* Language */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Language
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                <input
                                    type="radio"
                                    name="language"
                                    value="en"
                                    checked={language === "en"}
                                    onChange={() => setLanguage("en")}
                                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                />
                                🇬🇧 English
                            </label>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                <input
                                    type="radio"
                                    name="language"
                                    value="ur"
                                    checked={language === "ur"}
                                    onChange={() => setLanguage("ur")}
                                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                />
                                🇵🇰 اردو (Urdu)
                            </label>
                        </div>
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Author <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={authorId}
                            onChange={(e) => setAuthorId(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white"
                        >
                            <option value="" disabled>
                                Select an author
                            </option>
                            {authors.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name} ({a.role.replace("_", " ")})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rich Text Content */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                            direction={language === "ur" ? "rtl" : "ltr"}
                            placeholder={language === "ur" ? "اپنا بلاگ مواد یہاں لکھیں..." : "Write your blog content here..."}
                            rows={16}
                        />
                    </div>

                    {/* Featured Image */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            <ImageIcon className="w-4 h-4 inline mr-1" />
                            Featured Image
                        </label>

                        {/* File Upload */}
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                Upload an image
                            </label>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors">
                                    <Upload className="w-4 h-4" />
                                    Choose Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            setUploading(true);
                                            setUploadSuccess(false);
                                            setError("");

                                            try {
                                                const formData = new FormData();
                                                formData.append("image", file);

                                                const res = await fetch("/api/blogs/upload", {
                                                    method: "POST",
                                                    body: formData,
                                                });

                                                if (!res.ok) {
                                                    const data = await res.json();
                                                    throw new Error(data.message || "Upload failed");
                                                }

                                                const data = await res.json();
                                                setImage(data.url);
                                                setUploadSuccess(true);
                                                setTimeout(() => setUploadSuccess(false), 3000);
                                            } catch (err: unknown) {
                                                setError(
                                                    err instanceof Error
                                                        ? err.message
                                                        : "Failed to upload image"
                                                );
                                            } finally {
                                                setUploading(false);
                                            }
                                        }}
                                    />
                                </label>
                                {uploading && (
                                    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Uploading...
                                    </span>
                                )}
                                {uploadSuccess && (
                                    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
                                        <CheckCircle className="w-4 h-4" />
                                        Uploaded successfully
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* URL Input (fallback) */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                Or paste an image URL
                            </label>
                            <input
                                type="url"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                            />
                            {image && (
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="mt-2 h-40 w-full object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Published Toggle */}
                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={published}
                                onChange={(e) => setPublished(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                        <span className="text-sm font-medium text-gray-700">
                            {published ? "Published" : "Draft"}
                        </span>
                        <span className="text-xs text-gray-400">
                            {published ? "Visible on the website" : "Only visible in admin"}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <Link
                            href="/dashboard/admin/blogs"
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEditing ? "Update Blog" : "Create Blog"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}