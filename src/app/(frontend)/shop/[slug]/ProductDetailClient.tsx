"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ShoppingBag, 
    Truck, 
    ShieldCheck, 
    Sparkles, 
    ArrowLeft, 
    Check, 
    Plus, 
    Minus, 
    Share2, 
    Maximize2, 
    X,
    Clock,
    Ruler,
    Award
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductDetailProps {
    product: {
        id: string;
        name: string;
        slug: string;
        subtitle?: string;
        description: string;
        category: string;
        price: number;
        currency: string;
        formattedPrice: string;
        compareAtPrice?: number | null;
        sku?: string;
        stockQuantity?: number;
        inStock?: boolean;
        materials?: string;
        dimensions?: {
            height?: string;
            width?: string;
            depth?: string;
            weight?: string;
        };
        deliveryInfo?: {
            leadTime?: string;
            isFragile?: boolean;
            whiteGloveRequired?: boolean;
        };
        image: string;
        gallery?: string[];
    };
    relatedProducts: any[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailProps) {
    const { addToCart, openCart, openCheckout } = useCart();
    
    // Gallery state
    const galleryImages = product.gallery && product.gallery.length > 0 
        ? product.gallery 
        : [product.image];
    const [selectedImage, setSelectedImage] = useState<string>(galleryImages[0]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    
    // Order quantity state
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<"details" | "dimensions" | "delivery" | "provenance">("details");
    const [addedToast, setAddedToast] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 3500);
    };

    const handleAcquireNow = () => {
        addToCart(product, quantity);
        openCheckout();
    };

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2500);
        }
    };

    return (
        <main className="min-h-screen bg-obsidian text-sand pt-28 sm:pt-36 pb-24">
            {/* Added to Bag Toast */}
            <AnimatePresence>
                {addedToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 20, x: "-50%" }}
                        className="fixed bottom-8 left-1/2 z-50 bg-[#16161A] border border-gold/40 text-sand px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md"
                    >
                        <div className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                            <Check size={12} />
                        </div>
                        <span className="text-xs font-serif">
                            Added <strong className="text-gold">{quantity} × {product.name}</strong> to your bag.
                        </span>
                        <button
                            onClick={openCart}
                            className="ml-2 text-xs uppercase tracking-wider text-gold hover:underline font-bold"
                        >
                            View Bag
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 sm:px-6">
                {/* Breadcrumbs & Back Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-12 text-xs text-white/50">
                    <div className="flex items-center gap-2">
                        <Link href="/shop" className="hover:text-gold transition-colors flex items-center gap-1.5 group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Return to Collection</span>
                        </Link>
                        <span>/</span>
                        <span className="text-white/40">{product.category}</span>
                        <span>/</span>
                        <span className="text-gold truncate max-w-[180px] sm:max-w-none">{product.name}</span>
                    </div>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 text-white/50 hover:text-gold transition-colors"
                        title="Copy piece link"
                    >
                        <Share2 size={13} />
                        <span>{copiedLink ? "Link Copied!" : "Share Piece"}</span>
                    </button>
                </div>

                {/* Primary Spotlight Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-20 sm:mb-28">
                    {/* Left: Product Gallery (7 Cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Main Stage Display */}
                        <div 
                            className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#121216] border border-white/10 group cursor-zoom-in"
                            onClick={() => setLightboxOpen(true)}
                        >
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                            {/* Badge */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] tracking-widest uppercase font-medium rounded-full text-gold">
                                    {product.category}
                                </span>
                                {product.inStock && (
                                    <span className="px-3 py-1 bg-green-950/70 border border-green-500/30 text-[10px] tracking-widest uppercase font-medium rounded-full text-green-400 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        In Stock
                                    </span>
                                )}
                            </div>

                            {/* Fullscreen Trigger */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxOpen(true);
                                }}
                                className="absolute bottom-4 right-4 p-2.5 bg-black/70 backdrop-blur-md rounded-full text-white/70 hover:text-gold hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                                title="Expand View"
                            >
                                <Maximize2 size={16} />
                            </button>
                        </div>

                        {/* Thumbnail Angles */}
                        {galleryImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                                            selectedImage === img
                                                ? "border-gold scale-95 shadow-md shadow-gold/20"
                                                : "border-white/10 hover:border-white/40 opacity-70 hover:opacity-100"
                                        }`}
                                    >
                                        <img src={img} alt={`${product.name} angle ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Buying & Specifications Column (5 Cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gold text-[11px] font-bold tracking-[0.25em] uppercase flex items-center gap-1.5">
                                    <Sparkles size={12} /> Ogedecor Masterpiece
                                </span>
                                {product.sku && (
                                    <>
                                        <span className="text-white/20">•</span>
                                        <span className="text-white/40 text-xs tracking-widest font-mono">{product.sku}</span>
                                    </>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
                                {product.name}
                            </h1>

                            {product.subtitle && (
                                <p className="text-sm sm:text-base text-gold/90 font-medium">
                                    {product.subtitle}
                                </p>
                            )}

                            {/* Pricing Section */}
                            <div className="flex items-baseline gap-4 pt-2">
                                <span className="text-3xl sm:text-4xl font-serif font-bold text-gold">
                                    {product.formattedPrice}
                                </span>
                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                    <span className="text-lg font-serif text-white/40 line-through">
                                        ${product.compareAtPrice.toLocaleString()}
                                    </span>
                                )}
                                <span className="text-[11px] uppercase tracking-wider text-white/40 bg-white/5 px-2.5 py-1 rounded">
                                    VAT & White-Glove Included
                                </span>
                            </div>

                            <p className="text-sm sm:text-base text-white/70 leading-relaxed pt-2">
                                {product.description}
                            </p>
                        </div>

                        {/* Order & Acquire Actions */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-4">
                                <span className="text-xs uppercase tracking-widest text-white/50">Quantity:</span>
                                <div className="flex items-center border border-white/15 rounded-xl bg-white/5 overflow-hidden">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="p-2.5 text-white/70 hover:text-gold hover:bg-white/5 transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="px-4 text-sm font-bold text-sand font-mono">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="p-2.5 text-white/70 hover:text-gold hover:bg-white/5 transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-4 bg-white/5 hover:bg-gold hover:text-obsidian text-sand border border-white/15 hover:border-gold rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg"
                                >
                                    <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
                                    <span>Add to Shopping Bag</span>
                                </button>
                                <button
                                    onClick={handleAcquireNow}
                                    className="py-4 px-8 bg-gold text-obsidian rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-gold-light transition-all shadow-xl shadow-gold/20"
                                >
                                    Acquire Immediately
                                </button>
                            </div>

                            {/* Trust Highlights */}
                            <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-white/60">
                                <div className="flex items-center gap-2 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                                    <Truck size={16} className="text-gold flex-shrink-0" />
                                    <span>{product.deliveryInfo?.leadTime || "Dispatches in 2-3 days"}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                                    <ShieldCheck size={16} className="text-gold flex-shrink-0" />
                                    <span>Insured White-Glove Transit</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deep Specifications & Accordion Tabs */}
                <div className="mb-24 bg-[#121216] border border-white/10 rounded-2xl p-6 sm:p-10">
                    <div className="flex border-b border-white/10 gap-4 sm:gap-8 overflow-x-auto pb-4 mb-8 scrollbar-none">
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`text-xs uppercase tracking-widest font-bold pb-2 transition-colors relative whitespace-nowrap ${
                                activeTab === "details" ? "text-gold" : "text-white/40 hover:text-white"
                            }`}
                        >
                            Materials & Craft
                            {activeTab === "details" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                        </button>
                        <button
                            onClick={() => setActiveTab("dimensions")}
                            className={`text-xs uppercase tracking-widest font-bold pb-2 transition-colors relative whitespace-nowrap ${
                                activeTab === "dimensions" ? "text-gold" : "text-white/40 hover:text-white"
                            }`}
                        >
                            Dimensions & Weight
                            {activeTab === "dimensions" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                        </button>
                        <button
                            onClick={() => setActiveTab("delivery")}
                            className={`text-xs uppercase tracking-widest font-bold pb-2 transition-colors relative whitespace-nowrap ${
                                activeTab === "delivery" ? "text-gold" : "text-white/40 hover:text-white"
                            }`}
                        >
                            Logistics & Delivery
                            {activeTab === "delivery" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                        </button>
                        <button
                            onClick={() => setActiveTab("provenance")}
                            className={`text-xs uppercase tracking-widest font-bold pb-2 transition-colors relative whitespace-nowrap ${
                                activeTab === "provenance" ? "text-gold" : "text-white/40 hover:text-white"
                            }`}
                        >
                            Provenance Guarantee
                            {activeTab === "provenance" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="text-sm leading-relaxed text-white/70 min-h-[140px]">
                        {activeTab === "details" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <h3 className="text-gold font-serif text-xl">Artisanal Composition</h3>
                                <p>
                                    Every piece in the Ogedecor catalog is individually handcrafted by master artisans in West Africa. 
                                    Our woodworkers source only ethically harvested, aged hardwoods, applying natural botanical stains and hand-rubbed wax finishes that mature gracefully across generations.
                                </p>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-sand">
                                    <strong className="text-gold block mb-1">Materials Specification:</strong>
                                    {product.materials || "Solid African Hardwood, Brass Accents, Organic Oils."}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "dimensions" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <h3 className="text-gold font-serif text-xl">Architectural Proportions</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Height</span>
                                        <span className="text-base font-bold text-white">{product.dimensions?.height || "45 cm"}</span>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Width</span>
                                        <span className="text-base font-bold text-white">{product.dimensions?.width || "55 cm"}</span>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Depth</span>
                                        <span className="text-base font-bold text-white">{product.dimensions?.depth || "35 cm"}</span>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Weight</span>
                                        <span className="text-base font-bold text-gold">{product.dimensions?.weight || "9 kg"}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "delivery" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <h3 className="text-gold font-serif text-xl">White-Glove Delivery Standard</h3>
                                <p>
                                    All orders are shipped under strict climate and shock protection. For Lagos Metro deliveries, our uniformed white-glove team will place the item in your preferred room, unbox, inspect, and remove all transit crates.
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-white/60">
                                    <li>Dispatch Lead Time: <strong>{product.deliveryInfo?.leadTime || "2-3 business days"}</strong></li>
                                    <li>Transit Insurance: <strong>100% full declared value coverage included</strong></li>
                                    <li>Nationwide Freight: Insured crate shipping across Nigeria</li>
                                    <li>Showroom Pickup: Victoria Island flagship available upon request</li>
                                </ul>
                            </motion.div>
                        )}

                        {activeTab === "provenance" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <h3 className="text-gold font-serif text-xl">Certificate of Authenticity</h3>
                                <p>
                                    Each piece carries an embedded Ogedecor seal of provenance and an individually numbered Master Craft Certificate signed by the studio principal. 
                                    We guarantee original architectural design, ethical artisan wages, and lifetime structural integrity.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Related Curated Pieces (2 columns on Mobile!) */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div>
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h3 className="text-gold text-xs uppercase tracking-[0.2em] mb-2">Complementary Pieces</h3>
                                <h2 className="text-2xl sm:text-3xl font-serif text-white">You May Also Admire</h2>
                            </div>
                            <Link href="/shop" className="text-xs uppercase tracking-wider text-white/50 hover:text-gold transition-colors font-medium">
                                View Entire Collection &rarr;
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                            {relatedProducts.map((rel) => (
                                <Link href={`/shop/${rel.slug || rel.id}`} key={rel.id} className="group flex flex-col">
                                    <div className="relative aspect-square sm:aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 mb-3 border border-white/5 group-hover:border-gold/30 transition-all">
                                        <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                                    </div>
                                    <h4 className="text-xs sm:text-sm font-serif text-sand group-hover:text-gold transition-colors line-clamp-1">
                                        {rel.name}
                                    </h4>
                                    <span className="text-xs text-gold font-medium mt-0.5">
                                        {rel.formattedPrice || `$${rel.price}`}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute top-6 right-6 text-white/70 hover:text-gold p-2"
                        >
                            <X size={28} />
                        </button>
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
