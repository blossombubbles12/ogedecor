import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-obsidian border-t border-white/10 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <img
                            src="/ogedecor.png"
                            alt="OgeDecor Logo"
                            className="h-12 w-auto object-contain mb-6"
                        />
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            Redefining spaces with African elegance and modern luxury.
                            Creating timeless environments that tell your unique story.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold tracking-widest mb-6">EXPLORE</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><Link href="/about" className="hover:text-gold transition-colors">About Ogechi</Link></li>
                            <li><Link href="/projects" className="hover:text-gold transition-colors">Portfolio</Link></li>
                            <li><Link href="/services" className="hover:text-gold transition-colors">Services</Link></li>
                            <li><Link href="/shop" className="hover:text-gold transition-colors">Collection</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold tracking-widest mb-6">LEGAL</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link></li>
                            <li><Link href="/shipping-returns" className="hover:text-gold transition-colors">Shipping & Returns</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold tracking-widest mb-6">CONNECT</h4>
                        <div className="flex space-x-4 mb-6">
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-obsidian transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-obsidian transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-obsidian transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                        <a href="mailto:hello@ogedecor.com" className="flex items-center space-x-2 text-gold text-sm hover:underline">
                            <Mail size={16} />
                            <span>hello@ogedecor.com</span>
                        </a>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-white/40">
                    <p>&copy; {new Date().getFullYear()} OgeDecor. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">Designed with African Excellence.</p>
                </div>
            </div>
        </footer>
    );
}
