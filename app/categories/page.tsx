"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
  slug: string;
  productCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
  
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/category/categories-with-product-count', {
          signal: controller.signal
        });
        
        if (!isMounted) return;
        
        const sortedCategories = response.data.sort((a: Category, b: Category) => 
          b.productCount - a.productCount
        );
        setCategories(sortedCategories);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request was canceled');
          return;
        }
        console.error('Error fetching categories:', error);
        if (isMounted) {
          toast({
            title: 'Error',
            description: 'Failed to load categories',
            variant: 'destructive',
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
  
    fetchCategories();
  
    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Shop by Category</h1>
          <p className="text-muted-foreground mt-2">Loading categories...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Shop by Category</h1>
        <p className="text-muted-foreground mt-2">
          {categories.length > 0 
            ? `Discover products in our ${categories.length} categories`
            : 'No categories found'}
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              href={`/categories/${encodeURIComponent(category?.category_id)}`} 
              key={category._id} 
              className="block h-full group"
            >
              <Card className="h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl">{category?.category_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {category?.product_count} {category?.product_count === 1 ? 'product' : 'products'}
                    </span>
                    <span className="text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
