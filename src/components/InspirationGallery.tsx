"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { useState } from "react";

const galleryImages = [
    "https://images.unsplash.com/photo-1540932296235-d84c01570fdd?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599809275372-b40c7e9293ca?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop",
];

export default function InspirationGallery() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <section id="inspiration" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h3 className="text-gold tracking-[0.2em] text-sm uppercase mb-4">Moodboard</h3>
                    <h2 className="text-4xl md:text-5xl font-serif text-sand">Inspiration Gallery</h2>
                </div>

                {/* Masonry CSS Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {galleryImages.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="relative group cursor-zoom-in break-inside-avoid overflow-hidden rounded-sm"
                            onClick={() => setSelectedImage(src)}
                        >
                            <img src={src} alt={`Inspiration ${index + 1}`} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <ZoomIn className="text-white drop-shadow-lg" size={32} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-6 right-6 text-white hover:text-gold transition-colors">
                            <X size={32} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            src={selectedImage}
                            alt="Full screen inspiration"
                            className="max-w-full max-h-[90vh] object-contain shadow-2xl border-4 border-white/10"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
