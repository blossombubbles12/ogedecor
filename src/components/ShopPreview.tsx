"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getShopProducts } from "@/app/actions";
import { useCart } from "@/context/CartContext";

const MOCK_PRODUCTS = [
    {
        id: "p1",
        slug: "ashanti-stool-gold-edition",
        name: "Ashanti Stool - Gold Edition",
        price: 450,
        formattedPrice: "$450.00",
        currency: "USD",
        image: "https://images.unsplash.com/photo-1594056152367-285625fb4902?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "p2",
        slug: "wakandan-geometry-vase",
        name: "Wakandan Geometry Vase",
        price: 180,
        formattedPrice: "$180.00",
        currency: "USD",
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "p3",
        slug: "savanna-velvet-cushion",
        name: "Savanna Velvet Cushion",
        price: 95,
        formattedPrice: "$95.00",
        currency: "USD",
        image: "https://images.unsplash.com/photo-1584100936555-5c911b6d0590?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "p4",
        slug: "kalahari-onyx-sconce",
        name: "Kalahari Onyx Sconce",
        price: 340,
        formattedPrice: "$340.00",
        currency: "USD",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed60516b12?q=80&w=800&auto=format&fit=crop"
    }
];

export default function ShopPreview() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, openCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getShopProducts();
                if (data && data.length > 0) {
                    setProducts(data.slice(0, 4));
                } else {
                    setProducts(MOCK_PRODUCTS);
                }
            } catch {
                setProducts(MOCK_PRODUCTS);
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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
                    {loading ? (
                        [1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square sm:aspect-[4/5] bg-white/5 animate-pulse rounded-lg sm:rounded-xl" />
                        ))
                    ) : (
                        products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="group flex flex-col"
                            >
                                <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-neutral-900 rounded-lg sm:rounded-xl mb-3 sm:mb-4 group/img">
                                    <Link href={`/shop/${product.slug || product.id}`} className="block w-full h-full">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/img:scale-105"
                                            style={{ backgroundImage: `url(${product.image})` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50 group-hover/img:opacity-30 transition-opacity" />
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
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
