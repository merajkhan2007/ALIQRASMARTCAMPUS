import { Button } from "@/components/ui/button";

export function Gallery() {
    const images = [
        { src: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80", alt: "Students in class" },
        { src: "https://images.unsplash.com/photo-1585090150242-4dc4a83fbba3?auto=format&fit=crop&q=80", alt: "Campus building" },
        { src: "https://images.unsplash.com/photo-1594950482436-1e646aaecd08?auto=format&fit=crop&q=80", alt: "Quran study session" },
        { src: "https://images.unsplash.com/photo-1601366159670-80de71bc8429?auto=format&fit=crop&q=80", alt: "Prayer hall" },
        { src: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80", alt: "Library" },
        { src: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80", alt: "Graduation ceremony" },
    ];

    return (
        <section id="gallery" className="py-14 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div className="max-w-xl">
                        <span className="inline-block bg-emerald-50 text-brand-green font-semibold px-4 py-1.5 rounded-full text-sm tracking-wide mb-5">
                            Campus Life
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-dark leading-tight">
                            Glimpses of Our Madrasa
                        </h2>
                    </div>
                    <Button className="bg-brand-green hover:bg-brand-green-light text-white font-semibold px-6 h-11 rounded-full shadow-md shrink-0">
                        View All Photos
                    </Button>
                </div>

                {/* Gallery grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer">
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${img.src})` }}
                            ></div>
                            <div className="absolute inset-0 bg-brand-dark/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-white font-semibold text-sm bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full">
                                    {img.alt}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
