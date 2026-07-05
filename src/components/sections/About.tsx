import { CheckCircle2, BookOpen, GraduationCap, Heart, Home, Users, Monitor, Languages, Calculator, Globe, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function About() {
    return (
        <>
            {/* Introduction Section */}
            <section className="py-14 md:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Left - Image */}
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-green via-emerald-700 to-brand-dark"></div>
                                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1601366159670-80de71bc8429?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                                
                                {/* Bottom quote */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl">
                                    <p className="text-white font-medium italic text-base leading-relaxed">
                                        &ldquo;Seeking knowledge is an obligation upon every Muslim.&rdquo;
                                    </p>
                                    <p className="text-brand-gold font-bold mt-2 text-xs uppercase tracking-wider">— Hadith (Ibn Majah)</p>
                                </div>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-gold/20 rounded-2xl -z-10"></div>
                        </div>

                        {/* Right - Content */}
                        <div>
                            <span className="inline-block bg-emerald-50 text-brand-green font-semibold px-4 py-1.5 rounded-full text-sm tracking-wide mb-6">
                                About Our Institution
                            </span>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-dark leading-[1.15] mb-4">
                                A Beautiful Blend of <span className="text-brand-green">Knowledge</span>, <span className="text-brand-gold">Character</span> & Modern Development
                            </h2>

                            <p className="text-xl md:text-2xl text-brand-green font-urdu mb-5 leading-relaxed" style={{ fontFamily: 'var(--font-urdu)' }}>
                                &#x639;&#x644;&#x645; &#x648;&#x6C1; &#x631;&#x648;&#x634;&#x646;&#x6CC; &#x6C1;&#x6D2; &#x62C;&#x648; &#x62A;&#x627;&#x631;&#x6CC;&#x6A9;&#x6CC;&#x648;&#x6BA; &#x6A9;&#x648; &#x62F;&#x648;&#x631; &#x6A9;&#x631;&#x62A;&#x6CC; &#x6C1;&#x6D2; &#x6D4; &#x62A;&#x639;&#x644;&#x6CC;&#x645; &#x648;&#x6C1; &#x62E;&#x632;&#x627;&#x646;&#x6C1; &#x6C1;&#x6D2; &#x62C;&#x648; &#x646;&#x633;&#x644;&#x648;&#x6BA; &#x6A9;&#x6CC; &#x62A;&#x642;&#x62F;&#x6CC;&#x631;&#x648;&#x6BA; &#x6A9;&#x648; &#x633;&#x646;&#x648;&#x627;&#x631;&#x62A;&#x6CC; &#x6C1;&#x6D2;
                            </p>

                            <p className="text-gray-600 text-base leading-relaxed mb-4">
                                Knowledge is the light that removes darkness. Education is the treasure that shapes the destiny 
                                of generations. With these noble aims, <strong>Al-Iqra Modern Madrasa</strong> was established in 
                                <strong className="text-brand-green"> 2018</strong>. Today, by the grace of Allah, this institution 
                                has become a shining center of learning and character building.
                            </p>

                            <p className="text-gray-600 text-base leading-relaxed mb-8">
                                This is a unique and exemplary educational institution where the fragrance of religious education 
                                is combined with the freshness of modern studies. Education at Al-Iqra Modern Madrasa is based on 
                                character building, moral training, and strong academic foundations.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/admission">
                                    <Button className="bg-brand-green hover:bg-brand-green-light text-white font-bold h-12 px-8 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 group">
                                        New Admission
                                        <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white font-bold h-12 px-8 rounded-full transition-all">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Urdu Content Section */}
            <section className="py-14 md:py-20 bg-brand-dark relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #FBB03B 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                    <div className="text-center mb-10">
                        <span className="inline-block bg-brand-gold/20 text-brand-gold font-semibold px-4 py-1.5 rounded-full text-sm tracking-wide mb-5">
                            اردو
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: 'var(--font-urdu)' }}>
                            الاقرا ماڈرن مدرسہ
                        </h2>
                        <p className="text-brand-gold text-lg" style={{ fontFamily: 'var(--font-urdu)' }}>
                            علم، اخلاق اور جدید ترقی کا حسین امتزاج
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 space-y-6">
                        <div className="space-y-4 text-gray-200 text-lg leading-loose" style={{ fontFamily: 'var(--font-urdu)' }}>
                            <p>
                                علم وہ مشعل ہے جو تاریکیوں کو روشنی میں بدل دیتی ہے۔ تعلیم وہ خزانہ ہے جو نسلوں کی تقدیر سنوار دیتا ہے۔ انہی اعلیٰ مقاصد کے تحت <span className="text-brand-gold font-semibold">الاقرا ماڈرن مدرسہ</span> نے <span className="text-brand-gold font-semibold">۲۰۱۸</span> میں اپنی بنیاد رکھی، اور آج، الحمدللہ، یہ ادارہ علم و تربیت کے ایک روشن مینار کی حیثیت اختیار کر چکا ہے۔
                            </p>
                            <p>
                                یہ ایک ایسا منفرد اور مثالی تعلیمی مرکز ہے جہاں دینی تعلیم کی خوشبو میں عصری علوم کی تازگی گھلی ہوئی ہے۔
                            </p>
                        </div>

                        <div className="border-t border-white/10 pt-6">
                            <p className="text-brand-gold font-bold text-xl mb-5" style={{ fontFamily: 'var(--font-urdu)' }}>
                                یہاں بغیر کسی فیس کے طلباء و طالبات کو:
                            </p>
                            <ul className="grid sm:grid-cols-2 gap-3 text-gray-200 text-lg" style={{ fontFamily: 'var(--font-urdu)' }}>
                                {[
                                    "معیاری تعلیم",
                                    "آرام دہ رہائش",
                                    "روزانہ تین وقت کا پاکیزہ اور متوازن کھانا",
                                    "کپڑے دھونے کی ضروریات",
                                    "اور بنیادی طبی سہولتیں",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                                        <span className="w-6 h-6 bg-brand-gold/20 rounded-full flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Free Facilities Section */}
            <section className="py-14 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14 max-w-2xl mx-auto">
                        <span className="inline-block bg-emerald-50 text-brand-green font-semibold px-4 py-1.5 rounded-full text-sm tracking-wide mb-5">
                            Completely Free of Cost
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-dark leading-tight mb-4">
                            What We <span className="text-brand-green">Provide</span>
                        </h2>
                        <p className="text-gray-500 text-base">
                            Here, without taking any fees, students are provided with everything they need to thrive.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { icon: <GraduationCap className="w-7 h-7" />, title: "Quality Education", desc: "Religious and modern education with structured curriculum and experienced teachers." },
                            { icon: <Home className="w-7 h-7" />, title: "Comfortable Accommodation", desc: "Safe, clean, and well-supervised residential facilities for all students." },
                            { icon: <Heart className="w-7 h-7" />, title: "Nutritious Meals", desc: "Three clean and nutritious meals provided every single day." },
                            { icon: <CheckCircle2 className="w-7 h-7" />, title: "Laundry Facilities", desc: "Regular laundry services to maintain hygiene and cleanliness." },
                            { icon: <Users className="w-7 h-7" />, title: "Basic Medical Care", desc: "Access to basic healthcare and medical attention when needed." },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group">
                                <div className="w-14 h-14 bg-brand-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-lg text-brand-dark mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Curriculum Section */}
            <section className="py-14 md:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14 max-w-2xl mx-auto">
                        <span className="inline-block bg-emerald-50 text-brand-green font-semibold px-4 py-1.5 rounded-full text-sm tracking-wide mb-5">
                            Our Curriculum
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-dark leading-tight mb-4">
                            A Path of <span className="text-brand-green">Faith</span> & <span className="text-brand-gold">Modern Skills</span>
                        </h2>
                        <p className="text-gray-500 text-base">
                            A complete curriculum that nurtures both the soul and the mind.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        {/* Religious Studies */}
                        <div className="bg-brand-dark rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #FBB03B 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-brand-green" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Religious Studies</h3>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        { title: "Hifz-ul-Qur'an", desc: "Complete memorization of the Holy Quran with expert Hafiz teachers." },
                                        { title: "Nazrah", desc: "Learning to read the Quran with proper pronunciation and fluency." },
                                        { title: "Tajweed", desc: "Mastering the rules of Quranic recitation for beautiful and correct reading." },
                                        { title: "Basic Islamic Education", desc: "Foundational knowledge of Fiqh, Seerah, Aqeedah, and Hadith." },
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-semibold text-brand-gold">{item.title}</span>
                                                <p className="text-gray-400 text-sm mt-0.5">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Modern Subjects */}
                        <div className="bg-gray-50 rounded-3xl p-8 md:p-10 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center">
                                    <Monitor className="w-6 h-6 text-brand-green" />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-dark">Modern Subjects</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    { icon: <Languages className="w-5 h-5" />, title: "English", desc: "Building strong communication skills for the global stage." },
                                    { icon: <Languages className="w-5 h-5" />, title: "Hindi", desc: "Proficiency in the national language of India." },
                                    { icon: <Languages className="w-5 h-5" />, title: "Urdu", desc: "Rich literary and linguistic development in Urdu." },
                                    { icon: <Calculator className="w-5 h-5" />, title: "Mathematics", desc: "Developing logical thinking and problem-solving abilities." },
                                    { icon: <Globe className="w-5 h-5" />, title: "Social Studies", desc: "Understanding the world, society, and civic responsibilities." },
                                    { icon: <Monitor className="w-5 h-5" />, title: "Computer Education", desc: "Equipping students with essential digital and technology skills." },
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3">
                                        <div className="w-5 h-5 text-brand-green shrink-0 mt-0.5">{item.icon}</div>
                                        <div>
                                            <span className="font-semibold text-brand-dark">{item.title}</span>
                                            <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Message */}
                    <div className="text-center mt-12 max-w-3xl mx-auto">
                        <p className="text-gray-600 text-base leading-relaxed">
                            All these subjects are taught with modern teaching methods. Our aim is that every student 
                            graduating from here becomes not only a good Hafiz, Qari, or scholar, but also an 
                            <strong className="text-brand-green"> aware, disciplined, and responsible citizen</strong> who 
                            can keep pace with the modern world.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
