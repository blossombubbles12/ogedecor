import { Metadata } from "next";
import ShippingContent from "./ShippingContent";

export const metadata: Metadata = {
    title: "Shipping & Returns | Concierge Service",
    description: "Information regarding OgeDecor's white-glove delivery, international shipping, and bespoke order return policies.",
};

export default function ShippingPage() {
    return <ShippingContent />;
}
