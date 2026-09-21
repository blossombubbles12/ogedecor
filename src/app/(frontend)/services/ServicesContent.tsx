"use client";

import { motion } from "framer-motion";
import {
    Compass,
    PenTool,
    Layers,
    Hammer,
    Sparkles,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";

const servicesList = [
    {
        id: "residential",
        title: "Residential Luxury",
        desc: "We curate private sanctuaries that blend modern comfort with high-end African elegance. From penthouse suites to sprawling villas, our designs are deeply personal and culturally resonant.",
        features: ["Private Residences", "Luxury Apartments", "Vacation Homes", "Smart Home Integration"],
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200"
    },
    {
        id: "commercial",
        title: "Commercial Excellence",
        desc: "Designing functional, brand-elevating spaces for offices, retail, and hospitality. We create environments that inspire productivity and leave a lasting impression on your clientele.",
        features: ["Executive Offices", "Boutique Retail", "Hospitality & Lounges", "Co-working Spaces"],
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
    },
    {
        id: "decor",
        title: "Bespoke Decor & Styling",
        desc: "Our custom decor service focus on the final touches that breathe soul into a room. We source and create unique Afro-futuristic furniture, textiles, and art pieces.",
        features: ["Custom Furniture", "Art Curation", "Textile Design", "Space Final Styling"],
        image: "https://images.unsplash.com/photo-1552353617-3bfd679b3bdd?q=80&w=1200"
    }
];

const designProcess = [
    {
        step: "01",
        title: "Discovery",
        icon: Compass,
        content: "The journey begins with a deep dive into your vision. We explore your lifestyle, functional needs, and the emotional connection you wish to have with your space."
    },
    {
        step: "02",
        title: "Manifestation",
        icon: PenTool,
        content: "Our team translates your brief into a cohesive design concept. This includes mood boards, initial sketches, and material palettes that set the tone for the design alchemy."
    },
    {
        step: "03",
        title: "Refinement",
        icon: Layers,
        content: "We bring the concept to life through detailed 3D renderings and floor plans. Every texture, lighting fixture, and structural element is precisely curated for approval."
    },
    {
        step: "04",
        title: "Curation",
        icon: Hammer,
        content: "We source and fabricate. Our network of master artisans and global suppliers work together to create the bespoke pieces that define an Oge Decor space."
    },
    {
        step: "05",
        title: "Alchemy",
        icon: Sparkles,
        content: "The final reveal. Our styling team directs the installation, ensuring every element is placed with intention, transforming the house into a soulful home."
    }
];

export default function ServicesContent() {
    return (
        <main className="min-h-screen bg-obsidian text-sand overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center text-center px-6">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000')] bg-cover bg-fixed opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-obsidian/0 via-obsidian to-obsidian" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold tracking-[0.4em] uppercase text-sm mb-6 font-bold"
                    >
                        Design Excellence
                    </motion.h3>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-serif text-white mb-8"
                    >
                        Our Services
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
                    >
                        Curating spaces that bridge the gap between ancestral inspiration and futuristic luxury.
                    </motion.p>
                </div>
            </section>

            {/* Services Detail List */}
            <section className="py-24 container mx-auto px-6">
                <div className="space-y-32">
                    {servicesList.map((service, index) => (
                        <div
                            key={service.id}
                            className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            {/* Image Column */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="w-full lg:w-1/2 group relative aspect-[4/3] overflow-hidden"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${service.image})` }}
                                />
                                <div className="absolute inset-0 bg-gold/10 group-hover:bg-transparent transition-colors duration-700" />
                            </motion.div>

                            {/* Text Column */}
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="w-full lg:w-1/2 space-y-8"
                            >
                                <h2 className="text-4xl md:text-5xl font-serif text-white">{service.title}</h2>
                                <div className="h-1 w-20 bg-gold" />
                                <p className="text-lg text-white/60 leading-relaxed italic">
                                    "{service.desc}"
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    {service.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3 text-sm tracking-widest uppercase">
                                            <CheckCircle2 size={16} className="text-gold" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-4 text-gold border-b border-gold/30 pb-2 hover:border-gold hover:text-white transition-all transform hover:translate-x-2"
                                >
                                    <span className="font-bold uppercase tracking-widest text-sm">Start this Journey</span>
                                    <ArrowRight size={20} />
                                </Link>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Design Process Section */}
            <section className="py-32 bg-black/40 border-y border-white/5 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <h3 className="text-gold tracking-[0.3em] uppercase text-sm mb-4 font-bold">The Alchemy of Design</h3>
                        <h2 className="text-5xl md:text-7xl font-serif text-white">Our Process</h2>
                    </div>

                    <div className="relative">
                        {/* Desktop Connector Line */}
                        <div className="hidden lg:block absolute top-[60px] left-0 w-full h-[1px] bg-white/10" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                            {designProcess.map((step, idx) => (
                                <motion.div
                                    key={step.step}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="relative z-10 flex flex-col items-center lg:items-start group"
                                >
                                    <div className="w-16 h-16 bg-obsidian border border-white/10 rounded-full flex items-center justify-center mb-8 group-hover:border-gold group-hover:bg-gold/5 transition-all duration-500">
                                        <step.icon size={24} className="text-gold" />
                                    </div>

                                    <span className="text-gold font-bold tracking-widest text-xs mb-4 uppercase">Phase {step.step}</span>
                                    <h4 className="text-2xl font-serif text-white mb-4">{step.title}</h4>
                                    <p className="text-sm text-white/40 leading-relaxed text-center lg:text-left">
                                        {step.content}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-32 text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">Ready to transform your space?</h2>
                    <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
                        Book a private curation session and let’s discuss how we can bring your vision into reality.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-gold text-obsidian px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-white transition-all transform hover:scale-105 shadow-2xl"
                    >
                        Book a Consultation
                    </Link>
                </div>
            </section>
        </main>
    );
}
