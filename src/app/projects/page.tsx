"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjects } from "@/app/actions";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";

const CATEGORIES = ["All", "Residential", "Commercial", "Custom Decor"];

export default function PortfolioPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            const data = await getProjects();
            // Use mock data if empty for demonstration
            const initialData = data.length > 0 ? data : [
                { id: "1", title: "Neo-Lagos Penthouse", category: "Residential", media: [{ url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200" }] },
                { id: "2", title: "Vibranium Lounge", category: "Commercial", media: [{ url: "https://images.unsplash.com/photo-1552353617-3bfd679b3bdd?q=80&w=1200" }] },
                { id: "3", title: "Serengeti Villa", category: "Residential", media: [{ url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200" }] },
                { id: "4", title: "Onyx Office Complex", category: "Commercial", media: [{ url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200" }] },
                { id: "5", title: "Ashanti Royal Suite", category: "Residential", media: [{ url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200" }] },
                { id: "6", title: "Wakanda Tech Hub", category: "Commercial", media: [{ url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200" }] },
            ];
            setProjects(initialData);
            setFilteredProjects(initialData);
            setLoading(false);
        }
        fetchProjects();
    }, []);

    useEffect(() => {
        if (activeCategory === "All") {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(p => p.category === activeCategory));
        }
    }, [activeCategory, projects]);

    return (
        <main className="min-h-screen bg-obsidian pt-32 pb-24">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold tracking-[0.3em] font-medium uppercase text-sm mb-4"
                    >
                        Our Creations
                    </motion.h3>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif text-sand mb-8"
                    >
                        The Portfolio
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="h-[1px] w-48 bg-gold mx-auto mb-12"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                    {CATEGORIES.map((category, idx) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full border text-sm uppercase tracking-widest transition-all duration-300 ${activeCategory === category
                                    ? "bg-gold border-gold text-obsidian font-bold"
                                    : "border-white/10 text-white/40 hover:border-gold/50 hover:text-gold"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Staggered Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-[600px] items-center justify-center">
                        <div className="col-span-full flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-t-2 border-gold rounded-full animate-spin" />
                            <p className="text-gold tracking-[0.2em] uppercase text-xs">Curating Gallery...</p>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project, index) => {
                                const mainImage = Array.isArray(project.media) ? project.media[0]?.url : project.media;
                                // Randomize card heights for a creative staggered look
                                const isTall = index % 3 === 1;

                                return (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                        className={`group relative overflow-hidden bg-neutral-900 rounded-sm ${isTall ? "md:row-span-2 h-[600px] md:h-full" : "h-[450px]"}`}
                                    >
                                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${mainImage})` }} />
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-colors duration-500" />

                                        <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{project.category}</span>
                                            <h3 className="text-3xl font-serif text-white mb-6 leading-tight">{project.title}</h3>

                                            <Link
                                                href={`/projects/${project.id}`}
                                                className="inline-flex items-center gap-3 text-white border-b border-white/20 pb-2 self-start hover:border-gold hover:text-gold transition-all duration-300"
                                            >
                                                <span className="text-sm uppercase tracking-widest">Explore Project</span>
                                                <ArrowUpRight size={18} />
                                            </Link>
                                        </div>

                                        {/* Decorative Overlay */}
                                        <div className="absolute top-8 right-8 w-12 h-12 border border-white/10 group-hover:border-gold/50 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-transform">
                                            <ArrowUpRight className="text-gold" size={20} />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}

                {filteredProjects.length === 0 && !loading && (
                    <div className="text-center py-24">
                        <p className="text-white/40 font-serif italic text-2xl">No projects found in this collection.</p>
                        <button onClick={() => setActiveCategory("All")} className="mt-8 text-gold uppercase tracking-[0.3em] text-xs hover:underline">Reset Filters</button>
                    </div>
                )}
            </div>
        </main>
    );
}
