"use client";

import Link from "next/link";
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, MapPin } from "lucide-react";

export function TopBar() {
    return (
        <div className="bg-gradient-to-r from-brand-green via-brand-green to-brand-green-light text-white relative overflow-hidden">
            {/* Subtle decorative pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

            <div className="hidden md:block relative z-10">
                <div className="container mx-auto flex justify-between items-center py-1 px-4 sm:px-6 lg:px-8 text-[11px] sm:text-xs">
                    {/* Contact Info */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 group">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 group-hover:bg-brand-gold/20 transition-all duration-300">
                                <Mail className="w-3 h-3 text-brand-gold group-hover:scale-110 transition-transform" />
                            </span>
                            <span className="text-white/80 group-hover:text-white transition-colors duration-200 tracking-wide">
                                info@aliqramodernmadrasa.com
                            </span>
                        </div>
                        <div className="w-px h-3 bg-white/20" />
                        <div className="flex items-center gap-1.5 group">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 group-hover:bg-brand-gold/20 transition-all duration-300">
                                <Phone className="w-3 h-3 text-brand-gold group-hover:scale-110 transition-transform" />
                            </span>
                            <span className="text-white/80 group-hover:text-white transition-colors duration-200 tracking-wide">
                                +91 7004029406 | 9339093388 | 9830647995
                            </span>
                        </div>
                    </div>

                    {/* Right Side: Social Links + Quick Link */}
                    <div className="flex items-center gap-2">
                        {/* Social Icons */}
                        <div className="flex items-center gap-0">
                            {[
                                { icon: Facebook, href: "#", label: "Facebook" },
                                { icon: Twitter, href: "#", label: "Twitter" },
                                { icon: Instagram, href: "#", label: "Instagram" },
                                { icon: Linkedin, href: "#", label: "LinkedIn" },
                            ].map(({ icon: Icon, href, label }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="flex items-center justify-center w-7 h-7 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
                                >
                                    <Icon className="w-3 h-3" />
                                </Link>
                            ))}
                        </div>
                        <div className="w-px h-3 bg-white/20" />
                        <Link
                            href="/admission"
                            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-gold text-brand-green text-[11px] font-bold hover:bg-brand-gold-light hover:scale-105 transition-all duration-300 shadow-sm shadow-brand-gold/20"
                        >
                            <MapPin className="w-2.5 h-2.5" />
                            Apply Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile: Compact version */}
            <div className="md:hidden relative z-10 flex items-center justify-between px-4 py-1">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-white/80">
                        <Phone className="w-2.5 h-2.5 text-brand-gold" />
                        +91 7004029406
                    </span>
                </div>
                <Link
                    href="/admission"
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold text-brand-green text-[10px] font-bold hover:bg-brand-gold-light transition-all"
                >
                    Apply Now
                </Link>
            </div>
        </div>
    );
}
