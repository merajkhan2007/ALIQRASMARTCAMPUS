"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";

interface ClassData {
    id: string;
    name: string;
    section: string | null;
}

interface TeacherData {
    id: string;
    name: string;
}

interface CourseData {
    id: string;
    name: string;
    code: string;
    classId: string;
    teacherId: string | null;
}

interface Props {
    course: CourseData;
    classes: ClassData[];
    teachers: TeacherData[];
}

export function EditCourseClient({ course, classes, teachers }: Props) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const rawTeacherId = formData.get("teacherId");
        const teacherId = rawTeacherId === "unassigned" || !rawTeacherId ? null : rawTeacherId;

        try {
            const res = await fetch(`/api/admin/courses/${course.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.get("name"),
                    code: formData.get("code"),
                    classId: formData.get("classId"),
                    teacherId,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to update course");
            }

            toast.success("Course updated successfully!");
            setIsOpen(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="Edit Course"
            >
                <Pencil className="w-4 h-4" />
            </button>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Course</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Course Name</Label>
                        <Input id="edit-name" name="name" required defaultValue={course.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-code">Course Code</Label>
                        <Input id="edit-code" name="code" required defaultValue={course.code} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-classId">Target Class</Label>
                        <Select name="classId" required defaultValue={course.classId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.length === 0 ? (
                                    <SelectItem value="none" disabled>No classes available</SelectItem>
                                ) : (
                                    classes.map(c => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name} {c.section ? `- ${c.section}` : ''}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-teacherId">Assign Teacher (Optional)</Label>
                        <Select name="teacherId" defaultValue={course.teacherId || "unassigned"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Teacher" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unassigned">Leave Unassigned</SelectItem>
                                {teachers.map(t => (
                                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Course
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}