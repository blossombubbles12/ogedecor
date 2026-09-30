"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getShopProducts } from "@/app/actions";
import { useCart } from "@/context/CartContext";

export default function ShopPreview() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, openCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getShopProducts();
                setProducts(data ? data.slice(0, 4) : []);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleQuickAdd = (product: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        openCart();
    };

    return (
        <section id="shop" className="py-16 sm:py-24 bg-strip-pattern relative">
            <div className="container mx-auto px-3 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16">
                    <div>
                        <h3 className="text-gold tracking-[0.2em] text-xs sm:text-sm uppercase mb-2 sm:mb-4">The Collection</h3>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-sand">Curated Decor</h2>
                    </div>
                    <Link href="/shop" className="group flex items-center gap-2 text-white/60 hover:text-gold transition-colors mt-4 md:mt-0 text-xs sm:text-sm uppercase tracking-wider font-medium">
                        <span>Visit Store</span>
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square sm:aspect-[4/5] bg-white/5 animate-pulse rounded-lg sm:rounded-xl" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-16 text-center space-y-4">
                        <p className="text-white/40 text-sm">New collection pieces will appear here once added to the catalog.</p>
                        <Link href="/shop" className="inline-block text-gold text-xs uppercase tracking-widest hover:underline">Visit the full store →</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="group flex flex-col"
                            >
                                <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-[#0c0c0f] rounded-lg sm:rounded-xl mb-3 sm:mb-4 group/img flex items-center justify-center p-3 sm:p-4">
                                    <Link href={`/shop/${product.slug || product.id}`} className="block w-full h-full relative flex items-center justify-center">
                                        <img
                                            src={product.image || "/ogedecor.png"}
                                            alt={product.name}
                                            className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-500 group-hover/img:scale-105"
                                        />
                                    </Link>

                                    {/* Mobile Tap / Desktop Hover Quick Add Button */}
                                    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={(e) => handleQuickAdd(product, e)}
                                            className="bg-gold text-obsidian p-2 sm:px-4 sm:py-2.5 rounded-lg font-bold uppercase tracking-wider text-[10px] sm:text-xs hover:bg-gold-light transition-all flex items-center gap-1.5 shadow-lg shadow-gold/30"
                                            title="Add to Shopping Bag"
                                        >
                                            <ShoppingBag size={14} />
                                            <span className="hidden sm:inline">Add</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-0.5 sm:gap-2">
                                    <Link href={`/shop/${product.slug || product.id}`} className="group/title">
                                        <h3 className="text-xs sm:text-base md:text-lg font-serif text-sand group-hover/title:text-gold transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <span className="text-xs sm:text-sm text-gold font-medium flex-shrink-0">
                                        {product.formattedPrice || `$${product.price}`}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
