import Link from 'next/link';
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
    <div className="group relative bg-slate-100 rounded-2xl border border-border/40 hover:border-border transition-all duration-300 overflow-hidden flex flex-col h-full">
      <Link href={`/products/${product._id}`} className="flex-1 flex flex-col">
        {/* Image Section - Clean & Airy */}
        <div className="relative aspect-square p-6 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          ) : (
            <span className="text-6xl text-muted-foreground/50">🧴</span>
          )}

          {/* Minimalist Floating Badges - Removed Category */}

          {(product.stock ?? 0) <= 0 && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-1 gap-3">
          <div className="space-y-1">
            <h3 className="font-medium text-base text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {/* Rating - Subtle */}
            {(product.rating !== undefined) && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground font-medium">{product.rating}</span>
                <span className="text-[10px] text-muted-foreground/60">({product.reviewCount})</span>
              </div>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-foreground">₹{product.price}</span>
                {product.comparePrice != null && (
                  <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                    ₹{product.comparePrice}
                  </span>
                )}
              </div>
            </div>

            <Button
              size="icon"
              className="rounded-full w-10 h-10 shadow-sm hover:shadow-md transition-all duration-300 shrink-0"
              disabled={(product.stock ?? 0) === 0 || addToCartMutation.isPending}
              onClick={handleAddToCart}
            >
              {addToCartMutation.isPending ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              <span className="sr-only">Add to Cart</span>
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
