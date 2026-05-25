"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Key, User, Building2, CheckCircle, XCircle, Settings } from "lucide-react";

export default function AdminSettingsPage() {
    // Profile state
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Password state
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });
    const [passLoading, setPassLoading] = useState(false);
    const [passMsg, setPassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Institution settings state
    const [institution, setInstitution] = useState({
        name: "AL-IQRA MODERN MADRASA",
        tagline: "Knowledge, Character & Modern Development",
        phone: "",
        email: "",
        address: "",
        website: "",
    });
    const [instLoading, setInstLoading] = useState(false);
    const [instMsg, setInstMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMsg(null);
        try {
            const res = await fetch("/api/admin/settings/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update profile");
            setProfileMsg({ type: "success", text: "Profile updated successfully!" });
        } catch (err: any) {
            setProfileMsg({ type: "error", text: err.message });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setPassMsg({ type: "error", text: "New passwords do not match." });
            return;
        }
        if (passwords.new.length < 6) {
            setPassMsg({ type: "error", text: "New password must be at least 6 characters." });
            return;
        }
        setPassLoading(true);
        setPassMsg(null);
        try {
            const res = await fetch("/api/admin/settings/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to change password");
            setPassMsg({ type: "success", text: "Password changed successfully!" });
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (err: any) {
            setPassMsg({ type: "error", text: err.message });
        } finally {
            setPassLoading(false);
        }
    };

    const handleInstitutionUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setInstLoading(true);
        setInstMsg(null);
        try {
            const res = await fetch("/api/admin/settings/institution", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(institution),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update settings");
            setInstMsg({ type: "success", text: "Institution settings updated successfully!" });
        } catch (err: any) {
            setInstMsg({ type: "error", text: err.message });
        } finally {
            setInstLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Settings</h1>
                <p className="text-gray-500">Manage your profile, security, and institution settings.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Profile Settings */}
                <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-emerald-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Profile Settings</CardTitle>
                                <CardDescription>Update your personal information</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    placeholder="Super Admin"
                                    className="focus-visible:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    placeholder="admin@aliqramodernmadrasa.com"
                                    className="focus-visible:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    placeholder="+91 XXXXXXXXXX"
                                    className="focus-visible:ring-emerald-500"
                                />
                            </div>

                            {profileMsg && (
                                <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${profileMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                    {profileMsg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                    {profileMsg.text}
                                </div>
                            )}

                            <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white" disabled={profileLoading}>
                                {profileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Profile
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Change Password */}
                <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Key className="w-5 h-5 text-amber-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Change Password</CardTitle>
                                <CardDescription>Update your login credentials</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    className="focus-visible:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    placeholder="Min. 6 characters"
                                    required
                                    className="focus-visible:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    placeholder="Re-enter new password"
                                    required
                                    className="focus-visible:ring-emerald-500"
                                />
                            </div>

                            {passMsg && (
                                <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${passMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                    {passMsg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                    {passMsg.text}
                                </div>
                            )}

                            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={passLoading}>
                                {passLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
                                Change Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Institution Settings */}
            <Card className="shadow-sm border border-gray-200">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Institution Settings</CardTitle>
                            <CardDescription>Configure madrasa-wide information and contact details</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleInstitutionUpdate} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="instName">Institution Name</Label>
                                <Input
                                    id="instName"
                                    value={institution.name}
                                    onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                                    className="focus-visible:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instTagline">Tagline</Label>
                                <Input
                                    id="instTagline"
                                    value={institution.tagline}
                                    onChange={(e) => setInstitution({ ...institution, tagline: e.target.value })}
                                    className="focus-visible:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instPhone">Contact Phone</Label>
                                <Input
                                    id="instPhone"
                                    value={institution.phone}
                                    onChange={(e) => setInstitution({ ...institution, phone: e.target.value })}
                                    className="focus-visible:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instEmail">Contact Email</Label>
                                <Input
                                    id="instEmail"
                                    type="email"
                                    value={institution.email}
                                    onChange={(e) => setInstitution({ ...institution, email: e.target.value })}
                                    className="focus-visible:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="instAddress">Address</Label>
                                <Input
                                    id="instAddress"
                                    value={institution.address}
                                    onChange={(e) => setInstitution({ ...institution, address: e.target.value })}
                                    className="focus-visible:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="instWebsite">Website</Label>
                                <Input
                                    id="instWebsite"
                                    value={institution.website}
                                    onChange={(e) => setInstitution({ ...institution, website: e.target.value })}
                                    placeholder="https://www.aliqramodernmadrasa.com"
                                    className="focus-visible:ring-emerald-500"
                                />
                            </div>
                        </div>

                        {instMsg && (
                            <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${instMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                {instMsg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                {instMsg.text}
                            </div>
                        )}

                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={instLoading}>
                            {instLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />}
                            Save Institution Settings
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}