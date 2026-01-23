import { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
    title: "Start Your Project | Consultation",
    description: "Begin your luxury interior design journey with OgeDecor. Book a consultation for residential or commercial projects and experience modern African elegance.",
    keywords: ["book interior designer Lagos", "design consultation Nigeria", "start interior project", "OgeDecor contact"],
};

export default function ContactPage() {
    return <ContactContent />;
}
