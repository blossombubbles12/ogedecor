"use client";

import { motion } from "framer-motion";

export default function BrandStory() {
    return (
        <section className="py-24 md:py-32 relative overflow-hidden">
            {/* Background Pattern - African Geometric Lines */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-gold tracking-[0.2em] text-sm uppercase mb-4">The Philosophy</h3>
                        <h2 className="text-4xl md:text-5xl font-serif text-sand leading-tight mb-6">
                            Designing with <br /> <span className="text-white/50 italic">Soul & Structure</span>
                        </h2>
                        <div className="h-1 w-24 bg-gold mb-8" />
                        <p className="text-white/70 text-lg leading-relaxed mb-6">
                            OgeDecor was born from a desire to bridge the gap between ancient African artistry and futuristic interior design.
                            We believe that true luxury lies in the story behind the materials, the geometry of the layout, and the emotion of the space.
                        </p>
                        <p className="text-white/70 text-lg leading-relaxed">
                            Inspired by the fictional yet culturally rooted aesthetic of Wakanda, our designs are purely Afro-futuristic—clean lines,
                            deep textures, and a subtle infusion of heritage that feels both timeless and ahead of its time.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[600px] w-full bg-neutral-900 rounded-sm overflow-hidden"
                >
                    {/* Abstract/Portrait Placeholder */}
                    <div className="absolute inset-0 bg-[url('/philosophy-bg.png')] bg-cover bg-center opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />

                    <div className="absolute bottom-8 left-8">
                        <p className="text-gold font-serif text-2xl italic">"Luxury is a feeling."</p>
                        <p className="text-white/60 text-sm mt-2 uppercase tracking-widest">— Ogechi</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
