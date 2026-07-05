import Link from "next/link";
import { BookOpen, GraduationCap, Monitor, Languages, Calculator, Globe, Heart, Users, CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Courses() {
    return (
        <>
            {/* Section 1: Introduction & Educational Approach */}
            <section className="py-14 md:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image */}
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585090150242-4dc4a83fbba3?auto=format&fit=crop&q=80')" }}
                                ></div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-brand-gold text-brand-dark rounded-xl p-4 shadow-lg hidden md:block">
                                <p className="text-sm font-bold">Since 2018</p>
                                <p className="text-2xl font-extrabold">{new Date().getFullYear() - 2018}+ Years</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <span className="inline-block bg-emerald-50 text-brand-green font-semibold px-4 py-1.5 rounded-full text-sm tracking-wide mb-5">
                                Our Educational Approach
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark leading-tight mb-6">
                                A Complete Curriculum — A Path of Faith and Modern Skills
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Education at Al-Iqra Modern Madrasa is based on character building, moral training, and strong academic foundations.
                                This is a unique and exemplary educational institution where the fragrance of religious education is combined with the freshness of modern studies.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Here, without taking any fees, students are provided with quality education, comfortable accommodation,
                                nutritious meals, laundry facilities, and basic medical care — all completely free of cost.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/admission">
                                    <Button size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white font-bold h-12 px-8 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group">
                                        New Admission
                                        <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" size="lg" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white font-semibold h-12 px-8 rounded-xl transition-all">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Religious Studies */}
            <section className="py-14 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14 max-w-2xl mx-auto">
                        <span className="inline-block bg-brand-gold/20 text-brand-dark font-semibold px-4 py-1.5 rounded-full text-sm tracking-wide mb-5">
                            Religious Studies
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark leading-tight mb-4">
                            Islamic Education Programs
                        </h2>
                        <p className="text-gray-500 text-base">
                            Our religious curriculum nurtures spiritual growth and a deep connection with the Qur'an and Islamic teachings.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
                        {[
                            { icon: BookOpen, title: "Hifz-ul-Qur'an", desc: "Complete memorization of the Holy Qur'an with proper Tajweed and revision schedule." },
                            { icon: GraduationCap, title: "Nazrah", desc: "Learning to read the Qur'an fluently with correct pronunciation and articulation." },
                            { icon: Heart, title: "Tajweed", desc: "Mastering the rules of Qur'anic recitation for beautiful and accurate tilawah." },
                            { icon: Users, title: "Basic Islamic Education", desc: "Foundational knowledge of Aqeedah, Fiqh, Seerah, Hadith, and Islamic manners." },
                            { icon: CheckCircle2, title: "Moral Training", desc: "Character building and ethical development rooted in Islamic values and teachings." },
                        ].map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 text-center group">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-green transition-colors duration-300">
                                        <Icon className="w-7 h-7 text-brand-green group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="font-bold text-brand-dark mb-2">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Section 3: Modern Subjects */}
            <section className="py-14 md:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14 max-w-2xl mx-auto">
                        <span className="inline-block bg-emerald-50 text-brand-green font-semibold px-4 py-1.5 rounded-full text-sm tracking-wide mb-5">
                            Modern Subjects
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark leading-tight mb-4">
                            Academic Excellence
                        </h2>
                        <p className="text-gray-500 text-base">
                            Alongside religious studies, we provide a strong foundation in modern academic subjects to prepare students for the contemporary world.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            { icon: Languages, title: "English", desc: "Comprehensive English language learning — reading, writing, grammar, and communication skills for global readiness." },
                            { icon: Languages, title: "Hindi", desc: "Strong foundation in Hindi language and literature for cultural connection and academic proficiency." },
                            { icon: Languages, title: "Urdu", desc: "Mastery of Urdu reading, writing, and expression — a language of culture, poetry, and Islamic scholarship." },
                            { icon: Calculator, title: "Mathematics", desc: "Building logical thinking and problem-solving abilities through structured mathematics education." },
                            { icon: Globe, title: "Social Studies", desc: "Understanding history, geography, civics, and society to develop informed and responsible citizens." },
                            { icon: Monitor, title: "Computer Education", desc: "Practical computer skills and digital literacy to keep pace with the modern technological world." },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="group bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-brand-green hover:shadow-md transition-all duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green transition-colors duration-300">
                                            <Icon className="w-6 h-6 text-brand-green group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-brand-dark mb-1.5">{item.title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Section 4: Closing Statement */}
            <section className="py-14 md:py-20 bg-brand-dark relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #FBB03B 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <GraduationCap className="w-16 h-16 text-brand-gold mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                        Shaping Future Leaders
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                        All these subjects are taught with modern teaching methods. Our aim is that every student graduating from here becomes not only a good Hafiz, Qari, or scholar, but also an aware, disciplined, and responsible citizen who can keep pace with the modern world.
                    </p>
                    <Link href="/admission">
                        <Button size="lg" className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-extrabold h-14 px-10 rounded-full shadow-lg hover:shadow-xl transition-all text-base">
                            Enroll Your Child Today
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    );
}
