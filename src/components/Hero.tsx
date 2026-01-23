"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <section ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Parallax Background */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0 bg-cover bg-center"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-obsidian z-10" />
                {/* Placeholder for Cinematic Video/Image */}
                <div
                    className="w-full h-full bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"
                    role="img"
                    aria-label="Luxurious interior living room with dark walls and geometric accents"
                />
            </motion.div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h2 className="text-gold text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-4">
                        Interior Design Studio
                    </h2>
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif text-sand mb-6">
                        African Elegance.<br />
                        Modern Living.
                    </h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl font-light mb-10 leading-relaxed">
                        Curating spaces that blend Wakanda-inspired luxury with futuristic minimalism.
                        Where culture meets contemporary art.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <Link
                            href="#projects"
                            className="group relative px-8 py-4 border border-gold text-gold hover:text-obsidian overflow-hidden transition-colors"
                        >
                            <span className="relative z-10 flex items-center gap-2 font-medium tracking-wide">
                                View Projects <ArrowRight size={18} />
                            </span>
                            <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                        </Link>

                        <Link
                            href="#shop"
                            className="text-sand hover:text-gold transition-colors tracking-widest text-sm relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-gold hover:after:w-full unused-class"
                        >
                            Shop Collection
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
            </motion.div>
        </section>
    );
}
