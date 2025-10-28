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
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full overflow-hidden">
      <Link href={`/services/${service.id}`}>
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl sm:text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300">
              🚗
            </span>
          </div>
          
          {/* Category Badge */}
          {service.category?.name && (
            <div className="absolute top-3 left-3">
              <Badge className="text-xs font-semibold shadow-md">
                {service.category.name}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 sm:p-5 md:p-6">
          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-tight">
            {service.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Rating & Duration */}
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-border">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
              <span className="text-xs sm:text-sm font-semibold text-foreground">{service.rating}</span>
              <span className="text-xs text-muted-foreground">({service.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">{service.duration} min</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-0.5">Starting from</span>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">₹{service.price}</span>
            </div>
            <Button size="sm" className="group/btn shrink-0 h-8 sm:h-9">
              <span className="text-xs sm:text-sm">Book Now</span>
              <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
