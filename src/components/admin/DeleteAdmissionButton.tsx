"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteAdmission } from "@/app/dashboard/admin/admissions/actions";
import { useRouter } from "next/navigation";

export function DeleteAdmissionButton({ admissionId, studentName }: { admissionId: string, studentName: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete the admission application for ${studentName}? This action cannot be undone.`)) return;

        setIsDeleting(true);
        const res = await deleteAdmission(admissionId);
        setIsDeleting(false);

        if (res.error) {
            alert(res.error);
        } else {
            router.refresh();
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 bg-white text-red-600 hover:bg-red-50 border border-red-200 rounded-lg shadow-sm transition-all disabled:opacity-50"
            title="Delete Application"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    );
}
