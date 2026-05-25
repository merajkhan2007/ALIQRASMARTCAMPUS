import { ArrowRight, Heart, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mosque, Lantern } from "@/components/sections/IslamicIcons";

export function CTARibbon() {
    return (
        <section className="py-6 md:py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">

                    {/* Admission Card (Left) */}
                    <div className="relative bg-brand-green rounded-2xl overflow-hidden shadow-lg group/card">
                        {/* Subtle glow */}
                        <div className="absolute top-0 right-0 w-36 h-36 bg-brand-gold/12 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                        <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-gold/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

                        <div className="relative z-10 px-5 py-6 md:px-7 md:py-7 flex flex-col">
                            <h2 className="text-lg md:text-xl font-extrabold text-white leading-snug">
                                Ready to Begin Your Child's Islamic Education?
                            </h2>
                            <p className="text-sm md:text-base text-brand-gold font-bold leading-relaxed mt-1" style={{ fontFamily: 'var(--font-urdu)' }}>
                                اپنے بچوں کی دینی تعلیم کا سفر اب شروع کیجے!
                            </p>
                            <p className="text-emerald-200/80 text-xs mt-1.5">
                                Admissions are now open. Join hundreds of students already learning at Al-Iqra.
                            </p>
                            <div className="mt-4">
                                <Link href="/admission">
                                    <Button size="sm" className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold h-9 px-5 text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-300 group">
                                        Apply for Admission
                                        <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Donation Card (Right) */}
                    <div className="relative bg-gradient-to-br from-brand-green via-brand-green to-brand-green-light rounded-2xl overflow-hidden shadow-lg group/card">
                        {/* Subtle glow */}
                        <div className="absolute top-0 right-0 w-36 h-36 bg-brand-gold/12 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                        <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-gold/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

                        <div className="relative z-10 px-5 py-6 md:px-7 md:py-7 flex flex-col">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="inline-flex items-center justify-center w-9 h-9 bg-brand-gold/20 backdrop-blur-sm rounded-xl">
                                    <HandHeart className="w-4.5 h-4.5 text-brand-gold" />
                                </div>
                                <Lantern className="w-6 h-6 text-brand-gold/30" />
                            </div>
                            <h2 className="text-lg md:text-xl font-extrabold text-white leading-snug">
                                Support Our Mission — <span className="text-brand-gold">Make a Donation</span>
                            </h2>
                            <p className="text-sm md:text-base text-brand-gold/80 font-bold leading-relaxed mt-1" style={{ fontFamily: 'var(--font-urdu)' }}>
                                القرآن و دینی تعلیم کی خدمت میں حصہ دیڬے
                            </p>
                            <p className="text-emerald-200/80 text-xs mt-1.5">
                                Your contributions help us provide quality Islamic and modern education to deserving students.
                            </p>
                            <div className="mt-4">
                                <Link href="/contact">
                                    <Button size="sm" className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold h-9 px-5 text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-300 group">
                                        Donate Now
                                        <Heart className="ml-1.5 w-3.5 h-3.5 group-hover:scale-110 transition-transform fill-current" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
