"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
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
                        <Shield className="text-gold" size={32} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-serif text-white mb-6"
                    >
                        Privacy Policy
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
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">At OgeDecor</h2>
                        <p>
                            We hold your privacy in the highest regard. This Privacy Policy outlines how we collect, use, and protect your personal information when you engage with our luxury interior design services and digital platforms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">1. Information Collection</h2>
                        <p>
                            We collect information that you provide to us directly, such as when you fill out our "Start Your Project" form, subscribe to our newsletter, or contact us for a consultation. This may include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 marker:text-gold">
                            <li>Name, email address, and phone number.</li>
                            <li>Project details, preferences, and inspiration images.</li>
                            <li>Billing and delivery information for our custom decor pieces.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">2. How We Use Your Data</h2>
                        <p>
                            Your information is used solely to provide and improve our services, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 marker:text-gold">
                            <li>Curating personalized interior design concepts.</li>
                            <li>Communicating regarding your project status.</li>
                            <li>Processing orders and deliveries for custom furniture.</li>
                            <li>Sending exclusive OgeDecor updates (with your consent).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">3. Data Security</h2>
                        <p>
                            We implement rigorous security measures to maintain the safety of your personal information. Your media assets (inspiration images) are stored securely on Cloudinary, and your project data is protected within our private Neon database architecture.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">4. Third-Party Sharing</h2>
                        <p>
                            OgeDecor does not sell, trade, or otherwise transfer your personally identifiable information to outside parties, except for trusted partners who assist us in operating our website or conducting our business, so long as those parties agree to keep this information confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-gold mb-4 uppercase tracking-widest">5. Contact Us</h2>
                        <p>
                            If you have any questions regarding this privacy policy, you may contact our privacy team at:
                        </p>
                        <p className="text-gold font-bold italic">privacy@ogedecor.com</p>
                    </section>
                </motion.div>
            </div>
        </main>
    );
}
