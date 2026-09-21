"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Truck, ShieldCheck, CreditCard, Building2, MapPin, Loader2, ArrowLeft } from "lucide-react";
import { createOrder, getDeliveryMethods } from "@/app/actions";
import { CartItem } from "./CartDrawer";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onOrderSuccess: () => void;
}

export default function CheckoutModal({
    isOpen,
    onClose,
    items,
    onOrderSuccess,
}: CheckoutModalProps) {
    const [step, setStep] = useState<"details" | "confirmation">("details");
    const [submitting, setSubmitting] = useState(false);
    const [deliveryMethods, setDeliveryMethods] = useState<any[]>([]);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>("");
    const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

    // Form inputs
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        street: "",
        city: "Lagos",
        state: "Lagos State",
        country: "Nigeria",
        specialInstructions: "",
        paymentMethod: "bank_transfer" as "bank_transfer" | "card" | "pos_showroom",
    });

    useEffect(() => {
        async function fetchDelivery() {
            const methods = await getDeliveryMethods();
            setDeliveryMethods(methods);
            if (methods.length > 0) {
                setSelectedDeliveryId(methods[0].id);
            }
        }
        if (isOpen) {
            fetchDelivery();
        }
    }, [isOpen]);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const selectedMethod = deliveryMethods.find((m) => m.id === selectedDeliveryId) || deliveryMethods[0];
    
    // Check for free shipping threshold
    const deliveryFee = selectedMethod
        ? (selectedMethod.freeShippingThreshold && subtotal >= selectedMethod.freeShippingThreshold ? 0 : selectedMethod.price)
        : 0;

    const grandTotal = subtotal + deliveryFee;
    const currencySymbol = items[0]?.currency === "NGN" ? "₦" : "$";

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const result = await createOrder({
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            shippingAddress: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                country: formData.country,
            },
            items: items.map((i) => ({
                productId: i.id,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                imageUrl: i.image,
            })),
            deliveryMethodId: selectedMethod?.id,
            deliveryMethodTitle: selectedMethod?.title || "Standard Delivery",
            deliveryFee,
            specialInstructions: formData.specialInstructions,
            currency: items[0]?.currency || "USD",
            paymentMethod: formData.paymentMethod,
        });

        setSubmitting(false);

        if (result.success) {
            setConfirmedOrder({
                orderNumber: result.orderNumber,
                ...formData,
                items,
                deliveryFee,
                grandTotal,
                selectedMethodTitle: selectedMethod?.title,
                estimatedDays: selectedMethod?.estimatedDays,
            });
            setStep("confirmation");
            onOrderSuccess();
        } else {
            alert(result.error || "Failed to place order. Please check your connection.");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-3xl bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
                        <div>
                            <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-gold">
                                OgeDecor Atelier
                            </span>
                            <h2 className="font-serif text-2xl text-sand mt-0.5">
                                {step === "details" ? "Secure Checkout & White-Glove Logistics" : "Order Confirmed"}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {step === "details" ? (
                        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                            {/* Section 1: Customer Contact */}
                            <div className="space-y-4">
                                <h3 className="font-serif text-base text-gold flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center font-mono">1</span>
                                    Client & Contact Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">
                                            Full Name *
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                            placeholder="e.g. Adebayo Adeleke"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sand placeholder:text-white/20 text-sm focus:border-gold outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">
                                            Email Address *
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.customerEmail}
                                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                            placeholder="adebayo@example.com"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sand placeholder:text-white/20 text-sm focus:border-gold outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">
                                            Phone / WhatsApp Number *
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.customerPhone}
                                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                            placeholder="+234 803 123 4567"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sand placeholder:text-white/20 text-sm focus:border-gold outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Delivery Destination */}
                            <div className="space-y-4">
                                <h3 className="font-serif text-base text-gold flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center font-mono">2</span>
                                    Delivery Address
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">
                                            Street Address (Residence / Commercial Property) *
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.street}
                                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                            placeholder="e.g. 15 Queen's Drive, Ikoyi, Penthouse Suite"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sand placeholder:text-white/20 text-sm focus:border-gold outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">City *</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sand text-sm focus:border-gold outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">State *</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sand text-sm focus:border-gold outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">Country</label>
                                            <input
                                                readOnly
                                                type="text"
                                                value={formData.country}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sand/60 text-sm cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Select Delivery Tier */}
                            <div className="space-y-4">
                                <h3 className="font-serif text-base text-gold flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center font-mono">3</span>
                                    Logistics & Handling Option
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {deliveryMethods.map((method) => {
                                        const isFree = method.freeShippingThreshold && subtotal >= method.freeShippingThreshold;
                                        const isSelected = selectedDeliveryId === method.id;

                                        return (
                                            <div
                                                key={method.id}
                                                onClick={() => setSelectedDeliveryId(method.id)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                                    isSelected
                                                        ? "border-gold bg-gold/5 shadow-md shadow-gold/10"
                                                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                                isSelected ? "border-gold bg-gold" : "border-white/30"
                                                            }`}
                                                        >
                                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-obsidian" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-serif text-sand text-sm font-medium">
                                                                {method.title}
                                                            </h4>
                                                            <p className="text-xs text-white/50 mt-0.5">{method.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0 ml-4">
                                                        <span className="font-medium text-sm text-gold">
                                                            {isFree ? "Free" : `${currencySymbol}${method.price.toLocaleString()}`}
                                                        </span>
                                                        <span className="block text-[10px] text-white/40">
                                                            {method.estimatedDays}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Section 4: Payment Preference */}
                            <div className="space-y-4">
                                <h3 className="font-serif text-base text-gold flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center font-mono">4</span>
                                    Settlement Preference
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[
                                        { id: "bank_transfer", label: "Bank Transfer / Wire", desc: "Direct atelier wire invoice" },
                                        { id: "card", label: "Online Card / Paystack", desc: "Instant debit/credit authorization" },
                                        { id: "pos_showroom", label: "Showroom / COD", desc: "Pay upon white-glove inspection" },
                                    ].map((opt) => (
                                        <div
                                            key={opt.id}
                                            onClick={() => setFormData({ ...formData, paymentMethod: opt.id as any })}
                                            className={`p-3.5 rounded-xl border cursor-pointer text-xs transition-all ${
                                                formData.paymentMethod === opt.id
                                                    ? "border-gold bg-gold/10 text-sand"
                                                    : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20"
                                            }`}
                                        >
                                            <p className="font-medium text-sand">{opt.label}</p>
                                            <p className="text-[10px] text-white/40 mt-1">{opt.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 5: Special Delivery Instructions */}
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">
                                    Access & Fragile Handling Notes (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.specialInstructions}
                                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                                    placeholder="e.g. Please coordinate with security gate. Service elevator available on 3rd floor."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sand placeholder:text-white/20 text-sm focus:border-gold outline-none"
                                />
                            </div>

                            {/* Order Total & Submit */}
                            <div className="p-6 bg-black/60 border border-white/10 rounded-2xl space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-white/60">
                                        <span>Items Subtotal ({items.length} pieces)</span>
                                        <span className="text-sand">{currencySymbol}{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-white/60">
                                        <span>Logistics & Handling</span>
                                        <span className="text-gold">
                                            {deliveryFee === 0 ? "Complimentary" : `${currencySymbol}${deliveryFee.toLocaleString()}`}
                                        </span>
                                    </div>
                                    <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                                        <span className="font-serif text-sand text-base">Grand Total</span>
                                        <span className="font-serif text-2xl text-gold">
                                            {currencySymbol}{grandTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-gold text-obsidian font-medium tracking-wider uppercase text-xs rounded-xl hover:bg-gold-light transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Processing Order & Reserving Inventory...
                                        </>
                                    ) : (
                                        `Confirm & Place Order (${currencySymbol}${grandTotal.toLocaleString()})`
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Confirmation Screen */
                        <div className="p-8 md:p-12 text-center space-y-6 flex-1 overflow-y-auto">
                            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
                                <CheckCircle2 size={32} />
                            </div>

                            <div>
                                <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-gold">
                                    Order Reserved Successfully
                                </span>
                                <h3 className="font-serif text-3xl text-sand mt-1">Thank You, {confirmedOrder?.customerName}</h3>
                                <p className="text-white/60 text-sm max-w-md mx-auto mt-2">
                                    Your interior design pieces are now reserved in our atelier queue. A confirmation email has been dispatched to <span className="text-sand font-medium">{confirmedOrder?.customerEmail}</span>.
                                </p>
                            </div>

                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-3">
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <span className="text-xs uppercase tracking-wider text-white/50">Order Reference</span>
                                    <span className="font-mono text-gold font-bold">{confirmedOrder?.orderNumber}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/60">Delivery Method</span>
                                    <span className="text-sand">{confirmedOrder?.selectedMethodTitle}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/60">Estimated Transit</span>
                                    <span className="text-sand">{confirmedOrder?.estimatedDays}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/60">Delivery Destination</span>
                                    <span className="text-sand text-right truncate max-w-[220px]">
                                        {confirmedOrder?.street}, {confirmedOrder?.city}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                                    <span className="font-serif text-sand">Total Amount</span>
                                    <span className="font-serif text-xl text-gold font-bold">
                                        {currencySymbol}{confirmedOrder?.grandTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4 pt-4">
                                <button
                                    onClick={onClose}
                                    className="px-8 py-3.5 bg-gold text-obsidian font-medium tracking-wider uppercase text-xs rounded-xl hover:bg-gold-light transition-all"
                                >
                                    Continue Exploring Atelier
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
