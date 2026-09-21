"use client";

import { motion } from "framer-motion";
import { Quote, Sparkles, Award, Heart, Camera } from "lucide-react";

export default function AboutContent() {
    return (
        <main className="min-h-screen bg-obsidian text-sand pt-32 pb-24 overflow-x-hidden">
            {/* Hero Section */}
            <section className="container mx-auto px-6 mb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative group h-[700px] w-full"
                    >
                        <div className="absolute -inset-4 border border-gold/20 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
                        <div
                            className="absolute inset-0 bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-1000"
                            style={{ backgroundImage: "url('/ogechi-portrait.png')" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />

                        <div className="absolute bottom-8 left-8 right-8 text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-obsidian/40 backdrop-blur-md p-6 border border-white/10"
                            >
                                <p className="text-gold font-serif text-2xl italic mb-2">Manifesting the Future of African Luxury.</p>
                                <p className="text-white/40 text-xs uppercase tracking-widest">— The Visionary</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-gold tracking-[0.4em] uppercase text-xs mb-4 font-bold">The Creative Soul</h3>
                            <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight">
                                Ogechi Cynthia <br /> <span className="text-gold">Onuegbu</span>
                            </h1>
                            <div className="h-1 w-24 bg-gold mt-8" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="space-y-6 text-lg text-white/70 leading-relaxed font-light"
                        >
                            <p>
                                Ogechi Cynthia Onuegbu is more than an interior designer; she is a visual storyteller and a design alchemist. With a profound connection to her Nigerian heritage and a futuristic outlook, Ogechi has defined the "Afro-luxury" aesthetic in modern interiors.
                            </p>
                            <p>
                                Her journey began with a simple observation: the world was ready for a design language that celebrated African geometry and warmth without sacrificing the clean, sharp lines of contemporary minimalism.
                            </p>
                            <p>
                                Every space curated by Ogechi is a balance of "Soul and Structure." She believes that an interior should be a sanctuary—a physical manifestation of one's aspirations and a tribute to cultural identity.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-8 py-8 border-y border-white/5"
                        >
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-3xl font-serif text-gold">10+</span>
                                <span className="text-xs uppercase tracking-[0.2em] text-white/40">Years Experience</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-3xl font-serif text-gold">150+</span>
                                <span className="text-xs uppercase tracking-[0.2em] text-white/40">Spaces Manifested</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Design Philosophy / Pillars */}
            <section className="bg-black/40 py-32 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-serif text-white"
                        >
                            Principles of Alchemy
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Sparkles,
                                title: "Modern Heritage",
                                content: "Blending ancestral African patterns with futuristic materials like obsidian, brass, and velvet."
                            },
                            {
                                icon: Award,
                                title: "Precision Craft",
                                content: "Working with master artisans to ensure every bespoke piece is a work of structural perfection."
                            },
                            {
                                icon: Heart,
                                title: "Emotional Resonance",
                                content: "Designing not just for the eyes, but for the soul. Creating spaces that transform the mood of those within."
                            }
                        ].map((pillar, idx) => (
                            <motion.div
                                key={pillar.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.2 }}
                                viewport={{ once: true }}
                                className="text-center group"
                            >
                                <div className="w-16 h-16 bg-gold/5 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-500">
                                    <pillar.icon className="text-gold" size={24} />
                                </div>
                                <h3 className="text-2xl font-serif text-white mb-4">{pillar.title}</h3>
                                <p className="text-white/40 leading-relaxed italic">{pillar.content}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Personal Quote */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <Quote className="text-gold/10 absolute -top-16 -left-8 md:-left-16" size={120} />
                        <h2 className="text-3xl md:text-5xl font-serif text-sand leading-relaxed italic relative z-10">
                            "Interior design is the art of making a house breathe. My role is to listen to the walls and narrate a story that connects your past to your future."
                        </h2>
                        <div className="mt-12">
                            <p className="text-gold font-bold uppercase tracking-[0.4em] text-sm leading-widest">Ogechi Cynthia Onuegbu</p>
                            <p className="text-white/20 text-xs mt-2 uppercase tracking-[0.2em]">Creative Director, OgeDecor</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="pb-32 text-center">
                <div className="container mx-auto px-6">
                    <div className="h-[1px] w-full bg-white/5 mb-32" />
                    <h3 className="text-gold tracking-[0.4em] uppercase text-xs mb-8">Ready to manifest?</h3>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                    >
                        <a
                            href="/contact"
                            className="bg-gold text-obsidian px-16 py-6 font-bold uppercase tracking-widest text-sm shadow-2xl hover:bg-white transition-all"
                        >
                            Collaborate with Ogechi
                        </a>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
