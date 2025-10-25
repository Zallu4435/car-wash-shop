'use client';

import { HeroBanner } from '@/components/customer/HeroBanner';
import { ServiceCard } from '@/components/customer/ServiceCard';
import { ProductCard } from '@/components/customer/ProductCard';
import { PromoCarousel } from '@/components/customer/PromoCarousel';
import { PosterSection } from '@/components/customer/PosterSection';
import { Testimonials } from '@/components/customer/Testimonials';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getMockData } from '@/lib/api/mockData';
import { ArrowRight, Sparkles, Users, Award, TrendingUp, MessageSquare } from 'lucide-react';

export default function HomePage() {
  const services = getMockData.services().slice(0, 3);
  const products = getMockData.products().slice(0, 4);
  const posters = getMockData.posters();

  const promos = [
    {
      id: '1',
      title: 'Premium Wash - 20% Off',
      description: 'Limited time offer on all premium car wash services',
      image: '',
      link: '/services',
      ctaText: 'Book Now',
    },
    {
      id: '2',
      title: 'New Products Available',
      description: 'Check out our latest car care products',
      image: '',
      link: '/products',
      ctaText: 'Shop Now',
    },
  ];

  const testimonials = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      role: 'Business Owner',
      content: 'Absolutely exceptional service! My car looks brand new after their premium wash. The attention to detail and professionalism is unmatched.',
      rating: 5,
    },
    {
      id: '2',
      name: 'Priya Sharma',
      role: 'Marketing Executive',
      content: 'I have been a regular customer for over a year now. The quality of service is consistently excellent, and the staff is always friendly and helpful.',
      rating: 5,
    },
    {
      id: '3',
      name: 'Amit Patel',
      role: 'Software Engineer',
      content: 'Great experience every time! The online booking system is super convenient, and they always deliver on time. Highly recommended!',
      rating: 5,
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      role: 'Doctor',
      content: 'The products they use are top-notch, and my car always smells amazing after their service. Worth every penny!',
      rating: 5,
    },
    {
      id: '5',
      name: 'Vikram Singh',
      role: 'Entrepreneur',
      content: 'Professional, efficient, and affordable. These guys know what they are doing. My go-to place for all car care needs.',
      rating: 5,
    },
    {
      id: '6',
      name: 'Neha Gupta',
      role: 'Teacher',
      content: 'The interior detailing service exceeded my expectations. They removed stains I thought were permanent. Amazing work!',
      rating: 5,
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <HeroBanner />

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      {/* Promo Carousel */}
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background relative">
        {/* Decorative top border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        <div className="container-custom">
          <PromoCarousel promos={promos} />
        </div>

        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      </section>

      {/* Section Divider with decoration */}
      <div className="relative py-8">
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
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Our Services
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Featured Services
              </h2>
              <p className="text-muted-foreground text-lg">
                Premium car care services delivered with excellence and attention to detail
              </p>
            </div>
            <Button asChild size="lg" variant="outline" className="group shrink-0">
              <Link href="/services" className="flex items-center gap-2">
                View All Services
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider with decoration */}
      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-background px-4">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Marketing Posters */}
      {posters.length > 0 && (
        <section className="section-padding-lg bg-gradient-to-br from-primary/5 via-background to-primary/10 relative">
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

          <div className="container-custom relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4 px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                <Sparkles className="h-4 w-4" />
                Limited Time Offers
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Special Offers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Don't miss out on our exclusive deals and promotions designed just for you
              </p>
            </div>
            <PosterSection 
              posters={posters.map(p => ({
                id: p.id,
                title: p.title,
                description: p.description,
                imageUrl: p.imageUrl,
                link: '/services',
                ctaText: 'Learn More'
              }))} 
              layout="grid"
            />
          </div>
        </section>
      )}

      {/* Wave Divider */}
      <div className="relative h-16">
        <svg className="absolute bottom-0 w-full h-16 text-muted/50" preserveAspectRatio="none" viewBox="0 0 1440 54">
          <path
            fill="currentColor"
            d="M0,0 C480,54 960,54 1440,0 L1440,54 L0,54 Z"
          ></path>
        </svg>
      </div>

      {/* Popular Products */}
      <section className="section-padding-lg bg-muted/50 border-y border-border relative">
        {/* Left side accent */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/3 bg-gradient-to-b from-transparent via-primary to-transparent"></div>
        {/* Right side accent */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1/3 bg-gradient-to-b from-transparent via-primary to-transparent"></div>

        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Premium Products
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Popular Products
              </h2>
              <p className="text-muted-foreground text-lg">
                Top-quality car care products for professional results at home
              </p>
            </div>
            <Button asChild size="lg" variant="outline" className="group shrink-0">
              <Link href="/products" className="flex items-center gap-2">
                Shop All Products
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      {/* Testimonials Section */}
      <section className="section-padding-lg bg-gradient-to-b from-muted/20 to-muted/40 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
              <MessageSquare className="h-4 w-4" />
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      {/* Angular Divider */}
      <div className="relative h-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary transform -skew-y-2"></div>
      </div>

      {/* Trust Section - UPDATED FOR THEME */}
      <section className="section-padding-lg bg-primary relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              Join our community of satisfied customers who trust us with their vehicles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8 text-center hover:bg-primary-foreground/15 hover:scale-105 transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/20 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-5xl font-bold mb-2 text-primary-foreground">500+</div>
              <div className="text-primary-foreground/80 font-medium">Happy Customers</div>
            </div>
            
            <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8 text-center hover:bg-primary-foreground/15 hover:scale-105 transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/20 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Award className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-5xl font-bold mb-2 text-primary-foreground">50+</div>
              <div className="text-primary-foreground/80 font-medium">Expert Staff</div>
            </div>
            
            <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8 text-center hover:bg-primary-foreground/15 hover:scale-105 transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/20 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-5xl font-bold mb-2 text-primary-foreground">4.9</div>
              <div className="text-primary-foreground/80 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
