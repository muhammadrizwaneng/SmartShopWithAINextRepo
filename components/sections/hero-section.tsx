"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  discount_percent?: number;
  category: string;
  image: string;
  main_image_url?: string;
  images?: string[];
  featured?: boolean;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  slug?: string;
  has_variants?: boolean;
  variants?: Array<{
    _id: string;
    price: number;
    size?: string;
    color?: string;
    discount_price?: number;
    discount_percent?: number;
  }>;
}

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products/getAllProducts');
        const allProducts = response.data || [];

        setFeaturedProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Map featured products to slides
  const slides = featuredProducts.map(product => ({
    title: product.name,
    subtitle: product.description.length > 100 
      ? `${product.description.substring(0, 100)}...` 
      : product.description,
    image: product.main_image_url || product.images?.[0] || product.image || 
           "https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg?auto=compress&cs=tinysrgb&w=1920",
    cta: product.discount_percent ? `Shop Now - ${product.discount_percent}% Off` : "Shop Now",
    link: `/products/${product._id}`
  }));

  // Don't run the carousel effect if there are no slides
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            currentSlide === index ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="max-w-xl space-y-5"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  {slide.title}
                </h1>
                <p className="text-xl text-white/90">
                  {slide.subtitle}
                </p>
                <div className="pt-2">
                  <Link href={slide.link}>
                    <Button size="lg" className="rounded-full">
                      {slide.cta}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-colors duration-300",
              currentSlide === index ? "bg-white" : "bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}