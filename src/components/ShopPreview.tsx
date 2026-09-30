"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronLeft, ChevronRight, ArrowRight, Sparkles, Play, Check } from "lucide-react";
import Link from "next/link";
import { getShopProducts } from "@/app/actions";
import { useCart } from "@/context/CartContext";

export default function ShopPreview() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addedToast, setAddedToast] = useState<string | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const { addToCart, openCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getShopProducts();
                setProducts(data || []);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (carouselRef.current) {
            const scrollAmount = carouselRef.current.clientWidth * 0.75;
            carouselRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleQuickAdd = (product: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAddedToast(product.name);
        setTimeout(() => setAddedToast(null), 2500);
    };

    const isVideo = (url?: string) => {
        if (!url) return false;
        const u = url.toLowerCase().split("?")[0];
        return u.endsWith(".mp4") || u.endsWith(".webm") || u.endsWith(".mov") || u.includes("/video/");
    };

    return (
        <section id="shop" className="py-20 sm:py-28 bg-[#0b0b0e] border-y border-white/5 relative overflow-hidden">
            {/* Added Toast */}
            {addedToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#16161A] border border-gold/40 text-sand px-6 py-3 rounded-full shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-bounce">
                    <Check size={14} className="text-gold" />
                    <span className="text-xs">Added <strong className="text-gold">{addedToast}</strong> to bag.</span>
                </div>
            )}

            <div className="container mx-auto px-4 sm:px-6">
                {/* Section Header & Carousel Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 text-gold tracking-[0.25em] text-xs uppercase mb-2">
                            <Sparkles size={12} />
                            <span>Bespoke Collection</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-sand">
                            Curated Masterpieces
                        </h2>
                        <p className="text-white/60 text-xs sm:text-sm max-w-md mt-2">
                            Explore handcrafted statement furniture, sculptural lighting, and African architectural accents.
                        </p>
                    </div>

                    {/* Carousel Navigation Buttons + Store Link */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => scroll("left")}
                                aria-label="Previous Products"
                                className="p-2.5 sm:p-3 rounded-full bg-white/5 hover:bg-gold hover:text-obsidian text-white/70 border border-white/10 hover:border-gold transition-all shadow-md group"
                            >
                                <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                aria-label="Next Products"
                                className="p-2.5 sm:p-3 rounded-full bg-white/5 hover:bg-gold hover:text-obsidian text-white/70 border border-white/10 hover:border-gold transition-all shadow-md group"
                            >
                                <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        <Link
                            href="/shop"
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold text-sand text-xs uppercase tracking-wider rounded-xl transition-all font-medium"
                        >
                            <span>View All</span>
                            <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>

                {/* Carousel Product Track */}
                {loading ? (
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="min-w-[260px] sm:min-w-[300px] aspect-[3/4] bg-white/5 animate-pulse rounded-2xl border border-white/5"
                            />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-16 text-center space-y-4 bg-white/[0.02] border border-white/5 rounded-2xl p-8">
                        <p className="text-white/40 text-sm">New pieces will appear here once added to the catalog.</p>
                        <Link href="/shop" className="inline-block text-gold text-xs uppercase tracking-widest hover:underline">
                            Browse full store →
                        </Link>
                    </div>
                ) : (
                    <div
                        ref={carouselRef}
                        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth scrollbar-none snap-x snap-mandatory"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {products.map((product, index) => {
                            const productIsVideo = isVideo(product.image);

                            return (
                                <motion.div
                                    key={product.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.05, 0.3) }}
                                    viewport={{ once: true }}
                                    className="min-w-[240px] sm:min-w-[280px] md:min-w-[320px] max-w-[320px] snap-start group bg-[#121216] border border-white/10 hover:border-gold/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-xl flex-shrink-0"
                                >
                                    {/* Thumbnail Image Box with object-contain */}
                                    <div className="relative aspect-square w-full overflow-hidden bg-[#0c0c0f] group/img flex items-center justify-center p-3 sm:p-4">
                                        <Link href={`/shop/${product.slug || product.id}`} className="block w-full h-full relative flex items-center justify-center">
                                            {productIsVideo ? (
                                                <video
                                                    src={product.image}
                                                    muted
                                                    playsInline
                                                    loop
                                                    className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-500 group-hover/img:scale-105"
                                                    onMouseEnter={(e) => e.currentTarget.play()}
                                                    onMouseLeave={(e) => e.currentTarget.pause()}
                                                />
                                            ) : (
                                                <img
                                                    src={product.image || "/ogedecor.png"}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-500 group-hover/img:scale-105"
                                                />
                                            )}
                                        </Link>

                                        {/* Badges */}
                                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 pointer-events-none">
                                            <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md border border-white/10 text-[9px] tracking-wider uppercase font-medium rounded-full text-gold">
                                                {product.category}
                                            </span>
                                            {productIsVideo && (
                                                <span className="px-2 py-0.5 bg-gold/90 text-obsidian text-[9px] tracking-wider uppercase font-bold rounded-full flex items-center gap-1">
                                                    <Play size={8} fill="currentColor" /> Video
                                                </span>
                                            )}
                                        </div>

                                        {/* Quick Add Overlay */}
                                        <button
                                            onClick={(e) => handleQuickAdd(product, e)}
                                            className="absolute bottom-2.5 right-2.5 p-2 bg-gold text-obsidian rounded-lg font-bold shadow-lg shadow-gold/30 hover:bg-gold-light transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                                            title="Add to Shopping Bag"
                                        >
                                            <ShoppingBag size={14} />
                                        </button>
                                    </div>

                                    {/* Product Meta */}
                                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                        <div>
                                            <Link href={`/shop/${product.slug || product.id}`} className="group/title">
                                                <h3 className="font-serif text-sm sm:text-base text-sand group-hover/title:text-gold transition-colors line-clamp-1 font-medium">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            {product.subtitle && (
                                                <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                                                    {product.subtitle}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                            <span className="font-serif text-sm sm:text-base text-gold font-bold">
                                                {product.formattedPrice || `$${product.price}`}
                                            </span>
                                            <Link
                                                href={`/shop/${product.slug || product.id}`}
                                                className="text-[10px] uppercase tracking-wider text-white/50 hover:text-gold flex items-center gap-1 transition-colors"
                                            >
                                                <span>Details</span>
                                                <ArrowRight size={10} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Mobile View All Store CTA */}
                <div className="mt-8 text-center sm:hidden">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-sand text-xs uppercase tracking-wider rounded-xl font-medium hover:border-gold"
                    >
                        <span>Explore Full Shop</span>
                        <ArrowRight size={14} className="text-gold" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
