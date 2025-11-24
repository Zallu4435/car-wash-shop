'use client';

import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { useActiveBanners } from '@/api/domains/banners/queries';
import Loading from '@/components/shared/display/Loading';
import Link from 'next/link';

export function HeroBanner() {
  const { data: banners = [], isLoading } = useActiveBanners('hero');

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative w-full h-[500px] sm:h-[600px] md:h-[650px] lg:h-[700px] bg-primary flex items-center justify-center">
        <Loading text="Loading banners..." />
      </div>
    );
  }

  // Show empty state if no banners
  if (banners.length === 0) {
    return null; // Or return a default banner
  }
  return (
    <div className="relative w-full overflow-hidden">
      <Carousel
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div 
                className="relative h-[500px] sm:h-[600px] md:h-[650px] lg:h-[700px] bg-primary overflow-hidden"
                style={{
                  backgroundImage: banner.imageUrl ? `url(${banner.imageUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Background Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/60"></div>
                
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] bg-repeat animate-pulse" />
                </div>

                {/* Decorative Circles - Adjusted for mobile */}
                <div className="absolute top-10 right-5 sm:top-20 sm:right-20 w-48 h-48 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 left-5 sm:bottom-20 sm:left-20 w-64 h-64 sm:w-[600px] sm:h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Content */}
                <div className="container-custom h-full flex items-center relative z-10">
                  <div className="w-full max-w-4xl py-8 sm:py-12">
                    {/* Badge */}
                    {banner.subtitle && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-primary-foreground text-xs sm:text-sm font-semibold mb-4 sm:mb-6 md:mb-8 hover:bg-white/15 transition-colors animate-fade-in">
                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>Special Offer</span>
                      </div>
                    )}

                    {/* Title - Responsive sizing */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 text-primary-foreground leading-[1.1] tracking-tight">
                      {banner.title}
                    </h1>

                    {/* Subtitle - Better mobile sizing */}
                    {banner.subtitle && (
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-accent bg-accent/10 inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-lg backdrop-blur-sm border border-accent/20">
                        {banner.subtitle}
                      </div>
                    )}

                    {/* CTA Buttons - Better mobile layout */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {banner.ctaLink && (
                        <Link href={banner.ctaLink}>
                          <Button
                            size="lg"
                            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-2xl text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-7 h-auto group font-semibold rounded-xl transition-all w-full sm:w-auto border-2 border-primary-foreground/20"
                          >
                            <span>{banner.ctaText || 'Learn More'}</span>
                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows - Hidden on very small screens */}
        <CarouselPrevious className="left-2 sm:left-4 lg:left-8 bg-white/10 backdrop-blur-md border-white/20 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground h-10 w-10 sm:h-12 sm:w-12 hidden xs:flex" />
        <CarouselNext className="right-2 sm:right-4 lg:right-8 bg-white/10 backdrop-blur-md border-white/20 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground h-10 w-10 sm:h-12 sm:w-12 hidden xs:flex" />
      </Carousel>
    </div>
  );
}
