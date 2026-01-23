import { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
    title: "Privacy Policy | OgeDecor",
    description: "Learn how OgeDecor handles and protects your personal information and project data. We are committed to maintaining your privacy and data security.",
};

export default function PrivacyPolicyPage() {
    return <PrivacyContent />;
}
