'use client';

import { use } from 'react';
import Link from 'next/link';
import { Star, Clock, CheckCircle, ArrowLeft, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const getService = (id: string) => ({
  id,
  name: 'Premium Wash',
  categoryId: 'cat_ext',
  category: { id: 'cat_ext', name: 'Exterior Wash', description: '', icon: 'car', active: true, order: 1 },
  description: 'Complete exterior wash with foam, high-pressure rinse, and tire cleaning. Our premium service ensures your car looks brand new with professional-grade products and techniques.',
  price: 499,
  duration: 30,
  inclusions: [
    'High-pressure foam wash',
    'Wheel and tire cleaning',
    'Underbody wash',
    'Window cleaning',
    'Exterior wipe and dry',
    'Tire shine application',
  ],
  addOns: [
    {
      id: 'addon_wax',
      name: 'Wax Coating',
      description: 'Protective wax layer for long-lasting shine',
      price: 150,
      duration: 15,
    },
    {
      id: 'addon_polish',
      name: 'Polish',
      description: 'Deep polish to remove minor scratches',
      price: 200,
      duration: 20,
    },
    {
      id: 'addon_engine',
      name: 'Engine Bay Cleaning',
      description: 'Professional engine compartment cleaning',
      price: 250,
      duration: 20,
    },
  ],
  imageUrl: '/images/services/premium-wash.jpg',
  rating: 4.5,
  reviewCount: 128,
  active: true,
  createdAt: '2025-01-15T10:00:00Z',
});

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const service = getService(id);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const calculateTotal = () => {
    const addOnsTotal = selectedAddOns.reduce((sum, addonId) => {
      const addon = service.addOns.find((a) => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    return service.price + addOnsTotal;
  };

  const calculateDuration = () => {
    const addOnsDuration = selectedAddOns.reduce((sum, addonId) => {
      const addon = service.addOns.find((a) => a.id === addonId);
      return sum + (addon?.duration || 0);
    }, 0);
    return service.duration + addOnsDuration;
  };

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      <div className="container-custom py-6 sm:py-8">
        {/* Back Button */}
        <Link href="/services">
          <Button variant="ghost" className="mb-4 sm:mb-6 hover:bg-muted h-9 sm:h-10">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Back to Services</span>
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Service Image */}
            <div className="relative h-[250px] sm:h-[350px] lg:h-[400px] bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl sm:rounded-2xl overflow-hidden border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl sm:text-7xl md:text-8xl mb-2 sm:mb-4">🚗</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Service Image</p>
                </div>
              </div>
              <Badge className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-card border-border shadow-lg text-xs sm:text-sm">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                {service.rating} ({service.reviewCount})
              </Badge>
            </div>

            {/* Service Info */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                <Badge variant="default" className="text-xs sm:text-sm">{service.category.name}</Badge>
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                  {service.duration} mins
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
                {service.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* What's Included */}
            <Card className="border-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">What's Included</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {service.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-xs sm:text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Add-ons */}
            <Card className="border-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Enhance Your Service</CardTitle>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Select optional add-ons to customize your service
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5 sm:space-y-3">
                  {service.addOns.map((addon) => {
                    const isSelected = selectedAddOns.includes(addon.id);
                    return (
                      <div 
                        key={addon.id} 
                        className={`flex items-start space-x-2.5 sm:space-x-3 p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50 hover:bg-accent'
                        }`}
                        onClick={() => toggleAddOn(addon.id)}
                      >
                        <Checkbox
                          id={addon.id}
                          checked={isSelected}
                          onCheckedChange={() => toggleAddOn(addon.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <Label 
                            htmlFor={addon.id} 
                            className="font-semibold cursor-pointer text-foreground text-sm sm:text-base"
                          >
                            {addon.name}
                          </Label>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                            {addon.description}
                          </p>
                          <div className="flex items-center justify-between mt-2 sm:mt-3">
                            <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted px-2 py-0.5 sm:py-1 rounded-full">
                              +{addon.duration} mins
                            </span>
                            <span className="font-bold text-primary text-sm sm:text-base">
                              +₹{addon.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Summary (Desktop Sticky, Mobile Fixed Bottom) */}
          <div className="lg:col-span-1">
            {/* Desktop Version */}
            <Card className="hidden lg:block sticky top-24 border-2">
              <CardHeader className="bg-muted/30 pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Booking Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 sm:space-y-6 pt-4 sm:pt-6">
                {/* Price Breakdown */}
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Base Service</span>
                    <span className="font-medium text-foreground">₹{service.price}</span>
                  </div>
                  {selectedAddOns.length > 0 && (
                    <>
                      <Separator />
                      {selectedAddOns.map((addonId) => {
                        const addon = service.addOns.find((a) => a.id === addonId);
                        return (
                          <div key={addonId} className="flex justify-between text-xs sm:text-sm">
                            <span className="text-muted-foreground truncate mr-2">{addon?.name}</span>
                            <span className="font-medium text-foreground flex-shrink-0">₹{addon?.price}</span>
                          </div>
                        );
                      })}
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base sm:text-lg pt-1 sm:pt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm bg-muted p-2.5 sm:p-3 rounded-lg">
                    <span className="text-muted-foreground">Estimated Duration</span>
                    <span className="font-semibold text-foreground">{calculateDuration()} mins</span>
                  </div>
                </div>

                {/* Book Button */}
                <Button asChild className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" size="lg">
                  <Link href={`/book?serviceId=${service.id}&addOns=${selectedAddOns.join(',')}`}>
                    Book Now - ₹{calculateTotal()}
                  </Link>
                </Button>

                {/* Info */}
                <div className="space-y-2 pt-3 sm:pt-4 border-t border-border">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Free cancellation up to 2 hours before service
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Professional staff with verified credentials
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      100% satisfaction guaranteed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Fixed Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
              <div className="bg-background/95 backdrop-blur-xl border-t-2 border-border shadow-2xl px-4 py-3">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">₹{calculateTotal()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-semibold text-foreground">{calculateDuration()} mins</p>
                  </div>
                </div>
                <Button asChild className="w-full shadow-lg h-12 text-sm font-semibold" size="lg">
                  <Link href={`/book?serviceId=${service.id}&addOns=${selectedAddOns.join(',')}`}>
                    Book Now - ₹{calculateTotal()}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
