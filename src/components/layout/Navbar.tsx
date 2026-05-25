"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        // Set initial state in case page loads scrolled
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Courses", href: "/courses" },
        { name: "Services", href: "/services" },
        { name: "Donate", href: "/donation" },
        { name: "Contact Us", href: "/contact" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50">
            <nav
                className={`
                    relative transition-all duration-500 ease-out
                    ${isScrolled
                        ? "bg-white/85 backdrop-blur-xl shadow-lg shadow-brand-green/5 border-b border-white/50"
                        : "bg-white shadow-sm border-b border-gray-100"
                    }
                `}
            >
                {/* Subtle gold gradient line at top */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-gold via-brand-green to-brand-gold opacity-70" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-[56px] sm:h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group shrink-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-brand-gold/20 rounded-full blur-md scale-110 group-hover:scale-125 transition-transform duration-500" />
                                <Image
                                    src="/images/madrasa_logo.png"
                                    alt="Al-Iqra Logo"
                                    width={32}
                                    height={32}
                                    className="relative object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span
                                    className="text-xs sm:text-sm lg:text-base font-bold text-brand-green/80 leading-tight whitespace-nowrap group-hover:text-brand-green transition-colors duration-300"
                                    style={{ fontFamily: 'var(--font-urdu)' }}
                                >
                                    الاقرأ ماڈرن مدرسہ
                                </span>
                                <span className="text-[10px] sm:text-xs lg:text-sm font-black text-brand-green leading-tight uppercase tracking-[0.12em] whitespace-nowrap">
                                    AL-IQRA <span className="text-brand-gold">MODERN MADRASA</span>
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            <ul className="flex items-center">
                                {navLinks.map((link) => {
                                    const active = isActive(link.href);
                                    return (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className={`
                                                    relative px-3 py-1.5 text-sm font-semibold transition-all duration-300
                                                    ${active
                                                        ? "text-brand-green"
                                                        : "text-gray-600 hover:text-brand-green"
                                                    }
                                                `}
                                            >
                                                {link.name}
                                                {/* Active indicator */}
                                                <span
                                                    className={`
                                                        absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full
                                                        bg-gradient-to-r from-brand-gold to-brand-green
                                                        transition-all duration-300 ease-out
                                                        ${active ? "w-[70%]" : "w-0"}
                                                    `}
                                                />
                                                {/* Hover indicator */}
                                                <span
                                                    className={`
                                                        absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full
                                                        bg-brand-green/20
                                                        transition-all duration-300 ease-out
                                                        ${!active ? "group-hover:w-[60%] w-0" : "w-0"}
                                                    `}
                                                />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* CTA / Auth Button */}
                            <div className="ml-5 pl-5 border-l border-gray-200">
                                {isLoggedIn ? (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold
                                            bg-gradient-to-r from-brand-green to-brand-green-light text-white
                                            hover:shadow-lg hover:shadow-brand-green/25 hover:scale-[1.03]
                                            transition-all duration-300"
                                    >
                                        <User className="w-3.5 h-3.5" />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-brand-green
                                            border-2 border-brand-green/20 rounded-full
                                            hover:border-brand-green hover:bg-brand-green/5
                                            transition-all duration-300"
                                    >
                                        <User className="w-3.5 h-3.5" />
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="lg:hidden flex items-center gap-2">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="relative flex items-center justify-center w-10 h-10 rounded-xl
                                    text-gray-600 hover:text-brand-green hover:bg-brand-green/5
                                    transition-all duration-300"
                                aria-label="Toggle menu"
                            >
                                <div className="relative w-5 h-5">
                                    <span
                                        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                                            isMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                                        }`}
                                    >
                                        <Menu className="w-5 h-5" />
                                    </span>
                                    <span
                                        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                                            isMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
                                        }`}
                                    >
                                        <X className="w-5 h-5" />
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                <div
                    className={`
                        lg:hidden overflow-hidden transition-all duration-400 ease-in-out
                        ${isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
                    `}
                >
                    <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl">
                        <div className="px-4 py-2 divide-y divide-gray-100">
                            {/* Nav Links */}
                            <div className="py-3 space-y-1">
                                {navLinks.map((link, i) => {
                                    const active = isActive(link.href);
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold
                                                transition-all duration-200
                                                ${active
                                                    ? "bg-brand-green/10 text-brand-green"
                                                    : "text-gray-700 hover:bg-brand-green/5 hover:text-brand-green"
                                                }
                                            `}
                                            style={{ animationDelay: `${i * 50}ms` }}
                                        >
                                            <span
                                                className={`
                                                    w-1.5 h-1.5 rounded-full transition-all duration-300
                                                    ${active ? "bg-brand-green scale-125" : "bg-gray-300"}
                                                `}
                                            />
                                            {link.name}
                                            {active && (
                                                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-brand-green/50 bg-brand-green/5 px-2 py-0.5 rounded-full">
                                                    Active
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Auth Section */}
                            <div className="py-4 space-y-3">
                                {isLoggedIn ? (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl
                                            bg-gradient-to-r from-brand-green to-brand-green-light text-white font-bold
                                            hover:shadow-lg hover:shadow-brand-green/20 transition-all duration-300"
                                    >
                                        <User className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl
                                            text-brand-green font-bold border-2 border-brand-green/20
                                            hover:bg-brand-green/5 transition-all duration-300"
                                    >
                                        <User className="w-4 h-4" />
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
