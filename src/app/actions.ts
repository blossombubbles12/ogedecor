"use server";

import { getPayloadClient } from "@/lib/payload";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import {
    sendOrderConfirmationEmail,
    sendAdminNewOrderAlert,
    sendInquiryNotificationEmail,
    type OrderEmailData,
} from "@/lib/email";

if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

// Generate Cloudinary signature for legacy direct uploads
export async function getCloudinarySignature() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "ogedecor";

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            folder,
        },
        process.env.CLOUDINARY_API_SECRET || ""
    );

    return { signature, timestamp, folder };
}


// Project creation via Payload Local API
export async function createProject(data: {
    title: string;
    description: string;
    category: string;
    completionDate?: string;
    media?: Array<{ url: string; type?: "image" | "video"; publicId?: string }>;
}) {
    try {
        const payload = await getPayloadClient();
        const project = await payload.create({
            collection: "projects",
            data: {
                title: data.title,
                description: data.description,
                category: (data.category as any) || "Residential",
                completionDate: data.completionDate,
                media: (data.media || []).map((m) => ({
                    url: m.url,
                    type: (m.type as any) || "image",
                })),
            },
        });

        revalidatePath("/");
        revalidatePath("/projects");
        return { success: true, project };
    } catch (error) {
        console.error("Error creating project with Payload CMS:", error);
        return { success: false, error: "Failed to create project" };
    }
}

// Get all projects with fallback for pending DB credentials
export async function getProjects() {
    try {
        const payload = await getPayloadClient();
        const result = await payload.find({
            collection: "projects",
            sort: "-createdAt",
            limit: 100,
        });

        if (!result.docs || result.docs.length === 0) {
            return [];
        }

        return result.docs.map((doc: any) => ({
            id: String(doc.id),
            title: doc.title,
            description: doc.description,
            category: doc.category,
            completionDate: doc.completionDate,
            media: (doc.media || []).map((m: any) => ({
                url: typeof m.image === "object" && m.image?.url ? m.image.url : m.url || "",
                type: m.type || "image",
            })),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        }));
    } catch (error) {
        console.warn("Could not fetch projects via Payload CMS (DB credentials pending or connecting):", error);
        return [];
    }
}

// Get project by ID
export async function getProjectById(id: string) {
    try {
        const payload = await getPayloadClient();
        const doc: any = await payload.findByID({
            collection: "projects",
            id,
        });

        if (!doc) return null;

        return {
            id: String(doc.id),
            title: doc.title,
            description: doc.description,
            category: doc.category,
            completionDate: doc.completionDate,
            media: (doc.media || []).map((m: any) => ({
                url: typeof m.image === "object" && m.image?.url ? m.image.url : m.url || "",
                type: m.type || "image",
            })),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    } catch (error) {
        console.warn(`Could not fetch project [${id}] via Payload CMS:`, error);
        return null;
    }
}

// Delete a project
export async function deleteProject(id: string) {
    try {
        const payload = await getPayloadClient();
        await payload.delete({
            collection: "projects",
            id,
        });

        revalidatePath("/");
        revalidatePath("/projects");
        return { success: true };
    } catch (error) {
        console.error("Error deleting project via Payload CMS:", error);
        return { success: false, error: "Failed to delete project" };
    }
}

// Create inquiry / design consultation request
export async function createInquiry(data: {
    projectType: string;
    mood: string;
    timeline: string;
    budget: string;
    inspiration: any;
    name: string;
    email: string;
}) {
    try {
        const payload = await getPayloadClient();
        const inquiry = await payload.create({
            collection: "inquiries",
            data: {
                contactName: data.name,
                contactInfo: data.email,
                projectType: data.projectType,
                mood: data.mood,
                timeline: data.timeline,
                budget: data.budget,
                inspiration: data.inspiration,
                status: "new",
            },
        });

        // Trigger Resend notification (non-blocking)
        sendInquiryNotificationEmail({
            contactName: data.name,
            contactInfo: data.email,
            projectType: data.projectType,
            budget: data.budget,
            timeline: data.timeline,
            mood: data.mood,
        }).catch((err) => console.error("Resend inquiry notification error:", err));

        return { success: true, inquiry };
    } catch (error) {
        console.error("Error creating inquiry via Payload CMS:", error);
        return { success: false, error: "Failed to submit inquiry" };
    }
}

// Get all shop products with enhanced e-commerce fields
export async function getShopProducts() {
    try {
        const payload = await getPayloadClient();
        const result = await payload.find({
            collection: "products",
            sort: "-createdAt",
            limit: 100,
        });

        if (!result.docs || result.docs.length === 0) {
            return [];
        }

        return result.docs.map((doc: any) => {
            const rawPrice = typeof doc.price === "number" ? doc.price : parseFloat(String(doc.price).replace(/[^0-9.]/g, "")) || 0;
            const currencySymbol = doc.currency === "NGN" ? "₦" : doc.currency === "EUR" ? "€" : doc.currency === "GBP" ? "£" : "$";
            const formattedPrice = `${currencySymbol}${rawPrice.toLocaleString()}`;

            return {
                id: String(doc.id),
                name: doc.name,
                slug: doc.slug || doc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                subtitle: doc.subtitle || "",
                description: doc.description || "",
                category: doc.category || "Furniture",
                price: rawPrice,
                currency: doc.currency || "USD",
                formattedPrice,
                compareAtPrice: doc.compareAtPrice || null,
                sku: doc.sku || `OGE-${String(doc.id).slice(-4).toUpperCase()}`,
                stockQuantity: doc.stockQuantity ?? 10,
                inStock: doc.inStock ?? true,
                materials: doc.materials || "African Mahogany & Brass",
                dimensions: doc.dimensions || { height: "75cm", width: "60cm", depth: "50cm", weight: "12kg" },
                deliveryInfo: {
                    leadTime: doc.deliveryInfo?.leadTime || "Ready to ship in 2-3 business days",
                    isFragile: Boolean(doc.deliveryInfo?.isFragile),
                    whiteGloveRequired: Boolean(doc.deliveryInfo?.whiteGloveRequired),
                },
                image: typeof doc.imageMedia === "object" && doc.imageMedia?.url 
                    ? doc.imageMedia.url 
                    : doc.image || "https://images.unsplash.com/photo-1594056152367-285625fb4902?q=80&w=1200",
                gallery: Array.isArray(doc.gallery) ? doc.gallery.map((g: any) => typeof g.image === "object" ? g.image?.url : g.url).filter(Boolean) : [],
                createdAt: doc.createdAt,
            };
        });
    } catch (error) {
        console.warn("Could not fetch shop products via Payload CMS:", error);
        return [];
    }
}

const FALLBACK_CATALOG = [
    {
        id: "p1",
        name: "Ashanti Stool - Gold Edition",
        slug: "ashanti-stool-gold-edition",
        subtitle: "Handcrafted Solid Mahogany with 24k Gold Leaf Trim",
        price: 450,
        formattedPrice: "$450.00",
        currency: "USD",
        compareAtPrice: 550,
        category: "Furniture",
        sku: "OGE-FURN-001",
        stockQuantity: 8,
        inStock: true,
        materials: "Solid African Mahogany, 24k Gold Leaf Gilding, Hand-Rubbed Natural Beeswax",
        dimensions: { height: "45 cm", width: "55 cm", depth: "35 cm", weight: "9 kg" },
        deliveryInfo: { leadTime: "Ready to ship in 2-3 business days", isFragile: false, whiteGloveRequired: true },
        image: "https://images.unsplash.com/photo-1594056152367-285625fb4902?q=80&w=1200",
        gallery: [
            "https://images.unsplash.com/photo-1594056152367-285625fb4902?q=80&w=1200",
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200",
            "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1200",
        ],
        description: "Handcrafted from ethically sourced solid mahogany and embellished with antique 24k gold leaf, the Ashanti Stool is inspired by Ghanaian royal ceremonial thrones. Each stool features fluid organic curves balanced by structural architectural strength, serving as an arresting sculptural statement piece in contemporary interiors."
    },
    {
        id: "p2",
        name: "Wakandan Geometry Vase",
        slug: "wakandan-geometry-vase",
        subtitle: "Hand-Thrown Ceramic with West African Relief",
        price: 180,
        formattedPrice: "$180.00",
        currency: "USD",
        compareAtPrice: 220,
        category: "Art & Decor",
        sku: "OGE-ART-002",
        stockQuantity: 14,
        inStock: true,
        materials: "High-Fire Terracotta Clay, Matte Basalt Mineral Glaze",
        dimensions: { height: "38 cm", width: "22 cm", depth: "22 cm", weight: "4.5 kg" },
        deliveryInfo: { leadTime: "Ready to ship in 24 hours", isFragile: true, whiteGloveRequired: false },
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1200",
        gallery: [
            "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1200",
            "https://images.unsplash.com/photo-1513519245088-0e12902e15ca?q=80&w=1200",
        ],
        description: "Modern ceramic vase featuring intricate relief carvings inspired by West African geometric symbology. Finished in an ultra-matte volcanic basalt glaze that shifts subtly under ambient lighting."
    },
    {
        id: "p3",
        name: "Savanna Velvet Cushion",
        slug: "savanna-velvet-cushion",
        subtitle: "Embroidered Architectural Silk-Velvet",
        price: 95,
        formattedPrice: "$95.00",
        currency: "USD",
        compareAtPrice: 120,
        category: "Textiles",
        sku: "OGE-TEXT-003",
        stockQuantity: 25,
        inStock: true,
        materials: "100% Silk Velvet, Hungarian Goose Down Insert, Metallic Thread Embroidery",
        dimensions: { height: "50 cm", width: "50 cm", depth: "15 cm", weight: "1.2 kg" },
        deliveryInfo: { leadTime: "Ready to ship in 24 hours", isFragile: false, whiteGloveRequired: false },
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1200",
        gallery: [
            "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1200",
            "https://images.unsplash.com/photo-1584100936555-5c911b6d0590?q=80&w=1200",
        ],
        description: "Bespoke decorative cushion crafted from rich architectural silk-velvet with metallic thread accents. The hand-guided embroidery depicts the golden horizons of the African savanna at twilight."
    },
    {
        id: "p4",
        name: "Kalahari Onyx Sconce",
        slug: "kalahari-onyx-sconce",
        subtitle: "Translucent African Onyx with Solid Brass Backplate",
        price: 340,
        formattedPrice: "$340.00",
        currency: "USD",
        compareAtPrice: 400,
        category: "Lighting",
        sku: "OGE-LIGHT-004",
        stockQuantity: 6,
        inStock: true,
        materials: "Honed Kalahari Calcite Onyx, Unlacquered Brushed Brass, Dimmable Warm LED Module",
        dimensions: { height: "35 cm", width: "15 cm", depth: "12 cm", weight: "3.8 kg" },
        deliveryInfo: { leadTime: "Ready to ship in 2-3 business days", isFragile: true, whiteGloveRequired: false },
        image: "https://images.unsplash.com/photo-1507473885765-e6ed60516b12?q=80&w=1200",
        gallery: [
            "https://images.unsplash.com/photo-1507473885765-e6ed60516b12?q=80&w=1200",
        ],
        description: "Carved from solid Kalahari onyx cylinders, this architectural sconce radiates a warm, crystalline diffused light. Paired with hand-brushed unlacquered brass hardware that develops an organic patina over time."
    },
    {
        id: "p5",
        name: "Terracotta Relief Mask",
        slug: "terracotta-relief-mask",
        subtitle: "Sculptural Gallery Wall Accent",
        price: 210,
        formattedPrice: "$210.00",
        currency: "USD",
        compareAtPrice: 260,
        category: "Art & Decor",
        sku: "OGE-ART-005",
        stockQuantity: 10,
        inStock: true,
        materials: "Aged Terracotta, Smoked Charcoal Mineral Pigment, Concealed Brass Mounting",
        dimensions: { height: "60 cm", width: "28 cm", depth: "12 cm", weight: "5 kg" },
        deliveryInfo: { leadTime: "Ready to ship in 24 hours", isFragile: true, whiteGloveRequired: false },
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e15ca?q=80&w=1200",
        gallery: [
            "https://images.unsplash.com/photo-1513519245088-0e12902e15ca?q=80&w=1200",
        ],
        description: "Contemporary interpretation of classical West African ritual masks, sculpted from mineral-rich terracotta with hand-applied smoked charcoal pigment. Engineered with concealed brass suspension."
    },
    {
        id: "p6",
        name: "Baobab Root Sculptural Table",
        slug: "baobab-root-sculptural-table",
        subtitle: "Reclaimed Aged Timber with Volcanic Wax",
        price: 890,
        formattedPrice: "$890.00",
        currency: "USD",
        compareAtPrice: 1100,
        category: "Furniture",
        sku: "OGE-FURN-006",
        stockQuantity: 3,
        inStock: true,
        materials: "Reclaimed Aged Timber, Volcanic Obsidian Wax Treatment, Burnished Brass Feet",
        dimensions: { height: "52 cm", width: "65 cm", depth: "60 cm", weight: "22 kg" },
        deliveryInfo: { leadTime: "White-glove scheduled delivery within 5 days", isFragile: false, whiteGloveRequired: true },
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200",
        gallery: [
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200",
        ],
        description: "One-of-a-kind sculptural accent table carved from preserved aged baobab timber roots, celebrating raw organic silhouettes and natural cracks stabilized with volcanic wax and bronze pins."
    },
];

// Fetch single product by slug or id with rich details
export async function getProductBySlug(slugOrId: string) {
    try {
        const payload = await getPayloadClient();
        const result = await payload.find({
            collection: "products",
            where: {
                or: [
                    { slug: { equals: slugOrId } },
                    { id: { equals: slugOrId } },
                ],
            },
            limit: 1,
        });

        if (result.docs && result.docs.length > 0) {
            const doc: any = result.docs[0];
            const rawPrice = typeof doc.price === "number" ? doc.price : parseFloat(String(doc.price).replace(/[^0-9.]/g, "")) || 0;
            const currencySymbol = doc.currency === "NGN" ? "₦" : doc.currency === "EUR" ? "€" : doc.currency === "GBP" ? "£" : "$";
            const formattedPrice = `${currencySymbol}${rawPrice.toLocaleString()}`;

            const primaryImage = typeof doc.imageMedia === "object" && doc.imageMedia?.url 
                ? doc.imageMedia.url 
                : doc.image || "https://images.unsplash.com/photo-1594056152367-285625fb4902?q=80&w=1200";

            const galleryUrls: string[] = [];
            if (primaryImage) galleryUrls.push(primaryImage);
            if (Array.isArray(doc.gallery)) {
                doc.gallery.forEach((g: any) => {
                    const url = typeof g.image === "object" ? g.image?.url : g.url;
                    if (url && !galleryUrls.includes(url)) galleryUrls.push(url);
                });
            }

            return {
                id: String(doc.id),
                name: doc.name,
                slug: doc.slug || doc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                subtitle: doc.subtitle || "",
                description: doc.description || "",
                category: doc.category || "Furniture",
                price: rawPrice,
                currency: doc.currency || "USD",
                formattedPrice,
                compareAtPrice: doc.compareAtPrice || null,
                sku: doc.sku || `OGE-${String(doc.id).slice(-4).toUpperCase()}`,
                stockQuantity: doc.stockQuantity ?? 10,
                inStock: doc.inStock ?? true,
                materials: doc.materials || "Ethically Sourced African Mahogany & Solid Brass",
                dimensions: doc.dimensions || { height: "75cm", width: "60cm", depth: "50cm", weight: "12kg" },
                deliveryInfo: {
                    leadTime: doc.deliveryInfo?.leadTime || "Ready to ship in 2-3 business days",
                    isFragile: Boolean(doc.deliveryInfo?.isFragile),
                    whiteGloveRequired: Boolean(doc.deliveryInfo?.whiteGloveRequired),
                },
                image: primaryImage,
                gallery: galleryUrls.length > 0 ? galleryUrls : [primaryImage],
                createdAt: doc.createdAt,
            };
        }
    } catch (e) {
        console.warn("Could not find product in DB, trying showcase catalog:", e);
    }

    // Match fallback catalog
    const matched = FALLBACK_CATALOG.find(
        (p) => p.slug === slugOrId || p.id === slugOrId || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slugOrId
    );
    return matched || null;
}

// Get related products for product detail page
export async function getRelatedProducts(category: string, excludeId: string) {
    try {
        const payload = await getPayloadClient();
        const result = await payload.find({
            collection: "products",
            where: {
                and: [
                    { category: { equals: category } },
                    { id: { not_equals: excludeId } },
                ],
            },
            limit: 4,
        });

        if (result.docs && result.docs.length > 0) {
            return result.docs.map((doc: any) => {
                const rawPrice = typeof doc.price === "number" ? doc.price : parseFloat(String(doc.price).replace(/[^0-9.]/g, "")) || 0;
                const currencySymbol = doc.currency === "NGN" ? "₦" : doc.currency === "EUR" ? "€" : doc.currency === "GBP" ? "£" : "$";
                return {
                    id: String(doc.id),
                    name: doc.name,
                    slug: doc.slug || doc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    price: rawPrice,
                    formattedPrice: `${currencySymbol}${rawPrice.toLocaleString()}`,
                    currency: doc.currency || "USD",
                    category: doc.category,
                    image: typeof doc.imageMedia === "object" && doc.imageMedia?.url ? doc.imageMedia.url : doc.image,
                };
            });
        }
    } catch {
        // fallback
    }

    return FALLBACK_CATALOG.filter((p) => p.id !== excludeId).slice(0, 4);
}

// Get active delivery methods from Payload CMS
export async function getDeliveryMethods() {
    try {
        const payload = await getPayloadClient();
        const result = await payload.find({
            collection: "delivery-methods",
            where: {
                isActive: {
                    equals: true,
                },
            },
            limit: 20,
        });

        if (result.docs && result.docs.length > 0) {
            return result.docs.map((doc: any) => ({
                id: String(doc.id),
                title: doc.title,
                description: doc.description || "",
                price: Number(doc.price) || 0,
                currency: doc.currency || "USD",
                estimatedDays: doc.estimatedDays || "2-4 days",
                regions: doc.regions || ["Lagos Metro"],
                freeShippingThreshold: doc.freeShippingThreshold || null,
            }));
        }
    } catch (error) {
        console.warn("Using fallback delivery methods:", error);
    }

    // Default luxury delivery options
    return [
        {
            id: "del-whiteglove",
            title: "Lagos White-Glove Installation & Delivery",
            description: "Room-of-choice placement, unboxing, expert assembly, and packaging removal.",
            price: 120,
            currency: "USD",
            estimatedDays: "1 - 3 business days",
            regions: ["Lagos Metro"],
            freeShippingThreshold: 2000,
        },
        {
            id: "del-freight",
            title: "Nationwide Secure Freight",
            description: "Insured crate transport across Nigeria with real-time tracking.",
            price: 75,
            currency: "USD",
            estimatedDays: "4 - 7 business days",
            regions: ["Nationwide"],
            freeShippingThreshold: 2500,
        },
        {
            id: "del-pickup",
            title: "Showroom Flagship Pickup",
            description: "Complimentary pickup from our Victoria Island flagship showroom.",
            price: 0,
            currency: "USD",
            estimatedDays: "Ready in 24 hours",
            regions: ["Lagos Metro"],
            freeShippingThreshold: 0,
        },
    ];
}

// Create an e-commerce order
export async function createOrder(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode?: string;
        country: string;
    };
    items: Array<{
        productId?: string;
        name: string;
        price: number;
        quantity: number;
        imageUrl?: string;
    }>;
    deliveryMethodId?: string;
    deliveryMethodTitle: string;
    deliveryFee: number;
    specialInstructions?: string;
    currency?: string;
    paymentMethod?: "bank_transfer" | "card" | "pos_showroom";
}) {
    try {
        const payload = await getPayloadClient();
        
        // Calculate financial totals
        const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const grandTotal = subtotal + data.deliveryFee;
        const orderNumber = `OGE-${Date.now().toString().slice(-6)}`;

        const order = await payload.create({
            collection: "orders",
            data: {
                orderNumber,
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                shippingAddress: {
                    street: data.shippingAddress.street,
                    city: data.shippingAddress.city,
                    state: data.shippingAddress.state,
                    postalCode: data.shippingAddress.postalCode || "",
                    country: data.shippingAddress.country || "Nigeria",
                },
                items: data.items.map((item) => ({
                    product: item.productId as any,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    lineTotal: item.price * item.quantity,
                    imageUrl: item.imageUrl || "",
                })),
                delivery: {
                    method: data.deliveryMethodId as any,
                    methodTitle: data.deliveryMethodTitle,
                    deliveryFee: data.deliveryFee,
                    deliveryStatus: "pending",
                    carrier: "OgeDecor White-Glove Fleet",
                    trackingNumber: `TRK-${orderNumber}`,
                    specialInstructions: data.specialInstructions || "",
                },
                financials: {
                    subtotal,
                    deliveryTotal: data.deliveryFee,
                    discountTotal: 0,
                    grandTotal,
                    currency: (data.currency as any) || "USD",
                    paymentStatus: "pending",
                    paymentMethod: data.paymentMethod || "bank_transfer",
                },
            },
        });

        // Trigger Resend email notifications (non-blocking)
        const emailOrderData: OrderEmailData = {
            orderNumber,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            shippingAddress: data.shippingAddress,
            items: data.items.map((item) => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                lineTotal: item.price * item.quantity,
                imageUrl: item.imageUrl,
            })),
            deliveryMethodTitle: data.deliveryMethodTitle,
            deliveryFee: data.deliveryFee,
            subtotal,
            grandTotal,
            currency: data.currency || "USD",
            paymentMethod: data.paymentMethod || "bank_transfer",
            specialInstructions: data.specialInstructions,
        };

        Promise.allSettled([
            sendOrderConfirmationEmail(emailOrderData),
            sendAdminNewOrderAlert(emailOrderData),
        ]).catch((err) => console.error("Error triggering Resend order emails:", err));

        revalidatePath("/shop");
        return { success: true, orderNumber, order };
    } catch (error) {
        console.error("Error creating order with Payload CMS:", error);
        return { success: false, error: "Failed to place order. Please try again." };
    }
}

// Track an order by reference number
export async function trackOrder(orderNumber: string) {
    try {
        const payload = await getPayloadClient();
        const result = await payload.find({
            collection: "orders",
            where: {
                orderNumber: {
                    equals: orderNumber.trim(),
                },
            },
            limit: 1,
        });

        if (result.docs && result.docs.length > 0) {
            const order: any = result.docs[0];
            return {
                found: true,
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                deliveryStatus: order.delivery?.deliveryStatus || "pending",
                carrier: order.delivery?.carrier || "OgeDecor White-Glove Logistics",
                trackingNumber: order.delivery?.trackingNumber || "",
                deliveryMethod: order.delivery?.methodTitle || "",
                estimatedDays: "2 - 4 business days",
                items: order.items || [],
                grandTotal: order.financials?.grandTotal || 0,
                currency: order.financials?.currency || "USD",
                createdAt: order.createdAt,
            };
        }
        return { found: false };
    } catch (error) {
        console.warn("Could not track order:", error);
        return { found: false };
    }
}

