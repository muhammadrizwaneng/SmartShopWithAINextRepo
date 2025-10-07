import ProductClient from './product-client';

// This function tells Next.js which paths to pre-render at build time
export async function generateStaticParams() {
  // Return an empty array to opt-out of static generation
  // This will make the page render at request time
  return [];
}

// Opt out of static generation for this route
export const dynamic = 'force-dynamic';

export default function ProductDetailPage() {
  return <ProductClient />;
}
