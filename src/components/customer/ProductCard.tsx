import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddToCart } from '@/api/domains/cart/queries';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCartMutation = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCartMutation.mutate({
      type: 'product',
      itemId: product._id,
      quantity: 1,
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full overflow-hidden">
      <Link href={`/products/${product._id}`}>
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {product.image ? (
    <img 
      src={product.image}
      alt={product.name}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
    />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-5xl sm:text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300">
        🧴
      </span>
    </div>
  )}
          
          {/* Category Badge */}
          {(() => {
            const categoryName = typeof product.category === 'string' 
              ? product.category 
              : (product.category as any)?.name || (product as any).category?.name;
            return categoryName ? (
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="text-xs font-semibold shadow-md">
                  {categoryName}
                </Badge>
              </div>
            ) : null;
          })()}

          {/* Stock Badge */}
          {product.stock !== undefined && product.stock <= 10 && product.stock > 0 && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="warning" className="text-xs font-semibold shadow-md">
                Only {product.stock} left
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
        <Link href={`/products/${product._id}`}>
          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors min-h-[2.5rem] sm:min-h-[3rem] leading-tight">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          {(product.rating !== undefined || product.reviewCount !== undefined) && (
            <div className="flex items-center gap-1.5 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-border">
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
              <span className="text-xs sm:text-sm font-semibold text-foreground">{product.rating ?? 0}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount ?? 0})</span>
            </div>
          )}
        </Link>

        {/* Price & Add to Cart */}
        <div className="mt-auto">
          <div className="flex items-baseline justify-between mb-3 sm:mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-0.5">Price</span>
              <span className="text-xl sm:text-2xl font-bold text-foreground">₹{product.price}</span>
            </div>
            <Badge 
              variant={(product.stock ?? 0) > 0 ? "success" : "error"}
              className="text-xs font-semibold"
            >
              {(product.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
          <Button 
            className="w-full group/btn h-9 sm:h-10 border-2 border-primary/20" 
            size="sm"
            disabled={(product.stock ?? 0) === 0 || addToCartMutation.isPending}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm">
              {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
