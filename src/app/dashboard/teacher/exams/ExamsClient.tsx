"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Result {
    studentId: string;
    obtainedMarks: number;
    grade: string | null;
    remarks: string | null;
}

interface Student {
    id: string;
    fullName: string;
    admissionNo: string;
    rollNo: string | null;
}

interface Exam {
    id: string;
    title: string;
    date: Date;
    maxMarks: number;
    results: Result[];
}

interface SubjectData {
    id: string;
    name: string;
    code: string;
    class: {
        id: string;
        name: string;
        students: Student[];
    };
    exams: Exam[];
}

export function ExamsClient({ subjects }: { subjects: SubjectData[] }) {
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
    const [selectedExamId, setSelectedExamId] = useState<string>("");
    const [resultsData, setResultsData] = useState<Record<string, number>>({});
    const [isSaving, setIsSaving] = useState(false);
    
    // Create Exam Form state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
    const selectedExam = selectedSubject?.exams.find(e => e.id === selectedExamId);

    const handleSubjectChange = (subjectId: string) => {
        setSelectedSubjectId(subjectId);
        setSelectedExamId("");
        setResultsData({});
    };

    const handleExamChange = (examId: string) => {
        setSelectedExamId(examId);
        const exam = selectedSubject?.exams.find(e => e.id === examId);
        if (exam && selectedSubject) {
            const initialData: Record<string, number> = {};
            selectedSubject.class.students.forEach(s => {
                const existingResult = exam.results.find(r => r.studentId === s.id);
                if (existingResult) {
                    initialData[s.id] = existingResult.obtainedMarks;
                }
            });
            setResultsData(initialData);
        }
    };

    const handleMarksChange = (studentId: string, marks: string) => {
        const numMarks = parseFloat(marks);
        if (!isNaN(numMarks)) {
            setResultsData(prev => ({ ...prev, [studentId]: numMarks }));
        } else if (marks === "") {
            const newData = { ...resultsData };
            delete newData[studentId];
            setResultsData(newData);
        }
    };

    const handleSaveResults = async () => {
        if (!selectedExamId) {
            toast.error("Please select an exam");
            return;
        }

        setIsSaving(true);
        try {
            const payload = Object.entries(resultsData).map(([studentId, obtainedMarks]) => ({
                studentId,
                examId: selectedExamId,
                obtainedMarks,
            }));

            const res = await fetch("/api/teacher/results", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ results: payload }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to save results");
            }

            toast.success("Results saved successfully");
            // In a real app, we might refresh the router here to get updated data
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateExam = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        const formData = new FormData(e.currentTarget);
        
        try {
            const res = await fetch("/api/teacher/exams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.get("title"),
                    date: formData.get("date"),
                    maxMarks: parseFloat(formData.get("maxMarks") as string),
                    subjectId: formData.get("subjectId"),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to create exam");
            }

            toast.success("Exam created successfully. Please refresh the page to see it.");
            setIsCreateOpen(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-emerald-900">Manage Marks</h2>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Exam
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Exam</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateExam} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="subjectId">Subject</Label>
                                <Select name="subjectId" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name} ({s.class.name})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Exam Title</Label>
                                <Input name="title" required placeholder="e.g. Mid Term Exam" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input name="date" type="date" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxMarks">Maximum Marks</Label>
                                <Input name="maxMarks" type="number" required placeholder="100" />
                            </div>
                            <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={isCreating}>
                                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Exam
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-t-4 border-t-emerald-600 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg text-emerald-900">Select Subject & Exam</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Subject</label>
                        <Select value={selectedSubjectId} onValueChange={handleSubjectChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name} ({s.class.name})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Exam</label>
                        <Select 
                            value={selectedExamId} 
                            onValueChange={handleExamChange}
                            disabled={!selectedSubjectId || selectedSubject?.exams.length === 0}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={
                                    !selectedSubjectId ? "Select a subject first" : 
                                    selectedSubject?.exams.length === 0 ? "No exams found" : 
                                    "Select an exam"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {selectedSubject?.exams.map((e) => (
                                    <SelectItem key={e.id} value={e.id}>
                                        {e.title} (Max: {e.maxMarks})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {selectedExam && selectedSubject && (
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row justify-between items-center pb-2">
                        <div>
                            <CardTitle className="text-lg text-emerald-900">
                                Enter Marks for {selectedExam.title}
                            </CardTitle>
                            <p className="text-sm text-gray-500">Max Marks: {selectedExam.maxMarks}</p>
                        </div>
                        <Button 
                            onClick={handleSaveResults} 
                            disabled={isSaving || selectedSubject.class.students.length === 0}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Marks
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {selectedSubject.class.students.length > 0 ? (
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-gray-50">
                                        <TableRow>
                                            <TableHead className="w-[100px]">Roll No</TableHead>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Admission No</TableHead>
                                            <TableHead className="text-right w-[150px]">Marks Obtained</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedSubject.class.students.map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell className="font-medium">{student.rollNo || '-'}</TableCell>
                                                <TableCell>{student.fullName}</TableCell>
                                                <TableCell className="text-gray-500 text-sm">{student.admissionNo}</TableCell>
                                                <TableCell className="text-right">
                                                    <Input
                                                        type="number"
                                                        max={selectedExam.maxMarks}
                                                        min={0}
                                                        step="0.5"
                                                        value={resultsData[student.id] !== undefined ? resultsData[student.id] : ""}
                                                        onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                                        className="w-full text-right"
                                                        placeholder={`/ ${selectedExam.maxMarks}`}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No students found in this class.
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
