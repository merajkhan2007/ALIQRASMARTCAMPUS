"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteStudent } from "@/app/dashboard/admin/students/actions";

export function DeleteStudentActionButton({ userId, disabled }: { userId: string; disabled?: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("Are you absolutely sure you want to permanently delete this student? All linked records (attendance, fees, exams) will also be deleted. This action cannot be undone.")) {
            return;
        }
        
        startTransition(async () => {
            const res = await deleteStudent(userId);
            if (res?.error) {
                alert(res.error);
            }
        });
    };

    return (
        <button
            onClick={handleDelete}
            disabled={disabled || isPending}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Permanently remove student"
        >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin text-red-500" /> : <Trash2 className="h-4 w-4" />}
        </button>
    );
}
