import { Product } from "@/types/product";

// Mock product data for demo purposes
// In a real implementation, this would be fetched from an API
const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium wireless headphones with active noise cancellation for an immersive audio experience.",
    price: 299.99,
    discount: 10,
    category: "Electronics",
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    images: [
      "https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    featured: true
  },
  {
    id: "prod-2",
    name: "Smart Fitness Watch",
    description: "Track your fitness goals, heart rate, and sleep patterns with this advanced smartwatch.",
    price: 199.99,
    discount: 0,
    category: "Electronics",
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    images: [
      "https://images.pexels.com/photos/8065383/pexels-photo-8065383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    rating: 4.5,
    reviewCount: 89,
    isNew: true,
    featured: true
  },
  {
    id: "prod-3",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable t-shirt made from 100% organic cotton.",
    price: 39.99,
    discount: 20,
    category: "Fashion",
    image: "https://images.pexels.com/photos/6347892/pexels-photo-6347892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    images: [
      "https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    rating: 4.2,
    reviewCount: 67,
    isNew: false,
    featured: true
  },
  {
    id: "prod-4",
    name: "Ceramic Pour-Over Coffee Maker",
    description: "Elegant pour-over coffee maker for the perfect brew every morning.",
    price: 49.99,
    discount: 0,
    category: "Home & Kitchen",
    image: "https://images.pexels.com/photos/6401669/pexels-photo-6401669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    images: [
      "https://images.pexels.com/photos/6401668/pexels-photo-6401668.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    rating: 4.7,
    reviewCount: 52,
    isNew: false,
    featured: true
  },
  {
    id: "prod-5",
    name: "Moisturizing Face Cream",
    description: "Hydrating face cream with natural ingredients for all skin types.",
    price: 29.99,
    discount: 15,
    category: "Beauty",
    image: "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    images: [
      "https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    rating: 4.4,
    reviewCount: 78,
    isNew: false,
    featured: true
  },
  {
    id: "prod-6",
    name: "Ergonomic Office Chair",
    description: "Comfortable office chair with lumbar support for long working hours.",
    price: 249.99,
    discount: 5,
    category: "Home & Kitchen",
    image: "https://images.pexels.com/photos/3771691/pexels-photo-3771691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    images: [
      "https://images.pexels.com/photos/3771691/pexels-photo-3771691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    rating: 4.6,
    reviewCount: 43,
    isNew: true,
    featured: false
  },
  {
    id: "prod-7",
    name: "Waterproof Hiking Boots",
    description: "Durable and waterproof hiking boots for all terrain adventures.",
    price: 129.99,
    discount: 0,
    category: "Fashion",
    image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    images: [
      "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    rating: 4.3,
    reviewCount: 61,
    isNew: false,
    featured: false
  },
  {
    id: "prod-8",
    name: "Stainless Steel Water Bottle",
    description: "Eco-friendly water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 34.99,
    discount: 0,
    category: "Home & Kitchen",
    image: "https://images.pexels.com/photos/4000090/pexels-photo-4000090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    images: [
      "https://images.pexels.com/photos/4000089/pexels-photo-4000089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    rating: 4.9,
    reviewCount: 94,
    isNew: false,
    featured: true
  }
];

// Simulate API calls with delay
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  await simulateDelay(800);
  return mockProducts;
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  await simulateDelay(800);
  return mockProducts.filter(product => product.featured);
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  await simulateDelay(500);
  return mockProducts.find(product => product.id === id);
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  await simulateDelay(800);
  return mockProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
};

// Get new arrivals
export const getNewArrivals = async (): Promise<Product[]> => {
  await simulateDelay(800);
  return mockProducts.filter(product => product.isNew);
};

// Get products on sale
export const getProductsOnSale = async (): Promise<Product[]> => {
  await simulateDelay(800);
  return mockProducts.filter(product => product.discount > 0);
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  await simulateDelay(1000);
  const lowercasedQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowercasedQuery) || 
    product.description.toLowerCase().includes(lowercasedQuery) ||
    product.category.toLowerCase().includes(lowercasedQuery)
  );
};

// Get personalized recommendations (simulated)
export const getPersonalizedRecommendations = async (userId: string): Promise<Product[]> => {
  await simulateDelay(1200);
  // In a real app, this would use user preferences and AI to return recommendations
  // For now, we'll just return random products
  const shuffled = [...mockProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
};