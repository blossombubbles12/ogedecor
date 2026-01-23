import Hero from "@/components/Hero";
import BrandStory from "@/components/BrandStory";
import FeaturedProjects from "@/components/FeaturedProjects";
import Services from "@/components/Services";
import ShopPreview from "@/components/ShopPreview";
import InspirationGallery from "@/components/InspirationGallery";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <BrandStory />
      <FeaturedProjects />
      <Services />
      <ShopPreview />
      <InspirationGallery />
      <Testimonials />
    </div>
  );
}
