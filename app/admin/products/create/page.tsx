"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ArrowLeft, Package, Sparkles } from "lucide-react";
// Assuming AISuggestions is the refined component from the previous step
import { AISuggestions } from "@/components/ai/ai-suggestions"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { cn } from "@/lib/utils"; // Added cn import for general utility
import { VariantAISuggestions } from "@/components/ai/variant-ai-suggestions";

interface Category {
  _id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  brand: string;
  description: string;
  category_id: string | null;
  category_name: string;
  base_price: string;
  discount_price: string;
  main_image_url: string;
  gallery_images: string[];
  tags: string[];
  has_variants: boolean;
  variants: Array<{ name: string; price: string; stock: string }>;
  delivery_options: string[];
  features: Array<{ label: string; value: string }>;
  price: string;
  stock: string;
}

const defaultProductData: ProductFormData = {
  name: "",
  brand: "",
  description: "",
  category_id: null,
  category_name: "",
  base_price: "",
  discount_price: "",
  main_image_url: "",
  gallery_images: [],
  tags: [],
  has_variants: false,
  variants: [],
  delivery_options: [],
  features: [{ label: "", value: "" }],
  price: "",
  stock: "",
};

const MAX_GALLERY_IMAGES = 4;
const AVAILABLE_TAGS = ["New", "Hot", "Trending", "Discount"];
const DELIVERY_OPTIONS = ["Free Delivery", "Cash on Delivery", "7-Day Return"];

export default function CreateProductPage() {
  const user = useAppSelector((state) => state.auth?.user);
  const router = useRouter();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: defaultProductData,
  });

  const hasVariants = watch("has_variants");
  const selectedTags = watch("tags") || [];
  const selectedDeliveryOptions = watch("delivery_options") || [];
  const selectedCategoryId = watch("category_id");

  // Field Arrays
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({ control, name: "features" });

  const {
    fields: galleryFields,
    append: appendGallery,
    remove: removeGallery,
  } = useFieldArray({ control, name: "gallery_images" });

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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category/categories");
        setCategories(response.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      }
    };
    fetchCategories();
  }, [toast]);

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId);
    if (category) {
      setValue("category_id", category._id);
      setValue("category_name", category.name);
    }
  };

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setValue("tags", newTags, { shouldValidate: true });
  };

  // Handle delivery option toggle
  const toggleDeliveryOption = (option: string) => {
    const newOptions = selectedDeliveryOptions.includes(option)
      ? selectedDeliveryOptions.filter((o) => o !== option)
      : [...selectedDeliveryOptions, option];
    setValue("delivery_options", newOptions);
  };

  // Handle gallery image management
  const handleAddGalleryImage = () => {
    if (galleryFields.length < MAX_GALLERY_IMAGES) {
      // Append an empty string for a new URL field
      appendGallery(""); 
    } else {
      toast({
        title: "Limit Reached",
        description: `You can only add a maximum of ${MAX_GALLERY_IMAGES} gallery images.`,
        variant: "destructive",
      });
    }
  };

  // Form submission
  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);

      // Sanitize data
      const sanitizedData = { ...data };
      ["base_price", "discount_price"].forEach((field) => {
        if (sanitizedData[field as keyof ProductFormData] === "") {
          (sanitizedData as any)[field] = null;
        }
      });

      const dataToSend: any = {
        ...sanitizedData,
        category: sanitizedData.category_id,
        // Ensure description is a string, not an array
        description: Array.isArray(sanitizedData.description)
          ? sanitizedData.description[0]
          : sanitizedData.description,
        gallery_images: sanitizedData.gallery_images.filter(
          (img: string | null): img is string => img !== null
        ),
      };

      delete dataToSend.category_name;
      // Handle variants/simple product logic
      if (dataToSend.has_variants) {
        delete dataToSend.price;
        delete dataToSend.stock;
        dataToSend.variants = dataToSend.variants || [];
      } else {
        delete dataToSend.variants;
      }

      console.log("Submitting Product Data:", JSON.stringify(dataToSend, null, 2));

      const response = await api.post("/products/create", dataToSend);

      if (response.status === 201 || response.status === 200) {
        toast({
          title: "Success 🎉",
          description: "Product has been created successfully!",
        });
        reset(defaultProductData);
        router.push("/admin/products");
      }
    } catch (error: any) {
      console.error("API Request Error:", error.response?.data || error.message);

      let errorMessage = "An unexpected error occurred while saving the product.";
      if (error.response?.data?.detail) {
        // Assuming your backend sends detailed errors
        errorMessage = JSON.stringify(error.response.data.detail);
      }

      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.email !== "muhammadrizwaneng@gmail.com") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/products")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Create New Product
          </h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details to add a new product to your store
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Product name, brand, and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* 🎯 Product Name: USING AISuggestions Component 🎯 */}
            <div className="space-y-2">
              <Controller
                control={control}
                name="name"
                rules={{ required: "Product Name is required." }}
                render={({ field }) => (
                  <AISuggestions
                    // 1. Pass RHF's value to the component
                    value={field.value}
                    // 2. Use onSuggestion to update RHF's state (field.onChange)
                    onSuggestion={field.onChange} 
                    
                    // 3. Props for UI and logic
                    // label="Product Name"
                    placeholder="Enter product name or generate suggestions"
                    prompt={`Generate a creative product name for: ${watch('description') || 'a new product'}`}
                    buttonText="Suggest Name" 
                    className={errors.name ? "border-destructive" : ""}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            {/* ------------------------------------------------------------- */}


            {/* Brand (Reverted to standard Input for simplicity, remove redundant AISuggestions wrapper) */}
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Controller
                control={control}
                name="brand"
                render={({ field }) => (
                  <Input 
                    {...field} 
                    id="brand" 
                    placeholder="e.g., Acer Predator" 
                    className="mt-1"
                  />
                )}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="category_id"
                rules={{ required: "Category selection is required." }}
                render={({ field }) => (
                  <Select
                    onValueChange={handleCategoryChange}
                    value={field.value || undefined}
                  >
                    <SelectTrigger
                      className={errors.category_id ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category_id && (
                <p className="text-sm text-destructive">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                {/* Keeping the simple AI button for Textarea/Description since it doesn't need a dropdown */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!watch('name') || !watch('brand') || !watch('category_name')}
                  onClick={async () => {
                     try {
                        const productName = watch('name') || 'a product';
                        const brandName = watch('brand') ? `from ${watch('brand')}` : '';
                        const categoryName = watch('category_name') ? `in the ${watch('category_name')} category` : '';
                        
                        const prompt = `Generate a detailed product description for: ${productName} ${brandName} ${categoryName}.
                        Include key features, specifications, and benefits.`;
                        
                        const response = await api.post('/ai/generate-product-names', { 
                          prompt: prompt,
                          mode: 'description'
                        });
                        // Ensure we get a string, not an array
                        const description = Array.isArray(response.data.results) 
                          ? response.data.results[0] 
                          : (response.data.results || response.data.suggestion || '');
                        setValue('description', description, { shouldValidate: true });
                      } catch (e) {
                         toast({ 
                           title: "Error", 
                           description: "Failed to generate description. Please try again.", 
                           variant: "destructive" 
                         });
                      }
                  }}
                  className="text-xs text-primary hover:text-primary/80 p-0 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Generate Description
                </Button>
              </div>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Detailed product features..."
                    rows={4}
                    className="mt-1"
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>
              Tags <span className="text-destructive">*</span>
            </CardTitle>
            <CardDescription>Select product tags</CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="tags"
              rules={{
                validate: (value) =>
                  value.length > 0 || "At least one tag must be selected.",
              }}
              render={() => (
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            />
            {errors.tags && (
              <p className="text-sm text-destructive mt-2">{errors.tags.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Stock/Variants Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
            <CardDescription>
              Toggle if this product has multiple variants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="has_variants"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="has_variants"
                    className="
                      transition-colors duration-300
                      data-[state=checked]:bg-primary 
                      data-[state=unchecked]:bg-gray-500
                    "
                  />
                  <Label htmlFor="has_variants">Has Variants?</Label>
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* Variants or Simple Product */}
        {hasVariants ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Variants <span className="text-destructive">*</span>
                  </CardTitle>
                  <CardDescription>Add product variants</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendVariant({ name: "", price: "", stock: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Controller
                control={control}
                name="variants"
                rules={{
                  validate: (value) =>
                    value.length > 0 || "At least one variant is required.",
                }}
                render={() => null}
              />
              {errors.variants?.message && (
                <p className="text-sm text-destructive">{errors.variants.message}</p>
              )}

           {variantFields.map((item, index) => (
                // Use a 12-column grid layout for the row
                <div key={item.id} className="grid grid-cols-12 gap-4 items-start">
                  
                  {/* Variant Name Input (col-span-5) - This field determines the baseline */}
                  <div className="col-span-5">
                  <VariantAISuggestions
                      value={watch(`variants.${index}.name`) || ''}
                      onSuggestion={(suggestion) => {
                        setValue(`variants.${index}.name`, suggestion, { shouldValidate: true });
                      }}
                      label={`Variant ${index + 1}`}
                      variantType="name" // or any other type like 'color', 'size', etc.
                      productName={watch('name')}
                      brandName={watch('brand')}
                      categoryName={watch('category_name')}
                      placeholder="Variant Name"
                    />
                    {errors.variants?.[index]?.name && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.variants[index]?.name?.message}
                      </p>
                    )}
                    {/* ... (error message) ... */}
                  </div>

                  {/* Price Input (col-span-3) - ADDING pt-7 FOR ALIGNMENT */}
                  <div className="col-span-3 pt-7"> 
                    <div className="flex flex-col">
                      {/* Removed the label, relying on placeholder or leaving it if necessary */}
                      <Controller
                        control={control}
                        name={`variants.${index}.price`}
                        rules={{
                          required: "Required",
                          pattern: {
                            value: /^\d+(\.\d{1,2})?$/,
                            message: "Invalid",
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="Price" // Using placeholder as the visible label
                            className={cn("h-9", errors.variants?.[index]?.price && "border-destructive")}
                          />
                        )}
                      />
                      {errors.variants?.[index]?.price && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.variants[index]?.price?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stock Input (col-span-3) - ADDING pt-7 FOR ALIGNMENT */}
                  <div className="col-span-3 pt-7">
                    <div className="flex flex-col">
                      {/* Removed the label, relying on placeholder or leaving it if necessary */}
                      <Controller
                        control={control}
                        name={`variants.${index}.stock`}
                        rules={{
                          required: "Required",
                          pattern: {
                            value: /^\d+$/,
                            message: "Invalid",
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            placeholder="Stock" // Using placeholder as the visible label
                            className={cn("h-9", errors.variants?.[index]?.stock && "border-destructive")}
                          />
                        )}
                      />
                      {errors.variants?.[index]?.stock && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.variants[index]?.stock?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delete Button (col-span-1) - Adjusting alignment to the bottom */}
                  <div className="col-span-1 flex items-end h-full pb-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(index)}
                      className="text-destructive hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Stock</CardTitle>
              <CardDescription>Set product price and stock quantity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Product Price <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="price"
                  rules={{
                    required: "Price is required.",
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Must be a valid price.",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="Enter product price"
                      className={errors.price ? "border-destructive" : ""}
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">
                  Stock Quantity <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="stock"
                  rules={{
                    required: "Stock is required.",
                    pattern: {
                      value: /^\d+$/,
                      message: "Must be a whole number.",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter stock quantity"
                      className={errors.stock ? "border-destructive" : ""}
                    />
                  )}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive">{errors.stock.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delivery Options */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Options</CardTitle>
            <CardDescription>Select available delivery options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {DELIVERY_OPTIONS.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={option}
                    checked={selectedDeliveryOptions.includes(option)}
                    onChange={() => toggleDeliveryOption(option)}
                    className="rounded"
                  />
                  <Label htmlFor={option} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  Key Features <span className="text-destructive">*</span>
                </CardTitle>
                <CardDescription>Add product features</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendFeature({ label: "", value: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Controller
              control={control}
              name="features"
              rules={{
                validate: (value) =>
                  value.length > 0 || "At least one feature is required.",
              }}
              render={() => null}
            />
            {errors.features?.message && (
              <p className="text-sm text-destructive">{errors.features.message}</p>
            )}

            {featureFields.map((item, index) => (
              <div key={item.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <Controller
                    control={control}
                    name={`features.${index}.label`}
                    rules={{ required: "Label is required." }}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        placeholder="Label (e.g., RAM)" 
                        className={errors.features?.[index]?.label ? "border-destructive" : ""}
                      />
                    )}
                  />
                  {errors.features?.[index]?.label && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.features[index]?.label?.message}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <Controller
                    control={control}
                    name={`features.${index}.value`}
                    rules={{ required: "Value is required." }}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        placeholder="Value (e.g., 32GB DDR5)" 
                        className={errors.features?.[index]?.value ? "border-destructive" : ""}
                      />
                    )}
                  />
                  {errors.features?.[index]?.value && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.features[index]?.value?.message}
                    </p>
                  )}
                </div>

                {featureFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Images</CardTitle>
                <CardDescription>
                  Add product images ({galleryFields.length} / {MAX_GALLERY_IMAGES}{" "}
                  gallery images)
                </CardDescription>
              </div>
              {galleryFields.length < MAX_GALLERY_IMAGES && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddGalleryImage}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gallery Image
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Image */}
            <div className="space-y-2">
              <Label htmlFor="main_image_url">
                Main Image URL <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="main_image_url"
                rules={{ required: "Main Image URL is required." }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="main_image_url"
                    placeholder="https://main-image.url/photo.jpg"
                    className={errors.main_image_url ? "border-destructive" : ""}
                  />
                )}
              />
              {errors.main_image_url && (
                <p className="text-sm text-destructive">
                  {errors.main_image_url.message}
                </p>
              )}
            </div>

            {/* Gallery Images */}
            {galleryFields.map((item, index) => (
              <div key={item.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <Controller
                    control={control}
                    name={`gallery_images.${index}`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={`Gallery Image ${index + 1} URL (Optional)`}
                      />
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeGallery(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}