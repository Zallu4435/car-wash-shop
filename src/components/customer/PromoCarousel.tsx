'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Poster } from '@/types/poster';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface PromoCarouselProps {
  posters: Poster[];
}

export function PromoCarousel({ posters }: PromoCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  if (posters.length === 0) return null;

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {posters.map((currentPoster, index) => {
            // Get colors with fallbacks
            const headingColor = currentPoster.headingColor || '#ffffff';
            const descriptionColor = currentPoster.descriptionColor || '#ffffff';
            const showButton = currentPoster.showButton ?? true;
            const buttonText = currentPoster.buttonText || currentPoster.ctaText || 'Learn More';
            const buttonLink = currentPoster.buttonLink || currentPoster.link || '/services';
            const posterImage = currentPoster.image || currentPoster.imageUrl;

            return (
              <CarouselItem key={currentPoster._id || index}>
                <Card className="overflow-hidden border-0 shadow-none">
                  <div className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] bg-primary overflow-hidden">
                    {/* Background Image if available */}
                    {posterImage && (
                      <div className="absolute inset-0">
                        <Image
                          src={posterImage}
                          alt={currentPoster.title}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                        {/* Overlay for text readability */}
                        <div className="absolute inset-0 bg-black/40"></div>
                      </div>
                    )}

                    {/* Animated Background Pattern (only when no image) */}
                    {!posterImage && (
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] bg-repeat animate-pulse" />
                      </div>
                    )}

                    {/* Decorative Circles */}
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div
                      className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-pulse"
                      style={{ animationDelay: '1s' }}
                    ></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
                      <div className="text-center max-w-3xl relative z-10">
                        {/* Title */}
                        <h2
                          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight"
                          style={{ color: headingColor }}
                        >
                          {currentPoster.title}
                        </h2>

                        {/* Description */}
                        {currentPoster.description && (
                          <p
                            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed opacity-90"
                            style={{ color: descriptionColor }}
                          >
                            {currentPoster.description}
                          </p>
                        )}

                        {/* CTA Button */}
                        {showButton && buttonText && buttonLink && (
                          <Button
                            asChild
                            className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 h-auto group font-semibold rounded-lg transition-colors border-2 border-white/20 inline-flex items-center justify-center"
                          >
                            <Link href={buttonLink} className="flex items-center gap-2">
                              {buttonText}
                              <ArrowRight className="h-4 w-4 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Bottom Gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Indicators */}
      {posters.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5 sm:gap-2">
          {posters.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`h-1.5 sm:h-2 md:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${idx === current
                  ? 'bg-primary w-6 sm:w-8 md:w-10'
                  : 'bg-white/50 hover:bg-white/80 w-1.5 sm:w-2 md:w-2.5'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
