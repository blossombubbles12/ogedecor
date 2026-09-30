"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ShoppingBag, 
    Filter, 
    Truck, 
    ShieldCheck, 
    Sparkles, 
    Check, 
    Eye, 
    X, 
    ArrowRight, 
    Package, 
    Search,
    SlidersHorizontal,
    Play,
    RotateCcw
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const CATEGORIES = ["All", "Furniture", "Lighting", "Art & Decor", "Textiles", "Architectural Decor"];

const SORT_OPTIONS = [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Name: A to Z", value: "name_asc" },
];

const PRICE_RANGES = [
    { label: "All Prices", min: 0, max: Infinity },
    { label: "Under $500", min: 0, max: 500 },
    { label: "$500 – $2,000", min: 500, max: 2000 },
    { label: "$2,000+", min: 2000, max: Infinity },
];

interface ShopContentProps {
    initialProducts?: any[];
}

export default function ShopContent({ initialProducts = [] }: ShopContentProps) {
    const products = initialProducts;
    
    // Filter & Search States
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    const [selectedPriceRange, setSelectedPriceRange] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Global Cart State
    const { totalCount: totalCartCount, addToCart, openCart } = useCart();
    
    // Quick View modal state
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [addedToast, setAddedToast] = useState<string | null>(null);

    // Filter and sort computation
    const filteredProducts = useMemo(() => {
        return products
            .filter((product) => {
                // Category filter
                if (selectedCategory !== "All" && product.category !== selectedCategory) {
                    return false;
                }
                // In-Stock filter
                if (inStockOnly && product.inStock === false) {
                    return false;
                }
                // Price Range
                const price = typeof product.price === "number" ? product.price : 0;
                const range = PRICE_RANGES[selectedPriceRange];
                if (range && (price < range.min || price > range.max)) {
                    return false;
                }
                // Search query
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase().trim();
                    const name = (product.name || "").toLowerCase();
                    const desc = (product.description || "").toLowerCase();
                    const materials = (product.materials || "").toLowerCase();
                    const subtitle = (product.subtitle || "").toLowerCase();
                    if (!name.includes(q) && !desc.includes(q) && !materials.includes(q) && !subtitle.includes(q)) {
                        return false;
                    }
                }
                return true;
            })
            .sort((a, b) => {
                if (sortBy === "price_asc") {
                    return (a.price || 0) - (b.price || 0);
                }
                if (sortBy === "price_desc") {
                    return (b.price || 0) - (a.price || 0);
                }
                if (sortBy === "name_asc") {
                    return (a.name || "").localeCompare(b.name || "");
                }
                return 0; // Default order
            });
    }, [products, selectedCategory, searchQuery, sortBy, selectedPriceRange, inStockOnly]);

    // Compute category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { All: products.length };
        CATEGORIES.forEach((cat) => {
            if (cat !== "All") {
                counts[cat] = products.filter((p) => p.category === cat).length;
            }
        });
        return counts;
    }, [products]);

    const resetFilters = () => {
        setSelectedCategory("All");
        setSearchQuery("");
        setSortBy("featured");
        setSelectedPriceRange(0);
        setInStockOnly(false);
    };

    const hasActiveFilters = selectedCategory !== "All" || searchQuery !== "" || selectedPriceRange !== 0 || inStockOnly;

    // Cart action with feedback toast
    const handleAddToCart = (product: any) => {
        addToCart(product);
        setAddedToast(product.name);
        setTimeout(() => setAddedToast(null), 3000);
    };

    const isVideo = (url?: string) => {
        if (!url) return false;
        const u = url.toLowerCase().split('?')[0];
        return u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.mov') || u.includes('/video/');
    };

    return (
        <main className="min-h-screen bg-obsidian pt-28 sm:pt-36 pb-24 text-sand">
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

            <div className="container mx-auto px-4 sm:px-6">
                {/* Header Content */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 pb-6 border-b border-white/10 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-gold tracking-[0.25em] font-medium uppercase text-xs mb-2">
                            <Sparkles size={13} />
                            <span>Bespoke African Atelier</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight">
                            Shop The Collection
                        </h1>
                        <p className="text-white/60 text-xs sm:text-sm max-w-xl mt-2">
                            Handcrafted luxury furniture, lighting, and cultural decor pieces sculpted by master artisans.
                        </p>
                    </div>

                    {/* Quick Stats & Bag Button */}
                    <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
                        <button
                            onClick={() => setMobileFilterOpen(true)}
                            className="lg:hidden flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider text-sand hover:border-gold transition-colors"
                        >
                            <SlidersHorizontal size={14} className="text-gold" />
                            <span>Filter & Sort {hasActiveFilters && "•"}</span>
                        </button>

                        <div
                            onClick={() => openCart()}
                            className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 sm:px-5 py-2.5 rounded-xl hover:border-gold transition-all duration-300 shadow-lg cursor-pointer group hover:bg-white/[0.08]"
                        >
                            <ShoppingBag className="text-gold group-hover:scale-110 transition-transform" size={18} />
                            <div className="text-left">
                                <p className="text-[9px] uppercase tracking-widest text-white/40">Bag</p>
                                <p className="text-sand font-bold text-xs">
                                    {totalCartCount} {totalCartCount === 1 ? "Piece" : "Pieces"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Two-Column Layout (Sidebar + Product Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT SIDEBAR (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28 bg-[#121216]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                        {/* Search Input */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-2 block">
                                Search Catalog
                            </label>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search pieces, materials..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-xs text-sand placeholder:text-white/30 focus:border-gold focus:outline-none transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                                    Categories
                                </span>
                                {selectedCategory !== "All" && (
                                    <button
                                        onClick={() => setSelectedCategory("All")}
                                        className="text-[10px] text-white/40 hover:text-gold transition-colors"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                {CATEGORIES.map((cat) => {
                                    const count = categoryCounts[cat] ?? 0;
                                    const isActive = selectedCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                                                isActive
                                                    ? "bg-gold text-obsidian font-bold shadow-md shadow-gold/20"
                                                    : "text-white/60 hover:text-sand hover:bg-white/5"
                                            }`}
                                        >
                                            <span className="truncate">{cat}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                                isActive ? "bg-obsidian/20 text-obsidian" : "bg-white/5 text-white/40"
                                            }`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-3 block">
                                Price Bracket
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                {PRICE_RANGES.map((range, idx) => (
                                    <button
                                        key={range.label}
                                        onClick={() => setSelectedPriceRange(idx)}
                                        className={`px-2.5 py-2 rounded-lg text-[11px] border transition-all text-center ${
                                            selectedPriceRange === idx
                                                ? "border-gold bg-gold/10 text-gold font-medium"
                                                : "border-white/5 text-white/50 hover:border-white/20 hover:text-sand"
                                        }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort & Availability */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-2 block">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-sand focus:border-gold focus:outline-none transition-all cursor-pointer"
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value} className="bg-[#16161A] text-sand">
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* In-Stock Toggle */}
                            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <span className="text-xs text-white/70">In-Stock Only</span>
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/20 text-gold accent-gold focus:ring-gold focus:ring-offset-0 bg-transparent cursor-pointer"
                                />
                            </label>
                        </div>

                        {/* Reset All Filters Button */}
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="w-full flex items-center justify-center gap-2 py-2.5 border border-gold/30 hover:border-gold text-gold rounded-xl text-xs uppercase tracking-wider transition-all hover:bg-gold/10"
                            >
                                <RotateCcw size={13} />
                                <span>Reset All Filters</span>
                            </button>
                        )}

                        {/* Luxury Trust Indicators */}
                        <div className="pt-4 border-t border-white/10 space-y-2.5 text-[11px] text-white/50">
                            <div className="flex items-center gap-2">
                                <Truck size={13} className="text-gold flex-shrink-0" />
                                <span>White-Glove Delivery Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={13} className="text-gold flex-shrink-0" />
                                <span>100% Insured Global Transit</span>
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT PRODUCT GRID SECTION */}
                    <section className="lg:col-span-9">
                        {/* Results Header Bar */}
                        <div className="flex items-center justify-between mb-6 text-xs text-white/50">
                            <p>
                                Showing <strong className="text-sand">{filteredProducts.length}</strong> of {products.length} {products.length === 1 ? "piece" : "pieces"}
                                {selectedCategory !== "All" && (
                                    <span> in <strong className="text-gold">{selectedCategory}</strong></span>
                                )}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="text-gold hover:underline text-[11px] uppercase tracking-wider flex items-center gap-1"
                                >
                                    <RotateCcw size={11} /> Clear All
                                </button>
                            )}
                        </div>

                        {/* Products Grid */}
                        {filteredProducts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-24 text-center space-y-5 bg-[#121216]/50 border border-white/5 rounded-2xl p-8"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 text-gold/70">
                                    <Package size={28} />
                                </div>
                                <div className="space-y-1.5">
                                    <h2 className="text-xl font-serif text-white">
                                        No matching pieces found
                                    </h2>
                                    <p className="text-white/50 text-xs max-w-sm mx-auto">
                                        We couldn't find any piece matching your active filters. Try clearing your search or switching categories.
                                    </p>
                                </div>
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center gap-2 bg-gold text-obsidian px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-colors"
                                >
                                    <RotateCcw size={13} /> Reset Filters
                                </button>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-5">
                                {filteredProducts.map((product, idx) => {
                                    const productIsVideo = isVideo(product.image);

                                    return (
                                        <motion.div
                                            key={product.id || idx}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                                            className="group bg-[#121216] border border-white/10 hover:border-gold/40 rounded-xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-gold/5"
                                        >
                                            {/* Product Thumbnail Section - Crisp, well-proportioned, clearly visible */}
                                            <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-[#0c0c0f] group/img flex items-center justify-center p-3 sm:p-4">
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

                                                {/* Top Badges (Category & In-Stock) */}
                                                <div className="absolute top-2 left-2 flex flex-wrap gap-1 pointer-events-none">
                                                    <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md border border-white/10 text-[9px] tracking-wider uppercase font-medium rounded-full text-gold">
                                                        {product.category}
                                                    </span>
                                                    {productIsVideo && (
                                                        <span className="px-2 py-0.5 bg-gold/90 text-obsidian text-[9px] tracking-wider uppercase font-bold rounded-full flex items-center gap-1">
                                                            <Play size={8} fill="currentColor" /> Video
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quick View Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setSelectedProduct(product);
                                                    }}
                                                    className="absolute bottom-2 right-2 p-2 bg-black/80 backdrop-blur-md rounded-full text-white/80 hover:text-gold hover:bg-black transition-all opacity-0 group-hover:opacity-100 shadow-md"
                                                    title="Quick Overview"
                                                >
                                                    <Eye size={13} />
                                                </button>
                                            </div>

                                            {/* Product Details Section */}
                                            <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                                                <div>
                                                    <div className="flex items-start justify-between gap-1.5 mb-1">
                                                        <Link href={`/shop/${product.slug || product.id}`} className="group/title flex-1">
                                                            <h3 className="font-serif text-xs sm:text-base text-sand group-hover/title:text-gold transition-colors line-clamp-1 font-medium">
                                                                {product.name}
                                                            </h3>
                                                        </Link>
                                                    </div>

                                                    <div className="flex items-baseline justify-between gap-2">
                                                        <span className="font-serif text-xs sm:text-sm text-gold font-bold">
                                                            {product.formattedPrice || `$${product.price}`}
                                                        </span>
                                                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                                                            <span className="text-[10px] text-white/40 line-through">
                                                                ${product.compareAtPrice}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {product.subtitle && (
                                                        <p className="text-[10px] sm:text-[11px] text-white/50 line-clamp-1 mt-1">
                                                            {product.subtitle}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Delivery Info & Action Buttons */}
                                                <div className="pt-2 border-t border-white/5 space-y-2">
                                                    <div className="flex items-center justify-between text-[10px] text-white/40">
                                                        <span className="flex items-center gap-1 truncate">
                                                            <Truck size={10} className="text-gold flex-shrink-0" />
                                                            <span className="truncate">{product.deliveryInfo?.leadTime || "Ready to ship"}</span>
                                                        </span>
                                                        {product.inStock === false && (
                                                            <span className="text-red-400 font-medium">Out of stock</span>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-1.5">
                                                        <button
                                                            onClick={() => handleAddToCart(product)}
                                                            className="flex-1 py-2 px-2.5 bg-white/5 hover:bg-gold hover:text-obsidian text-sand border border-white/10 hover:border-gold rounded-lg text-[10px] uppercase tracking-wider font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 group/btn"
                                                        >
                                                            <ShoppingBag size={11} className="group-hover/btn:scale-110 transition-transform" />
                                                            <span>Add to Bag</span>
                                                        </button>
                                                        <Link
                                                            href={`/shop/${product.slug || product.id}`}
                                                            className="py-2 px-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center justify-center"
                                                            title="View piece"
                                                        >
                                                            <ArrowRight size={11} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Mobile Filter Slide-Over Drawer */}
            <AnimatePresence>
                {mobileFilterOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setMobileFilterOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#121216] border-l border-white/10 p-6 flex flex-col justify-between z-10 overflow-y-auto"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                    <span className="font-serif text-lg text-sand flex items-center gap-2">
                                        <SlidersHorizontal size={16} className="text-gold" /> Filter & Sort
                                    </span>
                                    <button
                                        onClick={() => setMobileFilterOpen(false)}
                                        className="p-1 text-white/50 hover:text-white"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Search */}
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-2 block">
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search pieces..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-sand focus:border-gold focus:outline-none"
                                    />
                                </div>

                                {/* Categories */}
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-2 block">
                                        Category
                                    </span>
                                    <div className="space-y-1">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                                                    selectedCategory === cat
                                                        ? "bg-gold text-obsidian font-bold"
                                                        : "text-white/60 hover:bg-white/5"
                                                }`}
                                            >
                                                <span>{cat}</span>
                                                <span className="text-[10px]">{categoryCounts[cat] ?? 0}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-2 block">
                                        Price Bracket
                                    </span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {PRICE_RANGES.map((range, idx) => (
                                            <button
                                                key={range.label}
                                                onClick={() => setSelectedPriceRange(idx)}
                                                className={`p-2 rounded-lg text-xs border text-center ${
                                                    selectedPriceRange === idx
                                                        ? "border-gold bg-gold/10 text-gold font-medium"
                                                        : "border-white/10 text-white/50"
                                                }`}
                                            >
                                                {range.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-2 block">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-sand focus:border-gold focus:outline-none"
                                    >
                                        {SORT_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value} className="bg-[#16161A]">
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-2">
                                <button
                                    onClick={() => setMobileFilterOpen(false)}
                                    className="w-full py-3 bg-gold text-obsidian font-bold text-xs uppercase tracking-wider rounded-xl"
                                >
                                    Show {filteredProducts.length} Results
                                </button>
                                {hasActiveFilters && (
                                    <button
                                        onClick={resetFilters}
                                        className="w-full py-2.5 border border-white/10 text-white/60 hover:text-white text-xs uppercase tracking-wider rounded-xl"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Quick View / Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
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
                                    <span className="text-[10px] uppercase tracking-widest text-gold font-medium">
                                        {selectedProduct.category}
                                    </span>
                                    <h2 className="font-serif text-2xl sm:text-3xl text-sand mt-1">{selectedProduct.name}</h2>
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

                            <div className="aspect-[4/3] sm:aspect-video w-full rounded-xl overflow-hidden bg-[#0c0c0f] border border-white/5 flex items-center justify-center p-3 sm:p-4">
                                {isVideo(selectedProduct.image) ? (
                                    <video
                                        src={selectedProduct.image}
                                        controls
                                        className="max-h-full max-w-full w-auto h-auto object-contain bg-black"
                                    />
                                ) : (
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        className="max-h-full max-w-full w-auto h-auto object-contain"
                                    />
                                )}
                            </div>

                            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                                {selectedProduct.description}
                            </p>

                            {/* Specifications Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs">
                                <div>
                                    <span className="text-white/40 block mb-0.5">Materials:</span>
                                    <span className="text-sand">{selectedProduct.materials || "Natural Mahogany, Brass Accents"}</span>
                                </div>
                                <div>
                                    <span className="text-white/40 block mb-0.5">Lead Time:</span>
                                    <span className="text-sand">{selectedProduct.deliveryInfo?.leadTime || "2-3 business days"}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Link
                                    href={`/shop/${selectedProduct.slug || selectedProduct.id}`}
                                    onClick={() => setSelectedProduct(null)}
                                    className="py-3 px-5 bg-white/5 hover:bg-white/10 text-sand border border-white/10 hover:border-gold rounded-xl uppercase tracking-wider text-xs font-medium flex items-center justify-center gap-2 transition-all order-2 sm:order-1"
                                >
                                    <span>Full Piece Details</span>
                                    <ArrowRight size={14} />
                                </Link>
                                <button
                                    onClick={() => {
                                        handleAddToCart(selectedProduct);
                                        setSelectedProduct(null);
                                    }}
                                    className="flex-1 py-3 bg-gold text-obsidian font-bold tracking-wider uppercase text-xs rounded-xl hover:bg-gold-light transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20 order-1 sm:order-2"
                                >
                                    <ShoppingBag size={15} />
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
