"use server";

import { sql } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to initialize the tables if they don't exist
async function ensureTablesExist() {
    try {
        // Projects table
        await sql`
          CREATE TABLE IF NOT EXISTS projects (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            completion_date TIMESTAMP WITH TIME ZONE NOT NULL,
            media JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;

        // Inquiries table
        await sql`
          CREATE TABLE IF NOT EXISTS inquiries (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            project_type TEXT NOT NULL,
            mood TEXT NOT NULL,
            timeline TEXT NOT NULL,
            budget TEXT NOT NULL,
            inspiration JSONB,
            contact_name TEXT NOT NULL,
            contact_info TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;

        // Products table
        await sql`
          CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            price TEXT NOT NULL,
            description TEXT,
            category TEXT,
            image TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;
    } catch (error) {
        console.error("Error ensuring tables exist:", error);
    }
}

// Generate Cloudinary signature for secure uploads
export async function getCloudinarySignature() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "ogedecor";

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            folder,
        },
        process.env.CLOUDINARY_API_SECRET!
    );

    return { signature, timestamp, folder };
}

// Create a new project
export async function createProject(data: {
    title: string;
    description: string;
    category: string;
    completionDate: string;
    media: Array<{ url: string; type: "image" | "video"; publicId: string }>;
}) {
    await ensureTablesExist();
    try {
        const result = await sql`
            INSERT INTO projects (title, description, category, completion_date, media)
            VALUES (${data.title}, ${data.description}, ${data.category}, ${data.completionDate}, ${JSON.stringify(data.media)})
            RETURNING *;
        `;

        revalidatePath("/");
        return { success: true, project: result[0] };
    } catch (error) {
        console.error("Error creating project with Neon SQL:", error);
        return { success: false, error: "Failed to create project" };
    }
}

// Get all projects
export async function getProjects() {
    await ensureTablesExist();
    try {
        const projects = await sql`
            SELECT 
              id, 
              title, 
              description, 
              category, 
              completion_date as "completionDate", 
              media, 
              created_at as "createdAt", 
              updated_at as "updatedAt"
            FROM projects 
            ORDER BY created_at DESC;
        `;
        return projects;
    } catch (error) {
        console.error("Error fetching projects with Neon SQL:", error);
        return [];
    }
}

// Delete a project
export async function deleteProject(id: string) {
    await ensureTablesExist();
    try {
        await sql`
            DELETE FROM projects 
            WHERE id = ${id};
        `;

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error deleting project with Neon SQL:", error);
        return { success: false, error: "Failed to delete project" };
    }
}

// Get project by ID
export async function getProjectById(id: string) {
    await ensureTablesExist();
    try {
        const result = await sql`
            SELECT 
              id, 
              title, 
              description, 
              category, 
              completion_date as "completionDate", 
              media, 
              created_at as "createdAt", 
              updated_at as "updatedAt"
            FROM projects 
            WHERE id = ${id};
        `;
        return result[0] || null;
    } catch (error) {
        console.error("Error fetching project by ID:", error);
        return null;
    }
}

// Create a project inquiry
export async function createInquiry(data: {
    projectType: string;
    mood: string;
    timeline: string;
    budget: string;
    inspiration: any;
    name: string;
    email: string;
}) {
    await ensureTablesExist();
    try {
        const result = await sql`
            INSERT INTO inquiries (project_type, mood, timeline, budget, inspiration, contact_name, contact_info)
            VALUES (${data.projectType}, ${data.mood}, ${data.timeline}, ${data.budget}, ${JSON.stringify(data.inspiration)}, ${data.name}, ${data.email})
            RETURNING *;
        `;
        return { success: true, inquiry: result[0] };
    } catch (error) {
        console.error("Error creating inquiry:", error);
        return { success: false, error: "Failed to submit inquiry" };
    }
}

// Get all products
export async function getShopProducts() {
    await ensureTablesExist();
    try {
        const products = await sql`
            SELECT * FROM products ORDER BY created_at DESC;
        `;
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

// Create a product
export async function createProduct(data: {
    name: string;
    price: string;
    description: string;
    category: string;
    image: string;
}) {
    await ensureTablesExist();
    try {
        const result = await sql`
            INSERT INTO products (name, price, description, category, image)
            VALUES (${data.name}, ${data.price}, ${data.description}, ${data.category}, ${data.image})
            RETURNING *;
        `;
        return { success: true, product: result[0] };
    } catch (error) {
        console.error("Error creating product:", error);
        return { success: false, error: "Failed to create product" };
    }
}


