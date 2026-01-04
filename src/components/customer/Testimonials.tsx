'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  // Only show up to 3 testimonials
  const displayTestimonials = testimonials.slice(0, 3);

  if (displayTestimonials.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Main Testimonial Cards - Static 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {displayTestimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="border-2 hover:shadow-lg transition-all duration-300 group bg-card"
          >
            <CardContent className="p-5 sm:p-6 md:p-8">
              {/* Quote Icon */}
              <div className="mb-4 sm:mb-5 md:mb-6">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>

              {/* Content */}
              <p className="text-foreground text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-4 sm:mb-5 md:mb-6 line-clamp-4">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-base sm:text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                    {testimonial.name}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
