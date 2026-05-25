import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-brand-dark text-white pt-16 pb-8 border-t-4 border-brand-green">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: About */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="bg-white rounded-lg p-1.5 shrink-0">
                                <Image src="/images/madrasa_logo.png" alt="Al-Iqra Logo" width={40} height={40} className="object-contain" />
                            </div>
                            <div className="flex items-center">
                                <span className="text-xl font-bold text-white leading-tight uppercase tracking-wider">AL-IQRA MODERN MADRASA</span>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                            We provide the best Islamic and Quranic education with structural courses in Hifz, Tajweed, and Islamic studies for students of all ages.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-green hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-green hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-green hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-green hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-brand-green rounded-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: "About Us", href: "/about" },
                                { name: "Our Courses", href: "/courses" },
                                { name: "Our Services", href: "/services" },
                                { name: "Careers", href: "/careers" },
                                { name: "Contact Us", href: "/contact" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-400 hover:text-brand-gold text-sm flex items-center transition-colors">
                                        <span className="mr-2 text-brand-green">›</span> {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-brand-green rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-sm text-gray-400">
                                <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                                <span>6/1, Gopi Mondal Lane, Kolkata, West Bengal 700002</span>
                            </li>
                            <li className="flex items-start">
                                <Phone className="w-5 h-5 mr-3 mt-0.5 text-brand-gold" />
                                <span>+91 7004029406 | 9339093388 | 9830647995</span>
                            </li>
                            <li className="flex items-start">
                                <Mail className="w-5 h-5 mr-3 mt-0.5 text-brand-gold" />
                                <span>info@aliqramodernmadrasa.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                            Newsletter
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-brand-green rounded-full"></span>
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to our newsletter to get latest updates and news.
                        </p>
                        <div className="flex flex-col space-y-2">
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="Your Email Address"
                                    className="bg-gray-800 border-gray-700 text-white pl-4 pr-12 py-6 rounded-md focus:ring-brand-green focus:border-brand-green"
                                />
                                <Button size="icon" className="absolute right-1 top-1 bottom-1 h-auto bg-brand-green hover:bg-brand-green-light text-white rounded-sm">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:items-center">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Al-Iqra Modern Madrasa. All Rights Reserved.
                    </p>
                    <div className="mt-4 md:mt-0 space-x-4 text-sm text-gray-500">
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <span>|</span>
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
