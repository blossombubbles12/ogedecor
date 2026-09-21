"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Filter, ChevronDown } from "lucide-react";
import { getShopProducts } from "@/app/actions";

const CATEGORIES = ["All", "Furniture", "Lighting", "Art & Decor", "Textiles"];

export default function ShopContent() {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        async function fetchProducts() {
            const data = await getShopProducts();
            // Use premium mock data if database is empty
            const initialData = data.length > 0 ? data : [
                {
                    id: "p1",
                    name: "Ashanti Stool - Gold Edition",
                    price: "$450.00",
                    category: "Furniture",
                    image: "https://images.unsplash.com/photo-1594056152367-285625fb4902?q=80&w=1200",
                    description: "Handcrafted with sustainable mahogany and finished with antique gold leaf."
                },
                {
                    id: "p2",
                    name: "Wakandan Geometry Vase",
                    price: "$180.00",
                    category: "Art & Decor",
                    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1200",
                    description: "Modern ceramic vase featuring intricate relief carvings inspired by West African geometry."
                },
                {
                    id: "p3",
                    name: "Savanna Velvet Cushion",
                    price: "$95.00",
                    category: "Textiles",
                    image: "https://images.unsplash.com/photo-1584100936555-5c911b6d0590?q=80&w=1200",
                    description: "Ultra-soft velvet with hand-embroidered patterns reflecting the vast savanna horizon."
                },
                {
                    id: "p4",
                    name: "Onyx Pillar Lamp",
                    price: "$320.00",
                    category: "Lighting",
                    image: "https://images.unsplash.com/photo-1507473885765-e6ed60516b12?q=80&w=1200",
                    description: "Natural onyx base with a warm, diffused glow for a sophisticated evening atmosphere."
                },
                {
                    id: "p5",
                    name: "Terracotta Relief Mask",
                    price: "$210.00",
                    category: "Art & Decor",
                    image: "https://images.unsplash.com/photo-1513519245088-0e12902e15ca?q=80&w=1200",
                    description: "Contemporary interpretation of traditional terracotta masks, perfect for gallery walls."
                },
                {
                    id: "p6",
                    name: "Baobab Root Side Table",
                    price: "$890.00",
                    category: "Furniture",
                    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200",
                    description: "Natural sculptural side table carved from fallen baobab wood, treated with volcanic wax."
                },
            ];
            setProducts(initialData);
            setFilteredProducts(initialData);
            setLoading(false);
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        if (activeCategory === "All") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === activeCategory));
        }
    }, [activeCategory, products]);

    const addToCart = () => {
        setCartCount(prev => prev + 1);
    };

    return (
        <main className="min-h-screen bg-obsidian pt-32 pb-24">
            {/* Header Content */}
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
                    <div>
                        <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-gold tracking-[0.3em] font-medium uppercase text-xs mb-4"
                        >
                            The Oge Collection
                        </motion.h3>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-serif text-white"
                        >
                            Bespoke Decor
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group cursor-pointer"
                    >
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-sm hover:border-gold transition-all duration-300">
                            <ShoppingBag className="text-gold" size={24} />
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest text-white/40">Your Bag</p>
                                <p className="text-sand font-bold">{cartCount} Items</p>
                            </div>
                        </div>
                        {cartCount > 0 && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold text-obsidian rounded-full flex items-center justify-center text-[10px] font-bold animate-bounce">
                                {cartCount}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 border-y border-white/5 py-8">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 text-xs uppercase tracking-widest transition-all duration-300 ${activeCategory === cat
                                    ? "text-gold font-bold border-b-2 border-gold"
                                    : "text-white/40 hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-white/40">
                        <button className="flex items-center gap-2 hover:text-gold transition-colors">
                            <Filter size={16} /> Filters
                        </button>
                        <button className="flex items-center gap-2 hover:text-gold transition-colors">
                            Sort By <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="group"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 mb-8 rounded-sm">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${product.image})` }}
                                        />
                                        <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-500" />

                                        {/* Quick Action Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            <button
                                                onClick={addToCart}
                                                className="bg-white text-obsidian px-8 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-gold transition-all shadow-2xl"
                                            >
                                                Add to Bag
                                            </button>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-6 left-6">
                                            <span className="bg-obsidian/80 backdrop-blur-md px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold border border-gold/20">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-center">
                                        <h3 className="text-2xl font-serif text-white hover:text-gold transition-colors cursor-pointer">{product.name}</h3>
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="h-[1px] w-8 bg-gold/30" />
                                            <span className="text-gold font-bold tracking-widest text-sm">{product.price}</span>
                                            <div className="h-[1px] w-8 bg-gold/30" />
                                        </div>
                                        <p className="text-xs text-white/40 italic max-w-xs mx-auto line-clamp-2">
                                            {product.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Empty State */}
                {filteredProducts.length === 0 && !loading && (
                    <div className="text-center py-24 border border-dashed border-white/10">
                        <p className="text-white/20 font-serif italic text-2xl mb-8">This collection is currently empty.</p>
                        <button onClick={() => setActiveCategory("All")} className="text-gold uppercase tracking-widest text-[10px] border-b border-gold pb-1 font-bold">Show All Pieces</button>
                    </div>
                )}
            </div>

            {/* Newsletter CTA */}
            <section className="mt-32 py-24 bg-black/40 border-t border-white/5">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <h2 className="text-4xl font-serif text-white mb-6">Gain Exclusive Access</h2>
                    <p className="text-white/50 mb-12">Subscribe to the Oge Curated list for first access to new collection drops and interior design journals.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 bg-white/5 border border-white/10 px-8 py-4 text-sand focus:outline-none focus:border-gold transition-colors"
                        />
                        <button className="bg-gold text-obsidian px-12 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-all">
                            Ascend
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
