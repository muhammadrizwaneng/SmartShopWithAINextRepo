import { HeroSection } from '@/components/sections/hero-section';
import { FeaturedProducts } from '@/components/sections/featured-products';
import { Categories } from '@/components/sections/categories';
import { AiFeatures } from '@/components/sections/ai-features';
import { Newsletter } from '@/components/sections/newsletter';
import { ChatbotButton } from '@/components/ui/chatbot-button';

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />
      <FeaturedProducts />
      <Categories />
      <AiFeatures />
      <Newsletter />
      <ChatbotButton />
    </div>
  );
}