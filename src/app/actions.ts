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

// Helper to determine if a URL or MIME type belongs to a video
function isVideoUrl(url: string | undefined | null, mimeType?: string): boolean {
    if (!url) return false;
    if (mimeType && mimeType.startsWith("video/")) return true;
    const lower = url.toLowerCase().split('?')[0];
    return (
        lower.endsWith(".mp4") ||
        lower.endsWith(".mov") ||
        lower.endsWith(".webm") ||
        lower.endsWith(".mkv") ||
        lower.includes("/video/")
    );
}

// Helper: resolve a Payload upload relation to a URL string
function resolveUpload(field: any): { url: string; mimeType: string } | null {
    if (typeof field === "object" && field !== null && field.url) {
        return { url: field.url, mimeType: field.mimeType || "" };
    }
    return null;
}

// Get all projects
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

        return result.docs.map((doc: any) => {
            const mediaItems: { url: string; type: "image" | "video" }[] = [];

            // Featured image upload (DB column: featured_image_id)
            const fi = resolveUpload(doc.featuredImage);
            if (fi) {
                const isVid = isVideoUrl(fi.url, fi.mimeType);
                mediaItems.push({ url: fi.url, type: isVid ? "video" : "image" });
            }

            // Gallery array (DB columns: image_id, url, type)
            if (Array.isArray(doc.media)) {
                for (const m of doc.media) {
                    const img = resolveUpload(m.image);
                    if (img && !mediaItems.find(i => i.url === img.url)) {
                        const isVid = m.type === "video" || isVideoUrl(img.url, img.mimeType);
                        const t: "image" | "video" = isVid ? "video" : "image";
                        mediaItems.push({ url: img.url, type: t });
                        continue;
                    }
                    if (typeof m.url === "string" && m.url.trim()) {
                        const u = m.url.trim();
                        if (!mediaItems.find(i => i.url === u)) {
                            const isVid = m.type === "video" || isVideoUrl(u);
                            const t: "image" | "video" = isVid ? "video" : "image";
                            mediaItems.push({ url: u, type: t });
                        }
                    }
                }
            }

            return {
                id: String(doc.id),
                title: doc.title,
                description: doc.description,
                category: doc.category,
                completionDate: doc.completionDate,
                media: mediaItems,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            };
        });
    } catch (error) {
        console.warn("Could not fetch projects via Payload CMS:", error);
        return [];
    }
}

// Get project by ID
export async function getProjectById(id: string) {
    try {
        const payload = await getPayloadClient();
        const doc: any = await payload.findByID({ collection: "projects", id });
        if (!doc) return null;

        const mediaItems: { url: string; type: "image" | "video" }[] = [];

        const fi = resolveUpload(doc.featuredImage);
        if (fi) {
            const isVid = isVideoUrl(fi.url, fi.mimeType);
            mediaItems.push({ url: fi.url, type: isVid ? "video" : "image" });
        }

        if (Array.isArray(doc.media)) {
            for (const m of doc.media) {
                const img = resolveUpload(m.image);
                if (img && !mediaItems.find(i => i.url === img.url)) {
                    const isVid = m.type === "video" || isVideoUrl(img.url, img.mimeType);
                    const t: "image" | "video" = isVid ? "video" : "image";
                    mediaItems.push({ url: img.url, type: t });
                    continue;
                }
                if (typeof m.url === "string" && m.url.trim()) {
                    const u = m.url.trim();
                    if (!mediaItems.find(i => i.url === u)) {
                        const isVid = m.type === "video" || isVideoUrl(u);
                        const t: "image" | "video" = isVid ? "video" : "image";
                        mediaItems.push({ url: u, type: t });
                    }
                }
            }
        }

        return {
            id: String(doc.id),
            title: doc.title,
            description: doc.description,
            category: doc.category,
            completionDate: doc.completionDate,
            media: mediaItems,
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

// Get all shop products
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

            const slug = doc.slug && doc.slug.trim() !== ""
                ? doc.slug
                : (doc.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

            // Primary image: imageMedia upload (DB: image_media_id) OR legacy image text URL
            const primaryImageUpload = resolveUpload(doc.imageMedia);
            const primaryImage = primaryImageUpload?.url || (typeof doc.image === "string" ? doc.image.trim() : "");
            const primaryIsVid = isVideoUrl(primaryImage, primaryImageUpload?.mimeType);

            // Gallery: imageMedia already included as primary image
            // gallery array has DB columns: image_id (upload), caption (text)
            const galleryItems: { url: string; type: "image" | "video" }[] = [];
            if (primaryImage) {
                galleryItems.push({ url: primaryImage, type: primaryIsVid ? "video" : "image" });
            }
            if (Array.isArray(doc.gallery)) {
                for (const g of doc.gallery) {
                    const img = resolveUpload(g.image);
                    if (img && !galleryItems.find(i => i.url === img.url)) {
                        const isVid = isVideoUrl(img.url, img.mimeType);
                        galleryItems.push({ url: img.url, type: isVid ? "video" : "image" });
                    }
                }
            }

            return {
                id: String(doc.id),
                name: doc.name || "Bespoke Piece",
                slug,
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
                image: primaryImage,
                gallery: galleryItems,
                createdAt: doc.createdAt,
            };
        });
    } catch (error) {
        console.warn("Could not fetch shop products via Payload CMS:", error);
        return [];
    }
}

// Fetch single product by slug or id with rich details
export async function getProductBySlug(slugOrId: string) {
    try {
        const payload = await getPayloadClient();

        const bySlug = await payload.find({
            collection: "products",
            where: { slug: { equals: slugOrId } },
            limit: 1,
        });

        let doc: any = bySlug.docs?.[0];
        if (!doc) {
            const all = await payload.find({ collection: "products", limit: 200 });
            doc = all.docs?.find((d: any) => {
                const derived = (d as any).name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                return String((d as any).id) === slugOrId || derived === slugOrId;
            });
        }

        if (doc) {
            const rawPrice = typeof doc.price === "number" ? doc.price : parseFloat(String(doc.price).replace(/[^0-9.]/g, "")) || 0;
            const currencySymbol = doc.currency === "NGN" ? "₦" : doc.currency === "EUR" ? "€" : doc.currency === "GBP" ? "£" : "$";
            const formattedPrice = `${currencySymbol}${rawPrice.toLocaleString()}`;

            const primaryImageUpload = resolveUpload(doc.imageMedia);
            const primaryImage = primaryImageUpload?.url || (typeof doc.image === "string" ? doc.image.trim() : "");
            const primaryIsVid = isVideoUrl(primaryImage, primaryImageUpload?.mimeType);

            // Gallery: primary image + gallery array items (existing DB columns only)
            const galleryItems: { url: string; type: "image" | "video" }[] = [];
            if (primaryImage) galleryItems.push({ url: primaryImage, type: primaryIsVid ? "video" : "image" });

            if (Array.isArray(doc.gallery)) {
                for (const g of doc.gallery) {
                    const img = resolveUpload(g.image);
                    if (img && !galleryItems.find(i => i.url === img.url)) {
                        const isVid = isVideoUrl(img.url, img.mimeType);
                        galleryItems.push({ url: img.url, type: isVid ? "video" : "image" });
                    }
                }
            }

            const slug = doc.slug && doc.slug.trim() !== ""
                ? doc.slug
                : doc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

            return {
                id: String(doc.id),
                name: doc.name,
                slug,
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
                gallery: galleryItems,
                createdAt: doc.createdAt,
            };
        }
    } catch (e) {
        console.warn("Could not find product in DB:", e);
    }

    return null;
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
        // no related products available
    }

    return [];
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

