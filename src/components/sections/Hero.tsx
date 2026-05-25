"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSlider } from "@/components/ui/image-slider";
import { CrescentStar } from "@/components/sections/IslamicIcons";

const heroSlides = [
    {
        image: "/images/slide1.jpg",
        alt: "Students learning Quran at Al-Iqra Modern Madrasa",
    },
];

export function Hero() {
    return (
        <section className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
            {/* Image Slider Background */}
            <ImageSlider
                slides={heroSlides}
                interval={6000}
                showArrows={false}
                showDots={true}
            />

            {/* Warm gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-dark/50 to-brand-dark/80 z-[5]"></div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5 z-[6]" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #FBB03B 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

            <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-28">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <CrescentStar className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold flex-shrink-0" />
                    <span className="text-brand-gold font-semibold text-xs sm:text-sm tracking-wide sm:tracking-widest uppercase whitespace-nowrap">
                        Admissions Open 2026-27
                    </span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
                    <Link href="/admission">
                        <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-bold bg-brand-gold hover:bg-brand-gold-light text-brand-dark rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group">
                            Apply for Admission
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

            </div>

            {/* Bottom wave divider */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block -mb-[1px]">
                    <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="white" />
                </svg>
            </div>
        </section>
    );
}
