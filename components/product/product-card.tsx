"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  recommended?: boolean;
}

export function ProductCard({ product, recommended = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted 
      ? `${product.name} removed from wishlist` 
      : `${product.name} added to wishlist`
    );
  };

  return (
    <TooltipProvider>
      <Card 
        className="group relative h-full overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {product.isNew && (
          <Badge className="absolute top-3 right-3 z-10 bg-blue-500 hover:bg-blue-600">New</Badge>
        )}
        
        {product.discount > 0 && (
          <Badge className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600">
            -{product.discount}%
          </Badge>
        )}
        
        {recommended && (
          <div className="absolute top-3 left-3 z-10">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-amber-500 text-white rounded-full p-1.5">
                  <Sparkles className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI Recommended for you</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
        
        <div className="relative pt-[100%]">
          <Link href={`/products/${product._id}`}>
            <Image
              src={product.main_image_url}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-500",
                isHovered && product.images && product.images.length > 0 
                  ? "opacity-0" 
                  : "opacity-100"
              )}
            />
            {product.gallery_images && product.gallery_images.length > 0 && (
              <Image
                src={product.gallery_images[0]}
                alt={`${product.name} - alternate view`}
                fill
                className={cn(
                  "object-cover transition-opacity duration-500",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </Link>
          
          <div className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 transition-all duration-300",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          )}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="rounded-full shadow-md"
                  onClick={toggleWishlist}
                >
                  <Heart className={cn(
                    "h-4 w-4", 
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  )} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/products/${product._id}`}>
                  <Button variant="secondary" size="icon" className="rounded-full shadow-md">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Quick view</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <CardContent className="p-4 pt-5">
          <div className="mb-2">
            <Link 
              href={`/categories/${product.category}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {product.category}
            </Link>
          </div>
          <Link href={`/products/${product._id}`} className="block">
            <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!product.has_variants && product.discount_price != null ? (
                <>
                  <span className="font-semibold text-primary">
                    ${product.discount_price.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : !product.has_variants ? (
                <span className="font-semibold">${product.price.toFixed(2)}</span>
              ) : null}
              
              {product.has_variants && product.variants?.[0]?.discount_price != null ? (
                <>
                  <span className="font-semibold text-primary">
                    ${product.variants[0].discount_price.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.variants[0].price.toFixed(2)}
                  </span>
                </>
              ) : product.has_variants ? (
                <span className="font-semibold">${product.variants[0]?.price?.toFixed(2)}</span>
              ) : null}
            </div>
            {product.rating && (
              <div className="flex items-center">
                <div className="flex">             
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg 
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5", 
                        i < Math.floor(product.rating) 
                          ? "text-yellow-400" 
                          : "text-gray-300 dark:text-gray-600"
                      )}
                      aria-hidden="true" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="currentColor" 
                      viewBox="0 0 22 20"
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">
                  ({product.reviewCount})
                </span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}