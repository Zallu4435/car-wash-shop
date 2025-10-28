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
  const [serviceAddresses, setServiceAddresses] = useState<Address[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  
  // Selections
  const [serviceType, setServiceType] = useState<string>('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [paymentOption, setPaymentOption] = useState('online');
  
  // Loading states
  const [loading, setLoading] = useState(false);

  // Load service types on mount
  useEffect(() => {
    loadServiceTypes();
    loadServiceAddresses();
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

  const loadServiceAddresses = async () => {
    try {
      const addressesData = await bookingApi.getUserAddresses();
      setServiceAddresses(addressesData);
    } catch (error) {
      toast.error('Failed to load addresses');
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

      // Load vehicles for car/bike services
      if (typeId !== 'home') {
        const vehiclesData = await bookingApi.getUserVehicles(typeId);
        setVehicles(vehiclesData);
      } else {
        setVehicles([]);
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
    setSelectedVehicle('');
    setSelectedAddress('');
    setSelectedAddOns([]);
  };

  const handleVehicleAdded = async () => {
    // Reload vehicles
    if (serviceType !== 'home') {
      const vehiclesData = await bookingApi.getUserVehicles(serviceType);
      setVehicles(vehiclesData);
    }
  };

  const handleAddressAdded = async () => {
    // Reload addresses
    await loadServiceAddresses();
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
      toast.success('Booking confirmed!');
      router.push('/orders');
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

  if (loading && serviceTypes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <BookingWizard
          currentStep={currentStep}
          totalSteps={7}
          onNext={handleNext}
          onPrev={handlePrev}
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
                services={services}
                selectedService={selectedService}
                onServiceSelect={setSelectedService}
                loading={loading}
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
                vehicles={vehicles}
                addresses={[]}
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
                addresses={serviceAddresses}
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
