"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { updateProduct } from "@/lib/actions/productActions"
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(10, "Please provide a more detailed description"),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Price must be a positive number",
  }),
  compareAtPrice: z.string().optional().refine((val) => {
    if (!val) return true;
    return !isNaN(parseFloat(val)) && parseFloat(val) > 0;
  }, {
    message: "Compare at price must be a positive number",
  }),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  status: z.enum(['AVAILABLE', 'OUT_OF_STOCK', 'DISCONTINUED']),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional().refine((val) => {
    if (!val) return true;
    const year = parseInt(val);
    return !isNaN(year) && year > 1900 && year <= new Date().getFullYear() + 5;
  }, {
    message: "Please enter a valid year",
  }),
  partNumber: z.string().optional(),
  stock: z.string().min(1, "Stock quantity is required").refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Stock must be a non-negative number",
  }),
  minStock: z.string().optional().refine((val) => {
    if (!val) return true;
    return !isNaN(parseInt(val)) && parseInt(val) >= 0;
  }, {
    message: "Min stock must be a non-negative number",
  }),
  weight: z.string().optional().refine((val) => {
    if (!val) return true;
    return !isNaN(parseFloat(val)) && parseFloat(val) > 0;
  }, {
    message: "Weight must be a positive number",
  }),
  warranty: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

const categories = [
  "Engine Parts",
  "Brake System",
  "Transmission",
  "Suspension",
  "Electrical",
  "Body Parts",
  "Interior",
  "Wheels & Tires",
  "Fluids & Lubricants",
  "Filters",
  "Belts & Hoses",
  "Batteries",
  "Lighting",
  "Exhaust System",
  "Cooling System",
  "Tools & Equipment",
  "Other"
]

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  barcode?: string;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  category: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  year?: number;
  partNumber?: string;
  stock: number;
  minStock: number;
  weight?: number;
  warranty?: string;
}

interface EditProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
  businessId: string
  onProductUpdated: () => void
}

export function EditProductModal({ open, onOpenChange, product, businessId, onProductUpdated }: EditProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      compareAtPrice: "",
      sku: "",
      barcode: "",
      status: "AVAILABLE",
      category: "",
      subcategory: "",
      brand: "",
      model: "",
      year: "",
      partNumber: "",
      stock: "",
      minStock: "",
      weight: "",
      warranty: "",
    },
  })

  // Update form when product changes
  useEffect(() => {
    if (product && open) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        compareAtPrice: product.compareAtPrice?.toString() || "",
        sku: product.sku,
        barcode: product.barcode || "",
        status: product.status,
        category: product.category,
        subcategory: product.subcategory || "",
        brand: product.brand || "",
        model: product.model || "",
        year: product.year?.toString() || "",
        partNumber: product.partNumber || "",
        stock: product.stock.toString(),
        minStock: product.minStock.toString(),
        weight: product.weight?.toString() || "",
        warranty: product.warranty || "",
      })
    }
  }, [product, open, form])

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)
    
    try {
      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : undefined,
        sku: data.sku,
        barcode: data.barcode,
        status: data.status as 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED',
        category: data.category,
        subcategory: data.subcategory,
        brand: data.brand,
        model: data.model,
        year: data.year ? parseInt(data.year) : undefined,
        partNumber: data.partNumber,
        stock: parseInt(data.stock),
        minStock: data.minStock ? parseInt(data.minStock) : 0,
        weight: data.weight ? parseFloat(data.weight) : undefined,
        warranty: data.warranty,
      }
      
      const response = await updateProduct(product.id, businessId, productData)
      
      if (response.success) {
        toast.success("Product updated successfully.")
        onProductUpdated()
        onOpenChange(false)
      } else {
        toast.error(response.error?.message || "Failed to update product.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update your product information and inventory details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Product SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                        <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed product description"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="compareAtPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare at Price (optional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Subcategory" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Brand" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="partNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Part Number (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Manufacturer part number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Product barcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Alert when stock falls below this level
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="warranty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 12 months manufacturer warranty" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
