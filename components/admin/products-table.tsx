"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Percent } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface ProductsTableProps {
  products: ProductRow[];
  loading: boolean;
  onEdit: (product: ProductRow) => void;
  onDelete: (product: ProductRow) => void;
  onDiscount: (product: ProductRow) => void;
}

export function ProductsTable({
  products,
  loading,
  onEdit,
  onDelete,
  onDiscount,
}: ProductsTableProps) {
  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No products found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, idx) => (
          <TableRow key={`${product._id}-${product.variantIndex ?? 'main'}-${idx}`}>
            <TableCell>
              <div className="flex items-center gap-3">
                <img
                  src={product.main_image_url || "/placeholder.png"}
                  alt={product.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <div className="font-medium">
                    {product.name}
                    {product.currentVariant && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({product.currentVariant.name})
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate max-w-xs">
                    {product.description}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{product.category_name}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                {product.currentVariant ? (
                  <>
                    {product.currentVariant.discountprice != null ? (
                      <>
                        <span className="font-medium">
                          ${product.currentVariant.discountprice.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.currentVariant.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium">
                        ${product.currentVariant.price.toFixed(2)}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {product.discount_price != null ? (
                      <>
                        <span className="font-medium">
                          ${product.discount_price.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.price?.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium">
                        ${product.price?.toFixed(2)}
                      </span>
                    )}
                  </>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  (product.currentVariant?.stock || product.stock || 0) < 10
                    ? "destructive"
                    : "secondary"
                }
              >
                {product.currentVariant?.stock || product.stock || 0} units
              </Badge>
            </TableCell>
            <TableCell>
              {product.currentVariant ? (
                product.currentVariant.discount_percent != null ? (
                  <Badge variant="default">
                    {product.currentVariant.discount_percent}% OFF
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )
              ) : product.discount_percent != null ? (
                <Badge variant="default">{product.discount_percent}% OFF</Badge>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDiscount(product)}
                >
                  <Percent className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(product)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
