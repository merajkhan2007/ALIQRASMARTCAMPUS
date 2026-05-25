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

interface TeacherData {
    id: string;
    name: string;
}

export function CreateClassClient({ teachers }: { teachers: TeacherData[] }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        
        const rawTeacherId = formData.get("classTeacherId");
        const teacherId = rawTeacherId === "unassigned" || !rawTeacherId ? null : rawTeacherId;

        try {
            const res = await fetch("/api/admin/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.get("name"),
                    section: formData.get("section") || null,
                    capacity: parseInt(formData.get("capacity") as string, 10),
                    classTeacherId: teacherId,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to create class");
            }

            toast.success("Class created successfully!");
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
                    New Class
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Class</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Class Name / Grade</Label>
                        <Input id="name" name="name" required placeholder="e.g. Grade 1" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="section">Section (Optional)</Label>
                        <Input id="section" name="section" placeholder="e.g. A" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="capacity">Student Capacity</Label>
                        <Input id="capacity" name="capacity" type="number" required min="1" max="1000" defaultValue="30" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="classTeacherId">Assign Class Teacher (Optional)</Label>
                        <Select name="classTeacherId" defaultValue="unassigned">
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
                            Create Class
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
