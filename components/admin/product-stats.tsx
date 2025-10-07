"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingDown, DollarSign } from "lucide-react";

interface Variant {
  stock: number;
  discount_percent?: number;
}

interface Product {
  _id: string;
  stock?: number;
  discount_percent?: number;
  has_variants?: boolean;
  variants?: Variant[];
}

interface ProductStatsProps {
  products: Product[];
}

export function ProductStats({ products }: ProductStatsProps) {
  const totalProducts = products.length;

  const activeDiscounts = products.filter((p) => {
    if (p.has_variants && p.variants) {
      return p.variants.some((v) => v.discount_percent && v.discount_percent > 0);
    }
    return p.discount_percent && p.discount_percent > 0;
  }).length;

  const lowStockItems = products.filter((p) => {
    if (p.has_variants && p.variants) {
      return p.variants.some((v) => v.stock < 10);
    }
    return p.stock && p.stock < 10;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeDiscounts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockItems}</div>
        </CardContent>
      </Card>
    </div>
  );
}
