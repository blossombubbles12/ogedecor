"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-obsidian text-sand py-32 px-6">
            <div className="container mx-auto max-w-4xl">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link href="/" className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-widest hover:text-white transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </motion.div>

                {/* Header */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6"
                    >
                        <FileText className="text-gold" size={32} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-serif text-white mb-6"
                    >
                        Terms of Service
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 text-sm tracking-widest uppercase"
                    >
                        Last Updated: January 23, 2026
                    </motion.p>
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="prose prose-invert prose-gold max-w-none space-y-12 text-white/70 leading-relaxed"
                >
                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">1. Engagement</h2>
                        <p>
                            By accessing or using the OgeDecor website and services, you agree to be bound by these Terms of Service. Our services include interior design consultation, space planning, and custom decor curation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">2. Design Alchemy</h2>
                        <p>
                            Our design process is a collaborative "Design Alchemy." While we strive to manifest your vision perfectly, creative interpretations are subject to professional design judgment. Final approval for all materials, furniture, and structural changes must be provided by the client in writing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">3. Intellectual Property</h2>
                        <p>
                            All design concepts, sketches, 3D renderings, and bespoke furniture designs produced by OgeDecor remain the intellectual property of OgeDecor until full payment has been settled. We reserve the right to photograph our finished work for portfolio and marketing purposes, respecting client confidentiality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">4. Custom Orders</h2>
                        <p>
                            All custom furniture and decor pieces are handcrafted to order. Due to the artisanal nature of our work, minor variations in wood grain, textile patterns, or hand-finished surfaces are expected and celebrate the uniqueness of the piece.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">5. Limitation of Liability</h2>
                        <p>
                            OgeDecor works with trusted third-party contractors and vendors. While we oversee implementation, we are not liable for delays or damages caused by independent third-party entities beyond our direct control.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">6. Termination</h2>
                        <p>
                            Either party may terminate the engagement with 30 days' written notice. In the event of termination, the client is responsible for all fees and expenses incurred up to the date of termination.
                        </p>
                    </section>
                </motion.div>
            </div>
        </main>
    );
}
