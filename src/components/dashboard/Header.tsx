"use client";

import { Bell, Search, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
    user: {
        name: string;
        email: string;
        role: string;
    };
}

export function Header({ user }: HeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (e) {
            console.error("Logout failed", e);
        }
        router.push("/login");
    };

    return (
        <header className="flex sticky top-0 z-40 h-16 w-full items-center justify-between border-b bg-white px-6 shadow-sm">
            <div className="flex w-full items-center gap-4 md:w-1/3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="search"
                        placeholder="Search students, teachers, fees..."
                        className="h-9 w-full rounded-md border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-600"></span>
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 rounded-full outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                            <Avatar className="h-8 w-8 border border-emerald-200">
                                <AvatarImage src="" alt={user.name} />
                                <AvatarFallback className="bg-emerald-100 text-emerald-900 font-semibold text-xs">
                                    {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="flex flex-col space-y-1">
                            <span className="text-sm font-medium leading-none">{user.name}</span>
                            <span className="text-xs leading-none text-muted-foreground">{user.email}</span>
                            <span className="mt-1 rounded-sm bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 w-fit">
                                {user.role}
                            </span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => router.push(`/dashboard/${user.role.toLowerCase()}/profile`)}>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 font-medium pt-2 border-t mt-2">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
