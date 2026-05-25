import { BookOpen, Heart } from "lucide-react";
import Link from "next/link";

export function FeaturesCards() {
    const features = [
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: "Hifz-ul-Quran",
            urdu: "\u062D\u0641\u0638 \u0627\u0644\u0642\u0631\u0622\u0646",
            desc: "Complete Quran memorization with Tajweed under certified Huffaz teachers.",
            bg: "from-emerald-600 to-green-700",
            delay: "animate-reveal-delay-1",
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "School Education",
            urdu: "\u062F\u06CC\u0646\u06CC \u062A\u0639\u0644\u06CC\u0645",
            desc: "Modern academic curriculum alongside Islamic studies for well-rounded students.",
            bg: "from-amber-500 to-orange-600",
            delay: "animate-reveal-delay-2",
        },
    ];

    return (
        <section className="relative z-20 pb-12 pt-2">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-4 lg:gap-5 max-w-xl mx-auto">
                    {features.map((feat, idx) => (
                        <div
                            key={idx}
                            className={`group relative bg-gradient-to-br ${feat.bg} rounded-2xl shadow-xl hover:shadow-2xl p-5 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden animate-reveal ${feat.delay}`}
                        >
                            {/* Shine overlay */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

                            {/* Decorative corner glow */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-bl-3xl -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>

                            {/* Icon */}
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                                <div className="text-white">{feat.icon}</div>
                            </div>

                            {/* Title */}
                            <h3 className="text-base font-bold text-white mb-0.5 drop-shadow-sm">
                                {feat.title}
                            </h3>

                            {/* Urdu subtitle */}
                            <p className="text-white/80 text-xs font-urdu mb-1.5" style={{ fontFamily: 'var(--font-urdu)' }}>
                                {feat.urdu}
                            </p>

                            {/* Description */}
                            <p className="text-white/80 text-xs leading-relaxed mb-4">
                                {feat.desc}
                            </p>

                            {/* CTA Link */}
                            <Link href="/admission" className="inline-flex items-center font-semibold text-xs text-white/90 hover:text-white transition-colors group/link">
                                Learn More
                                <span className="ml-1 group-hover/link:translate-x-1 transition-transform">→</span>
                            </Link>

                            {/* Bottom accent bar */}
                            <div className="absolute bottom-0 left-5 right-5 h-0.5 bg-white/40 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
