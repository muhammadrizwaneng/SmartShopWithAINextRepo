"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { Product } from "@/types/product";
import { useAI } from "@/contexts/ai-context";
import { getFeaturedProducts } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/axios";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { personalizedRecommendations } = useAI();

    useEffect(() => {
      fetchProducts();
    }, []);
  
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await api.get('/products/getAllProducts');
        const productsData = response.data || [];
        console.log("Fetched products:", productsData);
        console.log("Products with variants:", productsData.filter((p: Product) => p.has_variants));
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
  

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground mt-2">
              Discover our most popular items, curated just for you
            </p>
          </div>
          <Link href="/products">
            <Button variant="ghost" className="group">
              View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[350px] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                recommended={personalizedRecommendations.includes(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}