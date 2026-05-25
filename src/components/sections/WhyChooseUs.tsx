import { GraduationCap, Building2, Heart } from "lucide-react";
import { IslamicStar } from "@/components/sections/IslamicIcons";

const differences = [
    {
        icon: <GraduationCap className="w-6 h-6" />,
        title: "Expert Faculty",
        urdu: "\u0645\u0627\u06C1\u0631 \u0627\u0633\u0627\u062A\u0630\u06C1",
        desc: "Learn directly from highly qualified educators dedicated to student success.",
        descUrdu: "\u0637\u0644\u0628\u0627\u0621 \u06A9\u06CC \u06A9\u0627\u0645\u06CC\u0627\u0628\u06CC \u06A9\u06D2 \u0644\u06CC\u06D2 \u0648\u0642\u0641 \u0634\u062F\u06C1 \u0627\u0639\u0644\u06CC\u0670 \u062A\u0639\u0644\u06CC\u0645 \u06CC\u0627\u0641\u062A\u06C1 \u0627\u0633\u0627\u062A\u0630\u06C1 \u0633\u06D2 \u0628\u0631\u0627\u06C1\u0650 \u0631\u0627\u0633\u062A \u0633\u06CC\u06A9\u06BE\u06CC\u06BA\u06D4",
        color: "from-emerald-500 to-teal-600",
        delay: "animate-reveal-delay-1",
    },
    {
        icon: <Building2 className="w-6 h-6" />,
        title: "Modern Environment",
        urdu: "\u062C\u062F\u06CC\u062F \u0645\u0627\u062D\u0648\u0644",
        desc: "A clean, secure, and professional campus optimized for focused learning.",
        descUrdu: "\u062E\u0648\u0628\u0635\u0648\u0631\u062A\u060C \u0645\u062D\u0641\u0648\u0638 \u0627\u0648\u0631 \u067E\u06CC\u0634\u06C1 \u0648\u0631\u0627\u0646\u06C1 \u06A9\u06CC\u0645\u067E\u0633 \u062C\u0648 \u0645\u0631\u062A\u06A9\u0648\u0632 \u062A\u0639\u0644\u06CC\u0645 \u06A9\u06D2 \u0644\u06CC\u06D2 \u0645\u0648\u0632\u0648\u06BA \u0628\u0646\u0627\u06CC\u0627 \u06AF\u06CC\u0627 \u06C1\u06D2\u06D4",
        color: "from-sky-500 to-blue-600",
        delay: "animate-reveal-delay-2",
    },
    {
        icon: <Heart className="w-6 h-6" />,
        title: "Holistic Tarbiyah",
        urdu: "\u0645\u06A9\u0645\u0644 \u062A\u0631\u0628\u06CC\u062A",
        desc: "We prioritize moral development and character building alongside academic rigor.",
        descUrdu: "\u06C1\u0645 \u062A\u0639\u0644\u06CC\u0645\u06CC \u0633\u062E\u062A\u06CC \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u0627\u062E\u0644\u0627\u0642\u06CC \u0646\u0634\u0648\u0648\u0646\u0645\u0627 \u0627\u0648\u0631 \u06A9\u0631\u062F\u0627\u0631 \u0633\u0627\u0632\u06CC \u06A9\u0648 \u062A\u0631\u062C\u06CC\u062D \u062F\u06CC\u062A\u06D2 \u06C1\u06CC\u06BA\u06D4",
        color: "from-amber-500 to-orange-600",
        delay: "animate-reveal-delay-3",
    },
];

export function WhyChooseUs() {
    return (
        <section className="py-8 md:py-12 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Section heading */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark mb-3 animate-reveal">
                        The <span className="text-brand-gold">AL-IQRA MODERN MADRASA</span> Difference
                    </h2>
                    {/* Decorative divider */}
                    <div className="flex items-center justify-center gap-3 mb-4 animate-reveal animate-reveal-delay-1">
                        <div className="h-px w-10 bg-brand-gold/40"></div>
                        <IslamicStar className="w-5 h-5 text-brand-gold" />
                        <div className="h-px w-10 bg-brand-gold/40"></div>
                    </div>
                    <p
                        className="text-gray-500 text-base md:text-lg max-w-xl mx-auto animate-reveal animate-reveal-delay-1"
                        style={{ fontFamily: 'var(--font-urdu)' }}
                    >
                        &#x627;&#x644;&#x627;&#x642;&#x631;&#x627; &#x645;&#x627;&#x688;&#x631;&#x646; &#x645;&#x62F;&#x631;&#x633;&#x6C1; &#x6A9;&#x627; &#x641;&#x631;&#x642;
                    </p>
                </div>

                {/* Three difference cards */}
                <div className="grid md:grid-cols-3 gap-5">
                    {differences.map((item, idx) => (
                        <div
                            key={idx}
                            className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 transition-all duration-500 hover:-translate-y-1 overflow-hidden animate-reveal ${item.delay}`}
                        >
                            {/* Corner glow */}
                            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${item.color} opacity-8 rounded-bl-2xl -mr-4 -mt-4 group-hover:opacity-15 transition-opacity`}></div>

                            {/* Icon */}
                            <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-all duration-300`}>
                                <div className="text-white">{item.icon}</div>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-brand-dark mb-1 group-hover:text-brand-green transition-colors">
                                {item.title}
                            </h3>

                            {/* Urdu title */}
                            <p className="text-brand-gold font-bold text-xs mb-2" style={{ fontFamily: 'var(--font-urdu)' }}>
                                {item.urdu}
                            </p>

                            {/* Description - English */}
                            <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                {item.desc}
                            </p>

                            {/* Description - Urdu */}
                            <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-urdu)' }}>
                                {item.descUrdu}
                            </p>

                            {/* Bottom accent bar */}
                            <div className={`absolute bottom-0 left-5 right-5 h-0.5 bg-gradient-to-r ${item.color} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
