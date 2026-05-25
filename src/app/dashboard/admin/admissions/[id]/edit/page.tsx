import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import EditAdmissionForm from "./EditAdmissionForm";

export default async function EditAdmissionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const admission = await db.admission.findUnique({
        where: { id }
    });

    if (!admission) {
        notFound();
    }

    return <EditAdmissionForm admission={admission} />;
}
