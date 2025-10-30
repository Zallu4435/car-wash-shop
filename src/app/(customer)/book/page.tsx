// app/book/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookingWizard } from '@/components/customer/BookingWizard';
import { ServiceTypeSelector } from '@/components/customer/ServiceTypeSelector';
import { DynamicVehicleSelector } from '@/components/customer/DynamicVehicleSelector';
import { DateTimePicker } from '@/components/customer/DateTimePicker';
import { DynamicAddOnSelector } from '@/components/customer/DynamicAddOnSelector';
import { PaymentOptionSelector } from '@/components/shared/pricing/PaymentOptionSelector';
import { AddressSelector } from '@/components/customer/AddressSelector';
import { toast } from 'sonner';
import { useServices, useServiceCategories } from '@/api/domains/services/queries';
import { useVehicles } from '@/api/domains/vehicles/queries';
import { useAddresses } from '@/api/domains/addresses/queries';
import { useCreateBooking } from '@/api/domains/bookings/queries';
import { DynamicServiceSelector } from '@/components/customer/DynamicServiceSelector';
import type { Service, ServiceCategory } from '@/types/service';
import type { Vehicle } from '@/types/vehicle';
import type { Address } from '@/types/address';
import Loading from '@/components/shared/display/Loading';
import { mockServiceTypes, mockAddOns } from '@/mocks/data/customer-mock-data';

export default function BookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Data from API
  const [services, setServices] = useState<Service[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const addOns = mockAddOns; // Use mock add-ons
  
  // Selections
  const [serviceType, setServiceType] = useState<string>('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [paymentOption, setPaymentOption] = useState('online');
  
  // API hooks
  const { data: servicesResponse, isLoading: servicesLoading, error: servicesError } = useServices({
    vehicleType: serviceType ? serviceType as 'car' | 'bike' : undefined,
  });
  const { data: categories = [], isLoading: categoriesLoading } = useServiceCategories();
  const { data: vehiclesData, isLoading: vehiclesLoading, error: vehiclesError } = useVehicles();
  const { data: addressesData, isLoading: addressesLoading, error: addressesError } = useAddresses();
  const createBookingMutation = useCreateBooking();
  

  // Service types from mock data
  const serviceTypes = mockServiceTypes;

  // Load data when service type changes
  useEffect(() => {
    if (servicesResponse?.data) {
      // Convert API services to component format
      const convertedServices = servicesResponse.data.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        vehicleTypeId: service.vehicleType,
        features: service.features,
        popular: false,
        image: service.image,
      }));
      setServices(convertedServices as any);
    }
  }, [servicesResponse]);

  useEffect(() => {
    if (vehiclesData && Array.isArray(vehiclesData)) {
      setVehicles(vehiclesData);
    }
  }, [vehiclesData]);

  useEffect(() => {
    if (addressesData && Array.isArray(addressesData)) {
      setAddresses(addressesData);
    }
  }, [addressesData]);

  // Set default service type
  useEffect(() => {
    if (!serviceType && serviceTypes.length > 0) {
      setServiceType(serviceTypes[0].id);
    }
  }, [serviceType, serviceTypes]);

  const handleServiceTypeChange = (type: string) => {
    setServiceType(type);
    // Reset selections
    setSelectedService('');
    setSelectedVehicle('');
    setSelectedAddress('');
    setSelectedAddOns([]);
  };

  const handleVehicleAdded = () => {
    // Vehicles will be automatically refetched by React Query
    toast.success('Vehicle added successfully!');
  };

  const handleAddressAdded = () => {
    // Addresses will be automatically refetched by React Query
    toast.success('Address added successfully!');
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1 && !serviceType) {
      toast.error('Please select a service type');
      return;
    }
    if (currentStep === 2 && !selectedService) {
      toast.error('Please select a service');
      return;
    }
    if (currentStep === 3 && serviceType !== 'home' && !selectedVehicle) {
      toast.error(`Please select a ${serviceType}`);
      return;
    }
    if (currentStep === 4 && !selectedAddress) {
      toast.error('Please select a service address');
      return;
    }
    if (currentStep === 5 && (!selectedDate || !selectedTime)) {
      toast.error('Please select date and time');
      return;
    }

    if (currentStep === 7) {
      // Final step - complete booking
      if (!selectedDate || !selectedTime || !selectedVehicle) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      const scheduledAt = new Date(`${selectedDate.toDateString()} ${selectedTime}`).toISOString();
      
      const bookingData = {
        serviceId: selectedService,
        vehicleId: selectedVehicle,
        addressId: selectedAddress,
        scheduledAt,
        addOns: selectedAddOns,
        paymentType: paymentOption === 'online' ? 'full' as const : 'advance' as const,
      };
      
      createBookingMutation.mutate(bookingData);
    } else {
      // Skip vehicle step for home service
      if (currentStep === 2 && serviceType === 'home') {
        setCurrentStep(4); // Skip step 3 (vehicle)
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    // Skip vehicle step when going back for home service
    if (currentStep === 4 && serviceType === 'home') {
      setCurrentStep(2); // Skip step 3 (vehicle)
    } else {
      setCurrentStep(Math.max(1, currentStep - 1));
    }
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const isLoading = servicesLoading || categoriesLoading || vehiclesLoading || addressesLoading;

  if (isLoading && serviceTypes.length === 0) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <BookingWizard
          currentStep={currentStep}
          totalSteps={7}
          onNext={handleNext}
          onPrev={handlePrev}
          isBooking={createBookingMutation.isPending}
        >
          {/* Step 1: Service Type Selection */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1.5 sm:mb-2">
                  Select Service Type
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  What would you like to book?
                </p>
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
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1.5 sm:mb-2">
                  Select Service
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Choose the perfect {serviceType === 'home' ? 'cleaning' : serviceType} service
                </p>
              </div>
              <DynamicServiceSelector
                services={services as any}
                selectedService={selectedService}
                onServiceSelect={setSelectedService}
                loading={servicesLoading}
              />
            </div>
          )}

          {/* Step 3: Vehicle Selection (Only for Car/Bike) */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1.5 sm:mb-2">
                  Choose {serviceType === 'car' ? 'Vehicle' : 'Bike'}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground px-4">
                  Select which {serviceType} to service
                </p>
              </div>
              <DynamicVehicleSelector
                serviceType={serviceType}
                vehicles={vehicles as any}
                addresses={addresses as any}
                selectedId={selectedVehicle}
                onSelect={setSelectedVehicle}
                onVehicleAdded={handleVehicleAdded}
              />
            </div>
          )}

          {/* Step 4: Service Address */}
          {currentStep === 4 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1.5 sm:mb-2">
                  Service Address
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground px-4">
                  Where should we provide the service?
                </p>
              </div>
              <AddressSelector
                addresses={addresses as any}
                selectedId={selectedAddress}
                onSelect={setSelectedAddress}
                onAddressAdded={handleAddressAdded}
              />
            </div>
          )}

          {/* Step 5: Date & Time */}
          {currentStep === 5 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1.5 sm:mb-2">
                  Schedule Service
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Pick a convenient date and time
                </p>
              </div>
              <DateTimePicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateSelect={setSelectedDate}
                onTimeSelect={setSelectedTime}
                serviceId={selectedService}
              />
            </div>
          )}

          {/* Step 6: Add-ons */}
          {currentStep === 6 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1.5 sm:mb-2">
                  Add-ons (Optional)
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Enhance your service with extras
                </p>
              </div>
              <DynamicAddOnSelector
                addOns={addOns}
                selectedAddOns={selectedAddOns}
                onToggle={toggleAddOn}
              />
            </div>
          )}

          {/* Step 7: Payment */}
          {currentStep === 7 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1.5 sm:mb-2">
                  Payment Option
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Choose how you'd like to pay
                </p>
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
