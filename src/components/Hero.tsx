"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

const SLIDES = [
    {
        id: 1,
        subtitle: "Bespoke Afro-Luxury Living",
        heading: "African Elegance.\nModern Living.",
        description: "Curating timeless architectural spaces that blend African heritage with sleek, futuristic minimalism. Where culture meets contemporary art.",
        primaryCta: { label: "Explore Portfolio", href: "/projects" },
        secondaryCta: { label: "Shop Pieces", href: "/shop" },
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    },
    {
        id: 2,
        subtitle: "Handcrafted Atelier Pieces",
        heading: "Mastercrafted\nBespoke Decor.",
        description: "Sculpted statement furniture, ambient lighting, and artisanal accents created by master African craftsmen from sustainable hardwoods and solid brass.",
        primaryCta: { label: "Discover Shop", href: "/shop" },
        secondaryCta: { label: "Custom Commission", href: "/contact" },
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop",
    },
    {
        id: 3,
        subtitle: "Visionary Interior Architecture",
        heading: "Transforming Spaces\nInto Living Art.",
        description: "Comprehensive interior design services for luxury residential villas, penthouses, and executive commercial environments worldwide.",
        primaryCta: { label: "Book Consultation", href: "/contact" },
        secondaryCta: { label: "Our Services", href: "/services" },
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop",
    },
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    }, []);

    // Auto-advance slides every 6.5 seconds
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(nextSlide, 6500);
        return () => clearInterval(interval);
    }, [isPaused, nextSlide]);

    const slide = SLIDES[currentSlide];

    return (
        <section 
            className="relative h-[88vh] sm:h-[94vh] min-h-[580px] w-full overflow-hidden flex items-center bg-[#0b0b0e] pt-14"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background Image Carousel with Smooth Fade Transitions */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0 z-0"
                >
                    <div
                        className="w-full h-full bg-cover bg-center md:bg-[center_right]"
                        style={{ backgroundImage: `url(${slide.image})` }}
                        role="img"
                        aria-label={slide.heading}
                    />

                    {/* Gradient Overlay: Deep, rich shade on the left for maximum text contrast, transitioning to crystal-clear vivid photo on the right */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0e] via-[#0b0b0e]/80 md:via-[#0b0b0e]/65 to-transparent w-full md:w-[70%]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-transparent to-black/30" />
                </motion.div>
            </AnimatePresence>

            {/* Left-Aligned Slide Content */}
            <div className="relative z-20 container mx-auto px-5 sm:px-8 lg:px-12 flex items-center">
                <div className="max-w-2xl text-left py-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide.id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="space-y-4 sm:space-y-6"
                        >
                            {/* Subtitle Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121216]/80 backdrop-blur-md border border-gold/30 text-gold text-xs sm:text-sm font-medium tracking-[0.25em] uppercase shadow-lg">
                                <Sparkles size={13} className="text-gold animate-pulse" />
                                <span>{slide.subtitle}</span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-sand leading-[1.1] tracking-tight whitespace-pre-line drop-shadow-2xl">
                                {slide.heading}
                            </h1>

                            {/* Description */}
                            <p className="text-white/85 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-xl drop-shadow-md">
                                {slide.description}
                            </p>

                            {/* Call to Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                                <Link
                                    href={slide.primaryCta.href}
                                    className="group px-6 sm:px-7 py-3 sm:py-3.5 bg-gold text-obsidian font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gold-light transition-all duration-300 shadow-xl shadow-gold/20 flex items-center gap-2"
                                >
                                    <span>{slide.primaryCta.label}</span>
                                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href={slide.secondaryCta.href}
                                    className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-sand hover:border-gold hover:text-gold font-medium text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center"
                                >
                                    <span>{slide.secondaryCta.label}</span>
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Controls Bar (Pagination Dots + Left/Right Arrows) */}
            <div className="absolute bottom-6 sm:bottom-10 left-5 sm:left-8 lg:left-12 z-30 flex items-center gap-4 sm:gap-6">
                {/* Carousel Indicators / Dot Pagination */}
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full">
                    {SLIDES.map((s, idx) => (
                        <button
                            key={s.id}
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`transition-all duration-300 rounded-full ${
                                currentSlide === idx
                                    ? "w-7 h-2 bg-gold shadow-md shadow-gold/40"
                                    : "w-2 h-2 bg-white/30 hover:bg-white/60"
                            }`}
                        />
                    ))}
                </div>

                {/* Left & Right Arrow Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevSlide}
                        aria-label="Previous Slide"
                        className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-gold hover:text-obsidian text-white/80 border border-white/10 hover:border-gold backdrop-blur-md transition-all duration-300 group shadow-lg"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                        onClick={nextSlide}
                        aria-label="Next Slide"
                        className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-gold hover:text-obsidian text-white/80 border border-white/10 hover:border-gold backdrop-blur-md transition-all duration-300 group shadow-lg"
                    >
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}
