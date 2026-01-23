"use client";

import { motion } from "framer-motion";
import { PenTool, Home, Palette, Box } from "lucide-react";
import Link from "next/link";

const services = [
    {
        icon: Home,
        title: "Interior Architecture",
        description: "Reimagining structural layouts to maximize flow, light, and spatial harmony."
    },
    {
        icon: Palette,
        title: "Curated Styling",
        description: "Selecting bespoke furniture, art, and textiles that reflect your personal narrative."
    },
    {
        icon: Box,
        title: "Custom Furniture",
        description: "Designing one-of-a-kind pieces that serve as the crown jewel of your space."
    },
    {
        icon: PenTool,
        title: "Space Planning",
        description: "Strategic organization of interiors for functionality and aesthetic balance."
    }
];

export default function Services() {
    return (
        <section id="services" className="py-24 relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h3 className="text-gold tracking-[0.2em] text-sm uppercase mb-4">Our Expertise</h3>
                    <h2 className="text-4xl md:text-5xl font-serif text-sand">Design Services</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 border border-white/10 bg-white/5 hover:bg-gold/10 transition-colors duration-300 group"
                        >
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform duration-300">
                                <service.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-serif text-sand mb-4">{service.title}</h3>
                            <p className="text-white/60 text-sm leading-relaxed">{service.description}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-4 text-gold border border-gold/40 px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-gold hover:text-obsidian transition-all duration-500"
                    >
                        Explore Our Design Journey
                    </Link>
                </div>
            </div>
        </section>
    );
}
