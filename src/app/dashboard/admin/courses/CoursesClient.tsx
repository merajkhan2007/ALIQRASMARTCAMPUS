"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, AlertCircle, Search, User as UserIcon, Trash2, LayoutGrid, List, XCircle } from "lucide-react";
import { CreateCourseClient } from "./CreateCourseClient";
import { EditCourseClient } from "./EditCourseClient";
import { toast } from "sonner";

interface Course {
    id: string;
    name: string;
    code: string;
    classId: string;
    teacherId: string | null;
    class: { id: string; name: string; section: string | null };
    teacher: { id: string; user: { name: string } } | null;
}

interface ClassData {
    id: string;
    name: string;
    section: string | null;
}

interface TeacherData {
    id: string;
    name: string;
}

interface Props {
    courses: Course[];
    classes: ClassData[];
    teachers: TeacherData[];
}

export default function CoursesClient({ courses: initialCourses, classes, teachers }: Props) {
    const router = useRouter();
    const [courses, setCourses] = useState(initialCourses);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const filteredCourses = useMemo(() => {
        if (!search.trim()) return courses;
        const q = search.toLowerCase();
        return courses.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q) ||
            c.class.name.toLowerCase().includes(q) ||
            (c.teacher?.user.name || "").toLowerCase().includes(q)
        );
    }, [courses, search]);

    const totalCourses = courses.length;
    const unassignedCourses = courses.filter(c => !c.teacherId).length;

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to delete course");
            }
            setCourses(prev => prev.filter(c => c.id !== id));
            toast.success("Course deleted successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setDeletingId(null);
            setDeleteConfirmId(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-emerald-600" />
                        Courses Manager
                    </h1>
                    <p className="text-gray-500">Manage academic subjects, course codes, and assign teachers.</p>
                </div>
                <CreateCourseClient classes={classes} teachers={teachers} />
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border rounded-xl p-5 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 font-medium mb-1">
                        <BookOpen className="w-4 h-4" /> Total Courses
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{totalCourses}</span>
                </div>
                <div className="bg-white border rounded-xl p-5 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center gap-2 text-amber-500 font-medium mb-1">
                        <AlertCircle className="w-4 h-4" /> Unassigned
                    </div>
                    <span className="text-3xl font-bold text-gray-900">
                        {unassignedCourses}
                        {unassignedCourses > 0 && <span className="text-sm font-normal text-amber-600 ml-2">Needs attention</span>}
                    </span>
                </div>
                <div className="bg-white border rounded-xl p-5 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center gap-2 text-blue-500 font-medium mb-1">
                        <UserIcon className="w-4 h-4" /> Available Teachers
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{teachers.length}</span>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses, teacher, or class..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <XCircle className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-md transition ${viewMode === "grid" ? "bg-white shadow text-emerald-700" : "text-gray-500 hover:text-gray-700"}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`p-2 rounded-md transition ${viewMode === "table" ? "bg-white shadow text-emerald-700" : "text-gray-500 hover:text-gray-700"}`}
                            title="Table View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Results count */}
                {search && (
                    <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 text-sm text-emerald-800">
                        Showing {filteredCourses.length} of {courses.length} courses matching <strong>"{search}"</strong>
                    </div>
                )}

                {/* Grid View */}
                {viewMode === "grid" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y divide-gray-100 md:divide-y-0 md:divide-x border-b">
                        {filteredCourses.map((course) => {
                            const isUnassigned = !course.teacherId;
                            const isDeleteConfirmOpen = deleteConfirmId === course.id;

                            return (
                                <div key={course.id} className="p-6 hover:bg-emerald-50/30 transition-colors relative group">
                                    {isUnassigned && (
                                        <div className="absolute top-0 right-0 w-2 h-full bg-amber-400 rounded-r" />
                                    )}
                                    {/* Actions overlay */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <EditCourseClient
                                            course={{
                                                id: course.id,
                                                name: course.name,
                                                code: course.code,
                                                classId: course.classId,
                                                teacherId: course.teacherId,
                                            }}
                                            classes={classes}
                                            teachers={teachers}
                                        />
                                        {isDeleteConfirmOpen ? (
                                            <div className="flex items-center gap-1 bg-white rounded-lg shadow-md p-1">
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    disabled={deletingId === course.id}
                                                    className="px-2 py-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded"
                                                >
                                                    {deletingId === course.id ? "..." : "Yes"}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(null)}
                                                    className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(course.id); }}
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                title="Delete Course"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-start mb-4 pr-16">
                                        <div>
                                            <h3 className="text-xl font-bold text-emerald-950">{course.name}</h3>
                                            <p className="text-xs font-mono px-2 py-1 bg-gray-100 text-gray-800 rounded-md inline-block mt-2">
                                                {course.code}
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                                            {course.class.name} {course.class.section ? `- ${course.class.section}` : ''}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-6">
                                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                                            <span className="text-gray-500">Teacher</span>
                                            <span className="font-semibold text-gray-900 truncate pl-4 max-w-[140px]">
                                                {course.teacher ? course.teacher.user.name : (
                                                    <span className="text-amber-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" /> Unassigned
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredCourses.length === 0 && (
                            <div className="col-span-full py-16 text-center text-gray-500">
                                <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <p className="font-semibold text-gray-900 text-lg">
                                    {search ? "No courses match your search" : "No courses configured"}
                                </p>
                                <p className="text-sm mt-1">
                                    {search ? "Try adjusting your search terms." : "Create your first course to assign it to a class and teacher."}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Table View */}
                {viewMode === "table" && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left p-4 font-semibold text-gray-600">Course Name</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Code</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Class</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Teacher</th>
                                    <th className="text-right p-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map((course) => {
                                    const isUnassigned = !course.teacherId;
                                    const isDeleteConfirmOpen = deleteConfirmId === course.id;

                                    return (
                                        <tr key={course.id} className="border-b border-gray-100 hover:bg-emerald-50/30 transition-colors">
                                            <td className="p-4">
                                                <span className="font-semibold text-gray-900">{course.name}</span>
                                            </td>
                                            <td className="p-4">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{course.code}</code>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                                    {course.class.name} {course.class.section ? `- ${course.class.section}` : ''}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {course.teacher ? (
                                                    <span className="text-gray-900">{course.teacher.user.name}</span>
                                                ) : (
                                                    <span className="text-amber-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" /> Unassigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <EditCourseClient
                                                        course={{
                                                            id: course.id,
                                                            name: course.name,
                                                            code: course.code,
                                                            classId: course.classId,
                                                            teacherId: course.teacherId,
                                                        }}
                                                        classes={classes}
                                                        teachers={teachers}
                                                    />
                                                    {isDeleteConfirmOpen ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleDelete(course.id)}
                                                                disabled={deletingId === course.id}
                                                                className="px-2 py-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded"
                                                            >
                                                                {deletingId === course.id ? "..." : "Yes"}
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirmId(null)}
                                                                className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeleteConfirmId(course.id)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                            title="Delete Course"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredCourses.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center text-gray-500">
                                            <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                            <p className="font-semibold text-gray-900 text-lg">
                                                {search ? "No courses match your search" : "No courses configured"}
                                            </p>
                                            <p className="text-sm mt-1">
                                                {search ? "Try adjusting your search terms." : "Create your first course to assign it to a class and teacher."}
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}