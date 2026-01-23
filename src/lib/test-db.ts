import { sql } from "./db";

async function testConnection() {
    console.log("Testing Neon DB connection...");
    try {
        const result = await sql`SELECT NOW()`;
        console.log("✅ Success! Time from DB:", result[0].now);
    } catch (error) {
        console.error("❌ Connection failed:", error);
    }
}

testConnection();
