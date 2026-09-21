"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    formattedPrice: string;
    currency: string;
    image: string;
    quantity: number;
    category?: string;
    leadTime?: string;
}

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemoveItem: (id: string) => void;
    onCheckout: () => void;
}

export default function CartDrawer({
    isOpen,
    onClose,
    items,
    onUpdateQuantity,
    onRemoveItem,
    onCheckout,
}: CartDrawerProps) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const currencySymbol = items[0]?.currency === "NGN" ? "₦" : "$";
    const freeDeliveryThreshold = 2000;
    const progressToFreeDelivery = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0F0F11] border-l border-white/10 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-gold" size={20} />
                                <h3 className="font-serif text-xl text-sand tracking-wide">
                                    Your Atelier Bag ({items.reduce((s, i) => s + i.quantity, 0)})
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Free Delivery Banner */}
                        <div className="bg-gold/10 border-b border-gold/20 px-6 py-3">
                            <div className="flex items-center justify-between text-xs text-sand/80 mb-1.5">
                                <span className="flex items-center gap-1.5 text-gold font-medium">
                                    <Truck size={14} /> White-Glove Delivery
                                </span>
                                <span>
                                    {subtotal >= freeDeliveryThreshold
                                        ? "Complimentary delivery unlocked!"
                                        : `${currencySymbol}${(freeDeliveryThreshold - subtotal).toLocaleString()} away from free delivery`}
                                </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-gold h-full transition-all duration-500 rounded-full"
                                    style={{ width: `${progressToFreeDelivery}%` }}
                                />
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-white/40">
                                    <ShoppingBag size={48} className="mb-4 text-white/20 stroke-1" />
                                    <p className="font-serif text-lg text-sand/60 mb-2">Your collection is empty</p>
                                    <p className="text-xs max-w-xs text-white/40">
                                        Explore our handcrafted furniture, sculptural lighting, and curated decor.
                                    </p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-gold/30 transition-colors"
                                    >
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-900 border border-white/5">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-serif text-sm text-sand truncate">
                                                    {item.name}
                                                </h4>
                                                <button
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="text-white/30 hover:text-red-400 p-1 transition-colors"
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-white/40 mt-0.5">{item.category || "Decor"}</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <span className="text-gold font-medium text-sm">
                                                    {currencySymbol}{(item.price * item.quantity).toLocaleString()}
                                                </span>
                                                <div className="flex items-center border border-white/10 rounded-lg bg-black/40">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                                        className="p-1 hover:text-gold text-white/60 transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="px-2 text-xs text-sand font-mono">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                                        className="p-1 hover:text-gold text-white/60 transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer / Summary */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-[#09090A] space-y-4">
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between text-white/60">
                                        <span>Subtotal</span>
                                        <span className="text-sand font-medium">
                                            {currencySymbol}{subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-white/60 text-xs">
                                        <span>Estimated Delivery</span>
                                        <span className="text-gold">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                                    <span className="font-serif text-sand">Estimated Total</span>
                                    <span className="text-2xl font-serif text-gold">
                                        {currencySymbol}{subtotal.toLocaleString()}
                                    </span>
                                </div>

                                <button
                                    onClick={onCheckout}
                                    className="w-full py-4 bg-gold text-obsidian font-medium tracking-wider uppercase text-xs rounded-xl hover:bg-gold-light transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-gold/20"
                                >
                                    Proceed to Delivery & Checkout
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="flex items-center justify-center gap-4 text-[10px] text-white/40 pt-1">
                                    <span className="flex items-center gap-1">
                                        <ShieldCheck size={12} className="text-gold" /> Authenticity Guaranteed
                                    </span>
                                    <span>•</span>
                                    <span>Insured Transit</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
