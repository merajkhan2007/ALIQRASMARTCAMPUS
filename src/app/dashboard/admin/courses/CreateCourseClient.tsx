"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, PlusCircle } from "lucide-react";

interface ClassData {
    id: string;
    name: string;
    section: string | null;
}

interface TeacherData {
    id: string;
    name: string;
}

export function CreateCourseClient({ classes, teachers }: { classes: ClassData[], teachers: TeacherData[] }) {
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
            const res = await fetch("/api/admin/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.get("name"),
                    code: formData.get("code"),
                    classId: formData.get("classId"),
                    teacherId: teacherId,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to create course");
            }

            toast.success("Course created successfully!");
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
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all font-semibold active:scale-95">
                    <PlusCircle className="w-5 h-5" />
                    New Course
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Course Name</Label>
                        <Input id="name" name="name" required placeholder="e.g. Mathematics" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="code">Course Code</Label>
                        <Input id="code" name="code" required placeholder="e.g. MATH-101" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="classId">Target Class</Label>
                        <Select name="classId" required>
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
                        <Label htmlFor="teacherId">Assign Teacher (Optional)</Label>
                        <Select name="teacherId" defaultValue="unassigned">
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
                            Create Course
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
