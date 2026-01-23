"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Truck } from "lucide-react";

export default function ShippingPage() {
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
                        <Truck className="text-gold" size={32} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-serif text-white mb-6"
                    >
                        Shipping & Returns
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
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">Domestic & Global Delivery</h2>
                        <p>
                            OgeDecor offers white-glove delivery for all interior projects and custom decor pieces within Nigeria and select international destinations. Our logistics team ensures that every item is handled with the care it deserves.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">1. Delivery Timelines</h2>
                        <p>
                            Due to the bespoke nature of our products:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 marker:text-gold">
                            <li><strong>Custom Furniture:</strong> 8–12 weeks from design approval.</li>
                            <li><strong>Decor Accents:</strong> 2–4 weeks depending on artisan availability.</li>
                            <li><strong>Global Shipping:</strong> Additional 2–3 weeks depending on customs and location.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">2. White-Glove Service</h2>
                        <p>
                            Our white-glove delivery includes professional unboxing, assembly, and placement by our specialized installation team. We will coordinate a specific delivery window that fits your schedule.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">3. Return Policy</h2>
                        <p>
                            Because our interior designs and furniture are bespoke and made-to-order, <strong>we do not accept returns</strong> once a project is approved and production has commenced. We work closely with you during the "Refinement" phase to ensure every detail is perfect before creation begins.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">4. Damaged Items</h2>
                        <p>
                            In the rare event that an item is damaged during transit, please notify our installation team immediately upon delivery. We will arrange for a repair or replacement as a priority at no additional cost to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">5. Contact Support</h2>
                        <p>
                            For status updates or logistics inquiries, please contact our concierge team at:
                        </p>
                        <p className="text-gold font-bold italic">concierge@ogedecor.com</p>
                    </section>
                </motion.div>
            </div>
        </main>
    );
}
