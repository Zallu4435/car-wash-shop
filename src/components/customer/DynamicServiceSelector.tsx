'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sparkles, Droplet, Star, CheckCircle, Home as HomeIcon, Loader2 } from 'lucide-react';
import { Service } from '@/lib/api/bookingApi';

const iconMap = {
  Sparkles,
  Droplet,
  Star,
  HomeIcon,
};

interface DynamicServiceSelectorProps {
  services: Service[];
  selectedService: string;
  onServiceSelect: (serviceId: string) => void;
  loading?: boolean;
}

export function DynamicServiceSelector({
  services,
  selectedService,
  onServiceSelect,
  loading,
}: DynamicServiceSelectorProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No services available</p>
      </div>
    );
  }

  return (
    <RadioGroup value={selectedService} onValueChange={onServiceSelect}>
      <div className="grid gap-4">
        {services.map((service) => {
          // Default to Sparkles if no icon match
          const ServiceIcon = Sparkles;
          
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all border-2 hover:shadow-lg relative ${
                selectedService === service.id
                  ? 'ring-2 ring-primary border-primary bg-primary/5'
                  : 'border-border'
              }`}
              onClick={() => onServiceSelect(service.id)}
            >
              {service.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 hover:bg-orange-600">
                  Most Popular
                </Badge>
              )}
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <RadioGroupItem
                    value={service.id}
                    id={service.id}
                    className="mt-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={service.id} className="cursor-pointer">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${
                              selectedService === service.id ? 'bg-primary/10' : 'bg-muted'
                            }`}
                          >
                            <ServiceIcon
                              className={`h-5 w-5 sm:h-6 sm:w-6 ${
                                selectedService === service.id
                                  ? 'text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-base sm:text-lg text-foreground">
                              {service.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {service.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xl sm:text-2xl font-bold text-primary">
                            ₹{service.price}
                          </p>
                          <p className="text-xs text-muted-foreground">{service.duration}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 p-3 sm:p-4 bg-muted rounded-xl">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </RadioGroup>
  );
}
