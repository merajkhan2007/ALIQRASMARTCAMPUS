import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Pricing() {
    const plans = [
        {
            name: "Basic",
            desc: "For beginners starting their Quran journey",
            features: [
                "3 Classes Per Week",
                "30 Minutes Each",
                "Noorani Qaida / Nazra",
                "Monthly Progress Report",
                "Male & Female Teachers",
            ],
            highlighted: false,
        },
        {
            name: "Standard",
            desc: "Most popular for comprehensive learning",
            features: [
                "5 Classes Per Week",
                "45 Minutes Each",
                "Tajweed & Hifz Included",
                "Weekly Progress Report",
                "Priority Teacher Support",
            ],
            highlighted: true,
        },
        {
            name: "Premium",
            desc: "For dedicated Hifz & advanced studies",
            features: [
                "6 Classes Per Week",
                "60 Minutes Each",
                "Full Islamic Studies",
                "Daily Progress Tracking",
                "Direct Tutor Contact",
            ],
            highlighted: false,
        }
    ];

    return (
        <section className="py-14 md:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-14 max-w-2xl mx-auto">
                    <span className="inline-block bg-emerald-50 text-brand-green font-semibold px-4 py-1.5 rounded-full text-sm tracking-wide mb-5">
                        Our Programs
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-dark leading-tight mb-4">
                        Choose Your Learning Path
                    </h2>
                    <p className="text-gray-500 text-base">
                        All our programs are offered completely free of cost. We only ask for your dedication and commitment.
                    </p>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 ${
                                plan.highlighted
                                    ? 'border-brand-green shadow-xl md:-translate-y-2'
                                    : 'border-gray-100 shadow-sm hover:shadow-lg'
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green text-white font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <div className="text-center mb-6 pb-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-brand-dark mb-1">{plan.name}</h3>
                                <p className="text-sm text-gray-500">{plan.desc}</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-3 text-sm text-gray-700">
                                        <Check className={`w-4 h-4 shrink-0 ${plan.highlighted ? 'text-brand-green' : 'text-brand-gold'}`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/admission">
                                <Button
                                    className={`w-full h-12 rounded-xl font-bold transition-all ${
                                        plan.highlighted
                                            ? 'bg-brand-green hover:bg-brand-green-light text-white'
                                            : 'bg-brand-dark hover:bg-gray-800 text-white'
                                    }`}
                                >
                                    Apply Now
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Note */}
                <p className="text-center text-sm text-gray-400 mt-8">
                    * All programs are offered free of cost. Donations are welcome to support our mission.
                </p>
            </div>
        </section>
    );
}
