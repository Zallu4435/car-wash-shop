'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookingWizard } from '@/components/customer/BookingWizard';
import { ServiceTypeSelector } from '@/components/customer/ServiceTypeSelector';
import { DynamicVehicleSelector } from '@/components/customer/DynamicVehicleSelector';
import { DateTimePicker } from '@/components/customer/DateTimePicker';
import { DynamicAddOnSelector } from '@/components/customer/DynamicAddOnSelector';
import { PaymentOptionSelector } from '@/components/shared/pricing/PaymentOptionSelector';
import { toast } from 'sonner';
import { bookingApi, type ServiceType, type Service, type Vehicle, type Address, type AddOn } from '@/lib/api/bookingApi';
import { DynamicServiceSelector } from '@/components/customer/DynamicServiceSelector';

export default function BookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Data from API
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  
  // Selections
  const [serviceType, setServiceType] = useState<string>('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedVehicleOrAddress, setSelectedVehicleOrAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [paymentOption, setPaymentOption] = useState('online');
  
  // Loading states
  const [loading, setLoading] = useState(false);

  // Load service types on mount
  useEffect(() => {
    loadServiceTypes();
  }, []);

  // Load data when service type changes
  useEffect(() => {
    if (serviceType) {
      loadServiceTypeData(serviceType);
    }
  }, [serviceType]);

  const loadServiceTypes = async () => {
    try {
      const types = await bookingApi.getServiceTypes();
      setServiceTypes(types);
      if (types.length > 0) {
        setServiceType(types[0].id);
      }
    } catch (error) {
      toast.error('Failed to load service types');
    }
  };

  const loadServiceTypeData = async (typeId: string) => {
    setLoading(true);
    try {
      const [servicesData, addOnsData] = await Promise.all([
        bookingApi.getServicesByType(typeId),
        bookingApi.getAddOnsByType(typeId),
      ]);

      setServices(servicesData);
      setAddOns(addOnsData);

      // Load vehicles or addresses based on type
      if (typeId === 'home') {
        const addressesData = await bookingApi.getUserAddresses();
        setAddresses(addressesData);
        setVehicles([]);
      } else {
        const vehiclesData = await bookingApi.getUserVehicles(typeId);
        setVehicles(vehiclesData);
        setAddresses([]);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceTypeChange = (type: string) => {
    setServiceType(type);
    // Reset selections
    setSelectedService('');
    setSelectedVehicleOrAddress('');
    setSelectedAddOns([]);
  };

  const handleVehicleAdded = async () => {
    // Reload vehicles/addresses
    if (serviceType === 'home') {
      const addressesData = await bookingApi.getUserAddresses();
      setAddresses(addressesData);
    } else {
      const vehiclesData = await bookingApi.getUserVehicles(serviceType);
      setVehicles(vehiclesData);
    }
  };

  const handleNext = () => {
    if (currentStep === 6) {
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

  if (loading && serviceTypes.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <BookingWizard
          currentStep={currentStep}
          totalSteps={6}
          onNext={handleNext}
          onPrev={handlePrev}
        >
          {/* Step 1: Service Type Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Select Service Type</h2>
                <p className="text-muted-foreground">What would you like to book?</p>
              </div>
              <ServiceTypeSelector
                serviceTypes={serviceTypes}
                selectedType={serviceType}
                onTypeSelect={handleServiceTypeChange}
              />
            </div>
          )}

          {/* Step 2: Service Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Select Service</h2>
                <p className="text-muted-foreground">
                  Choose the perfect {serviceType === 'home' ? 'cleaning' : serviceType} service
                </p>
              </div>
              <DynamicServiceSelector
                services={services}
                selectedService={selectedService}
                onServiceSelect={setSelectedService}
                loading={loading}
              />
            </div>
          )}

          {/* Step 3: Vehicle/Address Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {serviceType === 'home' ? 'Service Address' : `Choose ${serviceType === 'car' ? 'Vehicle' : 'Bike'}`}
                </h2>
                <p className="text-muted-foreground">
                  {serviceType === 'home' 
                    ? 'Where should we provide the service?' 
                    : `Select which ${serviceType} to service`}
                </p>
              </div>
              <DynamicVehicleSelector
                serviceType={serviceType}
                vehicles={vehicles}
                addresses={addresses}
                selectedId={selectedVehicleOrAddress}
                onSelect={setSelectedVehicleOrAddress}
                onVehicleAdded={handleVehicleAdded}
              />
            </div>
          )}

          {/* Step 4: Date & Time */}
          {currentStep === 4 && (
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

          {/* Step 5: Add-ons */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Add-ons (Optional)</h2>
                <p className="text-muted-foreground">Enhance your service with extras</p>
              </div>
              <DynamicAddOnSelector
                addOns={addOns}
                selectedAddOns={selectedAddOns}
                onToggle={toggleAddOn}
              />
            </div>
          )}

          {/* Step 6: Payment */}
          {currentStep === 6 && (
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
