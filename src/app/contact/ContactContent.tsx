"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    ArrowLeft,
    Home,
    Building2,
    Sparkles,
    Wind,
    Flame,
    Sun,
    Calendar,
    Clock,
    Briefcase,
    CheckCircle2,
    Loader2,
    X,
    Camera
} from "lucide-react";
import { createInquiry } from "@/app/actions";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Link from "next/link";

const steps = [
    "Intro",
    "ProjectType",
    "Mood",
    "Timeline",
    "Budget",
    "Inspiration",
    "Contact",
    "Success"
];

const projectTypes = [
    { id: "Residential", label: "Residential", icon: Home, desc: "Private homes and apartments" },
    { id: "Commercial", label: "Commercial", icon: Building2, desc: "Offices, retail, and hospitality" },
    { id: "Custom Decor", label: "Custom Decor", icon: Sparkles, desc: "Bespoke furniture and accents" },
];

const moodOptions = [
    { id: "Calm", label: "Calm", icon: Wind, color: "bg-blue-500/10 text-blue-400" },
    { id: "Bold", label: "Bold", icon: Flame, color: "bg-red-500/10 text-red-400" },
    { id: "Warm", label: "Warm", icon: Sun, color: "bg-orange-500/10 text-orange-400" },
    { id: "Modern African Elegance", label: "Modern African Elegance", icon: Sparkles, color: "bg-gold/10 text-gold" },
];

const timelines = [
    { id: "Soon", label: "Starting Soon", icon: Clock, desc: "Within the next month" },
    { id: "1-3 months", label: "1–3 Months", icon: Calendar, desc: "Planned for the near future" },
    { id: "Exploring", label: "Exploring", icon: Briefcase, desc: "Just gathering ideas for now" },
];

const budgets = [
    { id: "Flexible", label: "Flexible", desc: "Open to suggestions based on design" },
    { id: "Moderate", label: "Moderate", desc: "Looking for high-quality, balanced value" },
    { id: "Premium", label: "Premium", desc: "Bespoke, high-end luxury investment" },
];

export default function ContactContent() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        projectType: "",
        mood: "",
        timeline: "",
        budget: "",
        inspiration: null as any,
        name: "",
        email: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const handleInspirationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, inspiration: { url: result.secure_url, publicId: result.public_id } }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await createInquiry(formData);
            if (result.success) {
                nextStep();
            } else {
                alert("Submission failed. Please try again.");
            }
        } catch (error) {
            console.error("Submission error", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (currentStep / (steps.length - 2)) * 100;

    return (
        <main className="min-h-screen bg-obsidian text-sand flex flex-col relative overflow-hidden">
            {/* Dynamic Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Progress Bar */}
            {currentStep > 0 && currentStep < steps.length - 1 && (
                <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
                    <motion.div
                        className="h-full bg-gold"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Navigation Controls */}
            {currentStep > 0 && currentStep < steps.length - 1 && (
                <div className="fixed bottom-8 left-0 right-0 z-50 px-6">
                    <div className="container mx-auto max-w-4xl flex justify-between items-center">
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors text-sm uppercase tracking-widest font-medium"
                        >
                            <ArrowLeft size={16} /> Backward
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-24 relative z-10">
                <div className="container mx-auto max-w-4xl">
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <motion.div
                                key="step-0"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8"
                                >
                                    <Sparkles className="text-gold" size={40} />
                                </motion.div>
                                <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">Your story begins with a space.</h1>
                                <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
                                    Let's create an environment that reflects your soul, culture, and vision. Your journey towards modern luxury starts here.
                                </p>
                                <button
                                    onClick={nextStep}
                                    className="bg-gold text-obsidian px-12 py-5 font-bold uppercase tracking-[0.2em] text-sm hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
                                >
                                    Start Your Project
                                </button>
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div
                                key="step-1"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-full"
                            >
                                <p className="text-gold font-bold uppercase tracking-[0.3em] text-xs mb-4 text-center">Step 01</p>
                                <h2 className="text-4xl md:text-5xl font-serif text-white text-center mb-16">What are we envisioning?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {projectTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                setFormData({ ...formData, projectType: type.id });
                                                nextStep();
                                            }}
                                            className={`group p-8 border text-left transition-all duration-500 hover:border-gold ${formData.projectType === type.id ? "bg-gold border-gold" : "bg-white/5 border-white/10"
                                                }`}
                                        >
                                            <type.icon size={32} className={`mb-6 ${formData.projectType === type.id ? "text-obsidian" : "text-gold"}`} />
                                            <h3 className={`text-xl font-serif mb-2 ${formData.projectType === type.id ? "text-obsidian" : "text-sand"}`}>{type.label}</h3>
                                            <p className={`text-sm ${formData.projectType === type.id ? "text-obsidian/60" : "text-white/40"}`}>{type.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step-2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-full"
                            >
                                <p className="text-gold font-bold uppercase tracking-[0.3em] text-xs mb-4 text-center">Step 02</p>
                                <h2 className="text-4xl md:text-5xl font-serif text-white text-center mb-16">Choose your atmosphere.</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {moodOptions.map((mood) => (
                                        <button
                                            key={mood.id}
                                            onClick={() => {
                                                setFormData({ ...formData, mood: mood.id });
                                                nextStep();
                                            }}
                                            className={`group relative overflow-hidden p-8 border text-center transition-all duration-500 h-48 flex flex-col items-center justify-center gap-4 ${formData.mood === mood.id ? "bg-white text-obsidian border-white" : "bg-white/5 border-white/10 hover:border-gold/50"
                                                }`}
                                        >
                                            <mood.icon size={32} className={`${formData.mood === mood.id ? "text-gold" : "text-gold/40"}`} />
                                            <span className="text-sm font-bold uppercase tracking-widest leading-tight">{mood.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step-3"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-full"
                            >
                                <p className="text-gold font-bold uppercase tracking-[0.3em] text-xs mb-4 text-center">Step 03</p>
                                <h2 className="text-4xl md:text-5xl font-serif text-white text-center mb-16">When should we begin?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {timelines.map((time) => (
                                        <button
                                            key={time.id}
                                            onClick={() => {
                                                setFormData({ ...formData, timeline: time.id });
                                                nextStep();
                                            }}
                                            className={`p-8 border transition-all duration-500 text-center flex flex-col items-center gap-6 ${formData.timeline === time.id ? "bg-gold border-gold text-obsidian" : "bg-white/5 border-white/10 hover:border-gold/30"
                                                }`}
                                        >
                                            <div className={`p-4 rounded-full ${formData.timeline === time.id ? "bg-obsidian/10" : "bg-gold/10 text-gold"}`}>
                                                <time.icon size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-serif mb-2">{time.label}</h3>
                                                <p className={`text-sm ${formData.timeline === time.id ? "text-obsidian/60" : "text-white/40"}`}>{time.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 4 && (
                            <motion.div
                                key="step-4"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-full"
                            >
                                <p className="text-gold font-bold uppercase tracking-[0.3em] text-xs mb-4 text-center">Step 04</p>
                                <h2 className="text-4xl md:text-5xl font-serif text-white text-center mb-16">Investment philosophy.</h2>
                                <div className="space-y-4 max-w-xl mx-auto">
                                    {budgets.map((budget) => (
                                        <button
                                            key={budget.id}
                                            onClick={() => {
                                                setFormData({ ...formData, budget: budget.id });
                                                nextStep();
                                            }}
                                            className={`w-full p-8 border text-left flex items-center justify-between transition-all duration-500 group ${formData.budget === budget.id ? "bg-white text-obsidian border-white" : "bg-white/5 border-white/10 hover:border-gold/50"
                                                }`}
                                        >
                                            <div>
                                                <h3 className="text-xl font-serif mb-1">{budget.label}</h3>
                                                <p className={`text-sm ${formData.budget === budget.id ? "text-obsidian/60" : "text-white/40"}`}>{budget.desc}</p>
                                            </div>
                                            <ArrowRight size={24} className={`transition-transform duration-300 group-hover:translate-x-2 ${formData.budget === budget.id ? "text-gold" : "text-white/20"}`} />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 5 && (
                            <motion.div
                                key="step-5"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-full text-center"
                            >
                                <p className="text-gold font-bold uppercase tracking-[0.3em] text-xs mb-4">Step 05</p>
                                <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">Visualize your vision.</h2>
                                <p className="text-white/40 mb-12 max-w-md mx-auto">Share an inspiration image that captures the feeling you want to evoke. (Optional)</p>

                                <div className="relative max-w-lg mx-auto">
                                    {formData.inspiration ? (
                                        <div className="relative rounded-sm overflow-hidden border border-gold shadow-2xl">
                                            <img src={formData.inspiration.url} alt="Inspiration" className="w-full h-80 object-cover" />
                                            <button
                                                onClick={() => setFormData({ ...formData, inspiration: null })}
                                                className="absolute top-4 right-4 bg-obsidian/80 p-2 rounded-full text-white hover:bg-gold transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className={`block border-2 border-dashed rounded-sm p-24 cursor-pointer transition-all ${uploading ? "opacity-50 cursor-wait" : "border-white/20 hover:border-gold/50 hover:bg-white/5"}`}>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleInspirationUpload} disabled={uploading} />
                                            <div className="flex flex-col items-center">
                                                {uploading ? <Loader2 className="animate-spin text-gold mb-4" size={48} /> : <Camera className="text-gold mb-4" size={48} />}
                                                <p className="text-sand text-lg mb-2">{uploading ? "Ascending..." : "Upload Inspiration"}</p>
                                                <p className="text-white/40 text-sm italic">JPG, PNG, WebP</p>
                                            </div>
                                        </label>
                                    )}
                                </div>

                                <button
                                    onClick={nextStep}
                                    disabled={uploading}
                                    className="mt-12 text-white/40 hover:text-gold uppercase tracking-[0.3em] text-xs transition-colors disabled:opacity-0"
                                >
                                    Skip this step
                                </button>

                                {formData.inspiration && (
                                    <div className="mt-8 flex justify-center">
                                        <button
                                            onClick={nextStep}
                                            className="bg-gold text-obsidian px-10 py-4 font-bold uppercase tracking-widest text-sm"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {currentStep === 6 && (
                            <motion.div
                                key="step-6"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-full text-center"
                            >
                                <p className="text-gold font-bold uppercase tracking-[0.3em] text-xs mb-4">Step 06</p>
                                <h2 className="text-4xl md:text-5xl font-serif text-white mb-16">How may we address you?</h2>

                                <div className="max-w-md mx-auto space-y-8">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl font-serif text-sand focus:border-gold focus:outline-none transition-colors placeholder:text-white/10"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Your Email or WhatsApp"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl font-serif text-sand focus:border-gold focus:outline-none transition-colors placeholder:text-white/10"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={!formData.name || !formData.email || isSubmitting}
                                        className="w-full bg-gold text-obsidian py-5 font-bold uppercase tracking-[0.2em] text-sm hover:bg-white disabled:opacity-30 disabled:hover:bg-gold transition-all mt-8 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Embark on Design Journey"}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 7 && (
                            <motion.div
                                key="step-7"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ rotate: -180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 1, type: "spring" }}
                                    className="w-32 h-32 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-12"
                                >
                                    <CheckCircle2 className="text-gold" size={64} />
                                </motion.div>
                                <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">Manifested.</h2>
                                <p className="text-xl text-white/60 mb-12 max-w-md mx-auto">
                                    Your vision has been received. Our team will review your project details and reach out within 48 hours to begin the alchemy.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-block border-b border-gold text-gold py-2 uppercase tracking-[0.3em] text-xs hover:text-white hover:border-white transition-all"
                                >
                                    Return to Home
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
