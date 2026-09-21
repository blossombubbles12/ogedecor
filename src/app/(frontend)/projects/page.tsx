import { Metadata } from "next";
import PortfolioContent from "./PortfolioContent";

export const metadata: Metadata = {
    title: "Portfolio | Our Design Legacy",
    description: "Explore OgeDecor's portfolio of luxury residential and commercial projects. Modern African interior design executed with precision and elegance.",
    keywords: ["interior design portfolio", "luxury homes Lagos", "commercial design Nigeria", "Afro-modern decor", "OgeDecor projects"],
};

export default function PortfolioPage() {
    return <PortfolioContent />;
}
