import { db } from "@/lib/db";
import { BookOpen, Users, Shield, Search } from "lucide-react";
import React from "react";
import { CreateClassClient } from "./CreateClassClient";

export const dynamic = "force-dynamic";

export default async function ClassesManagementPage() {
    const [classes, teachers] = await Promise.all([
        db.class.findMany({
            include: {
                classTeacher: {
                    include: {
                        user: true
                    }
                },
                _count: {
                    select: { students: true }
                }
            },
            orderBy: { name: 'asc' }
        }),
        db.teacher.findMany({
            include: { user: true },
            orderBy: { user: { name: 'asc' } }
        })
    ]);

    const transformedTeachers = teachers.map(t => ({
        id: t.id,
        name: t.user.name
    }));

    const totalCapacity = classes.reduce((acc, curr) => acc + curr.capacity, 0);
    const totalEnrolled = classes.reduce((acc, curr) => acc + curr._count.students, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-emerald-600" />
                        Class Management
                    </h1>
                    <p className="text-gray-500">Configure academic grades, sections, and monitor capacities.</p>
                </div>
                
                <CreateClassClient teachers={transformedTeachers} />
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border rounded-xl p-5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-gray-500 font-medium mb-1">
                        <BookOpen className="w-4 h-4" /> Total Classes
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{classes.length}</span>
                </div>
                <div className="bg-white border rounded-xl p-5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-blue-500 font-medium mb-1">
                        <Shield className="w-4 h-4" /> Current Enrollment
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{totalEnrolled} <span className="text-sm font-normal text-gray-400">students</span></span>
                </div>
                <div className="bg-white border rounded-xl p-5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-emerald-600 font-medium mb-1">
                        <Users className="w-4 h-4" /> System Capacity
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{Math.round((totalEnrolled / (totalCapacity || 1)) * 100)}% <span className="text-sm font-normal text-gray-400">full</span></span>
                </div>
            </div>

            {/* Classes Grid */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search classes..." className="w-full pl-9 pr-4 py-2 text-sm border-gray-300 rounded-md focus:ring-emerald-500 border outline-none" disabled />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y divide-gray-100 md:divide-y-0 md:divide-x border-b">
                    {classes.map((cls) => {
                        const fillPercentage = Math.round((cls._count.students / cls.capacity) * 100);
                        const isOverCapacity = cls._count.students > cls.capacity;

                        return (
                            <div key={cls.id} className="p-6 hover:bg-emerald-50/30 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-emerald-950">{cls.name} <span className="text-emerald-600/70">{cls.section || 'General'}</span></h3>
                                        <p className="text-xs text-gray-500 mt-1">Class ID: {cls.id.slice(0, 8)}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-bold ${isOverCapacity ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {fillPercentage}% Full
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                                        <span className="text-gray-500">Students</span>
                                        <span className="font-semibold text-gray-900">{cls._count.students} / {cls.capacity}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                                        <span className="text-gray-500">Class Teacher</span>
                                        <span className="font-semibold text-gray-900 truncate pl-4">
                                            {cls.classTeacher ? cls.classTeacher.user.name : <span className="text-amber-500 italic">Unassigned</span>}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {classes.length === 0 && (
                        <div className="col-span-full py-16 text-center text-gray-500">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="font-semibold text-gray-900 text-lg">No classes configured</p>
                            <p className="text-sm mt-1">Create your first class to start assigning students and teachers.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
