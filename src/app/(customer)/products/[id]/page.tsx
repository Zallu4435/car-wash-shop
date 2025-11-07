'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, ShoppingCart, Minus, Plus, Package, CheckCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CustomerRoutes } from '@/lib/constants/routes';
import { useProduct } from '@/api/domains/products/queries';
import { useAddToCart } from '@/api/domains/cart/queries';
import { useReviewsByProduct } from '@/api/domains/reviews/queries';
import { ReviewsList } from '@/components/customer/ReviewsList';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  // API calls
  const { data: product, isLoading: productLoading } = useProduct(id);
  const addToCartMutation = useAddToCart();
  const { data: reviews = [] } = useReviewsByProduct(id);
  
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Loading state
  if (productLoading) {
    return <Loading text="Loading product..." />;
  }

  // Product not found
  if (!product) {
    return (
      <Error 
        message="Product Not Found" 
        onRetry={() => router.push(CustomerRoutes.PRODUCTS)} 
        details="The product you're looking for doesn't exist." 
      />
    );
  }

  const handleAddToCart = () => {
    const pid = (product as any)?._id ?? product.id ?? id;
    addToCartMutation.mutate({
      type: 'product',
      itemId: pid,
      quantity: quantity,
    });
  };

  const handleBuyNow = () => {
    const pid = (product as any)?._id ?? product.id ?? id;
    addToCartMutation.mutate({
      type: 'product',
      itemId: pid,
      quantity: quantity,
    }, {
      onSuccess: () => {
        toast.success('Redirecting to checkout...');
        router.push(CustomerRoutes.CHECKOUT);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8">
          <Link href={CustomerRoutes.PRODUCTS}>
            <Button variant="ghost" className="mb-4 hover:bg-muted">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image + Description + Features */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Image */}
              <div className="relative h-[500px] bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden border-2 border-border">
                {product.image ? (
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-9xl mb-4">🧴</div>
                      <p className="text-muted-foreground">Product Image</p>
                    </div>
                  </div>
                )}
                {!product.isAvailable && (
                  <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white shadow-lg">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Description */}
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">Product Description</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">Key Features</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'High-quality materials and construction',
                      'Professional-grade performance',
                      'Easy to use and maintain',
                      'Long-lasting durability',
                      'Value for money',
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="p-1 bg-green-100 dark:bg-green-950/30 rounded-full mt-0.5">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-4">Specifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'Category', value: typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'N/A' },
                      { key: 'Brand', value: product.brand || 'Premium' },
                      { key: 'Availability', value: product.isAvailable ? 'In Stock' : 'Out of Stock' },
                      { key: 'Quality', value: 'Professional Grade' },
                    ].map(({ key, value }) => (
                      <div 
                        key={key} 
                        className="flex justify-between items-center p-3 bg-muted rounded-lg"
                      >
                        <span className="text-muted-foreground font-medium">{key}</span>
                        <span className="font-semibold text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Purchase Details (Sticky) */}
            <div className="lg:col-span-1">
              <Card className="border-2 sticky top-24">
                <CardContent className="p-6 space-y-6">
                  {/* Title & Category */}
                  <div>
                    <Badge variant="default" className="mb-3">
                      {typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'N/A'}
                    </Badge>
                    <h1 className="text-2xl font-bold text-foreground mb-3">{product.name}</h1>
                    
                    {/* Rating & Stock */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-foreground text-sm">4.5</span>
                        <span className="text-xs text-muted-foreground">(89)</span>
                      </div>
                      <Badge 
                        variant={product.isAvailable ? 'default' : 'error'}
                        className="px-2 py-1 text-xs"
                      >
                        {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Price */}
                  <div>
                    <p className="text-3xl font-bold text-primary mb-1">₹{product.price}</p>
                    <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
                  </div>

                  <Separator />

                  {/* Quantity Selector */}
                  <div>
                    <label className="font-semibold text-foreground mb-3 block text-sm">Quantity</label>
                    <div className="flex items-center gap-3 mb-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="flex-1 text-center font-bold text-xl text-foreground">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={!product.isAvailable}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Subtotal:</span>
                        <span className="text-xl font-bold text-primary">₹{product.price * quantity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <div className="space-y-3">
                    <Button 
                      size="lg" 
                      className="w-full h-12" 
                      onClick={handleAddToCart}
                      disabled={!product.isAvailable || addToCartMutation.isPending}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full h-12" 
                      onClick={handleBuyNow}
                      disabled={!product.isAvailable || addToCartMutation.isPending}
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Buy Now
                    </Button>
                  </div>

                  <Separator />

                  {/* Trust Badges */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <span className="text-2xl">🚚</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Free Delivery</p>
                        <p className="text-xs text-muted-foreground">On orders above ₹500</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <span className="text-2xl">🔄</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">7 Day Returns</p>
                        <p className="text-xs text-muted-foreground">Easy return policy</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">100% Genuine</p>
                        <p className="text-xs text-muted-foreground">Authentic products</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Customer Reviews Section - Full Width */}
          <div className="mt-8 lg:mt-12">
            <ReviewsList
              reviews={reviews}
              averageRating={averageRating}
              totalReviews={reviews.length}
              productName={product.name}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
