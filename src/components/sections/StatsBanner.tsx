import { Users, GraduationCap, Star, ShieldCheck } from "lucide-react";

export function StatsBanner() {
    return (
        <div className="py-12 bg-brand-green relative -mt-10 mx-auto max-w-6xl rounded-2xl shadow-2xl z-20 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-white/20">

                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-16 h-16 bg-brand-gold text-brand-dark rounded-full flex items-center justify-center mb-4 shadow-lg shrink-0">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-4xl font-extrabold text-white mb-2">18,000+</h4>
                            <p className="text-brand-gold font-bold uppercase tracking-wider text-sm">Enrolled Students</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-16 h-16 bg-brand-gold text-brand-dark rounded-full flex items-center justify-center mb-4 shadow-lg shrink-0">
                            <Star className="w-8 h-8 fill-brand-dark" />
                        </div>
                        <div>
                            <h4 className="text-4xl font-extrabold text-white mb-2">4.9/5</h4>
                            <p className="text-brand-gold font-bold uppercase tracking-wider text-sm">Average Rating</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-16 h-16 bg-brand-gold text-brand-dark rounded-full flex items-center justify-center mb-4 shadow-lg shrink-0">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-4xl font-extrabold text-white mb-2">250+</h4>
                            <p className="text-brand-gold font-bold uppercase tracking-wider text-sm">Qualified Tutors</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-16 h-16 bg-brand-gold text-brand-dark rounded-full flex items-center justify-center mb-4 shadow-lg shrink-0">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-4xl font-extrabold text-white mb-2">22+</h4>
                            <p className="text-brand-gold font-bold uppercase tracking-wider text-sm">Years Experience</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
