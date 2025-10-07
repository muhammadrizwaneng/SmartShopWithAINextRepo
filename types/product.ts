export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  category: string;
  image: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  isNew: boolean;
  featured?: boolean;
}