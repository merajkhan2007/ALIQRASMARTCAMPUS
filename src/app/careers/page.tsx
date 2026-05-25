import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, BookOpen, Heart, Mail, MapPin, ArrowRight } from "lucide-react";

export default function CareersPage() {
    const openings = [
        {
            title: "Quran Teacher (Male)",
            department: "Quranic Studies",
            type: "Full-time",
            desc: "Qualified Huffaz with Ijazah in Qira'at. Must have at least 3 years of teaching experience.",
            icon: <BookOpen className="w-6 h-6" />,
        },
        {
            title: "Quran Teacher (Female)",
            department: "Quranic Studies",
            type: "Full-time",
            desc: "Female Hafiza with Tajweed expertise to teach female students. Minimum 2 years experience.",
            icon: <BookOpen className="w-6 h-6" />,
        },
        {
            title: "Islamic Studies Instructor",
            department: "Islamic Studies",
            type: "Part-time",
            desc: "Knowledgeable in Fiqh, Hadith, Seerah, and Aqeedah. Alim/Alimah degree preferred.",
            icon: <GraduationCap className="w-6 h-6" />,
        },
        {
            title: "Arabic Language Teacher",
            department: "Languages",
            type: "Full-time",
            desc: "Proficient in Arabic grammar, conversation, and literature. Native or advanced fluency required.",
            icon: <BookOpen className="w-6 h-6" />,
        },
        {
            title: "Administrative Assistant",
            department: "Administration",
            type: "Full-time",
            desc: "Manage day-to-day operations, student records, and parent communication. Computer proficiency required.",
            icon: <Briefcase className="w-6 h-6" />,
        },
        {
            title: "Volunteer Tutor",
            department: "Academic Support",
            type: "Volunteer",
            desc: "Help students with modern academic subjects (Math, Science, English) alongside Islamic studies.",
            icon: <Heart className="w-6 h-6" />,
        },
    ];

    return (
        <main>
            {/* Breadcrumb Header */}
            <section className="bg-brand-dark py-16 md:py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #FBB03B 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 text-brand-gold/80 text-sm mb-4">
                        <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-brand-gold">Careers</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Join Our Team</h1>
                    <p className="text-gray-300 max-w-xl mx-auto text-lg">
                        Be part of our mission to provide free, quality Islamic education to every child.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Why Join Us */}
            <section className="py-14 md:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14 max-w-2xl mx-auto">
                        <span className="inline-block bg-emerald-50 text-brand-green font-semibold px-4 py-1.5 rounded-full text-sm tracking-wide mb-5">
                            Why Join Us
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-dark leading-tight mb-4">
                            Grow With Purpose
                        </h2>
                        <p className="text-gray-500 text-base">
                            At Al-Iqra, every role contributes to a noble cause — shaping the next generation of Muslims.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {[
                            { title: "Meaningful Impact", desc: "Your work directly shapes the lives and futures of young Muslims, creating a ripple effect of knowledge and goodness." },
                            { title: "Supportive Community", desc: "Join a team of passionate educators and staff who support each other in a collaborative Islamic environment." },
                            { title: "Growth Opportunities", desc: "Continuous professional development, workshops, and training to help you grow in your career and deen." },
                        ].map((item, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-14 h-14 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <span className="text-brand-green font-bold text-xl">{i + 1}</span>
                                </div>
                                <h3 className="font-bold text-xl text-brand-dark mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Current Openings */}
            <section className="py-14 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14 max-w-2xl mx-auto">
                        <span className="inline-block bg-emerald-50 text-brand-green font-semibold px-4 py-1.5 rounded-full text-sm tracking-wide mb-5">
                            Open Positions
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-dark leading-tight mb-4">
                            Current Openings
                        </h2>
                        <p className="text-gray-500 text-base">
                            Explore opportunities to contribute your skills and passion.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {openings.map((job, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green shrink-0">
                                        {job.icon}
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-brand-green bg-emerald-50 px-2 py-0.5 rounded-full">{job.type}</span>
                                        <p className="text-xs text-gray-400 mt-1">{job.department}</p>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-brand-dark mb-2">{job.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{job.desc}</p>
                                <Link href="/contact">
                                    <Button className="w-full bg-brand-green hover:bg-brand-green-light text-white font-semibold rounded-xl group">
                                        Apply Now
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-2xl mx-auto bg-brand-dark rounded-3xl p-10 md:p-14 relative overflow-hidden shadow-xl">
                        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #FBB03B 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Don't See Your Role?</h2>
                            <p className="text-gray-300 mb-6">
                                We are always looking for talented individuals who share our passion. Send us your resume and we will reach out when a suitable position opens.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/contact">
                                    <Button size="lg" className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-extrabold h-14 px-8 text-base rounded-full shadow-lg group">
                                        <Mail className="mr-2 w-5 h-5" />
                                        Send Your Resume
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}