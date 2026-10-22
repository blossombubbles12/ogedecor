"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Truck, ShieldCheck, CreditCard, Building2, MapPin, Loader2, ArrowLeft, MessageCircle, Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import { createOrder, getDeliveryMethods } from "@/app/actions";
import { CartItem } from "./CartDrawer";

const DEFAULT_WHATSAPP_NUMBER = "2349068389852";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onOrderSuccess: () => void;
}

// Generate structured luxury WhatsApp message with all order details
function formatWhatsAppOrderMessage({
    orderNumber,
    formData,
    items,
    selectedMethod,
    deliveryFee,
    grandTotal,
    subtotal,
    currencySymbol,
}: {
    orderNumber: string;
    formData: {
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        street: string;
        city: string;
        state: string;
        country: string;
        specialInstructions: string;
        paymentMethod: string;
    };
    items: CartItem[];
    selectedMethod: any;
    deliveryFee: number;
    grandTotal: number;
    subtotal: number;
    currencySymbol: string;
}) {
    const paymentLabels: Record<string, string> = {
        bank_transfer: "Direct Bank Transfer / Wire Invoice",
        card: "Online Card / Paystack",
        pos_showroom: "Showroom / COD on Inspection",
    };

    const itemsList = items
        .map(
            (item, index) =>
                `${index + 1}. *${item.name}*\n   • Qty: ${item.quantity} × ${currencySymbol}${item.price.toLocaleString()} = ${currencySymbol}${(item.price * item.quantity).toLocaleString()}`
        )
        .join("\n\n");

    const dateFormatted = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return `👑 *NEW CLIENT ORDER — OGEDECOR* 👑

*Order Reference:* ${orderNumber}
*Date:* ${dateFormatted}

━━━━━━━━━━━━━━━━━━━━━
👤 *CLIENT INFORMATION*
• *Name:* ${formData.customerName}
• *Phone / WhatsApp:* ${formData.customerPhone}
• *Email:* ${formData.customerEmail}

━━━━━━━━━━━━━━━━━━━━━
📍 *DELIVERY DESTINATION*
• *Address:* ${formData.street}
• *City / State:* ${formData.city}, ${formData.state}
• *Country:* ${formData.country}

━━━━━━━━━━━━━━━━━━━━━
🚚 *LOGISTICS & HANDLING*
• *Tier:* ${selectedMethod?.title || "Standard Delivery"}
• *Estimated Transit:* ${selectedMethod?.estimatedDays || "1 - 3 business days"}
• *Shipping Fee:* ${deliveryFee === 0 ? "Complimentary (Free)" : `${currencySymbol}${deliveryFee.toLocaleString()}`}

━━━━━━━━━━━━━━━━━━━━━
🛍️ *ORDERED PIECES (${items.reduce((s, i) => s + i.quantity, 0)} items)*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━
💰 *PAYMENT & TOTALS*
• *Items Subtotal:* ${currencySymbol}${subtotal.toLocaleString()}
• *Logistics Fee:* ${deliveryFee === 0 ? "Complimentary" : `${currencySymbol}${deliveryFee.toLocaleString()}`}
• *TOTAL AMOUNT:* ${currencySymbol}${grandTotal.toLocaleString()}
• *Payment Method:* ${paymentLabels[formData.paymentMethod] || formData.paymentMethod}
${formData.specialInstructions?.trim() ? `\n━━━━━━━━━━━━━━━━━━━━━\n📝 *SPECIAL INSTRUCTIONS / GATE ACCESS*\n${formData.specialInstructions.trim()}\n` : ""}
━━━━━━━━━━━━━━━━━━━━━
_Hello OgeDecor Concierge! I have placed this order on the website. Please confirm availability and send payment / dispatch instructions._`;
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
    const [copied, setCopied] = useState(false);

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
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const tempOrderNumber = `OGE-${Date.now().toString().slice(-6)}`;
        let finalOrderNumber = tempOrderNumber;

        try {
            // Attempt server creation & email dispatch (handled gracefully)
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
                currency: items[0]?.currency || "NGN",
                paymentMethod: formData.paymentMethod,
            });

            if (result && result.orderNumber) {
                finalOrderNumber = result.orderNumber;
            }
        } catch (error) {
            console.warn("createOrder error caught, proceeding with WhatsApp submission:", error);
        }

        // Format the complete WhatsApp order message
        const whatsappMessage = formatWhatsAppOrderMessage({
            orderNumber: finalOrderNumber,
            formData,
            items,
            selectedMethod,
            deliveryFee,
            grandTotal,
            subtotal,
            currencySymbol,
        });

        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Direct submission to WhatsApp
        try {
            window.open(whatsappUrl, "_blank");
        } catch (popupErr) {
            console.warn("Direct window.open blocked by browser:", popupErr);
        }

        setConfirmedOrder({
            orderNumber: finalOrderNumber,
            ...formData,
            items,
            deliveryFee,
            grandTotal,
            selectedMethodTitle: selectedMethod?.title,
            estimatedDays: selectedMethod?.estimatedDays,
            whatsappUrl,
            whatsappMessage,
        });

        setSubmitting(false);
        setStep("confirmation");
        onOrderSuccess();
    };

    const handleCopyDetails = () => {
        if (!confirmedOrder?.whatsappMessage) return;
        navigator.clipboard.writeText(confirmedOrder.whatsappMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
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
                                Ogedecor
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
                                        { id: "bank_transfer", label: "Bank Transfer / Wire", desc: "Direct bank wire invoice" },
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
                                    className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-obsidian font-medium tracking-wider uppercase text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin text-obsidian" />
                                            <span>Submitting Order to WhatsApp...</span>
                                        </>
                                    ) : (
                                        <>
                                            <MessageCircle size={18} className="text-obsidian fill-obsidian/20" />
                                            <span className="font-semibold">Submit Order via WhatsApp ({currencySymbol}{grandTotal.toLocaleString()})</span>
                                        </>
                                    )}
                                </button>
                                <p className="text-[11px] text-center text-white/40 flex items-center justify-center gap-1.5">
                                    <ShieldCheck size={13} className="text-gold" />
                                    <span>Directly sends all order details to admin WhatsApp (+234 906 838 9852) for express confirmation</span>
                                </p>
                            </div>
                        </form>
                    ) : (
                        /* Confirmation Screen */
                        <div className="p-6 md:p-10 space-y-6 flex-1 overflow-y-auto">
                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center mx-auto text-[#25D366]">
                                    <CheckCircle2 size={32} />
                                </div>

                                <div>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 text-[10px] tracking-[0.2em] font-medium uppercase text-[#25D366]">
                                        <MessageCircle size={12} />
                                        WhatsApp Order Submitted
                                    </span>
                                    <h3 className="font-serif text-3xl text-sand mt-2">Thank You, {confirmedOrder?.customerName}</h3>
                                    <p className="text-white/60 text-sm max-w-md mx-auto mt-1">
                                        Your order reference <span className="text-gold font-mono font-bold">{confirmedOrder?.orderNumber}</span> has been prepared.
                                    </p>
                                </div>
                            </div>

                            {/* Direct WhatsApp Call to Action Box */}
                            <div className="bg-gradient-to-br from-[#25D366]/15 via-black/40 to-black/60 border border-[#25D366]/30 rounded-2xl p-6 space-y-4 text-center">
                                <div className="flex items-center justify-center gap-2 text-sand font-serif text-lg">
                                    <MessageCircle className="text-[#25D366]" size={22} />
                                    <span>Admin WhatsApp Follow-Up</span>
                                </div>
                                <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
                                    If your WhatsApp did not open automatically, tap below to chat directly with the OgeDecor admin concierge on <strong className="text-white">+234 906 838 9852</strong> with all your order details:
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                                    {confirmedOrder?.whatsappUrl && (
                                        <a
                                            href={confirmedOrder.whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-obsidian font-semibold tracking-wider uppercase text-xs rounded-xl transition-all shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle size={16} />
                                            <span>Open in WhatsApp Now</span>
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleCopyDetails}
                                        className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/15 text-sand font-medium tracking-wider uppercase text-xs rounded-xl border border-white/15 transition-all flex items-center justify-center gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={14} className="text-[#25D366]" />
                                                <span className="text-[#25D366]">Copied to Clipboard!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} />
                                                <span>Copy Order Message</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Order Summary Receipt Box */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 max-w-xl mx-auto space-y-4">
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <span className="text-xs uppercase tracking-wider text-white/50">Order Reference</span>
                                    <span className="font-mono text-gold font-bold">{confirmedOrder?.orderNumber}</span>
                                </div>

                                {/* Items list preview */}
                                <div className="space-y-3 py-1 border-b border-white/10">
                                    <span className="text-xs uppercase tracking-wider text-white/50 block">Pieces Reserved</span>
                                    {confirmedOrder?.items?.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-10 h-10 object-cover rounded-lg border border-white/10 flex-shrink-0"
                                                    />
                                                )}
                                                <div className="truncate">
                                                    <p className="text-sand truncate text-xs font-medium">{item.name}</p>
                                                    <p className="text-[11px] text-white/40">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-mono text-xs text-gold flex-shrink-0">
                                                {currencySymbol}{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between items-center text-white/60">
                                        <span>Delivery Method</span>
                                        <span className="text-sand">{confirmedOrder?.selectedMethodTitle}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white/60">
                                        <span>Estimated Transit</span>
                                        <span className="text-sand">{confirmedOrder?.estimatedDays}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white/60">
                                        <span>Destination</span>
                                        <span className="text-sand text-right truncate max-w-[240px]">
                                            {confirmedOrder?.street}, {confirmedOrder?.city}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-white/60">
                                        <span>Logistics Fee</span>
                                        <span className="text-gold">
                                            {confirmedOrder?.deliveryFee === 0 ? "Complimentary" : `${currencySymbol}${confirmedOrder?.deliveryFee.toLocaleString()}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                                    <span className="font-serif text-sand text-sm">Total Payable</span>
                                    <span className="font-serif text-xl text-gold font-bold">
                                        {currencySymbol}{confirmedOrder?.grandTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-center pt-2">
                                <button
                                    onClick={onClose}
                                    className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-medium tracking-wider uppercase text-xs rounded-xl border border-white/10 transition-all"
                                >
                                    Continue Exploring Ogedecor
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
