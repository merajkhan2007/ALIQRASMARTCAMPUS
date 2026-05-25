import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <Card className="max-w-md w-full shadow-lg border-red-100">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-red-100 p-3 text-red-600">
                            <ShieldAlert className="h-10 w-10" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Access Denied</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <p className="text-gray-500">
                        You do not have the required permissions to view this page. If you believe this is a mistake, please contact the administrator.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Return to Dashboard
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
