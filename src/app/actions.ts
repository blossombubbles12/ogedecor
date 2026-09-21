"use server";

import { getPayloadClient } from "@/lib/payload";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

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

