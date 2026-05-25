import { CrescentStar, BismillahDecor, Lantern } from "@/components/sections/IslamicIcons";

export function WelcomeMessage() {
    return (
        <section className="py-12 md:py-16 bg-white relative overflow-hidden">
            {/* Islamic decorative pattern background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <div className="absolute top-8 left-8">
                    <CrescentStar className="w-16 h-16 text-brand-green" />
                </div>
                <div className="absolute top-12 right-12">
                    <Lantern className="w-12 h-12 text-brand-gold" />
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <BismillahDecor className="w-24 h-24 text-brand-green" />
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center relative z-10">
                {/* Greeting */}
                <div className="flex items-center justify-center gap-3 mb-2 animate-reveal">
                    <CrescentStar className="w-7 h-7 sm:w-8 sm:h-8 text-brand-gold" />
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-green">
                        Assalamu Alaikum
                    </h2>
                    <CrescentStar className="w-7 h-7 sm:w-8 sm:h-8 text-brand-gold scale-x-[-1]" />
                </div>

                {/* Welcome line */}
                <p className="text-xl md:text-2xl font-bold text-brand-dark mb-5 animate-reveal animate-reveal-delay-1">
                    Welcome to <span className="text-brand-gold">AL-IQRA MODERN MADRASA</span>
                </p>

                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-3 mb-6 animate-reveal animate-reveal-delay-2">
                    <div className="h-px w-12 bg-brand-gold/40"></div>
                    <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                    <div className="h-px w-12 bg-brand-gold/40"></div>
                </div>

                {/* Description - English */}
                <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-6 animate-reveal animate-reveal-delay-3">
                    We are dedicated to cultivating a generation of learners equipped with profound
                    Islamic knowledge and exceptional moral character. By blending traditional Islamic
                    sciences with a focused, structured environment, we prepare our students to succeed
                    and lead with integrity.
                </p>

                {/* Description - Urdu */}
                <p
                    className="text-gray-700 font-bold text-lg md:text-xl leading-loose max-w-2xl mx-auto animate-reveal animate-reveal-delay-4"
                    style={{ fontFamily: 'var(--font-urdu)' }}
                >
                    &#x627;&#x644;&#x633;&#x644;&#x627;&#x645; &#x639;&#x644;&#x6CC;&#x6A9;&#x645;&#x6D4; &#x627;&#x644;&#x627;&#x642;&#x631;&#x627; &#x645;&#x627;&#x688;&#x631;&#x646; &#x645;&#x62F;&#x631;&#x633;&#x6C1; &#x645;&#x6CC;&#x6BA; &#x62E;&#x648;&#x634; &#x622;&#x645;&#x62F;&#x6CC;&#x62F;&#x6D4;
                </p>
                <p
                    className="text-gray-500 text-lg md:text-xl leading-loose max-w-2xl mx-auto mt-2 animate-reveal animate-reveal-delay-5"
                    style={{ fontFamily: 'var(--font-urdu)' }}
                >
                    &#x6C1;&#x645; &#x627;&#x6CC;&#x6A9; &#x627;&#x6CC;&#x633;&#x6CC; &#x646;&#x633;&#x644; &#x6A9;&#x6CC; &#x62A;&#x631;&#x628;&#x6CC;&#x62A; &#x6A9;&#x6D2; &#x644;&#x6CC;&#x6D2; &#x648;&#x642;&#x641; &#x6C1;&#x6CC;&#x6BA; &#x62C;&#x648; &#x6AF;&#x6C1;&#x631;&#x6D2; &#x627;&#x633;&#x644;&#x627;&#x645;&#x6CC; &#x639;&#x644;&#x645; &#x627;&#x648;&#x631; &#x627;&#x639;&#x644;&#x6CC;&#x0670; &#x627;&#x62E;&#x644;&#x627;&#x642;&#x6CC; &#x6A9;&#x631;&#x62F;&#x627;&#x631; &#x633;&#x6D2; &#x622;&#x631;&#x627;&#x633;&#x62A;&#x6C1; &#x6C1;&#x648;&#x6D4; &#x631;&#x648;&#x627;&#x6CC;&#x62A;&#x6CC; &#x627;&#x633;&#x644;&#x627;&#x645;&#x6CC; &#x639;&#x644;&#x648;&#x645; &#x6A9;&#x648; &#x627;&#x6CC;&#x6A9; &#x645;&#x646;&#x638;&#x645; &#x627;&#x648;&#x631; &#x645;&#x631;&#x6A9;&#x648;&#x632; &#x645;&#x627;&#x62D;&#x648;&#x644; &#x6A9;&#x6D2; &#x633;&#x627;&#x62A;&#x6BE; &#x6C1;&#x645; &#x622;&#x6C1;&#x646;&#x6AF; &#x6A9;&#x631; &#x6A9;&#x6D2;&#x6D4; &#x6C1;&#x645; &#x627;&#x67E;&#x646;&#x6D2; &#x637;&#x644;&#x628;&#x627;&#x621; &#x6A9;&#x648; &#x6A9;&#x627;&#x645;&#x6CC;&#x627;&#x628;&#x6CC; &#x627;&#x648;&#x631; &#x62F;&#x6CC;&#x627;&#x646;&#x62A;&#x62F;&#x627;&#x631;&#x6CC; &#x6A9;&#x6D2; &#x633;&#x627;&#x62A;&#x6BE; &#x622;&#x6AF;&#x6D2; &#x628;&#x691;&#x6BE;&#x646;&#x6D2; &#x6A9;&#x6D2; &#x644;&#x6CC;&#x6D2; &#x62A;&#x6CC;&#x627;&#x631; &#x6A9;&#x631;&#x62A;&#x6D2; &#x6C1;&#x6CC;&#x6BA;&#x6D4;
                </p>
            </div>
        </section>
    );
}