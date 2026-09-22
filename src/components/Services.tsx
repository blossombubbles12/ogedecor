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
        <section id="services" className="py-16 sm:py-24 relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-3 sm:px-6">
                <div className="text-center mb-10 sm:mb-20">
                    <h3 className="text-gold tracking-[0.2em] text-xs sm:text-sm uppercase mb-2 sm:mb-4">Our Expertise</h3>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-sand">Design Services</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 mb-10 sm:mb-16">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="p-4 sm:p-8 border border-white/10 bg-white/5 hover:bg-gold/10 transition-colors duration-300 group rounded-lg sm:rounded-xl"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full flex items-center justify-center text-gold mb-3 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                                <service.icon size={20} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-sm sm:text-xl font-serif text-sand mb-2 sm:mb-4 line-clamp-1">{service.title}</h3>
                            <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">{service.description}</p>
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
