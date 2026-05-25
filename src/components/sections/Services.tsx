import { BookOpen, Sparkles, BookHeart, Mic, Languages, MoonStar, Heart, Monitor } from "lucide-react";
import { IslamicStar, Mosque, QuranBook } from "@/components/sections/IslamicIcons";

export function Services() {
    const services = [
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: "Quran Reading",
            urdu: "\u0646\u0627\u0638\u0631\u06C1 \u0642\u0631\u0622\u0646",
            desc: "Learn to read the Holy Quran with proper Makharij and fluency.",
            bg: "from-emerald-500 to-teal-600",
            delay: "animate-reveal-delay-1",
        },
        {
            icon: <Mic className="w-6 h-6" />,
            title: "Tajweed & Tarteel",
            urdu: "\u062A\u062C\u0648\u06CC\u062F \u0648 \u062A\u0631\u062A\u06CC\u0644",
            desc: "Master the rules of Tajweed and beautify your recitation.",
            bg: "from-amber-500 to-orange-600",
            delay: "animate-reveal-delay-2",
        },
        {
            icon: <BookHeart className="w-6 h-6" />,
            title: "Hifz Program",
            urdu: "\u062D\u0641\u0638 \u067E\u0631\u0648\u06AF\u0631\u0627\u0645",
            desc: "Structured memorization with daily revision and individual attention.",
            bg: "from-sky-500 to-blue-600",
            delay: "animate-reveal-delay-3",
        },
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: "Noorul Hikmah",
            urdu: "\u0646\u0648\u0631\u0627\u0644\u062D\u06A9\u0645\u06C1",
            desc: "Foundation course for beginners — Qaida to fluent reading in months.",
            bg: "from-violet-500 to-purple-600",
            delay: "animate-reveal-delay-4",
        },
        {
            icon: <Languages className="w-6 h-6" />,
            title: "Arabic Language",
            urdu: "\u0639\u0631\u0628\u06CC \u0632\u0628\u0627\u0646",
            desc: "Understand the language of the Quran through immersive Arabic studies.",
            bg: "from-rose-500 to-pink-600",
            delay: "animate-reveal-delay-5",
        },
        {
            icon: <MoonStar className="w-6 h-6" />,
            title: "Islamic Studies",
            urdu: "\u0627\u0633\u0644\u0627\u0645\u06CC \u062A\u0639\u0644\u06CC\u0645\u0627\u062A",
            desc: "Comprehensive Fiqh, Seerah, Aqeedah, and Hadith for all ages.",
            bg: "from-cyan-500 to-teal-600",
            delay: "animate-reveal-delay-6",
        },
        {
            icon: <Monitor className="w-6 h-6" />,
            title: "Computer Classes",
            urdu: "\u06A9\u0645\u067E\u06CC\u0648\u0679\u0631 \u0633\u06CC\u06A9\u06BE\u06CC\u06BA",
            desc: "Modern IT training covering programming, web development, graphic design, and digital literacy for the digital age.",
            bg: "from-indigo-500 to-blue-700",
            delay: "animate-reveal-delay-7",
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "School Education",
            urdu: "\u062F\u06CC\u0646\u06CC \u062A\u0639\u0644\u06CC\u0645",
            desc: "Modern academic curriculum alongside Islamic studies for well-rounded students.",
            bg: "from-amber-500 to-orange-600",
            delay: "animate-reveal-delay-8",
        },
    ];

    return (
        <section className="relative z-20 pb-12 -mt-12">
            {/* Islamic decorative background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
                <IslamicStar className="absolute top-4 left-[5%] w-16 h-16 text-brand-dark" />
                <IslamicStar className="absolute top-20 right-[8%] w-12 h-12 text-brand-dark" />
                <Mosque className="absolute bottom-8 left-[15%] w-14 h-14 text-brand-dark" />
                <QuranBook className="absolute bottom-4 right-[10%] w-12 h-12 text-brand-dark" />
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 max-w-5xl mx-auto">
                    {services.map((srv, idx) => (
                        <div
                            key={idx}
                            className={`group relative bg-gradient-to-br ${srv.bg} rounded-2xl shadow-xl hover:shadow-2xl p-5 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden animate-reveal ${srv.delay}`}
                        >
                            {/* Shine overlay */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

                            {/* Decorative corner glow */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-bl-3xl -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>

                            {/* Icon */}
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                                <div className="text-white">{srv.icon}</div>
                            </div>

                            {/* Title */}
                            <h3 className="text-base font-bold text-white mb-0.5 drop-shadow-sm">
                                {srv.title}
                            </h3>

                            {/* Urdu subtitle */}
                            <p className="text-white/80 text-xs font-urdu mb-1" style={{ fontFamily: 'var(--font-urdu)' }}>
                                {srv.urdu}
                            </p>

                            {/* Description */}
                            <p className="text-white/80 text-xs leading-relaxed">
                                {srv.desc}
                            </p>

                            {/* Bottom accent bar */}
                            <div className="absolute bottom-0 left-5 right-5 h-0.5 bg-white/40 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
