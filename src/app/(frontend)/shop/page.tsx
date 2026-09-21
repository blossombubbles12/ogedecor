import { Metadata } from "next";
import ShopContent from "./ShopContent";
import { getShopProducts } from "@/app/actions";

export const metadata: Metadata = {
    title: "Shop | Bespoke African Decor",
    description: "Discover a curated collection of handcrafted furniture, lighting, and decor pieces. Elevate your space with OgeDecor's exclusive Afro-luxury designs.",
    keywords: ["luxury furniture", "African decor", "handmade furniture", "bespoke design", "OgeDecor shop"],
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
    const initialProducts = await getShopProducts();
    return <ShopContent initialProducts={initialProducts} />;
}

