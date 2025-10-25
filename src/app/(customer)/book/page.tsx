'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingWizard } from '@/components/customer/BookingWizard';
import { VehicleSelector } from '@/components/customer/VehicleSelector';
import { DateTimePicker } from '@/components/customer/DateTimePicker';
import { AddOnSelector } from '@/components/customer/AddOnSelector';
import { PaymentOptionSelector } from '@/components/shared/pricing/PaymentOptionSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Sparkles, Droplet, Star, CheckCircle } from 'lucide-react';

const mockServices = [
  {
    id: 'service_001',
    name: 'Basic Wash',
    description: 'Exterior wash with foam and pressure wash',
    price: 299,
    duration: '30 mins',
    features: ['Exterior wash', 'Foam application', 'Pressure wash', 'Tire cleaning'],
    icon: Droplet,
  },
  {
    id: 'service_002',
    name: 'Premium Wash',
    description: 'Complete wash with interior cleaning',
    price: 599,
    duration: '60 mins',
    features: ['Everything in Basic', 'Interior vacuuming', 'Dashboard cleaning', 'Window cleaning'],
    icon: Sparkles,
    popular: true,
  },
  {
    id: 'service_003',
    name: 'Deluxe Detailing',
    description: 'Full detailing with wax and polish',
    price: 1299,
    duration: '2 hours',
    features: ['Everything in Premium', 'Wax application', 'Polish', 'Engine cleaning', 'Seat shampooing'],
    icon: Star,
  },
];

const mockAddOns = [
  { id: 'addon_001', name: 'Tire Polish', description: 'Premium tire shine', price: 99 },
  { id: 'addon_002', name: 'Dashboard Polish', description: 'Deep dashboard cleaning', price: 149 },
  { id: 'addon_003', name: 'Perfume', description: 'Fresh car fragrance', price: 79 },
];

export default function BookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [paymentOption, setPaymentOption] = useState('online');

  const handleNext = () => {
    if (currentStep === 5) {
      toast.success('Booking confirmed!');
      router.push('/orders');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  return (
    <div className="min-h-screen bg-background py-8 lg:py-12">
      <div className="container-custom">
        <BookingWizard
          currentStep={currentStep}
          totalSteps={5}
          onNext={handleNext}
          onPrev={handlePrev}
        >
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Select Service</h2>
                <p className="text-muted-foreground">Choose the perfect service for your vehicle</p>
              </div>

              <RadioGroup value={selectedService} onValueChange={setSelectedService}>
                <div className="grid gap-4">
                  {mockServices.map((service) => {
                    const ServiceIcon = service.icon;
                    return (
                      <Card
                        key={service.id}
                        className={`cursor-pointer transition-all border-2 hover:shadow-lg relative ${
                          selectedService === service.id
                            ? 'ring-2 ring-primary border-primary bg-primary/5'
                            : ''
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        {service.popular && (
                          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 hover:bg-orange-600">
                            Most Popular
                          </Badge>
                        )}
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <RadioGroupItem value={service.id} id={service.id} className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor={service.id} className="cursor-pointer">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-3 rounded-xl ${
                                        selectedService === service.id ? 'bg-primary/10' : 'bg-muted'
                                      }`}
                                    >
                                      <ServiceIcon
                                        className={`h-6 w-6 ${
                                          selectedService === service.id
                                            ? 'text-primary'
                                            : 'text-muted-foreground'
                                        }`}
                                      />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-lg text-foreground">{service.name}</h3>
                                      <p className="text-sm text-muted-foreground">{service.description}</p>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-2xl font-bold text-primary">₹{service.price}</p>
                                    <p className="text-xs text-muted-foreground">{service.duration}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 p-4 bg-muted rounded-xl">
                                  {service.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                      <span className="text-sm text-foreground">{feature}</span>
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
            </div>
          )}

          {/* Step 2: Vehicle Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Choose Vehicle</h2>
                <p className="text-muted-foreground">Select which vehicle to service</p>
              </div>
              <VehicleSelector
                selectedVehicle={selectedVehicle}
                onVehicleSelect={setSelectedVehicle}
              />
            </div>
          )}

          {/* Step 3: Date & Time */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Schedule Service</h2>
                <p className="text-muted-foreground">Pick a convenient date and time</p>
              </div>
              <DateTimePicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateSelect={setSelectedDate}
                onTimeSelect={setSelectedTime}
              />
            </div>
          )}

          {/* Step 4: Add-ons */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Add-ons (Optional)</h2>
                <p className="text-muted-foreground">Enhance your service with extras</p>
              </div>
              <AddOnSelector
                addOns={mockAddOns}
                selectedAddOns={selectedAddOns}
                onToggle={toggleAddOn}
              />
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Payment Option</h2>
                <p className="text-muted-foreground">Choose how you'd like to pay</p>
              </div>
              <PaymentOptionSelector
                value={paymentOption}
                onChange={setPaymentOption}
                codFee={40}
              />
            </div>
          )}
        </BookingWizard>
      </div>
    </div>
  );
}
