"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Filter, Truck, ShieldCheck, Sparkles, Check, Eye, X, ArrowRight } from "lucide-react";
import { getShopProducts } from "@/app/actions";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";

const CATEGORIES = ["All", "Furniture", "Lighting", "Art & Decor", "Textiles", "Architectural Decor"];

export default function ShopContent() {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    
    // Cart and Checkout state
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    
    // Quick View modal state
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [addedToast, setAddedToast] = useState<string | null>(null);

    // Load cart from localStorage
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem("ogedecor_cart");
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (e) {
            console.warn("Could not load cart from localStorage", e);
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        try {
            localStorage.setItem("ogedecor_cart", JSON.stringify(cartItems));
        } catch (e) {
            console.warn("Could not save cart", e);
        }
    }, [cartItems]);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const data = await getShopProducts();
            
            // Use luxury fallback items if database is freshly initialized
            const initialData = data.length > 0 ? data : [
                {
                    id: "p1",
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
                    image: "https://images.unsplash.com/photo-1584100936555-5c911b6d0590?q=80&w=1200",
                    description: "Ultra-soft velvet with hand-embroidered patterns reflecting the vast savanna horizon at dusk."
                },
                {
                    id: "p4",
                    name: "Onyx Pillar Lamp",
                    subtitle: "Hand-Carved Calcite Onyx with Brushed Brass",
                    price: 320,
                    formattedPrice: "$320.00",
                    currency: "USD",
                    category: "Lighting",
                    sku: "OGE-LITE-004",
                    stockQuantity: 6,
                    inStock: true,
                    materials: "Natural Calcite Onyx, Solid Brushed Brass, Dimmable LED Core",
                    dimensions: { height: "42 cm", width: "16 cm", depth: "16 cm", weight: "8 kg" },
                    deliveryInfo: { leadTime: "Ready to ship in 2-3 business days", isFragile: true, whiteGloveRequired: false },
                    image: "https://images.unsplash.com/photo-1507473885765-e6ed60516b12?q=80&w=1200",
                    description: "Natural onyx stone cylinder providing a warm, diffused crystalline glow for atmospheric spaces."
                },
                {
                    id: "p5",
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
            setFilteredProducts(products.filter((p) => p.category === activeCategory));
        }
    }, [activeCategory, products]);

    // Cart actions
    const handleAddToCart = (product: any) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    formattedPrice: product.formattedPrice || `$${product.price}`,
                    currency: product.currency || "USD",
                    image: product.image,
                    quantity: 1,
                    category: product.category,
                    leadTime: product.deliveryInfo?.leadTime,
                },
            ];
        });

        // Trigger toast
        setAddedToast(product.name);
        setTimeout(() => setAddedToast(null), 3000);
    };

    const handleUpdateQuantity = (id: string, delta: number) => {
        setCartItems((prev) =>
            prev
                .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
                .filter((item) => item.quantity > 0)
        );
    };

    const handleRemoveItem = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
                            onClick={() => setIsCartOpen(true)}
                            className="ml-2 text-xs uppercase tracking-wider text-gold hover:underline font-medium"
                        >
                            View Bag
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-6">
                {/* Header Content */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
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
                            className="text-5xl md:text-7xl font-serif text-white tracking-tight"
                        >
                            Bespoke Decor
                        </motion.h1>
                        <p className="text-white/60 text-sm max-w-lg mt-3">
                            Limited edition furniture, sculptural lighting, and African architectural accents designed for luxury living.
                        </p>
                    </div>

                    {/* Cart Trigger Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setIsCartOpen(true)}
                        className="relative group cursor-pointer"
                    >
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-xl hover:border-gold transition-all duration-300 shadow-xl group-hover:bg-white/[0.08]">
                            <ShoppingBag className="text-gold" size={24} />
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest text-white/40">Your Bag</p>
                                <p className="text-sand font-bold text-sm">
                                    {totalCartCount} {totalCartCount === 1 ? "Piece" : "Pieces"}
                                </p>
                            </div>
                        </div>
                        {totalCartCount > 0 && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold text-obsidian rounded-full flex items-center justify-center text-[11px] font-bold shadow-lg shadow-gold/30 animate-pulse">
                                {totalCartCount}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-y border-white/10 py-6">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 text-xs uppercase tracking-widest rounded-full transition-all duration-300 ${
                                    activeCategory === cat
                                        ? "bg-gold text-obsidian font-bold shadow-md shadow-gold/20"
                                        : "text-white/50 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-white/50">
                        <span className="flex items-center gap-1.5">
                            <Truck size={14} className="text-gold" /> White-Glove Logistics
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-gold" /> Insured Transit
                        </span>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product, idx) => (
                        <motion.div
                            key={product.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group bg-[#121215] border border-white/5 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500 flex flex-col"
                        >
                            {/* Product Image */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                {/* Category & Stock Badges */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] tracking-widest uppercase font-medium rounded-full text-gold">
                                        {product.category}
                                    </span>
                                </div>

                                {/* Quick View Button Overlay */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProduct(product);
                                    }}
                                    className="absolute bottom-4 right-4 p-2.5 bg-black/70 backdrop-blur-md rounded-full text-white/70 hover:text-gold hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                                    title="Quick Specifications"
                                >
                                    <Eye size={16} />
                                </button>
                            </div>

                            {/* Product Details */}
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="flex justify-between items-baseline gap-2 mb-1">
                                        <h3 className="font-serif text-xl text-sand group-hover:text-gold transition-colors">
                                            {product.name}
                                        </h3>
                                        <span className="font-serif text-lg text-gold font-medium flex-shrink-0">
                                            {product.formattedPrice || `$${product.price}`}
                                        </span>
                                    </div>
                                    {product.subtitle && (
                                        <p className="text-xs text-white/50 line-clamp-1 mb-2">
                                            {product.subtitle}
                                        </p>
                                    )}
                                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Delivery & Add to Cart */}
                                <div className="pt-4 border-t border-white/5 space-y-3">
                                    <div className="flex items-center justify-between text-[11px] text-white/40">
                                        <span className="flex items-center gap-1.5 truncate">
                                            <Truck size={12} className="text-gold flex-shrink-0" />
                                            {product.deliveryInfo?.leadTime || "Dispatches in 2-3 days"}
                                        </span>
                                        {product.deliveryInfo?.whiteGloveRequired && (
                                            <span className="text-[10px] text-gold/80 bg-gold/10 px-2 py-0.5 rounded">
                                                White Glove
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="flex-1 py-3 bg-white/5 hover:bg-gold hover:text-obsidian text-sand border border-white/10 hover:border-gold rounded-xl text-xs uppercase tracking-widest font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                        >
                                            <ShoppingBag size={14} className="group-hover/btn:scale-110 transition-transform" />
                                            Add to Bag
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleAddToCart(product);
                                                setIsCartOpen(true);
                                            }}
                                            className="px-4 py-3 bg-gold text-obsidian rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-gold-light transition-all"
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
                            onClick={() => setSelectedProduct(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 md:p-8 space-y-6"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] tracking-widest uppercase font-medium text-gold">
                                        {selectedProduct.category} • SKU: {selectedProduct.sku}
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
                            <div className="grid grid-cols-2 gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-xs">
                                <div>
                                    <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px]">Materials & Finish</span>
                                    <span className="text-sand">{selectedProduct.materials || "Natural Treated Mahogany & Brass"}</span>
                                </div>
                                <div>
                                    <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px]">Delivery Lead Time</span>
                                    <span className="text-gold">{selectedProduct.deliveryInfo?.leadTime || "2 - 3 business days"}</span>
                                </div>
                                {selectedProduct.dimensions && (
                                    <div className="col-span-2 pt-2 border-t border-white/5">
                                        <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px]">Dimensions</span>
                                        <span className="text-sand">
                                            {selectedProduct.dimensions.height && `H: ${selectedProduct.dimensions.height} `}
                                            {selectedProduct.dimensions.width && `• W: ${selectedProduct.dimensions.width} `}
                                            {selectedProduct.dimensions.depth && `• D: ${selectedProduct.dimensions.depth} `}
                                            {selectedProduct.dimensions.weight && `• Weight: ${selectedProduct.dimensions.weight}`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={() => {
                                        handleAddToCart(selectedProduct);
                                        setSelectedProduct(null);
                                    }}
                                    className="flex-1 py-4 bg-gold text-obsidian font-bold tracking-wider uppercase text-xs rounded-xl hover:bg-gold-light transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
                                >
                                    <ShoppingBag size={16} />
                                    Add Piece to Bag
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                items={cartItems}
                onOrderSuccess={() => {
                    setCartItems([]);
                }}
            />
        </main>
    );
}
