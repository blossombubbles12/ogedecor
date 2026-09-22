"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Filter, Truck, ShieldCheck, Sparkles, Check, Eye, X, ArrowRight } from "lucide-react";
import { getShopProducts } from "@/app/actions";
import { useCart } from "@/context/CartContext";

const CATEGORIES = ["All", "Furniture", "Lighting", "Art & Decor", "Textiles", "Architectural Decor"];

const FALLBACK_PRODUCTS = [
    {
        id: "p1",
        slug: "ashanti-stool-gold-edition",
        name: "Ashanti Stool - Gold Edition",
        subtitle: "Handcrafted Solid Mahogany with 24k Gold Leaf",
        price: 450,
        formattedPrice: "$450.00",
        currency: "USD",
        category: "Furniture",
        sku: "OGE-FURN-001",
        stockQuantity: 8,
        inStock: true,
        materials: "Solid Mahogany, 24k Gold Leaf Trim, Natural Wax Finish",
        dimensions: { height: "45 cm", width: "55 cm", depth: "35 cm", weight: "9 kg" },
        deliveryInfo: { leadTime: "Ready to ship in 2-3 business days", isFragile: false, whiteGloveRequired: true },
        image: "https://images.unsplash.com/photo-1594056152367-285625fb4902?q=80&w=1200",
        description: "Handcrafted with sustainable mahogany and finished with antique gold leaf, inspired by royal ceremonial seats."
    },
    {
        id: "p2",
        slug: "wakandan-geometry-vase",
        name: "Wakandan Geometry Vase",
        subtitle: "Hand-Thrown Ceramic with West African Relief",
        price: 180,
        formattedPrice: "$180.00",
        currency: "USD",
        category: "Art & Decor",
        sku: "OGE-ART-002",
        stockQuantity: 14,
        inStock: true,
        materials: "High-Fire Terracotta Clay, Matte Basalt Glaze",
        dimensions: { height: "38 cm", width: "22 cm", depth: "22 cm", weight: "4.5 kg" },
        deliveryInfo: { leadTime: "Ready to ship in 24 hours", isFragile: true, whiteGloveRequired: false },
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1200",
        description: "Modern ceramic vase featuring intricate relief carvings inspired by West African geometric symbology."
    },
    {
        id: "p3",
        slug: "savanna-velvet-cushion",
        name: "Savanna Velvet Cushion",
        subtitle: "Embroidered Architectural Silk-Velvet",
        price: 95,
        formattedPrice: "$95.00",
        currency: "USD",
        category: "Textiles",
        sku: "OGE-TEXT-003",
        stockQuantity: 25,
        inStock: true,
        materials: "100% Silk Velvet, Goose Down Insert, Metallic Embroidery",
        dimensions: { height: "50 cm", width: "50 cm", depth: "15 cm", weight: "1.2 kg" },
        deliveryInfo: { leadTime: "Ready to ship in 24 hours", isFragile: false, whiteGloveRequired: false },
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1200",
        description: "Bespoke decorative cushion crafted from rich architectural silk-velvet with metallic thread accents."
    },
    {
        id: "p4",
        slug: "kalahari-onyx-sconce",
        name: "Kalahari Onyx Sconce",
        subtitle: "Translucent African Onyx with Solid Brass Backplate",
        price: 340,
        formattedPrice: "$340.00",
        currency: "USD",
        category: "Lighting",
        sku: "OGE-LIGHT-004",
        stockQuantity: 6,
        inStock: true,
        materials: "African Onyx, Brushed Brass, Warm Dimmable LED",
        dimensions: { height: "35 cm", width: "15 cm", depth: "12 cm", weight: "3.8 kg" },
        deliveryInfo: { leadTime: "Ready to ship in 2-3 business days", isFragile: true, whiteGloveRequired: false },
        image: "https://images.unsplash.com/photo-1507473885765-e6ed60516b12?q=80&w=1200",
        description: "Carved from solid onyx cylinders, this architectural sconce radiates a warm, crystalline diffused light."
    },
    {
        id: "p5",
        slug: "terracotta-relief-mask",
        name: "Terracotta Relief Mask",
        subtitle: "Sculptural Gallery Wall Accent",
        price: 210,
        formattedPrice: "$210.00",
        currency: "USD",
        category: "Art & Decor",
        sku: "OGE-ART-005",
        stockQuantity: 10,
        inStock: true,
        materials: "Aged Terracotta, Smoked Charcoal Pigment",
        dimensions: { height: "60 cm", width: "28 cm", depth: "12 cm", weight: "5 kg" },
        deliveryInfo: { leadTime: "Ready to ship in 24 hours", isFragile: true, whiteGloveRequired: false },
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e15ca?q=80&w=1200",
        description: "Contemporary interpretation of classical terracotta masks, mounted with concealed brass suspension."
    },
    {
        id: "p6",
        slug: "baobab-root-sculptural-table",
        name: "Baobab Root Sculptural Table",
        subtitle: "Reclaimed Aged Timber with Volcanic Wax",
        price: 890,
        formattedPrice: "$890.00",
        currency: "USD",
        category: "Furniture",
        sku: "OGE-FURN-006",
        stockQuantity: 3,
        inStock: true,
        materials: "Reclaimed Baobab Wood, Volcanic Obsidian Wax Treatment",
        dimensions: { height: "52 cm", width: "65 cm", depth: "60 cm", weight: "22 kg" },
        deliveryInfo: { leadTime: "White-glove scheduled delivery within 5 days", isFragile: false, whiteGloveRequired: true },
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200",
        description: "One-of-a-kind sculptural accent table carved from preserved aged timber, celebrating natural organic forms."
    },
];

interface ShopContentProps {
    initialProducts?: any[];
}

export default function ShopContent({ initialProducts = [] }: ShopContentProps) {
    const hasInitial = initialProducts && initialProducts.length > 0;
    const initialList = hasInitial ? initialProducts : FALLBACK_PRODUCTS;
    const [products, setProducts] = useState<any[]>(initialList);
    const [filteredProducts, setFilteredProducts] = useState<any[]>(initialList);
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(!hasInitial);
    
    // Global Cart State
    const { totalCount: totalCartCount, addToCart, openCart } = useCart();
    
    // Quick View modal state
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [addedToast, setAddedToast] = useState<string | null>(null);

    useEffect(() => {
        if (!hasInitial) {
            async function fetchProducts() {
                try {
                    const data = await getShopProducts();
                    if (data && data.length > 0) {
                        setProducts(data);
                        setFilteredProducts(data);
                    }
                } catch (e) {
                    console.warn("Could not fetch products from backend", e);
                } finally {
                    setLoading(false);
                }
            }
            fetchProducts();
        }
    }, [hasInitial]);

    useEffect(() => {
        if (activeCategory === "All") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter((p) => p.category === activeCategory));
        }
    }, [activeCategory, products]);

    // Cart action with feedback toast
    const handleAddToCart = (product: any) => {
        addToCart(product);
        setAddedToast(product.name);
        setTimeout(() => setAddedToast(null), 3000);
    };

    return (
        <main className="min-h-screen bg-obsidian pt-32 pb-24 text-sand">
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
                            <strong className="text-gold">{addedToast}</strong> added to shopping bag.
                        </span>
                        <button
                            onClick={() => openCart()}
                            className="ml-2 text-xs uppercase tracking-wider text-gold hover:underline font-medium"
                        >
                            View Bag
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-3 sm:px-6">
                {/* Header Content */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 sm:mb-16 gap-6 sm:gap-8 text-center md:text-left">
                    <div>
                        <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-gold tracking-[0.3em] font-medium uppercase text-xs mb-3 flex items-center justify-center md:justify-start gap-2"
                        >
                            <Sparkles size={14} /> The Ogedecor Collection
                        </motion.h3>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-7xl font-serif text-white tracking-tight"
                        >
                            Bespoke Decor
                        </motion.h1>
                        <p className="text-white/60 text-xs sm:text-sm max-w-lg mt-2 sm:mt-3">
                            Limited edition furniture, sculptural lighting, and African architectural accents designed for luxury living.
                        </p>
                    </div>

                    {/* Cart Trigger Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => openCart()}
                        className="relative group cursor-pointer"
                    >
                        <div className="flex items-center gap-3 sm:gap-4 bg-white/5 border border-white/10 px-4 sm:px-6 py-3 sm:py-4 rounded-xl hover:border-gold transition-all duration-300 shadow-xl group-hover:bg-white/[0.08]">
                            <ShoppingBag className="text-gold" size={20} />
                            <div className="text-left">
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/40">Your Bag</p>
                                <p className="text-sand font-bold text-xs sm:text-sm">
                                    {totalCartCount} {totalCartCount === 1 ? "Piece" : "Pieces"}
                                </p>
                            </div>
                        </div>
                        {totalCartCount > 0 && (
                            <div className="absolute -top-2 -right-2 w-5 sm:w-6 h-5 sm:h-6 bg-gold text-obsidian rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold shadow-lg shadow-gold/30 animate-pulse">
                                {totalCartCount}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 mb-8 sm:mb-12 border-y border-white/10 py-4 sm:py-6">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest rounded-full transition-all duration-300 ${
                                    activeCategory === cat
                                        ? "bg-gold text-obsidian font-bold shadow-md shadow-gold/20"
                                        : "text-white/50 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="hidden sm:flex items-center gap-4 text-xs text-white/50">
                        <span className="flex items-center gap-1.5">
                            <Truck size={14} className="text-gold" /> White-Glove Logistics
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-gold" /> Insured Transit
                        </span>
                    </div>
                </div>

                {/* Products Grid - 2 columns on Mobile, 2 on MD, 3 on LG */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
                    {filteredProducts.map((product, idx) => (
                        <motion.div
                            key={product.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group bg-[#121215] border border-white/5 rounded-xl sm:rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500 flex flex-col"
                        >
                            {/* Product Image */}
                            <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-neutral-900 group/img">
                                <Link href={`/shop/${product.slug || product.id}`} className="block w-full h-full">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity" />
                                </Link>

                                {/* Category Badge */}
                                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1.5 pointer-events-none">
                                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase font-medium rounded-full text-gold">
                                        {product.category}
                                    </span>
                                </div>

                                {/* Quick View Button Overlay */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedProduct(product);
                                    }}
                                    className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 p-1.5 sm:p-2.5 bg-black/70 backdrop-blur-md rounded-full text-white/70 hover:text-gold hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                                    title="Quick Specifications"
                                >
                                    <Eye size={14} className="sm:w-4 sm:h-4" />
                                </button>
                            </div>

                            {/* Product Details */}
                            <div className="p-3 sm:p-6 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                                <div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-0.5 sm:gap-2 mb-1">
                                        <Link href={`/shop/${product.slug || product.id}`} className="group/title">
                                            <h3 className="font-serif text-sm sm:text-xl text-sand group-hover/title:text-gold transition-colors line-clamp-1">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <span className="font-serif text-sm sm:text-lg text-gold font-medium flex-shrink-0">
                                            {product.formattedPrice || `$${product.price}`}
                                        </span>
                                    </div>
                                    {product.subtitle && (
                                        <p className="text-[10px] sm:text-xs text-white/50 line-clamp-1 mb-1 sm:mb-2">
                                            {product.subtitle}
                                        </p>
                                    )}
                                    <p className="text-[11px] sm:text-xs text-white/60 line-clamp-2 leading-relaxed hidden sm:block">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Delivery & Add to Cart */}
                                <div className="pt-2 sm:pt-4 border-t border-white/5 space-y-2 sm:space-y-3">
                                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-white/40">
                                        <span className="flex items-center gap-1 sm:gap-1.5 truncate">
                                            <Truck size={11} className="text-gold flex-shrink-0" />
                                            <span className="truncate">{product.deliveryInfo?.leadTime || "2-3 days"}</span>
                                        </span>
                                        {product.deliveryInfo?.whiteGloveRequired && (
                                            <span className="hidden sm:inline text-[9px] sm:text-[10px] text-gold/80 bg-gold/10 px-1.5 sm:px-2 py-0.5 rounded">
                                                White Glove
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-1.5 sm:gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="flex-1 py-2 sm:py-3 bg-white/5 hover:bg-gold hover:text-obsidian text-sand border border-white/10 hover:border-gold rounded-lg sm:rounded-xl text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 group/btn"
                                        >
                                            <ShoppingBag size={12} className="sm:w-3.5 sm:h-3.5 group-hover/btn:scale-110 transition-transform" />
                                            <span>Add to Bag</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleAddToCart(product);
                                                openCart();
                                            }}
                                            className="hidden sm:block px-3 sm:px-4 py-2 sm:py-3 bg-gold text-obsidian rounded-lg sm:rounded-xl text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-bold hover:bg-gold-light transition-all"
                                            title="Acquire Immediately"
                                        >
                                            Acquire
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Quick View / Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedProduct(null)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#121215] border border-gold/30 rounded-2xl p-6 md:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs uppercase tracking-widest text-gold font-medium">
                                        {selectedProduct.category}
                                    </span>
                                    <h2 className="font-serif text-3xl text-sand mt-1">{selectedProduct.name}</h2>
                                    <p className="text-xl font-serif text-gold mt-1">
                                        {selectedProduct.formattedPrice || `$${selectedProduct.price}`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/5"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 border border-white/5">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <p className="text-sm text-white/70 leading-relaxed">
                                {selectedProduct.description}
                            </p>

                            {/* Specifications Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-y border-white/10 text-xs">
                                <div>
                                    <span className="text-white/40 block mb-1">Materials & Finishes:</span>
                                    <span className="text-sand">{selectedProduct.materials || "Natural Mahogany, Brass Accents"}</span>
                                </div>
                                <div>
                                    <span className="text-white/40 block mb-1">Lead Time:</span>
                                    <span className="text-sand">{selectedProduct.deliveryInfo?.leadTime || "2-3 business days"}</span>
                                </div>
                                <div>
                                    <span className="text-white/40 block mb-1">Dimensions:</span>
                                    <span className="text-sand">
                                        {selectedProduct.dimensions?.height} (H) × {selectedProduct.dimensions?.width} (W) × {selectedProduct.dimensions?.depth} (D)
                                    </span>
                                </div>
                                <div>
                                    <span className="text-white/40 block mb-1">Handling Protocol:</span>
                                    <span className="text-sand">
                                        {selectedProduct.deliveryInfo?.whiteGloveRequired ? "White-Glove Included" : "Standard Insured Transport"}
                                    </span>
                                </div>
                            </div>

                            {/* Delivery highlights */}
                            <div className="bg-white/5 p-4 rounded-xl space-y-2 border border-white/5">
                                <div className="flex items-center gap-2 text-xs text-sand font-medium">
                                    <ShieldCheck size={16} className="text-gold" />
                                    <span>Verified Ogedecor Authenticity & Master Craft Certificate</span>
                                </div>
                                {selectedProduct.deliveryInfo?.whiteGloveRequired && (
                                    <div className="flex items-center gap-2 text-xs text-white/60">
                                        <Truck size={16} className="text-gold" />
                                        <span>Complimentary room-of-choice placement and packaging de-installation.</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Link
                                    href={`/shop/${selectedProduct.slug || selectedProduct.id}`}
                                    onClick={() => setSelectedProduct(null)}
                                    className="py-3.5 px-5 bg-white/5 hover:bg-white/10 text-sand border border-white/10 hover:border-gold rounded-xl uppercase tracking-wider text-xs font-medium flex items-center justify-center gap-2 transition-all order-2 sm:order-1"
                                >
                                    <span>Full Details & Specs</span>
                                    <ArrowRight size={14} />
                                </Link>
                                <button
                                    onClick={() => {
                                        handleAddToCart(selectedProduct);
                                        setSelectedProduct(null);
                                    }}
                                    className="flex-1 py-3.5 bg-gold text-obsidian font-bold tracking-wider uppercase text-xs rounded-xl hover:bg-gold-light transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20 order-1 sm:order-2"
                                >
                                    <ShoppingBag size={16} />
                                    <span>Add Piece to Bag</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
