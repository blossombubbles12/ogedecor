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
            className="relative h-[92vh] sm:h-screen w-full overflow-hidden flex items-center justify-center bg-obsidian pt-16"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background Image Carousel with Smooth Fade Transitions */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 z-0"
                >
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.image})` }}
                        role="img"
                        aria-label={slide.heading}
                    />
                    {/* Multi-layered cinematic gradient overlays for perfect contrast */}
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-black/40 to-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60" />
                </motion.div>
            </AnimatePresence>

            {/* Slide Content */}
            <div className="relative z-20 container mx-auto px-4 sm:px-6 text-center max-w-5xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-4 sm:space-y-6"
                    >
                        {/* Subtitle / Category Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-gold/30 text-gold text-xs sm:text-sm font-medium tracking-[0.25em] uppercase">
                            <Sparkles size={13} className="text-gold animate-pulse" />
                            <span>{slide.subtitle}</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-sand leading-[1.1] tracking-tight whitespace-pre-line drop-shadow-2xl">
                            {slide.heading}
                        </h1>

                        {/* Description */}
                        <p className="text-white/85 max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-light leading-relaxed drop-shadow-md">
                            {slide.description}
                        </p>

                        {/* Call to Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 pt-2 sm:pt-4">
                            <Link
                                href={slide.primaryCta.href}
                                className="w-full sm:w-auto group relative px-7 py-3.5 bg-gold text-obsidian font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gold-light transition-all duration-300 shadow-xl shadow-gold/20 flex items-center justify-center gap-2"
                            >
                                <span>{slide.primaryCta.label}</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href={slide.secondaryCta.href}
                                className="w-full sm:w-auto px-7 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-sand hover:border-gold hover:text-gold font-medium text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center"
                            >
                                <span>{slide.secondaryCta.label}</span>
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Carousel Navigation Arrows (Left & Right) */}
            <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-gold hover:text-obsidian text-white/80 border border-white/10 hover:border-gold backdrop-blur-md transition-all duration-300 group shadow-xl"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-gold hover:text-obsidian text-white/80 border border-white/10 hover:border-gold backdrop-blur-md transition-all duration-300 group shadow-xl"
            >
                <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Carousel Indicators / Dot Pagination */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 sm:gap-3 bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                {SLIDES.map((s, idx) => (
                    <button
                        key={s.id}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`transition-all duration-300 rounded-full ${
                            currentSlide === idx
                                ? "w-8 h-2 bg-gold shadow-md shadow-gold/40"
                                : "w-2 h-2 bg-white/30 hover:bg-white/60"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
