"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const testimonials = [
    {
        quote: "OgeDecor transformed our Lagos apartment into a sanctuary. The blend of textures and cultural depth is unlike anything I've seen.",
        author: "Amara N.",
        role: "Private Client"
    },
    {
        quote: "Professional, visionary, and deeply connected to the African aesthetic. A masterpiece of design.",
        author: "Tunde O.",
        role: "CEO, TechFlow"
    },
    {
        quote: "The team understood my vision perfectly. It's not just design; it's storytelling through space.",
        author: "Sarah K.",
        role: "Art Collector"
    }
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {/* Testimonials */}
            <section className="py-24 bg-gradient-to-b from-obsidian to-black/80">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <div className="mb-12 flex justify-center">
                        <Quote size={48} className="text-gold/20" />
                    </div>

                    <div className="relative h-48 md:h-32">
                        {testimonials.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: index === current ? 1 : 0,
                                    y: index === current ? 0 : 20,
                                    pointerEvents: index === current ? "auto" : "none"
                                }}
                                transition={{ duration: 0.8 }}
                                className="absolute inset-0 flex flex-col items-center justify-center"
                            >
                                <p className="text-xl md:text-2xl font-serif italic text-sand mb-6 leading-relaxed">"{item.quote}"</p>
                                <div>
                                    <p className="text-gold font-medium uppercase tracking-widest text-sm">{item.author}</p>
                                    <p className="text-white/40 text-xs mt-1">{item.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === current ? "bg-gold w-8" : "bg-white/20 hover:bg-white/40"}`}
                                aria-label={`Go to testimonial ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 relative overflow-hidden flex items-center justify-center bg-zinc-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558603668-6570496b66f8?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian" />

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">Ready to elevate your space?</h2>
                    <p className="text-white/70 max-w-xl mx-auto mb-10 text-lg">
                        Let's create something extraordinary together. Book a consultation and start your design journey with OgeDecor.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-gold text-obsidian px-10 py-4 font-bold tracking-widest text-sm uppercase hover:bg-white transition-colors duration-300 transform hover:scale-105"
                    >
                        Start Your Design Journey
                    </Link>
                </div>
            </section>
        </>
    );
}
