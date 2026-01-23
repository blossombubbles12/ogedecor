"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/app/actions";
import { useEffect, useState } from "react";

export default function FeaturedProjects() {
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        async function fetchProjects() {
            const data = await getProjects();
            setProjects(data);
        }
        fetchProjects();
    }, []);

    // Fallback to mock data if no projects exist yet
    const displayProjects = projects.length > 0 ? projects.slice(0, 4) : [
        {
            id: "1",
            title: "The Neo-Lagos Penthouse",
            category: "Residential",
            media: [{ url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop", type: "image" }],
        },
        {
            id: "2",
            title: "Vibranium Lounge",
            category: "Commercial",
            media: [{ url: "https://images.unsplash.com/photo-1552353617-3bfd679b3bdd?q=80&w=1200&auto=format&fit=crop", type: "image" }],
        },
        {
            id: "3",
            title: "Serengeti Villa",
            category: "Residential",
            media: [{ url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop", type: "image" }],
        },
        {
            id: "4",
            title: "Onyx Office Complex",
            category: "Commercial",
            media: [{ url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop", type: "image" }],
        },
    ];

    return (
        <section id="projects" className="py-24 bg-strip-pattern">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div>
                        <h3 className="text-gold tracking-[0.2em] text-sm uppercase mb-4">Selected Works</h3>
                        <h2 className="text-4xl md:text-5xl font-serif text-sand">Our Portfolio</h2>
                    </div>
                    <Link href="/projects" className="group flex items-center gap-2 text-white/60 hover:text-gold transition-colors mt-6 md:mt-0">
                        View All Projects
                        <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayProjects.map((project: any, index: number) => {
                        const firstMedia = Array.isArray(project.media) ? project.media[0] : project.media;
                        const imageUrl = typeof firstMedia === 'string' ? firstMedia : firstMedia?.url;
                        const size = index === 0 || index === 3 ? "col-span-1 md:col-span-2" : "col-span-1";

                        return (
                            <Link href={`/projects/${project.id}`} key={project.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`group relative h-[400px] overflow-hidden bg-neutral-900 cursor-pointer ${size}`}
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${imageUrl})` }}
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="text-gold text-xs uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                            {project.category}
                                        </p>
                                        <h3 className="text-2xl font-serif text-white">{project.title}</h3>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
