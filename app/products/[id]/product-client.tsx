'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, Truck, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

interface ProductVariant {
  _id: string;
  name: string;
  price: number;
  stock: number;
  discountprice?: number;
  discount_percent?: number;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  category_name: string;
  price: number;
  discount_price?: number;
  discount_percent?: number;
  main_image_url: string;
  gallery_images: string[];
  tags: string[];
  rating: number;
  reviews_count: number;
  has_variants: boolean;
  variants: ProductVariant[];
  features: Array<{ label: string; value: string }>;
  delivery_options: string[];
  stock: number;
}

export default function ProductClient() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImage, setActiveImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [discountInput, setDiscountInput] = useState('');
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/product/${id}`);
        console.log("=-=response00-",response?.data)
        setProduct(response.data);
        setActiveImage(response.data.main_image_url);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, toast]);

  const currentVariant = product?.variants?.[selectedVariantIndex];
  const currentPrice = currentVariant?.discountprice ?? currentVariant?.price ?? product?.discount_price ?? product?.price ?? 0;
  const originalPrice = currentVariant?.price ?? product?.price ?? 0;
  const hasDiscount = currentPrice < originalPrice;
  const discountPercent = currentVariant?.discount_percent ?? product?.discount_percent;
  const stockCount = currentVariant?.stock ?? product?.stock ?? 0;

  const handleDiscountApply = async () => {
    try {
      const discount = parseFloat(discountInput);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        toast({
          title: 'Invalid discount',
          description: 'Please enter a valid discount percentage between 0 and 100',
          variant: 'destructive',
        });
        return;
      }

      const endpoint = currentVariant 
        ? `/products/${id}/variants/${currentVariant._id}/discount`
        : `/products/${id}/discount`;

      await api.patch(endpoint, { discount_percent: discount });
      
      // Refresh product data
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      
      toast({
        title: 'Success',
        description: `Discount of ${discount}% applied successfully`,
      });
      
      setShowDiscountModal(false);
      setDiscountInput('');
    } catch (error) {
      console.error('Error applying discount:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply discount',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="text-muted-foreground mt-2">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={activeImage || product.main_image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {product.gallery_images && product.gallery_images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setActiveImage(product.main_image_url)}
                className={`aspect-square relative rounded-md overflow-hidden border-2 ${
                  activeImage === product.main_image_url ? 'border-primary' : 'border-transparent'
                }`}
              >
                <Image
                  src={product.main_image_url}
                  alt={`${product.name} - Main`}
                  fill
                  className="object-cover"
                />
              </button>
              
              {product.gallery_images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(image)}
                  className={`aspect-square relative rounded-md overflow-hidden border-2 ${
                    activeImage === image ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? 'fill-primary' : 'fill-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews_count} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${currentPrice.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                  {discountPercent && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-sm ${stockCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stockCount > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="text-sm text-muted-foreground">
                {stockCount} units available
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div>
              <h3 className="font-medium">Brand</h3>
              <p className="text-muted-foreground">{product.brand}</p>
            </div>
            
            <div>
              <h3 className="font-medium">Category</h3>
              <p className="text-muted-foreground">{product.category_name}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-medium">Tags</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-medium">Variants</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariantIndex(index)}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      selectedVariantIndex === index
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}



          {/* Delivery Options */}
          {product.delivery_options && product.delivery_options.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-medium">Delivery Options</h3>
              <ul className="space-y-2">
                {product.delivery_options.map((option, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
                    <div className="pt-4 border-t">
            <div className="flex gap-3">
              <Button size="lg" className="flex-1">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Features */}
      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>
        </div>

        {product.features && product.features.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, index) => (
                <div key={index} className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium">{feature.label}</h3>
                  <p className="text-muted-foreground">{feature.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Apply Discount</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="discount">Discount Percentage</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  placeholder="Enter discount percentage"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a value between 0 and 100
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDiscountModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleDiscountApply}>Apply Discount</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
