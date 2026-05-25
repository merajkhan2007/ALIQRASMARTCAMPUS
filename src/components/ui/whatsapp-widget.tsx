"use client";

import { useState } from "react";
import { X, MessageCircle } from "lucide-react";

interface WhatsAppWidgetProps {
    phoneNumber: string;
    message?: string;
}

export default function WhatsAppWidget({
    phoneNumber = "919XXXXXXXXX",
    message = "Assalamu Alaikum! I'm interested in learning more about Al-Iqra Modern Madrasa.",
}: WhatsAppWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);

    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Chat Popup */}
            {isOpen && (
                <div className="animate-in slide-in-from-bottom-5 fade-in duration-300 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#075e54] to-[#128c7e] p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <svg
                                        viewBox="0 0 32 32"
                                        className="w-5 h-5 fill-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M16 2C8.28 2 2 8.28 2 16c0 2.47.65 4.88 1.88 7L2.3 28.8c-.23.77.53 1.52 1.3 1.3L9.33 28.6A13.95 13.95 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.67c-2.18 0-4.28-.56-6.14-1.62l-.44-.25-3.7 1.03 1.04-3.6-.26-.45A11.56 11.56 0 0 1 4.33 16c0-6.45 5.22-11.67 11.67-11.67S27.67 9.55 27.67 16 22.45 27.67 16 27.67zm6.38-8.17c-.35-.18-2.07-1.02-2.4-1.13-.32-.12-.55-.18-.78.18-.23.35-.9 1.13-1.1 1.36-.2.24-.4.26-.75.09-.35-.18-1.47-.54-2.8-1.73-1.04-.93-1.74-2.07-1.94-2.42-.2-.35-.02-.54.15-.71.16-.16.35-.4.52-.6.17-.2.23-.35.35-.58.12-.23.06-.43-.03-.6-.09-.18-.78-1.87-1.06-2.56-.28-.67-.57-.58-.78-.59-.2-.01-.43-.02-.66-.02-.23 0-.6.09-.9.43-.3.35-1.18 1.16-1.18 2.82s1.2 3.27 1.37 3.5c.17.23 2.37 3.63 5.75 5.1.8.35 1.43.56 1.92.71.8.26 1.54.22 2.12.13.65-.1 2.07-.85 2.36-1.66.3-.82.3-1.52.2-1.66-.08-.15-.3-.24-.65-.42z" />
                                    </svg>
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#128c7e]"></span>
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Al-Iqra Madrasa</p>
                                <p className="text-emerald-200 text-xs">Typically replies instantly</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="p-4 bg-[#efeae2] bg-opacity-50">
                        <div className="bg-white rounded-lg p-3 shadow-sm text-sm text-gray-700 leading-relaxed">
                            <p className="font-semibold text-[#075e54] mb-1">Assalamu Alaikum! 👋</p>
                            <p>Welcome to <strong>Al-Iqra Modern Madrasa</strong>. How can we help you today?</p>
                            <p className="text-xs text-gray-400 mt-2">🟢 We typically reply within minutes</p>
                        </div>
                    </div>

                    {/* Chat Footer */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#22c35e] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                        >
                            <svg
                                viewBox="0 0 32 32"
                                className="w-5 h-5 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M16 2C8.28 2 2 8.28 2 16c0 2.47.65 4.88 1.88 7L2.3 28.8c-.23.77.53 1.52 1.3 1.3L9.33 28.6A13.95 13.95 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.67c-2.18 0-4.28-.56-6.14-1.62l-.44-.25-3.7 1.03 1.04-3.6-.26-.45A11.56 11.56 0 0 1 4.33 16c0-6.45 5.22-11.67 11.67-11.67S27.67 9.55 27.67 16 22.45 27.67 16 27.67zm6.38-8.17c-.35-.18-2.07-1.02-2.4-1.13-.32-.12-.55-.18-.78.18-.23.35-.9 1.13-1.1 1.36-.2.24-.4.26-.75.09-.35-.18-1.47-.54-2.8-1.73-1.04-.93-1.74-2.07-1.94-2.42-.2-.35-.02-.54.15-.71.16-.16.35-.4.52-.6.17-.2.23-.35.35-.58.12-.23.06-.43-.03-.6-.09-.18-.78-1.87-1.06-2.56-.28-.67-.57-.58-.78-.59-.2-.01-.43-.02-.66-.02-.23 0-.6.09-.9.43-.3.35-1.18 1.16-1.18 2.82s1.2 3.27 1.37 3.5c.17.23 2.37 3.63 5.75 5.1.8.35 1.43.56 1.92.71.8.26 1.54.22 2.12.13.65-.1 2.07-.85 2.36-1.66.3-.82.3-1.52.2-1.66-.08-.15-.3-.24-.65-.42z" />
                            </svg>
                            Start Chat
                        </a>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative group flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
                    isOpen
                        ? "bg-gray-700 hover:bg-gray-800 rotate-90"
                        : "bg-[#25D366] hover:bg-[#22c35e]"
                }`}
                aria-label="Chat on WhatsApp"
            >
                {/* Pulse rings */}
                {!isOpen && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"></span>
                        <span className="absolute -inset-1 rounded-full bg-[#25D366]/20 animate-pulse"></span>
                    </>
                )}

                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <svg
                        viewBox="0 0 32 32"
                        className="w-7 h-7 fill-white"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M16 2C8.28 2 2 8.28 2 16c0 2.47.65 4.88 1.88 7L2.3 28.8c-.23.77.53 1.52 1.3 1.3L9.33 28.6A13.95 13.95 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.67c-2.18 0-4.28-.56-6.14-1.62l-.44-.25-3.7 1.03 1.04-3.6-.26-.45A11.56 11.56 0 0 1 4.33 16c0-6.45 5.22-11.67 11.67-11.67S27.67 9.55 27.67 16 22.45 27.67 16 27.67zm6.38-8.17c-.35-.18-2.07-1.02-2.4-1.13-.32-.12-.55-.18-.78.18-.23.35-.9 1.13-1.1 1.36-.2.24-.4.26-.75.09-.35-.18-1.47-.54-2.8-1.73-1.04-.93-1.74-2.07-1.94-2.42-.2-.35-.02-.54.15-.71.16-.16.35-.4.52-.6.17-.2.23-.35.35-.58.12-.23.06-.43-.03-.6-.09-.18-.78-1.87-1.06-2.56-.28-.67-.57-.58-.78-.59-.2-.01-.43-.02-.66-.02-.23 0-.6.09-.9.43-.3.35-1.18 1.16-1.18 2.82s1.2 3.27 1.37 3.5c.17.23 2.37 3.63 5.75 5.1.8.35 1.43.56 1.92.71.8.26 1.54.22 2.12.13.65-.1 2.07-.85 2.36-1.66.3-.82.3-1.52.2-1.66-.08-.15-.3-.24-.65-.42z" />
                    </svg>
                )}

                {/* Tooltip */}
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                    Chat with us
                    <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></span>
                </span>
            </button>
        </div>
    );
}