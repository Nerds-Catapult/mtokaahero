"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
    Calendar,
    DollarSign,
    Heart,
    Package,
    Shield,
    ShoppingCart,
    Star,
    Tag
} from "lucide-react"

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  barcode?: string;
  images: string[];
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  category: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  year?: number;
  partNumber?: string;
  compatibility: string[];
  stock: number;
  minStock: number;
  weight?: number;
  dimensions?: any;
  warranty?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  business: {
    name: string;
    type: string;
  };
  _count: {
    orderItems: number;
    reviews: number;
    favorites: number;
  };
};

interface ProductDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

export function ProductDetailsModal({ open, onOpenChange, product }: ProductDetailsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'default';
      case 'OUT_OF_STOCK':
        return 'destructive';
      case 'DISCONTINUED':
        return 'secondary';
      default:
        return 'default';
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Product Details</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-muted-foreground mt-1">{product.description}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant={getStatusColor(product.status) as any}>
                {product.status.replace('_', ' ')}
              </Badge>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <Badge variant="outline">On Sale</Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Pricing</span>
            </h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-muted-foreground line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Identification */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Product Identification</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">SKU:</span>
                <span className="ml-2 font-mono">{product.sku}</span>
              </div>
              {product.barcode && (
                <div>
                  <span className="text-muted-foreground">Barcode:</span>
                  <span className="ml-2 font-mono">{product.barcode}</span>
                </div>
              )}
              {product.partNumber && (
                <div>
                  <span className="text-muted-foreground">Part Number:</span>
                  <span className="ml-2">{product.partNumber}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Product Details */}
          <div className="space-y-2">
            <h4 className="font-medium">Product Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category:</span>
                <span className="ml-2">{product.category}</span>
              </div>
              {product.subcategory && (
                <div>
                  <span className="text-muted-foreground">Subcategory:</span>
                  <span className="ml-2">{product.subcategory}</span>
                </div>
              )}
              {product.brand && (
                <div>
                  <span className="text-muted-foreground">Brand:</span>
                  <span className="ml-2">{product.brand}</span>
                </div>
              )}
              {product.model && (
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <span className="ml-2">{product.model}</span>
                </div>
              )}
              {product.year && (
                <div>
                  <span className="text-muted-foreground">Year:</span>
                  <span className="ml-2">{product.year}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Inventory */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Inventory</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Stock:</span>
                <span className="ml-2 font-semibold">{product.stock}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Minimum Stock:</span>
                <span className="ml-2">{product.minStock}</span>
              </div>
              {product.weight && (
                <div>
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="ml-2">{product.weight} kg</span>
                </div>
              )}
            </div>
          </div>

          {/* Warranty */}
          {product.warranty && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Warranty</span>
                </h4>
                <p className="text-sm">{product.warranty}</p>
              </div>
            </>
          )}

          {/* Compatibility */}
          {product.compatibility.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Compatibility</h4>
                <div className="flex flex-wrap gap-1">
                  {product.compatibility.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Statistics */}
          <div className="space-y-2">
            <h4 className="font-medium">Statistics</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{product._count.orderItems}</div>
                  <div className="text-muted-foreground">Orders</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{product._count.reviews}</div>
                  <div className="text-muted-foreground">Reviews</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{product._count.favorites}</div>
                  <div className="text-muted-foreground">Favorites</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Dates</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">{formatDate(product.createdAt)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Updated:</span>
                <span className="ml-2">{formatDate(product.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
