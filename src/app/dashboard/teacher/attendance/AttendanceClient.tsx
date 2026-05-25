"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface Student {
    id: string;
    fullName: string;
    admissionNo: string;
    rollNo: string | null;
}

interface ClassData {
    id: string;
    name: string;
    section: string | null;
    students: Student[];
}

export function AttendanceClient({ classes }: { classes: ClassData[] }) {
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const selectedClass = classes.find(c => c.id === selectedClassId);

    // Fetch existing attendance when class or date changes
    useEffect(() => {
        if (!selectedClassId || !date) return;

        const fetchAttendance = async () => {
            setIsFetching(true);
            try {
                const res = await fetch(`/api/teacher/attendance?classId=${selectedClassId}&date=${date}`);
                if (!res.ok) throw new Error("Failed to fetch records");
                
                const { records } = await res.json();
                
                // Initialize with defaults
                const newClass = classes.find(c => c.id === selectedClassId);
                const newData: Record<string, string> = {};
                
                if (newClass) {
                    newClass.students.forEach(s => {
                        newData[s.id] = "PRESENT"; // Default to present
                    });
                }

                // Override with fetched records
                if (records && Array.isArray(records)) {
                    records.forEach((record: any) => {
                        newData[record.studentId] = record.status;
                    });
                }

                setAttendanceData(newData);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load existing attendance");
            } finally {
                setIsFetching(false);
            }
        };

        fetchAttendance();
    }, [selectedClassId, date, classes]);

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceData(prev => ({ ...prev, [studentId]: status }));
    };

    const handleBulkAction = (status: string) => {
        if (!selectedClass) return;
        const newData: Record<string, string> = {};
        selectedClass.students.forEach(s => {
            newData[s.id] = status;
        });
        setAttendanceData(newData);
    };

    const handleSave = async () => {
        if (!selectedClassId) {
            toast.error("Please select a class");
            return;
        }

        setIsSaving(true);
        try {
            const payload = Object.entries(attendanceData).map(([studentId, status]) => ({
                studentId,
                status,
                date: new Date(date).toISOString(),
            }));

            const res = await fetch("/api/teacher/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ attendanceRecords: payload }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to save attendance");
            }

            toast.success("Attendance saved successfully");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate Summary Stats
    const totalStudents = selectedClass?.students.length || 0;
    const presentCount = Object.values(attendanceData).filter(s => s === "PRESENT").length;
    const absentCount = Object.values(attendanceData).filter(s => s === "ABSENT").length;
    const leaveCount = Object.values(attendanceData).filter(s => s === "LEAVE").length;

    return (
        <div className="space-y-6">
            <Card className="border-t-4 border-t-emerald-600 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg text-emerald-900">Select Class & Date</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Class</label>
                        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((cls) => (
                                    <SelectItem key={cls.id} value={cls.id}>
                                        {cls.name} {cls.section ? `- ${cls.section}` : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Date</label>
                        <Input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            className="w-full"
                        />
                    </div>
                </CardContent>
            </Card>

            {selectedClass && (
                <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="bg-gray-50/50 border-b pb-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <CardTitle className="text-xl text-emerald-950 flex items-center gap-2">
                                    Student List 
                                    {isFetching && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
                                </CardTitle>
                                <p className="text-sm text-gray-500 mt-1">Total Students: {totalStudents}</p>
                            </div>

                            {/* Summary Stats */}
                            <div className="flex gap-4 text-sm font-medium bg-white px-4 py-2 rounded-lg border shadow-sm">
                                <span className="text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {presentCount} Present</span>
                                <span className="text-red-700 flex items-center gap-1"><XCircle className="w-4 h-4"/> {absentCount} Absent</span>
                                <span className="text-amber-600 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {leaveCount} Leave</span>
                            </div>

                            <Button 
                                onClick={handleSave} 
                                disabled={isSaving || isFetching || totalStudents === 0}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white w-full md:w-auto"
                            >
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Attendance
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {totalStudents > 0 ? (
                            <div className="space-y-4">
                                {/* Bulk Actions */}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("PRESENT")} className="text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                                        Mark All Present
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("ABSENT")} className="text-red-700 border-red-200 hover:bg-red-50">
                                        Mark All Absent
                                    </Button>
                                </div>

                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead className="w-[100px]">Roll No</TableHead>
                                                <TableHead>Student Name</TableHead>
                                                <TableHead>Admission No</TableHead>
                                                <TableHead className="text-center">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedClass.students.map((student) => (
                                                <TableRow key={student.id} className={isFetching ? "opacity-50 pointer-events-none" : ""}>
                                                    <TableCell className="font-medium">{student.rollNo || '-'}</TableCell>
                                                    <TableCell className="font-semibold text-gray-900">{student.fullName}</TableCell>
                                                    <TableCell className="text-gray-500 text-sm font-mono">{student.admissionNo}</TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant={attendanceData[student.id] === "PRESENT" ? "default" : "outline"}
                                                                className={attendanceData[student.id] === "PRESENT" ? "bg-emerald-600 hover:bg-emerald-700 text-white w-24 shadow-sm" : "w-24 text-gray-500 hover:text-emerald-700"}
                                                                onClick={() => handleStatusChange(student.id, "PRESENT")}
                                                            >
                                                                Present
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant={attendanceData[student.id] === "ABSENT" ? "default" : "outline"}
                                                                className={attendanceData[student.id] === "ABSENT" ? "bg-red-600 hover:bg-red-700 text-white w-24 shadow-sm" : "w-24 text-gray-500 hover:text-red-700"}
                                                                onClick={() => handleStatusChange(student.id, "ABSENT")}
                                                            >
                                                                Absent
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant={attendanceData[student.id] === "LEAVE" ? "default" : "outline"}
                                                                className={attendanceData[student.id] === "LEAVE" ? "bg-amber-500 hover:bg-amber-600 text-white w-24 shadow-sm" : "w-24 text-gray-500 hover:text-amber-600"}
                                                                onClick={() => handleStatusChange(student.id, "LEAVE")}
                                                            >
                                                                Leave
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
                                <p className="text-gray-500 font-medium">No students enrolled in this class yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
