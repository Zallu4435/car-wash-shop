'use client';

import { HeroBanner } from '@/components/customer/HeroBanner';
import { ServiceCard } from '@/components/customer/ServiceCard';
import { ProductCard } from '@/components/customer/ProductCard';
import { PromoCarousel } from '@/components/customer/PromoCarousel';
import { PosterSection } from '@/components/customer/PosterSection';
import { Testimonials } from '@/components/customer/Testimonials';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useServices } from '@/api/domains/services/queries';
import { useProducts } from '@/api/domains/products/queries';
import { ArrowRight, Sparkles, Users, Award, TrendingUp, MessageSquare } from 'lucide-react';
import Loading from '@/components/shared/display/Loading';
import { getMockData } from '@/lib/api/mockData';
import { useMemo } from 'react';

export default function HomePage() {
  // API calls
  const { data: servicesResponse, isLoading: servicesLoading } = useServices({ limit: 3 });
  const { data: productsResponse, isLoading: productsLoading } = useProducts({ limit: 4 });
  
  const services = servicesResponse?.data || [];
  const products = productsResponse?.data || [];
  
  // Get dynamic data from mock data
  const posters = useMemo(() => getMockData.posters().slice(0, 2), []);
  const banners = useMemo(() => getMockData.banners(), []);
  const testimonials = useMemo(() => getMockData.testimonials(), []);
  const trustStats = useMemo(() => getMockData.trustStats(), []);
  
  // Convert banners to promos format
  const promos = useMemo(() => 
    banners.slice(0, 2).map(banner => ({
      id: banner.id,
      title: banner.title,
      description: banner.subtitle || 'Limited time offer',
      image: banner.imageUrl || '',
      link: banner.ctaLink || '/services',
      ctaText: banner.ctaText || 'Learn More',
    })),
    [banners]
  );

  // Loading state
  if (servicesLoading || productsLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <HeroBanner />

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      {/* Promo Carousel */}
      <section className="section-padding bg-muted/30 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        <div className="container-custom">
          <PromoCarousel promos={promos} />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      </section>

      {/* Section Divider with decoration */}
      <div className="relative py-6 sm:py-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-background px-4">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Featured Services */}
      <section className="section-padding-lg bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 sm:mb-10 md:mb-12 gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">
                  Our Services
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
                Featured Services
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                Premium car care services delivered with excellence and attention to detail
              </p>
            </div>
            <Button asChild size="lg" variant="outline" className="group shrink-0">
              <Link href="/services" className="flex items-center gap-2">
                <span className="text-sm sm:text-base">View All Services</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service as any} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider with decoration */}
      <div className="relative py-6 sm:py-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-background px-4">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Marketing Posters */}
      {posters.length > 0 && (
        <section className="section-padding-lg bg-accent/5 relative">
          <div className="absolute top-10 right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

          <div className="container-custom relative z-10">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-4 sm:px-5 py-2 sm:py-2.5 bg-accent/10 text-accent-foreground rounded-full text-xs sm:text-sm font-semibold border border-accent/20">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Limited Time Offers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
                Special Offers
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Don't miss out on our exclusive deals and promotions designed just for you
              </p>
            </div>
            <PosterSection
              posters={posters.map(p => ({
                id: p.id,
                title: p.title,
                description: p.description,
                imageUrl: p.imageUrl,
                link: p.link || '/services',
                ctaText: p.ctaText || 'Learn More'
              }))}
              layout="grid"
            />
          </div>
        </section>
      )}

      {/* Wave Divider */}
      <div className="relative h-12 sm:h-16">
        <svg className="absolute bottom-0 w-full h-12 sm:h-16 text-muted" preserveAspectRatio="none" viewBox="0 0 1440 54">
          <path
            fill="currentColor"
            d="M0,0 C480,54 960,54 1440,0 L1440,54 L0,54 Z"
          ></path>
        </svg>
      </div>

      {/* Popular Products */}
      <section className="section-padding-lg bg-muted border-y border-border relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/3 bg-gradient-to-b from-transparent via-accent to-transparent"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1/3 bg-gradient-to-b from-transparent via-accent to-transparent"></div>

        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 sm:mb-10 md:mb-12 gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-accent/10 rounded-lg">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">
                  Premium Products
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
                Popular Products
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                Top-quality car care products for professional results at home
              </p>
            </div>
            <Button asChild size="lg" variant="outline" className="group shrink-0">
              <Link href="/products" className="flex items-center gap-2">
                <span className="text-sm sm:text-base">Shop All Products</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

      {/* Testimonials Section */}
      <section className="section-padding-lg bg-secondary/50 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-4 sm:px-5 py-2 sm:py-2.5 bg-accent/10 text-accent-foreground rounded-full text-xs sm:text-sm font-semibold border border-accent/20">
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Testimonials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
              What Our Customers Say
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      {/* Simple Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      {/* Trust Section */}
      <section className="section-padding-lg bg-primary relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary-foreground/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary-foreground/5 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2 sm:mb-3 md:mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-primary-foreground/95 max-w-2xl mx-auto">
              Join our community of satisfied customers who trust us with their vehicles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {trustStats.map((stat) => {
              // Map icon names to components
              const IconComponent = stat.icon === 'users' ? Users : stat.icon === 'award' ? Award : TrendingUp;
              
              return (
                <div key={stat.id} className="bg-primary-foreground/15 backdrop-blur-sm border-2 border-primary-foreground/30 rounded-2xl p-6 sm:p-8 text-center hover:bg-primary-foreground/20 hover:border-primary-foreground/40 hover:scale-105 transition-all duration-300 group shadow-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary-foreground/25 rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-md">
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 text-primary-foreground">{stat.value}</div>
                  <div className="text-sm sm:text-base text-primary-foreground/90 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
    </div>
  );
}
