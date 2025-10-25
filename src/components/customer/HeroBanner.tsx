'use client';

import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

const banners = [
  {
    id: 1,
    title: 'Premium Wash - 20% Off',
    subtitle: 'Limited time offer on all premium services',
    image: '/images/banners/banner1.jpg',
    cta: { text: 'Book Now', link: '/services' },
  },
  {
    id: 2,
    title: 'Interior Detailing Special',
    subtitle: 'Deep clean your car interior with expert care',
    image: '/images/banners/banner2.jpg',
    cta: { text: 'Explore Services', link: '/services' },
  },
];

export function HeroBanner() {
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
              <div className="relative h-[600px] md:h-[700px] lg:h-[800px] bg-primary overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] bg-repeat animate-pulse" />
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-[600px] h-[600px] bg-primary-foreground/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Content */}
                <div className="container-custom h-full flex items-center relative z-10">
                  <div className="max-w-4xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 rounded-full text-primary-foreground text-sm font-semibold mb-8 hover:bg-primary-foreground/15 transition-colors animate-fade-in">
                      <Sparkles className="h-4 w-4" />
                      Special Offer
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 text-primary-foreground leading-[1.1] tracking-tight">
                      {banner.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-primary-foreground/90 max-w-3xl leading-relaxed font-light">
                      {banner.subtitle}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        size="lg"
                        className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-2xl text-lg px-10 py-7 h-auto group font-semibold rounded-xl transition-all"
                      >
                        {banner.cta.text}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>

                      <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 text-lg px-10 py-7 h-auto backdrop-blur-md rounded-xl font-semibold"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Watch Demo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 lg:left-8 bg-primary-foreground/10 backdrop-blur-md border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground h-12 w-12" />
        <CarouselNext className="right-4 lg:right-8 bg-primary-foreground/10 backdrop-blur-md border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground h-12 w-12" />
      </Carousel>
    </div>
  );
}
