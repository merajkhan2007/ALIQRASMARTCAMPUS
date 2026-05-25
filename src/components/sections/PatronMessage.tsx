import Image from "next/image";
import { Quote } from "lucide-react";
import { CrescentStar, BismillahDecor } from "@/components/sections/IslamicIcons";

export function PatronMessage() {
    return (
        <section className="py-8 md:py-12 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section heading */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-2">
                        <CrescentStar className="w-6 h-6 text-brand-gold mr-2" />
                        <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark">
                            MESSAGE FROM <span className="text-brand-gold">OUR PATRON</span>
                        </h2>
                        <CrescentStar className="w-6 h-6 text-brand-gold ml-2 scale-x-[-1]" />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-10 bg-brand-gold/40"></div>
                        <BismillahDecor className="w-5 h-5 text-brand-gold" />
                        <div className="h-px w-10 bg-brand-gold/40"></div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="flex flex-col md:flex-row">

                            {/* Image Side */}
                            <div className="md:w-2/5 bg-gradient-to-br from-brand-green to-emerald-800 p-8 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
                                {/* Decorative circles */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-gold/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-36 h-44 md:w-48 md:h-56 relative mb-5 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl">
                                        <Image
                                            src="/images/AnwarKhan-removebg-preview.png"
                                            alt="Haji Anwar Khan"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-white text-lg">Haji Anwar Khan</h3>
                                        <p className="text-brand-gold text-sm font-medium">Patron, Al-Iqra Modern Madrasa</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message Side */}
                            <div className="md:w-3/5 p-8 md:p-12">
                                <p className="text-lg text-brand-green font-urdu mb-5 leading-relaxed text-right" style={{ fontFamily: 'var(--font-urdu)' }}>
                                    سرپرست کا پیغام
                                </p>

                                <div className="relative">
                                    <Quote className="absolute -top-2 -left-3 w-10 h-10 text-gray-100 -z-10" />

                                    <div className="space-y-5 text-gray-600 leading-relaxed text-sm md:text-base">
                                        <div>
                                            <p>
                                                Education is the most powerful tool to transform lives and communities.
                                                Through Al-Iqra Modern Madrasa, we aim to remove all barriers that prevent
                                                our children from gaining Islamic & modern knowledge. It is our duty as a
                                                community to ensure that every child, regardless of their family's financial
                                                situation, has access to the teachings of the Quran and the beautiful guidance
                                                of Islam.
                                            </p>
                                            <p className="mt-2 text-gray-500 leading-relaxed" style={{ fontFamily: 'var(--font-urdu)' }}>
                                                تعلیم سب سے طاقتور ذریعہ ہے زندگیوں اور معاشروں کو بدلنے کا۔ الاقرا ماڈرن مدرسہ کے ذریعے ہم ان تمام رکاوٹوں کو دور کرنا چاہتے ہیں جو ہمارے بچوں کو اسلامی اور جدید تعلیم حاصل کرنے سے روکتی ہیں۔ بحیثیتِ معاشرہ یہ ہماری ذمہ داری ہے کہ ہر بچہ، چاہے اس کے خاندان کی مالی حالت کیسی بھی ہو، قرآن کی تعلیمات اور اسلام کی خوبصورت رہنمائی تک رسائی حاصل کر سکے۔
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                This madrasa is not just an educational institution&mdash;it is a home where
                                                students are nurtured spiritually, intellectually, and emotionally. By providing
                                                free education, meals, and accommodation, we hope to create scholars and
                                                righteous individuals who will benefit society and earn the pleasure of Allah.
                                            </p>
                                            <p className="mt-2 text-gray-500 leading-relaxed" style={{ fontFamily: 'var(--font-urdu)' }}>
                                                یہ مدرسہ محض ایک تعلیمی ادارہ نہیں ہے — یہ ایک گھر ہے جہاں طلباء کی روحانی، ذہنی اور جذباتی تربیت کی جاتی ہے۔ مفت تعلیم، کھانے اور رہائش کی سہولت فراہم کر کے ہم ایسے علماء اور صالح افراد تیار کرنا چاہتے ہیں جو معاشرے کو فائدہ پہنچائیں اور اللہ کی رضا حاصل کریں۔
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                I invite all parents to entrust us with their children's Islamic education,
                                                and I encourage community members to support this noble cause through their
                                                prayers and contributions.
                                            </p>
                                            <p className="mt-2 text-gray-500 leading-relaxed" style={{ fontFamily: 'var(--font-urdu)' }}>
                                                میں تمام والدین کو دعوت دیتا ہوں کہ وہ اپنے بچوں کی اسلامی تعلیم کے لیے ہم پر اعتماد کریں، اور میں کمیونٹی کے افراد کی حوصلہ افزائی کرتا ہوں کہ وہ اپنی دعاؤں اور عطیات کے ذریعے اس نیک مقصد کی حمایت کریں۔
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
