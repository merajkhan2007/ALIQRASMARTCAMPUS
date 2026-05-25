"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/app/dashboard/admin/users/actions";

export function DeleteUserButton({ userId, disabled }: { userId: string, disabled: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("Are you absolutely sure you want to permanently delete this user? This action cannot be undone and will delete linked data.")) {
            return;
        }
        
        startTransition(async () => {
            const res = await deleteUser(userId);
            if (res?.error) {
                alert(res.error);
            }
        });
    };

    return (
        <Button 
            variant="outline" 
            size="sm" 
            disabled={disabled || isPending}
            onClick={handleDelete}
            className="h-8 shadow-sm hover:bg-red-50 hover:text-red-600 border-gray-200"
            title={disabled ? "Root administrators cannot be deleted." : "Permanently delete user"}
        >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Trash2 className="w-3.5 h-3.5 mr-1" />}
            {isPending ? "..." : "Delete"}
        </Button>
    );
}
