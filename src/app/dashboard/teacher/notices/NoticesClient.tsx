"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Send, Calendar as CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";

interface ClassData {
    id: string;
    name: string;
}

interface NoticeData {
    id: string;
    title: string;
    content: string;
    date: Date;
    targetRoles: string | null;
    author: {
        name: string;
        role: string;
    };
    class: {
        name: string;
    } | null;
}

export function NoticesClient({ classes, initialNotices }: { classes: ClassData[], initialNotices: NoticeData[] }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notices, setNotices] = useState(initialNotices);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        
        const rawClassId = formData.get("classId");
        const classId = rawClassId === "all" || !rawClassId ? null : rawClassId;
        
        try {
            const res = await fetch("/api/teacher/notices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.get("title"),
                    content: formData.get("content"),
                    classId: classId,
                    targetRoles: formData.get("targetRoles") || "STUDENT,PARENT",
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to send notice");
            }

            const { notice } = await res.json();
            toast.success("Notice sent successfully!");
            
            // Add new notice to list (simplistic approach without refetching)
            setNotices(prev => [notice, ...prev]);
            
            // Reset form
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Create Notice Column */}
            <div className="md:col-span-1 space-y-6">
                <Card className="border-t-4 border-t-emerald-600 shadow-sm sticky top-6">
                    <CardHeader>
                        <CardTitle className="text-lg text-emerald-900">Send New Notice</CardTitle>
                        <CardDescription>Send an announcement to your classes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input name="title" required placeholder="e.g. Tomorrow's Class Cancelled" />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="classId">Target Class (Optional)</Label>
                                <Select name="classId" defaultValue="all">
                                    <SelectTrigger>
                                        <SelectValue placeholder="All My Classes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All My Classes</SelectItem>
                                        {classes.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="targetRoles">Audience</Label>
                                <Select name="targetRoles" defaultValue="STUDENT,PARENT">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Audience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="STUDENT,PARENT">Students & Parents</SelectItem>
                                        <SelectItem value="STUDENT">Students Only</SelectItem>
                                        <SelectItem value="PARENT">Parents Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Message</Label>
                                <Textarea 
                                    name="content" 
                                    required 
                                    placeholder="Write your notice here..."
                                    className="min-h-[120px] resize-none"
                                />
                            </div>

                            <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="mr-2 h-4 w-4" />
                                )}
                                Send Notice
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Notice Board Column */}
            <div className="md:col-span-2 space-y-6">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-emerald-900">Notice Board</CardTitle>
                        <CardDescription>Recent announcements and notices.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {notices.length > 0 ? (
                                notices.map(notice => (
                                    <div key={notice.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow transition-shadow relative overflow-hidden">
                                        {/* Decorative left border line depending on author role */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                            notice.author.role === 'SUPER_ADMIN' || notice.author.role === 'ADMIN' 
                                            ? 'bg-red-500' 
                                            : 'bg-emerald-500'
                                        }`} />
                                        
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-900">{notice.title}</h3>
                                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center">
                                                <CalendarIcon className="w-3 h-3 mr-1" />
                                                {format(new Date(notice.date), "MMM d, yyyy")}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 whitespace-pre-wrap text-sm mb-4">
                                            {notice.content}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3 mt-3">
                                            <div className="flex items-center">
                                                <User className="w-3 h-3 mr-1" />
                                                <span className="font-medium text-gray-700 mr-1">{notice.author.name}</span> 
                                                ({notice.author.role === 'SUPER_ADMIN' ? 'Admin' : notice.author.role})
                                            </div>
                                            {notice.class && (
                                                <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase">
                                                    {notice.class.name}
                                                </div>
                                            )}
                                            {!notice.class && notice.targetRoles && (
                                                <div className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase">
                                                    {notice.targetRoles === 'ALL' ? 'Everyone' : notice.targetRoles.split(',').join(' & ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                                    <p className="text-gray-500">No notices found.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
