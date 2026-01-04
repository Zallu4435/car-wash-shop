'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Bike,
  CalendarDays,
  Car,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { MapPicker } from '@/components/shared/selectors/MapPicker';
import { AddressSelectionModal } from '@/components/customer/AddressSelectionModal';
import { useService } from '@/api/domains/services/queries';
import { useAvailableSlots, useAvailableDays, bookingKeys } from '@/api/domains/bookings/queries';
import { bookingFetchers } from '@/api/domains/bookings/fetchers';
import { useVehicleContext } from '@/context/VehicleContext';
import { useAddresses } from '@/api/domains/addresses/queries';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { CustomerRoutes } from '@/lib/constants/routes';
import { useActiveAddons } from '@/api/domains/addons/queries';
import type { Vehicle } from '@/types/vehicle';
import type { Booking, BookingInput, TimeSlot } from '@/types/booking';
import type { Location as MapLocation } from '@/lib/maps';
import { geocodeAddress, getCurrentPosition, reverseGeocode } from '@/lib/maps/leaflet-utils';
import { cn } from '@/lib/utils/cn';
import { useRazorpay } from '@/hooks/useRazorpay';
import { getVehicleCategory, getVehicleBodyType, normalizeVehicleCategory, getVehicleDisplayType } from '@/utils/vehicle';

type Step = 'vehicle' | 'address' | 'schedule' | 'review' | 'confirmation';

interface StepConfig {
  id: Step;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CAR_TYPE_KEYWORDS = ['car', 'sedan', 'suv', 'hatchback', 'crossover', 'mpv', 'pickup'];
const BIKE_TYPE_KEYWORDS = ['bike', 'super-bike', 'sports-bike', 'cruiser', 'scooty', 'motorcycle', 'scooter'];
const DEPOSIT_PERCENTAGE = 0.3;

const stepsConfig: StepConfig[] = [
  {
    id: 'vehicle',
    title: 'Select Vehicle',
    description: 'Choose the vehicle for this service',
    icon: Car,
  },
  {
    id: 'address',
    title: 'Confirm Address',
    description: 'Pin your location on the map',
    icon: MapPin,
  },
  {
    id: 'schedule',
    title: 'Pick Slot',
    description: 'Select date and time',
    icon: CalendarDays,
  },
  {
    id: 'review',
    title: 'Review & Pay',
    description: 'Pay refundable deposit',
    icon: Wallet,
  },
  {
    id: 'confirmation',
    title: 'Booking Confirmed',
    description: 'We are all set',
    icon: ShieldCheck,
  },
];



function getPriceForVehicle(servicePricing: Array<{ vehicleType: string; price: number }> | undefined, vehicle: Vehicle | null): number | null {
  if (!servicePricing || !servicePricing.length || !vehicle) return null;

  const bodyType = getVehicleBodyType(vehicle);
  const category = getVehicleCategory(vehicle);

  // Try exact match with bodyType first
  if (bodyType) {
    const bodyTypeMatch = servicePricing.find((p) => String(p.vehicleType).toLowerCase() === bodyType.toLowerCase());
    if (bodyTypeMatch) return Number(bodyTypeMatch.price) || null;
  }

  // Try exact match with category
  if (category) {
    const categoryMatch = servicePricing.find((p) => String(p.vehicleType).toLowerCase() === category.toLowerCase());
    if (categoryMatch) return Number(categoryMatch.price) || null;
  }

  // Try partial matches
  if (category === 'bike') {
    const bikeMatch = servicePricing.find((p) => BIKE_TYPE_KEYWORDS.some((keyword) => String(p.vehicleType).toLowerCase().includes(keyword)));
    if (bikeMatch) return Number(bikeMatch.price) || null;
  }

  if (category === 'car') {
    const carMatch = servicePricing.find((p) => CAR_TYPE_KEYWORDS.some((keyword) => String(p.vehicleType).toLowerCase().includes(keyword)));
    if (carMatch) return Number(carMatch.price) || null;
  }

  const genericMatch = servicePricing.find((p) => String(p.vehicleType).toLowerCase().includes('car') || String(p.vehicleType).toLowerCase().includes('bike'));
  if (genericMatch) return Number(genericMatch.price) || null;

  return Number(servicePricing[0]?.price) || null;
}

function safeFormatDate(date: Date | null, formatString: string): string {
  if (!date) return '';
  try {
    return format(date, formatString);
  } catch (error) {
    return '';
  }
}


function isPastDate(date: Date): boolean {
  const reference = new Date();
  reference.setHours(0, 0, 0, 0);
  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);
  return candidate < reference;
}

function formatCurrency(amount: number | null | undefined): string {
  if (!amount || Number.isNaN(amount)) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function BookServicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryServiceId = searchParams.get('serviceId') || '';
  const addOnsParam = searchParams.get('addOns');

  const selectedAddOnIds = useMemo(() => {
    if (!addOnsParam) return [] as string[];
    return addOnsParam
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  }, [addOnsParam]);

  const { data: service, isLoading: serviceLoading } = useService(queryServiceId);
  const {
    vehicles,
    selectedVehicle: contextSelectedVehicle,
    selectVehicle,
    isLoading: vehiclesLoading,
  } = useVehicleContext();
  const queryClient = useQueryClient();

  // Refetch vehicles when page mounts to ensure fresh data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
  }, [queryClient]);
  const {
    data: addresses = [],
    isLoading: addressesLoading,
  } = useAddresses();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<Step>('vehicle');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [hasAttemptedGeoLocate, setHasAttemptedGeoLocate] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [bookingConfirmation, setBookingConfirmation] = useState<Booking | null>(null);
  const [depositInfo, setDepositInfo] = useState<{
    amount: number;
    paymentId: string;
    orderId: string;
  } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'full' | 'advance'>('advance');

  // Fetch all add-ons and filter to selected IDs
  const { data: allAddons = [] } = useActiveAddons();

  const addOnDetails = useMemo(() => {
    return selectedAddOnIds
      .map((id) => allAddons.find((addon) => addon._id === id))
      .filter((addon): addon is typeof allAddons[number] => Boolean(addon));
  }, [selectedAddOnIds, allAddons]);

  const baseServicePrice = useMemo(() => {
    if (!service?.pricing || service.pricing.length === 0) return 0;
    const prices = service.pricing.map((p) => Number(p.price) || 0).filter((price) => price > 0);
    if (!prices.length) return 0;
    return Math.min(...prices);
  }, [service?.pricing]);

  const serviceVehicleTypes = useMemo(() => {
    if (!service?.pricing || service.pricing.length === 0) return [] as ('car' | 'bike')[];
    const derivedTypes = service.pricing
      .map((p) => {
        const text = String(p.vehicleType || '').toLowerCase();
        if (BIKE_TYPE_KEYWORDS.some((keyword) => text.includes(keyword))) return 'bike';
        if (CAR_TYPE_KEYWORDS.some((keyword) => text.includes(keyword))) return 'car';
        return null;
      })
      .filter((value): value is 'car' | 'bike' => value !== null);
    return Array.from(new Set(derivedTypes));
  }, [service?.pricing]);

  const matchingVehicles = useMemo(() => {
    if (!vehicles.length) return [] as Vehicle[];
    if (!serviceVehicleTypes.length) return vehicles;

    return vehicles.filter((vehicle) => {
      const category = getVehicleCategory(vehicle) || normalizeVehicleCategory(vehicle.type || '');
      if (category === 'other') return false;
      return serviceVehicleTypes.includes(category);
    });
  }, [vehicles, serviceVehicleTypes]);

  const selectedVehicle = useMemo(() => {
    return vehicles.find((vehicle) => vehicle.id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  const selectedVehiclePrice = useMemo(() => {
    return getPriceForVehicle(service?.pricing, selectedVehicle) ?? baseServicePrice;
  }, [service?.pricing, selectedVehicle, baseServicePrice]);

  const addOnsTotal = useMemo(() => {
    return addOnDetails.reduce((sum, addon) => sum + (addon.price || 0), 0);
  }, [addOnDetails]);

  const totalAmount = useMemo(() => {
    return (selectedVehiclePrice || 0) + addOnsTotal;
  }, [selectedVehiclePrice, addOnsTotal]);

  const advanceAmount = useMemo(() => {
    const raw = Math.round(totalAmount * DEPOSIT_PERCENTAGE);
    return raw > 0 ? raw : totalAmount;
  }, [totalAmount]);

  const payableAmount = useMemo(() => {
    return selectedPaymentType === 'full' ? totalAmount : advanceAmount;
  }, [selectedPaymentType, totalAmount, advanceAmount]);

  const baseDuration = useMemo(() => {
    if (typeof service?.duration === 'number') {
      return service.duration;
    }
    const parsed = Number(service?.duration);
    return Number.isNaN(parsed) ? 60 : parsed;
  }, [service?.duration]);

  const totalDuration = useMemo(() => {
    const addOnDuration = addOnDetails.reduce((sum, addon) => sum + (addon.duration || 0), 0);
    return baseDuration + addOnDuration;
  }, [baseDuration, addOnDetails]);

  // Removed createBookingMutation - booking is now created after payment success

  const { processPayment, isLoading: razorpayLoading } = useRazorpay({
    onSuccess: async (response) => {
      // Payment verified and booking created by backend
      // Fetch created booking to show confirmation
      const bookingIdToUse = response.checkoutResult?.bookingId;
      if (bookingIdToUse) {
        try {
          const updatedBooking = await bookingFetchers.getBookingById(bookingIdToUse);
          setBookingConfirmation(updatedBooking);
          setDepositInfo({
            amount: payableAmount,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
          });
          setCurrentStep('confirmation');
          toast.success('Payment received! Once slot assigned to a staff we\'ll let you know.');
        } catch (error) {
          toast.error('Payment successful but failed to load booking details');
        }
      } else {
        toast.success('Payment received! Once slot assigned to a staff we\'ll let you know.');
      }
      setIsProcessingPayment(false);
    },
    onFailure: () => {
      toast.error('Payment failed. Please try again. Your slot is still available.');
      setIsProcessingPayment(false);
      // Booking remains in pending status, slot remains available
    },
    onDismiss: () => {
      setIsProcessingPayment(false);
      toast.info('Payment cancelled. Your slot is still available.');
    },
  });

  const serviceDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const {
    data: availableDaysData,
    isFetching: availableDaysFetching,
    refetch: refetchAvailableDays,
  } = useAvailableDays(service ? service.id : '', 30);

  const {
    data: availableSlots,
    isFetching: slotsFetching,
    refetch: refetchAvailableSlots,
  } = useAvailableSlots(service ? service.id : '', serviceDateKey);

  // Refetch slots when entering schedule step to get latest availability
  useEffect(() => {
    if (currentStep === 'schedule' && service?.id) {
      refetchAvailableDays();
      if (serviceDateKey) {
        refetchAvailableSlots();
      }
    }
  }, [currentStep, service?.id, serviceDateKey, refetchAvailableDays, refetchAvailableSlots]);

  const availableDays = availableDaysData?.availableDays || [];

  const currentStepIndex = stepsConfig.findIndex((step) => step.id === currentStep);

  const selectedAddress = useMemo(() => {
    return addresses.find((address) => address.id === selectedAddressId) || null;
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (addressesLoading) return;
    if (selectedAddressId) return;
    if (addresses.length === 0) return;

    const primary = addresses.find((address) => address.isPrimary);
    setSelectedAddressId((primary || addresses[0]).id);
  }, [addresses, addressesLoading, selectedAddressId]);

  useEffect(() => {
    if (!selectedAddress) return;
    const addressString = [selectedAddress.line1, selectedAddress.line2, selectedAddress.city, selectedAddress.state, selectedAddress.pincode]
      .filter(Boolean)
      .join(', ');

    if (!addressString) return;

    let isCancelled = false;

    geocodeAddress(addressString)
      .then((location) => {
        if (isCancelled) return;
        setSelectedLocation(location);
        setLocationConfirmed(false);
      })
      .catch(() => {
        /* silent failure */
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedAddress]);

  useEffect(() => {
    if (currentStep !== 'address') {
      // Reset geoLoading when leaving address step
      setGeoLoading(false);
      return;
    }
    if (hasAttemptedGeoLocate) return;

    let isCancelled = false;
    setGeoLoading(true);
    setHasAttemptedGeoLocate(true);

    getCurrentPosition()
      .then(async ({ lat, lng }) => {
        if (isCancelled) return;
        try {
          const address = await reverseGeocode(lat, lng);
          if (isCancelled) return;
          setSelectedLocation({ address, latitude: lat, longitude: lng });
          setLocationConfirmed(false);
        } catch (error) {
          /* ignore */
        }
      })
      .catch((error: any) => {
        if (!isCancelled) {
          toast.warning(error?.message || 'Unable to access your location.');
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setGeoLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      setGeoLoading(false);
    };
  }, [currentStep, hasAttemptedGeoLocate]);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicleId(vehicle.id);
    selectVehicle(vehicle.id);
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    setShowAddressModal(false);
  };

  const handleAddressAdded = () => {
    toast.success('Address added');
    setShowAddressModal(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    if (isPastDate(date)) {
      toast.error('Please choose a future date for your service.');
      return;
    }
    const dateKey = format(date, 'yyyy-MM-dd');
    if (availableDays.length > 0 && !availableDays.includes(dateKey)) {
      toast.error('This date is not available. Please select an available date.');
      return;
    }
    setSelectedDate(date);
    setSelectedSlot(null);
    setIsCalendarExpanded(false); // Collapse calendar when date is selected
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const goToNextStep = () => {
    if (currentStep === 'vehicle') {
      if (!selectedVehicle) {
        toast.error('Select a vehicle to continue.');
        return;
      }
      goToStep('address');
      return;
    }

    if (currentStep === 'address') {
      if (!selectedAddress) {
        toast.error('Select an address to continue.');
        return;
      }
      if (!selectedLocation) {
        toast.error('Confirm your location on the map.');
        return;
      }
      if (!locationConfirmed) {
        toast.warning('Confirm your pinned location before proceeding.');
        return;
      }
      goToStep('schedule');
      return;
    }

    if (currentStep === 'schedule') {
      if (!selectedDate) {
        toast.error('Select a date for your service.');
        return;
      }
      if (!selectedSlot) {
        toast.error('Select a time slot to continue.');
        return;
      }
      goToStep('review');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 'vehicle') return;
    const order: Step[] = ['vehicle', 'address', 'schedule', 'review', 'confirmation'];
    const index = order.indexOf(currentStep);
    if (index > 0) {
      setCurrentStep(order[index - 1]);
    }
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) {
      toast.error('Pin your location on the map first.');
      return;
    }
    setLocationConfirmed(true);
    toast.success('Location confirmed.');
  };

  const handlePayment = async () => {
    if (!service || !selectedVehicle || !selectedDate || !selectedSlot || !selectedAddress || !selectedLocation) {
      toast.error('Complete all previous steps before payment.');
      return;
    }

    if (!payableAmount || payableAmount <= 0) {
      toast.error('Unable to compute payment amount.');
      return;
    }

    const userName = user?.name || 'Customer';
    const userEmail = user?.email || 'customer@example.com';
    const userPhone = user?.phone || '+919999999999';

    setIsProcessingPayment(true);

    try {
      // Prepare booking data (will be created after successful payment)
      const bookingData: BookingInput = {
        serviceId: service.id,
        serviceName: service.name,
        vehicleId: selectedVehicle.id,
        slotId: selectedSlot.id,
        addressId: selectedAddressId,
        addOns: selectedAddOnIds,
        paymentType: selectedPaymentType,
        coordinates: selectedLocation ? {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        } : undefined,
      };

      const paymentDescription = selectedPaymentType === 'full'
        ? `Full Payment for ${service.name}`
        : `Advance (30%) for ${service.name}`;

      // Process payment with bookingData (booking will be created after payment success)
      await processPayment({
        bookingData: bookingData,
        amount: payableAmount,
        description: paymentDescription,
        paymentType: selectedPaymentType,
        userName,
        userEmail,
        userPhone,
        notes: {
          serviceId: service.id,
          vehicleId: selectedVehicle.id,
          scheduledDate: serviceDateKey,
          slot: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
          paymentType: selectedPaymentType,
          amount: String(payableAmount),
        },
      });
    } catch (error: any) {
      setIsProcessingPayment(false);
      toast.error(error?.message || 'Unable to process payment right now.');
    }
  };

  if (!queryServiceId) {
    return (
      <Error
        message="Service not specified"
        onRetry={() => router.push(CustomerRoutes.SERVICES)}
        details="Please select a service to continue with booking."
      />
    );
  }

  if (serviceLoading || vehiclesLoading) {
    return <Loading text="Preparing booking wizard..." />;
  }

  if (!service) {
    return (
      <Error
        message="Service unavailable"
        onRetry={() => router.push(CustomerRoutes.SERVICES)}
        details="We couldn't load this service. Please try again later."
      />
    );
  }



  const SummaryItem = ({
    icon,
    label,
    value,
    action,
  }: {
    icon: ReactNode;
    label: string;
    value: ReactNode;
    action?: ReactNode;
  }) => (
    <div className="rounded-xl border-2 border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {icon}
            <span>{label}</span>
          </div>
          <div className="mt-2 text-sm text-foreground">{value}</div>
        </div>
        {action}
      </div>
    </div>
  );

  const mapKey = selectedLocation ? `${selectedLocation.latitude}-${selectedLocation.longitude}` : 'no-location';

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-16">
      <div className="container-custom py-6 sm:py-8 lg:py-10">
        {/* Unified Booking Header */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="h-9 px-2 text-muted-foreground hover:text-foreground"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="text-sm font-medium text-muted-foreground">
              Step <span className="text-foreground">{currentStepIndex + 1}</span> of {stepsConfig.length}
            </div>
          </div>

          <div className="space-y-1 px-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {stepsConfig[currentStepIndex].title}
            </h1>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              Booking <span className="font-semibold text-foreground">{service.name}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{stepsConfig[currentStepIndex].description}</span>
            </p>
          </div>

          <Progress value={((currentStepIndex + 1) / stepsConfig.length) * 100} className="h-1" />
        </div>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 xl:grid-cols-[2.2fr_1fr]">
          <div className="space-y-4 sm:space-y-5">

            {currentStep === 'vehicle' && (
              <Card className="border-2">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">Select Your Vehicle</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Choose a vehicle that matches this service. Pricing adjusts based on vehicle category.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {matchingVehicles.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center">
                      <p className="text-sm font-semibold text-foreground">No matching vehicles found</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Add a {serviceVehicleTypes.includes('bike') ? 'bike' : 'car'} to continue booking this service.
                      </p>
                      <Button asChild className="mt-4">
                        <Link href={CustomerRoutes.VEHICLES}>Add Vehicle</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {matchingVehicles.map((vehicle) => {
                        const price = getPriceForVehicle(service.pricing, vehicle) ?? baseServicePrice;
                        const isActive = selectedVehicleId === vehicle.id;
                        const vehicleCategory = getVehicleCategory(vehicle) || normalizeVehicleCategory(vehicle.type || '');
                        const Icon = vehicleCategory === 'bike' ? Bike : Car;
                        return (
                          <div
                            key={vehicle.id}
                            role="button"
                            onClick={() => handleVehicleSelect(vehicle)}
                            className={cn(
                              'flex items-center justify-between gap-3 rounded-xl border-2 p-4 transition-all',
                              isActive ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/40'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn('rounded-xl p-3', isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground capitalize">
                                  {getVehicleDisplayType(vehicle)}
                                </p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide capitalize">
                                  {vehicle.category}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-primary">{formatCurrency(price)}</p>
                              <p className="text-[10px] text-muted-foreground">Includes base pricing</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-between sm:items-center">
                    <Button
                      variant="outline"
                      className="order-2 sm:order-1"
                      onClick={() => router.push(CustomerRoutes.VEHICLES)}
                    >
                      Manage Vehicles
                    </Button>
                    <Button
                      className="order-1 sm:order-2"
                      onClick={goToNextStep}
                      disabled={!selectedVehicle}
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 'address' && (
              <Card className="border-2">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">Confirm Service Location</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    We’ll arrive at the pinned location. You can move the pin or use the map search to adjust the spot.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SummaryItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="Delivery Address"
                    value={selectedAddress ? (
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold capitalize">{selectedAddress.label}</p>
                        <p className="text-muted-foreground">
                          {[selectedAddress.line1, selectedAddress.line2, selectedAddress.city].filter(Boolean).join(', ')}
                        </p>
                        <p className="text-muted-foreground">{selectedAddress.state} - {selectedAddress.pincode}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No address selected yet.</p>
                    )}
                    action={
                      <Button variant="outline" size="sm" onClick={() => setShowAddressModal(true)}>
                        Change
                      </Button>
                    }
                  />

                  <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
                    <p className="text-sm font-semibold text-primary">Tip</p>
                    <p className="text-xs text-muted-foreground">
                      Use the current location button or search to place the pin exactly where you want our team to arrive.
                    </p>
                  </div>

                  <div className="rounded-xl border-2 border-border">
                    <MapPicker
                      key={mapKey}
                      initialAddress={selectedLocation?.address}
                      initialLatitude={selectedLocation?.latitude}
                      initialLongitude={selectedLocation?.longitude}
                      onLocationSelect={(location) => {
                        setSelectedLocation(location);
                        setLocationConfirmed(false);
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-between sm:items-center">
                    <Button
                      variant="outline"
                      className="order-2 sm:order-1"
                      onClick={goToPreviousStep}
                    >
                      Back
                    </Button>
                    <div className="order-1 flex flex-col gap-2 sm:order-2 sm:flex-row">
                      <Button
                        variant={locationConfirmed ? 'outline' : 'default'}
                        onClick={handleConfirmLocation}
                        disabled={!selectedLocation}
                      >
                        {locationConfirmed ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Location Confirmed
                          </>
                        ) : (
                          'Confirm Location'
                        )}
                      </Button>
                      <Button onClick={goToNextStep} disabled={!locationConfirmed || !selectedAddress}>
                        Continue
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 'schedule' && (
              <Card className="border-2">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">Pick Date & Time</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Choose a convenient date. Available slots will appear once you select a day.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Calendar Section - Collapsible */}
                  <div className="space-y-3">
                    {selectedDate && !isCalendarExpanded && (
                      <div className="flex items-center justify-between rounded-xl border-2 border-border bg-muted/30 p-3">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">
                            Selected: {safeFormatDate(selectedDate, 'EEEE, MMM dd, yyyy')}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsCalendarExpanded(true)}
                          className="h-8"
                        >
                          Change Date
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {(isCalendarExpanded || !selectedDate) && (
                      <div className="rounded-xl border-2 border-border p-3 sm:p-4">
                        {availableDaysFetching ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="ml-2 text-sm text-muted-foreground">Loading available dates...</span>
                          </div>
                        ) : (
                          <Calendar
                            selected={selectedDate || undefined}
                            onSelect={handleDateSelect}
                            availableDays={availableDays}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Time Slots Section */}
                  {selectedDate && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">Available Time Slots</h3>
                        {selectedDate && (
                          <Badge variant="secondary" className="text-xs">
                            {safeFormatDate(selectedDate, 'MMM dd, yyyy')}
                          </Badge>
                        )}
                      </div>

                      {slotsFetching && (
                        <div className="rounded-lg border border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
                          <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                          Loading slots...
                        </div>
                      )}

                      {!slotsFetching && (
                        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                          {availableSlots?.slots?.length ? (
                            availableSlots.slots
                              .filter((slot) => slot.isAvailable === true) // Only show available slots
                              .map((slot) => {
                                const isActive = selectedSlot?.startTime === slot.startTime && selectedSlot?.endTime === slot.endTime;
                                return (
                                  <button
                                    key={`${slot.startTime}-${slot.endTime}`}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    className={cn(
                                      'rounded-xl border-2 p-3 text-left transition-all',
                                      isActive && 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20',
                                      !isActive && 'border-border hover:border-primary/50 hover:bg-primary/5'
                                    )}
                                  >
                                    <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                                      <span>{slot.startTime}</span>
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">Until {slot.endTime}</p>
                                    {isActive && (
                                      <p className="mt-2 text-xs font-medium text-primary">Selected</p>
                                    )}
                                  </button>
                                );
                              })
                          ) : (
                            <div className="col-span-full rounded-lg border border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
                              No slots available for this date. Please choose another day.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {!selectedDate && (
                    <div className="rounded-lg bg-muted/60 p-4 text-center text-sm text-muted-foreground">
                      Select a date above to view available time slots.
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="outline" onClick={goToPreviousStep}>
                      Back
                    </Button>
                    <Button onClick={goToNextStep} disabled={!selectedSlot || !selectedDate}>
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 'review' && (
              <Card className="border-2">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">Review & Pay</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Choose your payment option and confirm your booking.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-3 rounded-xl border-2 border-border bg-muted/40 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Service Price</span>
                      <span className="font-semibold text-foreground">{formatCurrency(selectedVehiclePrice || baseServicePrice)}</span>
                    </div>
                    {addOnDetails.length > 0 && (
                      <div className="space-y-2">
                        <Separator />
                        {addOnDetails.map((addon) => (
                          <div key={addon._id} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{addon.name}</span>
                            <span className="font-medium text-foreground">{formatCurrency(addon.price)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <Separator />
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-foreground">Total Amount</span>
                      <span className="text-primary">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>

                  {/* Payment Option Selector */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Choose Payment Option</h3>
                    <RadioGroup
                      value={selectedPaymentType}
                      onValueChange={(value) => setSelectedPaymentType(value as 'full' | 'advance')}
                      className="space-y-3"
                    >
                      {/* Full Payment Option */}
                      <div
                        className={cn(
                          'flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all',
                          selectedPaymentType === 'full'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/40'
                        )}
                        onClick={() => setSelectedPaymentType('full')}
                      >
                        <RadioGroupItem value="full" id="payment-full" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="payment-full" className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                'p-1.5 rounded-lg',
                                selectedPaymentType === 'full' ? 'bg-primary/10' : 'bg-muted'
                              )}>
                                <CreditCard className="h-4 w-4" />
                              </div>
                              <span className="font-semibold text-foreground">Pay Full Amount</span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Pay {formatCurrency(totalAmount)} now via Razorpay. No balance due after service.
                            </p>
                          </Label>
                        </div>
                      </div>

                      {/* Advance Payment Option */}
                      <div
                        className={cn(
                          'flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all',
                          selectedPaymentType === 'advance'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/40'
                        )}
                        onClick={() => setSelectedPaymentType('advance')}
                      >
                        <RadioGroupItem value="advance" id="payment-advance" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="payment-advance" className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                'p-1.5 rounded-lg',
                                selectedPaymentType === 'advance' ? 'bg-primary/10' : 'bg-muted'
                              )}>
                                <Wallet className="h-4 w-4" />
                              </div>
                              <span className="font-semibold text-foreground">Pay Advance (30%)</span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Pay {formatCurrency(advanceAmount)} now. Balance of {formatCurrency(totalAmount - advanceAmount)} due after service.
                            </p>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Payment Summary */}
                  <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">Amount to Pay Now</span>
                      <span className="text-lg font-bold text-primary">{formatCurrency(payableAmount)}</span>
                    </div>
                    {selectedPaymentType === 'advance' && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Remaining {formatCurrency(totalAmount - advanceAmount)} payable after service completion
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border-2 border-border bg-muted/50 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-red-500">Cancellation Policy</p>
                        <p className="text-xs text-muted-foreground">
                          Full refund available if cancelled within 1 hour of booking. Refunds are processed within 3-5 business days.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="outline" onClick={goToPreviousStep}>
                      Back
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessingPayment || razorpayLoading}
                    >
                      {(isProcessingPayment || razorpayLoading) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {selectedPaymentType === 'full' ? 'Pay & Confirm' : 'Pay Advance & Confirm'} ({formatCurrency(payableAmount)})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 'confirmation' && bookingConfirmation && (
              <Card className="border-2">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-500/20 p-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">Booking Confirmed</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Your booking is locked in. We’ll send reminders as the service date approaches.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border-2 border-border bg-muted/40 p-4">
                    <p className="text-sm font-semibold text-foreground">Booking ID</p>
                    <p className="mt-1 text-sm text-muted-foreground">{bookingConfirmation.id}</p>
                  </div>

                  <SummaryItem
                    icon={<Car className="h-4 w-4 text-primary" />}
                    label="Vehicle"
                    value={selectedVehicle ? (
                      <div>
                        <p className="text-sm font-semibold text-foreground capitalize">
                          {getVehicleDisplayType(selectedVehicle)}
                        </p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide capitalize">{selectedVehicle.category}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Vehicle details unavailable</p>
                    )}
                  />

                  <SummaryItem
                    icon={<CalendarDays className="h-4 w-4 text-primary" />}
                    label="Schedule"
                    value={
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {safeFormatDate(selectedDate, 'EEEE, dd MMM yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">{selectedSlot?.startTime} - {selectedSlot?.endTime}</p>
                      </div>
                    }
                  />

                  <SummaryItem
                    icon={<MapPin className="h-4 w-4 text-primary" />}
                    label="Service Location"
                    value={
                      <div className="text-sm text-muted-foreground">
                        {selectedLocation?.address || 'Location confirmed'}
                      </div>
                    }
                  />

                  <SummaryItem
                    icon={<CreditCard className="h-4 w-4 text-primary" />}
                    label={selectedPaymentType === 'full' ? 'Payment' : 'Advance Paid'}
                    value={
                      <div className="space-y-1 text-sm text-foreground">
                        <p className="font-semibold">{formatCurrency(depositInfo?.amount || payableAmount)}</p>
                        {depositInfo && (
                          <p className="text-xs text-muted-foreground">
                            Paid via Razorpay • Ref: {depositInfo.paymentId}
                          </p>
                        )}
                        {selectedPaymentType === 'advance' && (
                          <p className="text-xs text-muted-foreground">
                            Balance due: {formatCurrency(totalAmount - (depositInfo?.amount || advanceAmount))}
                          </p>
                        )}
                      </div>
                    }
                  />

                  <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-semibold text-primary">What happens next?</p>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>• Our team will review your booking and assign staff.</li>
                      <li>• You can manage this booking from your orders dashboard.</li>
                      {selectedPaymentType === 'advance' && (
                        <li>• Remaining balance is payable after service completion.</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="outline" onClick={() => router.push(CustomerRoutes.SERVICES)}>
                      Book Another Service
                    </Button>
                    <Button onClick={() => router.push(CustomerRoutes.ORDERS_SERVICES)}>
                      View My Bookings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="border-2 border-border">
              <CardHeader className="border-b border-border pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Service</p>
                  <p className="text-sm font-semibold text-foreground">{service.name}</p>
                </div>

                <SummaryItem
                  icon={<Car className="h-4 w-4 text-primary" />}
                  label="Vehicle"
                  value={selectedVehicle ? (
                    <div className="text-sm text-foreground">
                      <p className="capitalize">{getVehicleDisplayType(selectedVehicle)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{selectedVehicle.category}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Pending selection</p>
                  )}
                />

                <SummaryItem
                  icon={<CalendarDays className="h-4 w-4 text-primary" />}
                  label="Schedule"
                  value={selectedDate && selectedSlot ? (
                    <div>
                      <p className="text-sm text-foreground">{safeFormatDate(selectedDate, 'dd MMM yyyy')}</p>
                      <p className="text-xs text-muted-foreground">{selectedSlot.startTime} - {selectedSlot.endTime}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Pending selection</p>
                  )}
                />

                {selectedVehicle && (
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimate</span>
                      <span className="font-semibold text-foreground">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{selectedPaymentType === 'full' ? 'Full Payment' : 'Advance (30%)'}</span>
                      <span>{formatCurrency(payableAmount)}</span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">Add-ons</p>
                  {addOnDetails.length ? (
                    <ul className="mt-2 space-y-1">
                      {addOnDetails.map((addon) => (
                        <li key={addon._id} className="flex items-center justify-between">
                          <span>{addon.name}</span>
                          <span>{formatCurrency(addon.price)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2">No add-ons selected</p>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      <AddressSelectionModal
        open={showAddressModal}
        onOpenChange={setShowAddressModal}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={handleAddressSelect}
        onAddressAdded={handleAddressAdded}
      />
    </div>
  );
}

