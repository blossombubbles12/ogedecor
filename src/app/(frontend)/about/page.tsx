import { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
    title: "About | Ogechi Cynthia Onuegbu",
    description: "Meet the visionary behind OgeDecor. Ogechi Cynthia Onuegbu is an interior design alchemist blending African heritage with modern luxury to create soulful spaces.",
    keywords: ["Ogechi Cynthia Onuegbu", "interior designer Lagos", "Afro-luxury designer", "OgeDecor founder", "creative director Nigeria"],
};

export default function AboutPage() {
    return <AboutContent />;
}
