'use client';

import { useState, useEffect } from 'react';
import { ServiceCard } from '@/components/customer/ServiceCard';
import { VehicleTypeFilter } from '@/components/shared/selectors/VehicleTypeFilter';
import { Pagination } from '@/components/admin/Pagination';
import { Search, SlidersHorizontal, X, Car, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleSelectionModal } from '@/components/shared/selectors/VehicleSelectionModal';
import { useServices } from '@/api/domains/services/queries';
import type { ServiceFilters } from '@/types/service';
import Loading from '@/components/shared/display/Loading';
import { useVehicleContext } from '@/context/VehicleContext';
import { mockServiceTypes } from '@/mocks/data/customer-mock-data';
import { getVehicleCategory } from '@/utils/vehicle';

export default function ServicesPage() {
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Get selected vehicle from context
  const { selectedVehicle, vehicles, selectVehicle } = useVehicleContext();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // API filters - category is now 'bike' or 'car' based on vehicle type
  const filters: ServiceFilters = {
    category: selectedVehicleTypes.length > 0 ? selectedVehicleTypes[0] as 'car' | 'bike' : undefined,
    search: debouncedSearch || undefined,
  };

  // Fetch all services without category filter for count calculations
  const allServicesFilters: ServiceFilters = {
    search: debouncedSearch || undefined,
    // No category filter - we need all services to calculate accurate counts
  };

  // API calls
  const { data: servicesResponse, isLoading: servicesLoading } = useServices(filters);
  const { data: allServicesResponse } = useServices(allServicesFilters);

  const allServices = servicesResponse?.data || [];
  const allServicesForCounts = allServicesResponse?.data || [];

  // Helper function to get category ID from service (handles both string and object)
  const getCategoryId = (service: any): string | undefined => {
    if (!service.category) return undefined;
    if (typeof service.category === 'string') return service.category;
    return service.category.id || service.categoryId;
  };

  // Vehicle types with actual counts from all services (not filtered by category)
  const vehicleTypes = mockServiceTypes.map(type => ({
    id: type.id,
    name: type.name,
    icon: type.icon,
    count: allServicesForCounts.filter((s: any) => {
      const categoryId = getCategoryId(s);
      return categoryId === type.id || categoryId?.toLowerCase() === type.id.toLowerCase();
    }).length,
  }));

  const handleOpenFilters = () => {
    setShowFilters(true);
    setIsOpening(true);
    // Small delay to trigger animation
    setTimeout(() => {
      setIsOpening(false);
    }, 50);
  };

  const handleCloseFilters = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowFilters(false);
      setIsClosing(false);
    }, 500); // Match animation duration
  };

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedVehicleTypes, debouncedSearch]);

  const toggleVehicleType = (typeId: string) => {
    setSelectedVehicleTypes(prev => {
      const newSelection = prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [typeId]; // Only allow one selection at a time
      return newSelection;
    });
  };

  const filteredServices = allServices.filter((service: any) => {
    if (selectedVehicleTypes.length === 0) return true;
    const categoryId = getCategoryId(service);
    return categoryId && selectedVehicleTypes.some(typeId => 
      categoryId === typeId || categoryId.toLowerCase() === typeId.toLowerCase()
    );
  });

  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  const clearAllFilters = () => {
    setSelectedVehicleTypes([]);
    setSearchQuery('');
  };

  const totalActiveFilters = selectedVehicleTypes.length + (debouncedSearch ? 1 : 0);

  // Loading state
  if (servicesLoading) {
    return <Loading text="Loading services..." />;
  }

  // No price shown on list view as pricing varies by vehicle type

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Compact Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Our Services</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Professional car, bike, and home cleaning services</p>

        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                {/* Search Bar */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">
                    Search Services
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <VehicleTypeFilter
                  vehicleTypes={vehicleTypes}
                  selectedTypes={selectedVehicleTypes}
                  onToggle={toggleVehicleType}
                  onClearAll={() => {
                    setSelectedVehicleTypes([]);
                  }}
                />
              </div>
            </aside>

            {/* Services grid */}
            <div className="flex-1 min-w-0">
              {/* Active Filters Pills */}
              {totalActiveFilters > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6 p-3 sm:p-4 bg-muted rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground">Active:</span>
                  
                  {debouncedSearch && (
                    <Badge
                      variant="default"
                      className="cursor-pointer hover:opacity-80 transition-opacity text-xs"
                      onClick={() => setSearchQuery('')}
                    >
                      Search: {debouncedSearch}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}

                  {selectedVehicleTypes.map((typeId) => {
                    const type = vehicleTypes.find(t => t.id === typeId);
                    return (
                      <Badge
                        key={typeId}
                        variant="default"
                        className="cursor-pointer hover:opacity-80 transition-opacity text-xs"
                        onClick={() => toggleVehicleType(typeId)}
                      >
                        {type?.name}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    );
                  })}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs h-7 ml-auto"
                  >
                    Clear All
                  </Button>
                </div>
              )}

              {/* Results Count */}
              <div className="mb-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{startIndex + 1}</span>-
                  <span className="font-semibold text-foreground">{Math.min(endIndex, filteredServices.length)}</span> of{' '}
                  <span className="font-semibold text-foreground">{filteredServices.length}</span> results
                </p>
              </div>

              {/* Services Grid */}
              {paginatedServices.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {paginatedServices.map((service: any) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-6 sm:mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      pageSize={pageSize}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={(newSize) => {
                        setPageSize(newSize);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-12 sm:py-16">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full mb-4">
                    <Search className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                    No services found
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                    Try adjusting your search or filters
                  </p>
                  <Button onClick={clearAllFilters} size="sm">
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Filter Button - Header Style */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-background/95 backdrop-blur-xl border-t border-border shadow-lg px-4 py-3">
          <Button
            variant="default"
            size="lg"
            className="w-full shadow-md h-12 text-sm sm:text-base font-semibold"
            onClick={handleOpenFilters}
          >
            <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span>Filters</span>
            {totalActiveFilters > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-accent text-accent-foreground font-bold text-xs"
              >
                {totalActiveFilters}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <>
          <div 
            className={`lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
              isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            onClick={handleCloseFilters}
          />
          
          <div 
            className={`lg:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl shadow-2xl border-t-2 border-border max-h-[88vh] flex flex-col force-sheet-bg transition-all duration-500 ease-in-out ${
              isOpening ? 'translate-y-full' : isClosing ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
            }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">Filters</h2>
                  <p className="text-xs text-muted-foreground">
                    {filteredServices.length} result{filteredServices.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseFilters}
                className="rounded-full h-9 w-9"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
              {/* Search Bar */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground block">
                  Search Services
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-base border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <VehicleTypeFilter
                vehicleTypes={vehicleTypes}
                selectedTypes={selectedVehicleTypes}
                onToggle={toggleVehicleType}
                onClearAll={() => {
                  setSelectedVehicleTypes([]);
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-border bg-muted/30 flex-shrink-0">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 font-semibold text-sm"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1 h-11 font-semibold text-sm shadow-md"
                  onClick={handleCloseFilters}
                >
                  Show {filteredServices.length}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Vehicle Selection Modal */}
      <VehicleSelectionModal
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        onSelect={(vehicle) => {
          // Select vehicle using context - this will trigger re-render with new prices
          selectVehicle(vehicle.id);
        }}
        selectedVehicleId={selectedVehicle?.id}
      />
    </div>
  );
}
