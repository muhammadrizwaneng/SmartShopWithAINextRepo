"use client";

"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  discount_price: number | null;
  discount_percent: number | null;
  main_image_url: string;
  gallery_images: string[];
  brand?: string;
  tags?: string[];
  features?: Array<{ label: string; value: string }>;
  stock?: number;
  has_variants?: boolean;
  variants?: Array<{
    name: string;
    price: number;
    discountprice?: number;
    discount_percent?: number;
    stock: number;
  }>;
  category_name: string | null;
  delivery_options?: string[];
  currency?: string;
}

type CategoryPageProps = {
  params: { category: string };
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const { category: categoryId } = params;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/get-products-by-category/${categoryId}`, {
          signal: controller.signal
        });
        
        if (isMounted) {
          setProducts(response.data);
          
          // Set category name from the first product or URL
          if (response.data.length > 0 && response.data[0].category_name) {
            setCategoryName(response.data[0].category_name);
          } else {
            // Fallback to URL-based name
            const nameFromUrl = categoryId.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            setCategoryName(nameFromUrl);
          }
        }
      } catch (error) {
        // Only show error if it's not a canceled request
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error fetching products:', error);
          if (isMounted) {
            toast({
              title: 'Error',
              description: 'Failed to load products',
              variant: 'destructive',
            });
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (categoryId) {
      fetchProducts();
    }

    // Cleanup function to cancel the request if the component unmounts
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [categoryId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-full">
              <div className="aspect-square relative">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
        <p className="text-muted-foreground mt-2">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found in this category.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/categories')}
          >
            Back to Categories
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="group">
              <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-lg">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.main_image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.discount_percent && product.discount_price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discount_percent}% OFF
                    </div>
                  )}
                  {product.tags?.includes('New') && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                      NEW
                    </div>
                  )}
                </div>
                <CardHeader className="flex-1 p-4 pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg leading-tight">
                        <Link href={`/products/${product._id}`} className="hover:underline">
                          {product.name}
                        </Link>
                      </CardTitle>
                      {product.brand && (
                        <span className="text-sm text-muted-foreground whitespace-nowrap ml-2">
                          {product.brand}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">
                      ${!product.has_variants && product.discount_price ? product.discount_price.toFixed(2) : product.price?.toFixed(2) || 'N/A'}
                    </span>
                    {!product.has_variants && product.discount_price && product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                    <span className="text-xl font-bold">
                      ${product.has_variants && product?.variants[0]?.discount_price ? product?.variantss[0]?.discount_price.toFixed(2) : product?.variants?.price?.toFixed(2) || 'N/A'}
                    </span>
                    {product.has_variants && product?.variants[0]?.discount_price && product?.variants[0]?.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product?.variants[0]?.price?.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.features && product.features.length > 0 && (
                    <div className="text-sm text-muted-foreground space-y-1">
                      {product.features.slice(0, 2).map((feature, i) => (
                        <div key={i} className="flex gap-1">
                          <span className="font-medium">{feature.label}:</span>
                          <span>{feature.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {product.tags?.includes('Trending') && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Trending
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="w-full space-y-2">
                    {product.delivery_options && (
                      <div className="text-xs text-green-600">
                        {product.delivery_options[0]}
                      </div>
                    )}
                    <Button className="w-full" asChild>
                      <Link href={`/products/${product._id}`}>
                        {product.has_variants ? 'View Options' : 'View Details'}
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Remove generateStaticParams as we're doing client-side fetching
