"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Mock Product Type
type Product = {
    id: number;
    name: string;
    price: string;
    image: string;
};

// Mock Data mimicking WordPress REST API response
const MOCK_PRODUCTS: Product[] = [
    {
        id: 101,
        name: "Ashanti Stool - Gold Edition",
        price: "$450.00",
        image: "https://images.unsplash.com/photo-1594056152367-285625fb4902?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 102,
        name: "Wakandan Geometry Vase",
        price: "$120.00",
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 103,
        name: "Savanna Velvet Cushion",
        price: "$85.00",
        image: "https://images.unsplash.com/photo-1584100936555-5c911b6d0590?q=80&w=800&auto=format&fit=crop"
    }
];

export default function ShopPreview() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API Fetch
        const fetchProducts = async () => {
            setTimeout(() => {
                setProducts(MOCK_PRODUCTS);
                setLoading(false);
            }, 1000);
        };
        fetchProducts();
    }, []);

    return (
        <section id="shop" className="py-24 bg-white/5 relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div>
                        <h3 className="text-gold tracking-[0.2em] text-sm uppercase mb-4">The Collection</h3>
                        <h2 className="text-4xl md:text-5xl font-serif text-sand">Curated Decor</h2>
                    </div>
                    <Link href="/shop" className="group flex items-center gap-2 text-white/60 hover:text-gold transition-colors mt-6 md:mt-0">
                        Visit Store
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                        // Skeletons
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-[400px] bg-white/5 animate-pulse rounded-sm" />
                        ))
                    ) : (
                        products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer"
                            >
                                <div className="relative h-[400px] overflow-hidden bg-neutral-900 mb-6">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${product.image})` }}
                                    />
                                    {/* Quick Add Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button className="bg-gold text-obsidian px-6 py-3 font-medium uppercase tracking-widest text-sm hover:bg-white transition-colors flex items-center gap-2">
                                            <ShoppingBag size={16} /> Add to Cart
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-serif text-sand group-hover:text-gold transition-colors">{product.name}</h3>
                                    <span className="text-gold font-medium">{product.price}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
