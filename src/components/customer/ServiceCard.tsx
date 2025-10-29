import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Service {
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
  duration: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
}

interface ServiceCardProps {
  service: Service;
  priceDisplay?: string;
  pricingBadge?: string;
  bodyTypeBadge?: string;
  showFromLabel?: boolean;
}

export function ServiceCard({ 
  service, 
  priceDisplay, 
  pricingBadge, 
  bodyTypeBadge, 
  showFromLabel = true 
}: ServiceCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full overflow-hidden border-2">
      <Link href={`/services/${service.id}`}>
        {/* Image Container */}
        <div className="relative h-44 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl group-hover:scale-110 transition-transform duration-300">
              🚗
            </span>
          </div>
          
          {/* Category Badge */}
          {(service.category?.name || bodyTypeBadge) && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {service.category?.name && (
                  <Badge className="text-[10px] sm:text-xs font-semibold shadow-md px-2 py-0.5">
                    {service.category.name}
                  </Badge>
                )}
                {bodyTypeBadge && (
                  <Badge variant="secondary" className="text-[9px] sm:text-[10px] font-semibold shadow-md px-1.5 py-0.5">
                    {bodyTypeBadge}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2 md:mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-snug">
            {service.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 md:mb-5 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Rating & Duration */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-5 lg:mb-6 pb-3 sm:pb-4 md:pb-5 lg:pb-6 border-b border-border">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-foreground">{service.rating}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">({service.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">{service.duration} min</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex flex-col min-w-0 flex-1">
              {priceDisplay ? (
                <>
                  <span className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Price</span>
                  <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary transition-all duration-300 leading-none">
                      {priceDisplay}
                    </span>
                    {pricingBadge && (
                      <Badge variant="secondary" className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 leading-none">
                        {pricingBadge}
                      </Badge>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {showFromLabel && (
                    <span className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">From</span>
                  )}
                  <div className="flex flex-col xs:flex-row xs:items-baseline gap-1 xs:gap-2">
                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary leading-none">
                      ₹{service.price}
                    </span>
                    <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1.5 py-0.5 w-fit">
                      Select vehicle
                    </Badge>
                  </div>
                </>
              )}
            </div>
            <Button size="sm" className="group/btn shrink-0 h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm">
              <span className="hidden xs:inline">Book Now</span>
              <span className="xs:hidden">Book</span>
              <ArrowRight className="ml-1 sm:ml-1.5 md:ml-2 h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
