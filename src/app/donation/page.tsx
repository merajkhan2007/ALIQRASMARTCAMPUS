import Link from "next/link";
import { Heart, Banknote, QrCode, Building2, ArrowRight } from "lucide-react";

export default function DonationPage() {
    return (
        <main>
            {/* Breadcrumb Header */}
            <section className="bg-brand-dark py-16 md:py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #FBB03B 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 text-brand-gold/80 text-sm mb-4">
                        <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-brand-gold">Donate</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Sadaqah Jariyah — A Gift That Keeps Giving</h1>
                    <p className="text-gray-300 max-w-xl mx-auto text-lg">
                        Your donation is an ongoing charity that continues to benefit you even after this life — every letter of Quran a child learns, every prayer they offer, every good deed they do, you share in the reward.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="#121212" />
                    </svg>
                </div>
            </section>

            {/* Donation Methods */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-flex items-center gap-2 text-brand-green font-semibold text-sm uppercase tracking-wider mb-3">
                            <Heart className="w-4 h-4 text-brand-gold fill-brand-gold" />
                            Ways to Give
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">Choose Your Method</h2>
                        <p className="text-gray-500 mt-3 max-w-lg mx-auto">Select the most convenient way to contribute — every donation makes a lasting impact.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Bank Transfer */}
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-t-4 border-brand-green">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 rounded-bl-full -mr-4 -mt-4 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative p-8">
                                <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center mb-5 group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                                    <Building2 className="w-8 h-8 text-brand-green group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-1">Bank Transfer</h3>
                                <p className="text-xs text-gray-400 mb-5">Direct NEFT / RTGS / IMPS</p>
                                <div className="space-y-0">
                                    {[
                                        ["Account Name", "AL IQRA MODERN MADRASA"],
                                        ["Account No.", "123456789012"],
                                        ["Bank", "State Bank of India"],
                                        ["IFSC Code", "SBIN0001234"],
                                    ].map(([label, value], i) => (
                                        <div key={i} className="flex justify-between items-center py-3 text-sm border-b border-gray-50 last:border-0">
                                            <span className="text-gray-500">{label}</span>
                                            <span className="font-semibold text-brand-dark text-right max-w-[60%]">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* UPI / QR Code */}
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-t-4 border-brand-gold">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-bl-full -mr-4 -mt-4 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative p-8">
                                <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center mb-5 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                                    <QrCode className="w-8 h-8 text-brand-gold group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-1">UPI / QR Code</h3>
                                <p className="text-xs text-gray-400 mb-5">Instant payment via any UPI app</p>
                                <div className="mb-5 p-3 bg-gray-50 rounded-xl text-center">
                                    <span className="text-xs text-gray-400 block mb-1">UPI ID</span>
                                    <span className="font-bold text-brand-dark text-sm tracking-wide">aliqramadrasa@sbi</span>
                                </div>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center group-hover:border-brand-gold/40 transition-colors duration-300">
                                    <QrCode className="w-20 h-20 text-gray-300 group-hover:text-brand-gold/60 transition-colors duration-300" />
                                    <span className="text-xs text-gray-400 mt-2">Scan to pay instantly</span>
                                </div>
                            </div>
                        </div>

                        {/* Cash / Cheque */}
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-t-4 border-brand-green-light">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green-light/5 rounded-bl-full -mr-4 -mt-4 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative p-8">
                                <div className="w-16 h-16 rounded-2xl bg-brand-green-light/10 flex items-center justify-center mb-5 group-hover:bg-brand-green-light group-hover:text-white transition-all duration-300">
                                    <Banknote className="w-8 h-8 text-brand-green-light group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-1">Cash / Cheque</h3>
                                <p className="text-xs text-gray-400 mb-5">In-person donation at our campus</p>
                                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                                    Visit our campus to donate in person. Cheques should be payable to:
                                </p>
                                <div className="p-3 bg-brand-green/5 rounded-xl text-center mb-5">
                                    <span className="font-bold text-brand-dark text-sm">"Al-Iqra Modern Madrasa"</span>
                                </div>
                                <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                                    <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        <span className="font-semibold text-gray-700">Campus Address</span><br />
                                        Village Post Office, District,<br />State - PIN Code
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-brand-green to-brand-green-light">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Make a Difference?</h2>
                    <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                        Contact us for any questions about donations or to learn more about how your contribution is used.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-gold text-brand-green font-bold 
                            hover:bg-brand-gold-light hover:shadow-lg hover:shadow-brand-gold/30 transition-all duration-300"
                    >
                        Contact Us <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}