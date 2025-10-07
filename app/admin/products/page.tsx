"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Percent, 
  Search,
  Package,
  DollarSign,
  TrendingDown
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";

interface Variant {
  _id: string;
  price: number;
  discountprice?: number;
  size?: string;
  color?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  image: string;
  stock: number;
  has_variants?: boolean;
  variants?: Variant[];
}

export default function AdminProductsPage() {
  const user = useAppSelector((state) => state.auth?.user);
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });
  const [discountValue, setDiscountValue] = useState("");

  // Check if user is admin
  useEffect(() => {
    if (!user || user.email !== "muhammadrizwaneng@gmail.com") {
      router.push("/");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [user, router, toast]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await api.get('/products/getAllProducts');
      setProducts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      await api.post('/products', productData);
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      
      setIsAddDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Failed to add product:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      await api.put(`/products/${selectedProduct._id}`, productData);
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      
      setIsEditDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleAddDiscount = async () => {
    if (!selectedProduct) return;

    try {
      const discount = parseFloat(discountValue);
      let updateData: any = { discount };

      // Handle products without variants
      if (!selectedProduct.has_variants) {
        const originalPrice = selectedProduct.price;
        const discountPrice = originalPrice * (1 - discount / 100);
        updateData.discount_price = discountPrice;
      } 
      // Handle products with variants
      else if (selectedProduct.variants && selectedProduct.variants.length > 0) {
        updateData.variants = selectedProduct.variants.map(variant => ({
          ...variant,
          discountprice: variant.price * (1 - discount / 100),
        }));
      }

      await api.put(`/products/${selectedProduct._id}`, updateData);
      
      toast({
        title: "Success",
        description: `${discount}% discount applied successfully`,
      });
      
      setIsDiscountDialogOpen(false);
      setDiscountValue("");
      fetchProducts();
    } catch (error) {
      console.error("Failed to add discount:", error);
      toast({
        title: "Error",
        description: "Failed to add discount",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await api.delete(`/products/${selectedProduct._id}`);
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const openDiscountDialog = (product: Product) => {
    setSelectedProduct(product);
    setDiscountValue(product.discount?.toString() || "");
    setIsDiscountDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
    });
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user || user.email !== "muhammadrizwaneng@gmail.com") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Product Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your store's products, pricing, and inventory
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.discount && p.discount > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.stock < 10).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            View and manage all products in your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No products found
            </div>
          ) : (
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
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.main_image_url || "/placeholder.png"}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        {/* Product without variants */}
                        {!product.has_variants && product.discount_price != null ? (
                          <>
                            <span className="font-medium">${product.discount_price.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          </>
                        ) : !product.has_variants ? (
                          <span className="font-medium">${product.price.toFixed(2)}</span>
                        ) : null}
                        
                        {/* Product with variants */}
                        {product.has_variants && product.variants && product.variants[0]?.discountprice != null ? (
                          <>
                            <span className="font-medium">${product.variants[0].discountprice.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.variants[0].price.toFixed(2)}
                            </span>
                          </>
                        ) : product.has_variants && product.variants ? (
                          <span className="font-medium">${product.variants[0].price.toFixed(2)}</span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock < 10 ? "destructive" : "secondary"}>
                        {product.stock} units
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {((product?.has_variants && product?.variants[0]?.discount_percent != null)|| (product?.discount_percent)) ? (
                        <Badge variant="default">{((product?.has_variants &&product?.variants[0]?.discount_percent) || (product?.discount_percent) )}% OFF</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDiscountDialog(product)}
                        >
                          <Percent className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(product)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your store
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Electronics, Clothing"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Discount Dialog */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Discount</DialogTitle>
            <DialogDescription>
              Set a discount percentage for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="discount">Discount Percentage</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder="e.g., 20"
              />
              {selectedProduct && discountValue && (
                <div className="text-sm text-muted-foreground space-y-1">
                  {!selectedProduct.has_variants ? (
                    <p>
                      New price: ${(selectedProduct.price * (1 - parseFloat(discountValue) / 100)).toFixed(2)}
                      {" "}(was ${selectedProduct.price.toFixed(2)})
                    </p>
                  ) : selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                    <div>
                      <p className="font-medium mb-1">Variant prices after discount:</p>
                      {selectedProduct.variants.map((variant, idx) => (
                        <p key={idx}>
                          {variant.size && `Size ${variant.size}`}{variant.color && ` - ${variant.color}`}: 
                          ${(variant.price * (1 - parseFloat(discountValue) / 100)).toFixed(2)}
                          {" "}(was ${variant.price.toFixed(2)})
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDiscountDialogOpen(false); setDiscountValue(""); }}>
              Cancel
            </Button>
            <Button onClick={handleAddDiscount}>Apply Discount</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteDialogOpen(false); setSelectedProduct(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
