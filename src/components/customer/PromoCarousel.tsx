'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Promo {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  ctaText: string;
}

interface PromoCarouselProps {
  promos: Promo[];
}

export function PromoCarousel({ promos }: PromoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % promos.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);

  if (promos.length === 0) return null;

  const currentPromo = promos[currentIndex];

  return (
    <div className="relative">
      <Card className="overflow-hidden border-0 shadow-none">
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] bg-primary overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] bg-repeat animate-pulse" />
          </div>

          {/* Decorative Circles */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-primary-foreground/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-3xl relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-primary-foreground/20 backdrop-blur-md border border-primary-foreground/30 rounded-full text-primary-foreground text-xs sm:text-sm font-semibold mb-4 sm:mb-6 md:mb-8 hover:bg-primary-foreground/25 transition-colors">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                Exclusive Offer
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 text-primary-foreground leading-tight">
                {currentPromo.title}
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
                {currentPromo.description}
              </p>

              {/* CTA Button */}
              <Button
                asChild
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-xs sm:text-sm md:text-base lg:text-lg px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 md:py-6 lg:py-7 h-auto group font-semibold rounded-lg sm:rounded-xl transition-colors border-2 border-primary-foreground/20"
              >
                <Link href={currentPromo.link} className="flex items-center gap-2">
                  {currentPromo.ctaText}
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

            </div>
          </div>

          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>
      </Card>

      {/* Navigation */}
      {promos.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-card backdrop-blur-md hover:bg-card/80 z-10 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
            onClick={prev}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-card backdrop-blur-md hover:bg-card/80 z-10 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
            onClick={next}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Indicators */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 md:mt-8">
            {promos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 sm:h-2 md:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'bg-primary w-6 sm:w-8 md:w-10'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5 sm:w-2 md:w-2.5'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
