"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Mail, MailOpen, Phone, RefreshCw, Search, Loader2, Inbox } from "lucide-react";

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/messages");
            if (!res.ok) throw new Error("Failed to fetch messages");
            const data = await res.json();
            setMessages(data.messages);
            setUnreadCount(data.messages.filter((m: ContactMessage) => !m.isRead).length);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await fetch("/api/messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            setMessages((prev) =>
                prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const toggleExpand = (id: string) => {
        const msg = messages.find((m) => m.id === id);
        if (msg && !msg.isRead) {
            markAsRead(id);
        }
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const filteredMessages = messages.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase()) ||
            m.subject.toLowerCase().includes(search.toLowerCase()) ||
            m.message.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <Mail className="w-8 h-8 text-emerald-600" />
                        Messages
                    </h1>
                    <p className="text-gray-500">
                        Contact form submissions from the website
                        {unreadCount > 0 && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                {unreadCount} unread
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={fetchMessages}
                    className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all font-medium"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Inbox className="w-16 h-16 mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-gray-600">No messages found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {search ? "Try a different search term" : "Messages from the contact form will appear here"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-emerald-900/5 text-emerald-900 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 w-8"></th>
                                    <th className="px-6 py-4">Sender</th>
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4">Message Preview</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredMessages.map((msg) => (
                                    <>
                                        <tr
                                            key={msg.id}
                                            onClick={() => toggleExpand(msg.id)}
                                            className={`cursor-pointer transition-colors ${
                                                msg.isRead
                                                    ? "hover:bg-gray-50/50"
                                                    : "bg-emerald-50/30 hover:bg-emerald-50/60 font-semibold"
                                            }`}
                                        >
                                            <td className="px-6 py-4">
                                                {msg.isRead ? (
                                                    <MailOpen className="w-4 h-4 text-gray-400" />
                                                ) : (
                                                    <Mail className="w-4 h-4 text-emerald-600" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={msg.isRead ? "" : "text-gray-900"}>
                                                    {msg.name}
                                                </div>
                                                <div className="text-xs text-gray-500">{msg.email}</div>
                                                {msg.phone && (
                                                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                        <Phone className="w-3 h-3" />
                                                        {msg.phone}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        msg.subject === "admission"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : msg.subject === "hifz"
                                                            ? "bg-purple-100 text-purple-800"
                                                            : msg.subject === "school"
                                                            ? "bg-amber-100 text-amber-800"
                                                            : msg.subject === "general"
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {msg.subject}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-600 line-clamp-2 max-w-sm">
                                                    {msg.message}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                                                {format(new Date(msg.createdAt), "MMM dd, yyyy")}
                                                <br />
                                                {format(new Date(msg.createdAt), "h:mm a")}
                                            </td>
                                        </tr>
                                        {expandedId === msg.id && (
                                            <tr key={`${msg.id}-expanded`}>
                                                <td colSpan={5} className="px-6 py-5 bg-gray-50">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                Sender Details
                                                            </span>
                                                            <div className="mt-1 grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <span className="text-gray-500">Name: </span>
                                                                    <span className="font-medium">{msg.name}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-500">Email: </span>
                                                                    <span className="font-medium">{msg.email}</span>
                                                                </div>
                                                                {msg.phone && (
                                                                    <div>
                                                                        <span className="text-gray-500">Phone: </span>
                                                                        <span className="font-medium">{msg.phone}</span>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <span className="text-gray-500">Date: </span>
                                                                    <span className="font-medium">
                                                                        {format(new Date(msg.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                Full Message
                                                            </span>
                                                            <p className="mt-1 text-gray-800 whitespace-pre-wrap leading-relaxed">
                                                                {msg.message}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <a
                                                                href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                                                className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-900 font-medium"
                                                            >
                                                                <Mail className="w-4 h-4" />
                                                                Reply via Email
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}