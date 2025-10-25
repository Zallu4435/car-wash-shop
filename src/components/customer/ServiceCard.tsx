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
    <Card className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full overflow-hidden border-border">
      <Link href={`/services/${service.id}`}>
        {/* Image Container */}
        <div className="relative h-64 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl group-hover:scale-110 transition-transform duration-300 filter group-hover:drop-shadow-lg">🚗</span>
          </div>
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Category Badge */}
          {service.category?.name && (
            <div className="absolute top-4 left-4">
              <Badge className="shadow-lg font-semibold">
                {service.category.name}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {/* Title */}
          <h3 className="font-bold text-xl mb-3 line-clamp-1 text-foreground group-hover:text-primary transition-colors">
            {service.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Rating & Duration */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-foreground">{service.rating}</span>
              <span className="text-xs text-muted-foreground">({service.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{service.duration} min</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">Starting from</span>
              <span className="text-3xl font-bold text-primary">₹{service.price}</span>
            </div>
            <Button size="sm" className="group/btn shadow-md">
              Book Now
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
