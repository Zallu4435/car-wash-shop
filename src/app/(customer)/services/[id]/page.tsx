'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Star, Clock, ArrowLeft, Sparkles, ShieldCheck, 
  Timer, Info, CarFront 
} from 'lucide-react';

import { CustomerRoutes } from '@/lib/constants/routes';
import { useService } from '@/api/domains/services/queries';
import { useReviewsByService } from '@/api/domains/reviews/queries';
import { ReviewsList } from '@/components/customer/ReviewsList';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils/cn';

// Define this centrally or import it. DO NOT hardcode it inside JSX while importing it for logic.
const AVAILABLE_ADDONS = [
  {
    id: 'addon_wax',
    name: 'Wax Coating',
    description: 'Protective wax layer for long-lasting shine',
    price: 150,
    duration: 15,
  },
  {
    id: 'addon_polish',
    name: 'Polish',
    description: 'Deep polish to remove minor scratches',
    price: 200,
    duration: 20,
  },
  {
    id: 'addon_engine',
    name: 'Engine Bay Cleaning',
    description: 'Professional engine compartment cleaning',
    price: 250,
    duration: 20,
  },
];

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const { data: service, isLoading: serviceLoading } = useService(id);
  const { data: reviews = [] } = useReviewsByService(id);
  
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const vehiclePricing = useMemo(() => (
    Array.isArray(service?.pricing) ? service?.pricing ?? [] : []
  ), [service?.pricing]);

  // Safe calculation for base price (lowest available)
  const basePriceStart = useMemo(() => {
    if (!vehiclePricing.length) return 0;
    return Math.min(...vehiclePricing.map((p: any) => Number(p.price) || 0));
  }, [vehiclePricing]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }, [reviews]);

  // Loading state
  if (serviceLoading) return <Loading text="Fetching service details..." />;

  // Error state
  if (!service) {
    return (
      <Error 
        message="Service Not Found" 
        onRetry={() => router.push(CustomerRoutes.SERVICES)} 
        details="We couldn't locate the service details." 
      />
    );
  }

  const calculateDuration = () => {
    const addOnsDuration = selectedAddOns.reduce((sum, addonId) => {
      const addon = AVAILABLE_ADDONS.find((a) => a.id === addonId);
      return sum + (addon?.duration || 0);
    }, 0);
    return (service.duration || 30) + addOnsDuration;
  };

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-12">
      <div className="container-custom max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {/* Navigation */}
        <nav className="mb-6">
          <Link 
            href={CustomerRoutes.SERVICES} 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Hero Section */}
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-muted shadow-sm">
                {service.imageUrl ? (
                  <img 
                    src={service.imageUrl}
                    alt={service.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105 duration-700"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-secondary/20">
                    <CarFront className="h-20 w-20 text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="backdrop-blur-md bg-background/80 shadow-sm border-primary/20">
                    <Star className="mr-1 h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="ml-1 text-muted-foreground">({reviews.length})</span>
                  </Badge>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="rounded-md border-primary/20 bg-primary/5 text-primary">
                    {service.category?.name || service.categoryId || 'General'}
                  </Badge>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {service.duration} mins base time
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {service.name}
                </h1>
                <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>

            <Separator />

              {/* Vehicle Pricing Grid - Responsive Hybrid */}
              <section className="space-y-4">
              <div className="flex items-center gap-2">
                <CarFront className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Vehicle Pricing</h3>
              </div>
              
              {/* GRID LAYOUT: 
                  - Mobile: grid-cols-2 (Dense) 
                  - Desktop (md+): grid-cols-3 (Spacious, like your screenshot) 
              */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                {vehiclePricing.length > 0 ? (
                  vehiclePricing.map((p: any) => (
                    <div
                      key={p.vehicleType}
                      // PADDING: p-3 on mobile (tight), p-6 on desktop (airy)
                      className="flex flex-col justify-center p-3 md:p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:border-primary/30 transition-all duration-200"
                    >
                      {/* TEXT: Smaller and tighter on mobile */}
                      <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 truncate">
                        {String(p.vehicleType).replace(/-/g, ' ')}
                      </span>
                      {/* PRICE: Standard size on mobile, larger on desktop */}
                      <span className="text-lg md:text-2xl font-bold text-foreground">
                        ₹{p.price}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center rounded-xl border border-dashed">
                    <p className="text-sm text-muted-foreground">Pricing details coming soon.</p>
                  </div>
                )}
              </div>
            </section>


            {/* Add-ons Selection */}
            <Card className="border shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Enhance Your Service
                    </CardTitle>
                    <CardDescription>Customize your package with premium add-ons</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 grid gap-4">
                {AVAILABLE_ADDONS.map((addon) => {
                  const isSelected = selectedAddOns.includes(addon.id);
                  return (
                    <div 
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={cn(
                        "relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-200 hover:bg-accent",
                        isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                      )}
                    >
                      <Checkbox
                        id={addon.id}
                        checked={isSelected}
                        className="mt-1"
                        // Prevent double toggle event since parent has onClick
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={() => toggleAddOn(addon.id)}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <label htmlFor={addon.id} className="font-semibold cursor-pointer">
                            {addon.name}
                          </label>
                          <span className="font-bold text-primary">
                            +₹{addon.price}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground pr-8">
                          {addon.description}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs font-medium text-muted-foreground">
                          <Timer className="h-3 w-3" />
                          <span>+{addon.duration} mins</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div className="pt-4">
              <ReviewsList
                reviews={reviews}
                averageRating={averageRating}
                totalReviews={reviews.length}
                serviceName={service.name}
              />
            </div>
          </div>

          {/* Right Column - Sticky Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <Card className="border-2 shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/50 pb-4 border-b">
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  
                  {/* Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Duration</span>
                      <span>{service.duration} mins</span>
                    </div>
                    
                    {selectedAddOns.length > 0 && (
                      <>
                        <Separator className="my-2" />
                        {selectedAddOns.map((addonId) => {
                          const addon = AVAILABLE_ADDONS.find((a) => a.id === addonId);
                          return (
                            <div key={addonId} className="flex justify-between text-sm items-center">
                              <span className="text-muted-foreground truncate max-w-[160px]">{addon?.name}</span>
                              <span className="font-medium text-xs bg-muted px-2 py-1 rounded">
                                +{addon?.duration}m
                              </span>
                            </div>
                          );
                        })}
                      </>
                    )}
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Est. Total Time</span>
                      <div className="flex items-center gap-1.5 text-primary font-bold text-lg">
                        <Timer className="h-4 w-4" />
                        {calculateDuration()} mins
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button asChild size="lg" className="w-full text-base font-semibold h-12 shadow-md hover:shadow-lg transition-all">
                    <Link href={`${CustomerRoutes.BOOK}?serviceId=${service.id}&addOns=${selectedAddOns.join(',')}`}>
                      Book Service
                    </Link>
                  </Button>

                  {/* Trust Indicators */}
                  <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-green-600 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-tight">
                        <span className="font-medium text-foreground">Verified Pros.</span> Background checked staff.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-tight">
                        <span className="font-medium text-foreground">Price varies</span> by vehicle size selected at checkout.
                      </p>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t bg-background/80 backdrop-blur-xl p-4 z-50 pb-safe-area-inset-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Est. Duration</p>
            <div className="flex items-center gap-1.5">
              <Timer className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold text-foreground">{calculateDuration()} mins</span>
            </div>
          </div>
          <Button asChild size="lg" className="flex-1 h-12 font-semibold shadow-lg">
            <Link href={`${CustomerRoutes.BOOK}?serviceId=${service.id}&addOns=${selectedAddOns.join(',')}`}>
              Book Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
