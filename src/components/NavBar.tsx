"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { totalCount, openCart } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "Projects", href: "/projects" },
        { name: "Services", href: "/services" },
        { name: "Collection", href: "/shop" },
        { name: "Start Project", href: "/contact" },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-obsidian/90 backdrop-blur-md py-4" : "bg-transparent py-6"
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <img
                            src="/ogedecor.png"
                            alt="OgeDecor Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm uppercase tracking-widest hover:text-gold transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button
                            onClick={openCart}
                            aria-label="Open Shopping Bag"
                            className="relative hover:text-gold transition-colors p-1 group cursor-pointer"
                        >
                            <ShoppingBag size={20} className="group-hover:scale-105 transition-transform" />
                            {totalCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gold text-obsidian text-[10px] font-bold min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full shadow-md animate-pulse">
                                    {totalCount}
                                </span>
                            )}
                        </button>
                    </nav>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={openCart}
                            aria-label="Open Shopping Bag"
                            className="relative hover:text-gold transition-colors p-1 cursor-pointer"
                        >
                            <ShoppingBag size={20} />
                            {totalCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gold text-obsidian text-[10px] font-bold min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full shadow-md animate-pulse">
                                    {totalCount}
                                </span>
                            )}
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} className="text-sand" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "tween", duration: 0.4 }}
                        className="fixed inset-0 z-[60] bg-obsidian flex flex-col items-center justify-center space-y-8"
                    >
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-6 right-6 text-sand hover:text-gold"
                        >
                            <X size={32} />
                        </button>

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-serif text-sand hover:text-gold tracking-widest"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
