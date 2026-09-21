import { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
    title: "Services | Design Alchemy",
    description: "From residential luxury to commercial excellence, OgeDecor provides end-to-end interior design services. We bridge ancestral heritage with futuristic minimalism.",
    keywords: ["luxury interior design Lagos", "commercial office design Nigeria", "bespoke furniture design", "interior styling services"],
};

export default function ServicesPage() {
    return <ServicesContent />;
}
