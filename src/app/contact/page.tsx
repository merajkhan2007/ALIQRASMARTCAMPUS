"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ArrowRight, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.get("name"),
                    email: formData.get("email"),
                    phone: formData.get("phone") || null,
                    subject: formData.get("subject"),
                    message: formData.get("message"),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to send message");
            }

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main>
            {/* Breadcrumb Header */}
            <section className="bg-brand-dark py-16 md:py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #FBB03B 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 text-brand-gold/80 text-sm mb-4">
                        <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-brand-gold">Contact Us</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Get In Touch</h1>
                    <p className="text-gray-300 max-w-xl mx-auto text-lg">
                        Have questions about our programs? We'd love to hear from you. Reach out and we'll respond as soon as possible.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-14 md:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
                                {submitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h2>
                                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                            JazakAllahu Khairan! Your message has been received. Our team will get back to you within 24-48 hours, In Sha Allah.
                                        </p>
                                        <Link href="/">
                                            <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white font-semibold">
                                                <Home className="w-4 h-4 mr-2" />
                                                Back to Home
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                                        <p className="text-gray-500 mb-8">Fill out the form below and we'll get back to you shortly.</p>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                                                    <Input id="name" name="name" type="text" placeholder="Enter your full name" required className="h-12 rounded-lg border-gray-300 focus:border-brand-green focus:ring-brand-green" />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                                                    <Input id="email" name="email" type="email" placeholder="Enter your email" required className="h-12 rounded-lg border-gray-300 focus:border-brand-green focus:ring-brand-green" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                                    <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number" className="h-12 rounded-lg border-gray-300 focus:border-brand-green focus:ring-brand-green" />
                                                </div>
                                                <div>
                                                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                                                    <select id="subject" name="subject" required className="w-full h-12 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-brand-green focus:ring-brand-green focus:outline-none">
                                                        <option value="">Select a subject</option>
                                                        <option value="admission">Admission Inquiry</option>
                                                        <option value="hifz">Hifz Program</option>
                                                        <option value="school">School Education</option>
                                                        <option value="general">General Inquiry</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Your Message *</label>
                                                <Textarea id="message" name="message" rows={5} placeholder="Write your message here..." required className="rounded-lg border-gray-300 focus:border-brand-green focus:ring-brand-green resize-none" />
                                            </div>
                                            {error && (
                                                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                                                    {error}
                                                </div>
                                            )}
                                            <Button type="submit" size="lg" disabled={submitting} className="w-full h-14 text-base font-bold bg-brand-green hover:bg-brand-green/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all group disabled:opacity-70">
                                                {submitting ? (
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                ) : (
                                                    <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                                                )}
                                                {submitting ? "Sending..." : "Send Message"}
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Contact Info Sidebar */}
                        <div className="space-y-6">
                            {/* Info Cards */}
                            <div className="bg-brand-green rounded-2xl p-8 text-white shadow-xl">
                                <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                                <ul className="space-y-5">
                                    <li className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Our Address</p>
                                            <p className="text-white/80 text-sm mt-0.5">6/1, Gopi Mondal Lane, Kolkata, West Bengal 700002</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Phone Number</p>
                                            <p className="text-white/80 text-sm mt-0.5">+91 7004029406 | 9339093388 | 9830647995</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Email Address</p>
                                            <p className="text-white/80 text-sm mt-0.5">info@aliqramodernmadrasa.com</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Working Hours</p>
                                            <p className="text-white/80 text-sm mt-0.5">Mon - Thu & Sat: 8:00 AM - 4:00 PM</p>
                                            <p className="text-white/80 text-sm">Friday: Closed (Jummah Prayer)</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Quick Links Card */}
                            <div className="bg-brand-dark rounded-2xl p-8 text-white shadow-xl">
                                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                                <ul className="space-y-3">
                                    {[
                                        { name: "Apply for Admission", href: "/admission" },
                                        { name: "Our Courses", href: "/#courses" },
                                        { name: "Our Services", href: "/#services" },
                                        { name: "Institute Gallery", href: "/#gallery" },
                                    ].map((link) => (
                                        <li key={link.name}>
                                            <Link href={link.href} className="flex items-center text-brand-gold hover:text-white transition-colors text-sm group">
                                                <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}