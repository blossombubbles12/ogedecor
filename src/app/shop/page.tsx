import { Metadata } from "next";
import ShopContent from "./ShopContent";

export const metadata: Metadata = {
    title: "Shop | Bespoke African Decor",
    description: "Discover a curated collection of handcrafted furniture, lighting, and decor pieces. Elevate your space with OgeDecor's exclusive Afro-luxury designs.",
    keywords: ["luxury furniture", "African decor", "handmade furniture", "bespoke design", "OgeDecor shop"],
};

export default function ShopPage() {
    return <ShopContent />;
}
