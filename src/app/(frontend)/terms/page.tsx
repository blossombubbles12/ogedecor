import { Metadata } from "next";
import TermsContent from "./TermsContent";

export const metadata: Metadata = {
    title: "Terms of Service | OgeDecor",
    description: "Read the terms and conditions for engaging with OgeDecor's interior design services and custom decor orders.",
};

export default function TermsPage() {
    return <TermsContent />;
}
