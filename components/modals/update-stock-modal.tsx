"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Package, TrendingDown, TrendingUp } from "lucide-react"

const stockUpdateSchema = z.object({
  stock: z.string().min(1, "Stock quantity is required").refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Stock must be a non-negative number",
  }),
  reason: z.string().optional(),
})

type StockUpdateFormValues = z.infer<typeof stockUpdateSchema>

type Product = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
}

interface UpdateStockModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
  onStockUpdated: (newStock: number) => void
}

export function UpdateStockModal({ open, onOpenChange, product, onStockUpdated }: UpdateStockModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<StockUpdateFormValues>({
    resolver: zodResolver(stockUpdateSchema),
    defaultValues: {
      stock: product.stock.toString(),
      reason: "",
    },
  })

  // Reset form when product changes
  useEffect(() => {
    if (product && open) {
      form.reset({
        stock: product.stock.toString(),
        reason: "",
      })
    }
  }, [product, open, form])

  const onSubmit = async (data: StockUpdateFormValues) => {
    setIsSubmitting(true)
    
    try {
      const newStock = parseInt(data.stock)
      await onStockUpdated(newStock)
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  const newStockValue = parseInt(form.watch("stock") || "0")
  const stockDifference = newStockValue - product.stock
  
  const getStockStatusIcon = (stock: number, minStock: number) => {
    if (stock === 0) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
    if (stock <= minStock) {
      return <TrendingDown className="h-4 w-4 text-yellow-500" />
    }
    return <TrendingUp className="h-4 w-4 text-green-500" />
  }

  const getStockChangeIndicator = () => {
    if (stockDifference > 0) {
      return (
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm">+{stockDifference} units</span>
        </div>
      )
    } else if (stockDifference < 0) {
      return (
        <div className="flex items-center space-x-2 text-red-600">
          <TrendingDown className="h-4 w-4" />
          <span className="text-sm">{stockDifference} units</span>
        </div>
      )
    }
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Package className="h-4 w-4" />
        <span className="text-sm">No change</span>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
          <DialogDescription>
            Update the stock quantity for this product.
          </DialogDescription>
        </DialogHeader>

        {/* Product Info */}
        <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
          <div className="flex items-center space-x-2">
            {getStockStatusIcon(product.stock, product.minStock)}
            <span className="text-sm">
              Current Stock: <span className="font-medium">{product.stock}</span>
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Minimum Stock: {product.minStock}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Stock Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter new stock quantity" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the total number of units currently in stock
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stock Change Preview */}
            {stockDifference !== 0 && (
              <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium">Stock Change Preview</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Change:</span>
                  {getStockChangeIndicator()}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Status:</span>
                  <div className="flex items-center space-x-2">
                    {getStockStatusIcon(newStockValue, product.minStock)}
                    <span className="text-sm">
                      {newStockValue === 0 
                        ? "Out of Stock" 
                        : newStockValue <= product.minStock 
                        ? "Low Stock" 
                        : "Available"
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Change (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Inventory count, Sale, Restock, Damage" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Optional note about why the stock is being updated
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Warnings */}
            {newStockValue === 0 && (
              <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <div className="text-sm text-red-700">
                  Setting stock to 0 will mark this product as "Out of Stock"
                </div>
              </div>
            )}

            {newStockValue > 0 && newStockValue <= product.minStock && (
              <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <TrendingDown className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  This stock level is at or below the minimum threshold ({product.minStock})
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Stock"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
