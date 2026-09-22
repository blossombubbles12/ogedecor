import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/app/actions";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: "Piece Not Found | Ogedecor",
            description: "The requested bespoke decor piece could not be located in the Ogedecor collection.",
        };
    }

    return {
        title: `${product.name} | Ogedecor Bespoke Decor`,
        description: product.subtitle || product.description.slice(0, 160),
        keywords: [product.name, product.category, "Ogedecor", "luxury furniture", "African decor", "bespoke interior"],
        openGraph: {
            title: `${product.name} — Ogedecor`,
            description: product.subtitle || product.description.slice(0, 160),
            images: product.image ? [{ url: product.image }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: `${product.name} — Ogedecor`,
            description: product.subtitle || product.description.slice(0, 160),
            images: product.image ? [product.image] : [],
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return (
            <main className="min-h-[80vh] bg-obsidian text-sand flex items-center justify-center px-6 pt-32">
                <div className="max-w-md text-center space-y-6">
                    <span className="text-gold tracking-[0.25em] text-xs uppercase font-bold flex items-center justify-center gap-2">
                        <Sparkles size={14} /> Catalog Archival
                    </span>
                    <h1 className="text-4xl font-serif text-white">Piece Not Located</h1>
                    <p className="text-white/60 text-sm leading-relaxed">
                        This exclusive piece may have been acquired, retired from our current collection, or cataloged under a new reference.
                    </p>
                    <div className="pt-4">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-gold text-obsidian px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all shadow-xl shadow-gold/20"
                        >
                            <ArrowLeft size={14} />
                            <span>Explore Active Collection</span>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const relatedProducts = await getRelatedProducts(product.category, product.id);

    return (
        <ProductDetailClient
            product={product}
            relatedProducts={relatedProducts}
        />
    );
}
