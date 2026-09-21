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

// Get all shop products with fallback for pending DB credentials
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

        return result.docs.map((doc: any) => ({
            id: String(doc.id),
            name: doc.name,
            price: doc.price,
            description: doc.description,
            category: doc.category,
            image: typeof doc.imageMedia === "object" && doc.imageMedia?.url ? doc.imageMedia.url : doc.image || "",
            createdAt: doc.createdAt,
        }));
    } catch (error) {
        console.warn("Could not fetch shop products via Payload CMS (DB credentials pending or connecting):", error);
        return [];
    }
}

// Create a product
export async function createProduct(data: {
    name: string;
    price: string;
    description?: string;
    category?: string;
    image?: string;
}) {
    try {
        const payload = await getPayloadClient();
        const product = await payload.create({
            collection: "products",
            data: {
                name: data.name,
                price: data.price,
                description: data.description || "",
                category: (data.category as any) || "Furniture",
                image: data.image || "",
            },
        });
        return { success: true, product };
    } catch (error) {
        console.error("Error creating product via Payload CMS:", error);
        return { success: false, error: "Failed to create product" };
    }
}
