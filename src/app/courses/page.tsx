import { Courses } from "@/components/sections/Courses";
import Link from "next/link";

export default function CoursesPage() {
    return (
        <main>
            {/* Breadcrumb Header */}
            <section className="bg-brand-dark py-16 md:py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #FBB03B 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 text-brand-gold/80 text-sm mb-4">
                        <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-brand-gold">Courses</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Our Courses & Curriculum</h1>
                    <p className="text-gray-300 max-w-xl mx-auto text-lg">
                        A Beautiful Blend of Knowledge, Character, and Modern Development — completely free of cost.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="#ffffff" />
                    </svg>
                </div>
            </section>

            <Courses />
        </main>
    );
}