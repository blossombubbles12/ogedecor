import { Metadata } from "next";
import { getProjectById } from "@/app/actions";
import { notFound } from "next/navigation";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    return {
        title: project.title,
        description: project.description.substring(0, 160),
        openGraph: {
            title: `${project.title} | OgeDecor`,
            description: project.description.substring(0, 160),
            images: Array.isArray(project.media) ? [{ url: project.media[0]?.url }] : [],
        },
    };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
        // Fallback for mock data or 404
        if (["1", "2", "3", "4"].includes(id)) {
            return (
                <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center text-center p-6">
                    <h1 className="text-4xl font-serif text-gold mb-4">Sample Project</h1>
                    <p className="text-white/60 mb-8">This is a placeholder for a sample project. Add a real project via the admin dashboard to see the full details page.</p>
                    <Link href="/" className="text-gold flex items-center gap-2 hover:underline">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            );
        }
        return notFound();
    }

    const { title, description, category, completionDate, media } = project;
    const mediaItems = Array.isArray(media) ? media : [];

    return (
        <div className="min-h-screen bg-obsidian text-sand">
            {/* Project Hero */}
            <section className="relative h-[70vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${mediaItems[0]?.url})` }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />

                <div className="absolute bottom-12 left-0 right-0">
                    <div className="container mx-auto px-6">
                        <Link href="/" className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-widest mb-8 hover:text-white transition-colors">
                            <ArrowLeft size={16} /> Portfolio
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-serif mb-4">{title}</h1>
                        <div className="flex flex-wrap gap-6 text-sm uppercase tracking-widest text-white/60">
                            <span className="flex items-center gap-2">
                                <Tag size={16} className="text-gold" /> {category}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={16} className="text-gold" /> {new Date(completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Info */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-2xl font-serif text-gold mb-6">Brief</h2>
                            <div className="h-1 w-12 bg-gold mb-8" />
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-xl leading-relaxed text-white/70 whitespace-pre-wrap">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Media Gallery */}
            <section className="pb-24">
                <div className="container mx-auto px-6">
                    <div className="space-y-12">
                        {mediaItems.map((item: any, index: number) => (
                            <div key={index} className="relative group">
                                {item.type === "video" ? (
                                    <video
                                        src={item.url}
                                        controls
                                        className="w-full h-auto rounded-sm shadow-2xl"
                                    />
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={`${title} - Media ${index + 1}`}
                                        className="w-full h-auto rounded-sm shadow-2xl"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <section className="py-24 border-t border-white/10">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-white/40 mb-8 uppercase tracking-widest text-xs">Interested in a similar project?</p>
                    <Link
                        href="/contact"
                        className="inline-block border border-gold text-gold px-12 py-4 font-bold tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300"
                    >
                        Book a Consultation
                    </Link>
                </div>
            </section>
        </div>
    );
}
