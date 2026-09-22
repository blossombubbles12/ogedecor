"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";

interface CartContextType {
    items: CartItem[];
    totalCount: number;
    subtotal: number;
    isCartOpen: boolean;
    isCheckoutOpen: boolean;
    addToCart: (product: any, quantity?: number) => void;
    updateQuantity: (id: string, delta: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    openCheckout: () => void;
    closeCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "ogedecor_cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (saved) {
                setItems(JSON.parse(saved));
            }
        } catch (e) {
            console.warn("Could not load cart from localStorage", e);
        }

        // Listen for storage events (e.g. across tabs)
        const handleStorage = (event: StorageEvent) => {
            if (event.key === CART_STORAGE_KEY && event.newValue) {
                try {
                    setItems(JSON.parse(event.newValue));
                } catch {}
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    // Save changes to localStorage
    useEffect(() => {
        if (!mounted) return;
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.warn("Could not save cart to localStorage", e);
        }
    }, [items, mounted]);

    const addToCart = (product: any, quantity: number = 1) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === product.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity,
                };
                return updated;
            }

            const rawPrice = typeof product.price === "number" 
                ? product.price 
                : parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0;
            
            const currencySymbol = product.currency === "NGN" ? "₦" : "$";
            const formattedPrice = product.formattedPrice || `${currencySymbol}${rawPrice.toLocaleString()}`;

            const newItem: CartItem = {
                id: String(product.id),
                name: product.name,
                price: rawPrice,
                formattedPrice,
                currency: product.currency || "USD",
                image: product.image || "/ogedecor.png",
                quantity,
                category: product.category,
                leadTime: product.deliveryInfo?.leadTime,
            };

            return [...prev, newItem];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems((prev) =>
            prev
                .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
                .filter((item) => item.quantity > 0)
        );
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
        try {
            localStorage.removeItem(CART_STORAGE_KEY);
        } catch {}
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const openCheckout = () => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };
    const closeCheckout = () => setIsCheckoutOpen(false);

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                totalCount,
                subtotal,
                isCartOpen,
                isCheckoutOpen,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart,
                openCart,
                closeCart,
                openCheckout,
                closeCheckout,
            }}
        >
            {children}

            {/* Global Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={closeCart}
                items={items}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={openCheckout}
            />

            {/* Global Checkout Modal */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={closeCheckout}
                items={items}
                onOrderSuccess={clearCart}
            />
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
