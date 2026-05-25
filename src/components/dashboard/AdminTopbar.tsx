"use client";

import { Bell, Search, Menu, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminTopbar() {
    return (
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center">
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="relative w-64 hidden sm:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search dashboard..."
                        className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:ring-brand-green h-9"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-brand-green">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-brand-dark">Admin User</p>
                        <p className="text-xs text-gray-500">Super Administrator</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center text-white font-bold cursor-pointer">
                        A
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                        try {
                            await fetch("/api/auth/logout", { method: "POST" });
                        } catch (e) {
                            console.error("Logout failed", e);
                        }
                        window.location.href = "/login";
                    }}
                    className="text-gray-500 hover:text-red-500 hover:bg-red-50 flex items-center gap-1.5"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                </Button>
            </div>
        </header>
    );
}
