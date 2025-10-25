import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    active?: boolean;
    order?: number;
  };
  description: string;
  price: number;
  stock: number;
  rating: number;
  reviewCount: number;
  images?: string[];
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 h-full overflow-hidden">
      <Link href={`/products/${product.id}`}>
        {/* Image Container */}
        <div className="relative h-64 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl group-hover:scale-110 transition-transform duration-300 filter group-hover:drop-shadow-lg">🧴</span>
          </div>
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Category Badge */}
          {product.category?.name && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="shadow-lg font-semibold">
                {product.category.name}
              </Badge>
            </div>
          )}

          {/* Stock Badge */}
          {product.stock <= 10 && product.stock > 0 && (
            <div className="absolute bottom-4 left-4">
              <Badge variant="warning" className="font-semibold">
                Only {product.stock} left
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-6 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`}>
          {/* Title */}
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-5 pb-5 border-b border-border">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-foreground">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>
        </Link>

        {/* Price & Add to Cart */}
        <div className="mt-auto">
          <div className="flex items-baseline justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">Price</span>
              <span className="text-2xl font-bold text-foreground">₹{product.price}</span>
            </div>
            <Badge 
              variant={product.stock > 0 ? "success" : "error"}
              className="font-semibold"
            >
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
          <Button 
            className="w-full group/btn shadow-md" 
            size="default" 
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
