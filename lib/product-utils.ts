interface Variant {
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
  description: string;
  price?: number;
  discount_price?: number;
  discount_percent?: number;
  category_name: string;
  main_image_url: string;
  stock?: number;
  has_variants?: boolean;
  variants?: Variant[];
}

interface ProductRow extends Product {
  currentVariant?: Variant;
  variantIndex?: number;
}

/**
 * Flattens products with variants into separate rows
 * Products with variants will have one row per variant
 * Products without variants will have a single row
 */
export function flattenProducts(products: Product[]): ProductRow[] {
  const flattened: ProductRow[] = [];

  products.forEach((product) => {
    if (product.has_variants && product.variants && product.variants.length > 0) {
      console.log(
        `Product "${product.name}" has ${product.variants.length} variants:`,
        product.variants
      );
      // Create a row for each variant
      product.variants.forEach((variant, index) => {
        flattened.push({
          ...product,
          currentVariant: variant,
          variantIndex: index,
        });
      });
    } else {
      // Product without variants - add as single row
      flattened.push(product);
    }
  });

  console.log(
    `Total rows after flattening: ${flattened.length} (from ${products.length} products)`
  );
  return flattened;
}

/**
 * Filters products by search query (name or category)
 */
export function filterProducts(
  products: ProductRow[],
  searchQuery: string
): ProductRow[] {
  if (!searchQuery.trim()) return products;

  const query = searchQuery.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.category_name.toLowerCase().includes(query)
  );
}
