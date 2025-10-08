"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";

interface Category {
  _id: string;
  category_name: string;
  product_count: number;
  slug?: string;
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map of category names to their corresponding images
  const categoryImages: Record<string, string> = {
    'electronics': 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'apparel': 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'health & wellness': 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'beauty & personal care': 'https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'default': 'https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg?auto=compress&cs=tinysrgb&w=1200'
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.get('/category/categories-with-product-count', {
          signal: controller.signal
        });
        
        // if (isMounted) {
          setCategories(response.data);
        // }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching categories:', err);
          setError('Failed to load categories');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground mt-2">
              Browse our wide range of product categories
            </p>
          </div>
          <Link href="/categories">
            <Button variant="ghost" className="group">
              All Categories <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-[300px] rounded-lg overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : categories.filter(c => c.product_count > 0).length === 0 ? (
          <p className="text-center text-muted-foreground">No categories with products available at the moment</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories
              .filter(category => category.product_count > 0)
              .slice(0, 4)
              .map((category) => {
                const imageUrl = categoryImages[category.category_name.toLowerCase()] || categoryImages['default'];
                
                return (
                  <Link 
                    key={category.category_id}
                    href={`/categories/${category?.category_id}`}
                    className="group block relative h-[300px] rounded-lg overflow-hidden"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <h3 className="text-xl font-semibold text-white">
                        {category.category_name}
                      </h3>
                      <span className={cn(
                        "inline-flex items-center text-sm text-white/80 mt-2",
                        "transition-all duration-300 group-hover:translate-x-1"
                      )}>
                        {category.product_count} {category.product_count === 1 ? 'product' : 'products'} • View all <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </section>
  );
}