'use client';

import { useState, useEffect } from 'react';
import { ServiceCard } from '@/components/customer/ServiceCard';
import { VehicleTypeFilter } from '@/components/shared/selectors/VehicleTypeFilter';
import { CategoryFilter } from '@/components/shared/selectors/CategoryFilter';
import { Pagination } from '@/components/shared/crud/Pagination';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock services data
const allServices = [
  // Car services
  {
    id: 'service_001',
    name: 'Premium Car Wash',
    description: 'Complete exterior wash with premium products',
    price: 499,
    duration: 45,
    rating: 4.8,
    reviewCount: 120,
    categoryId: 'cat_ext',
    vehicleTypeId: 'car',
    image: '/images/services/car-wash.jpg',
  },
  {
    id: 'service_002',
    name: 'Interior Deep Clean',
    description: 'Professional interior detailing and sanitization',
    price: 799,
    duration: 90,
    rating: 4.9,
    reviewCount: 95,
    categoryId: 'cat_int',
    vehicleTypeId: 'car',
    image: '/images/services/interior-clean.jpg',
  },
  {
    id: 'service_003',
    name: 'Full Car Detailing',
    description: 'Complete interior and exterior detailing package',
    price: 1499,
    duration: 180,
    rating: 5.0,
    reviewCount: 78,
    categoryId: 'cat_full',
    vehicleTypeId: 'car',
    image: '/images/services/full-detailing.jpg',
  },
  
  // Bike services
  {
    id: 'service_004',
    name: 'Bike Express Wash',
    description: 'Quick and efficient bike washing',
    price: 199,
    duration: 20,
    rating: 4.7,
    reviewCount: 156,
    categoryId: 'cat_bike_wash',
    vehicleTypeId: 'bike',
    image: '/images/services/bike-wash.jpg',
  },
  {
    id: 'service_005',
    name: 'Bike Premium Wash',
    description: 'Complete bike wash with wax polish',
    price: 299,
    duration: 30,
    rating: 4.8,
    reviewCount: 89,
    categoryId: 'cat_bike_wash',
    vehicleTypeId: 'bike',
    image: '/images/services/bike-premium.jpg',
  },
  {
    id: 'service_006',
    name: 'Basic Bike Service',
    description: 'Oil change and basic maintenance',
    price: 599,
    duration: 45,
    rating: 4.6,
    reviewCount: 67,
    categoryId: 'cat_bike_service',
    vehicleTypeId: 'bike',
    image: '/images/services/bike-service.jpg',
  },
  
  // Home cleaning services
  {
    id: 'service_007',
    name: 'Deep House Cleaning',
    description: 'Complete deep cleaning of entire house',
    price: 1999,
    duration: 240,
    rating: 4.9,
    reviewCount: 102,
    categoryId: 'cat_home_deep',
    vehicleTypeId: 'home',
    image: '/images/services/deep-clean.jpg',
  },
  {
    id: 'service_008',
    name: 'Regular House Cleaning',
    description: 'Daily cleaning and maintenance',
    price: 899,
    duration: 120,
    rating: 4.7,
    reviewCount: 134,
    categoryId: 'cat_home_regular',
    vehicleTypeId: 'home',
    image: '/images/services/regular-clean.jpg',
  },
  {
    id: 'service_009',
    name: 'Kitchen Deep Clean',
    description: 'Specialized kitchen cleaning service',
    price: 699,
    duration: 90,
    rating: 4.8,
    reviewCount: 87,
    categoryId: 'cat_home_deep',
    vehicleTypeId: 'home',
    image: '/images/services/kitchen-clean.jpg',
  },
];

const ITEMS_PER_PAGE = 6;

export default function ServicesPage() {
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Vehicle types with actual counts
  const vehicleTypes = [
    { id: 'car', name: 'Car Services', icon: 'Car', count: 3 },
    { id: 'bike', name: 'Bike Services', icon: 'Bike', count: 3 },
    { id: 'home', name: 'Home Cleaning', icon: 'Home', count: 3 },
  ];

  // All categories
  const allCategories = [
    { id: 'cat_ext', name: 'Exterior Wash', vehicleTypeId: 'car', count: 1 },
    { id: 'cat_int', name: 'Interior Detailing', vehicleTypeId: 'car', count: 1 },
    { id: 'cat_full', name: 'Full Detailing', vehicleTypeId: 'car', count: 1 },
    { id: 'cat_bike_wash', name: 'Bike Wash', vehicleTypeId: 'bike', count: 2 },
    { id: 'cat_bike_service', name: 'Bike Service', vehicleTypeId: 'bike', count: 1 },
    { id: 'cat_home_deep', name: 'Deep Cleaning', vehicleTypeId: 'home', count: 2 },
    { id: 'cat_home_regular', name: 'Regular Cleaning', vehicleTypeId: 'home', count: 1 },
  ];

  const getFilteredCategories = () => {
    if (selectedVehicleTypes.length === 0) {
      return allCategories;
    }
    return allCategories.filter(cat => selectedVehicleTypes.includes(cat.vehicleTypeId));
  };

  const categories = getFilteredCategories();

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
  }, [selectedVehicleTypes, selectedCategories]);

  const toggleVehicleType = (typeId: string) => {
    setSelectedVehicleTypes(prev => {
      const newSelection = prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId];
      
      if (!prev.includes(typeId)) {
        setSelectedCategories([]);
      }
      return newSelection;
    });
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredServices = allServices.filter(service => {
    const matchesVehicleType = selectedVehicleTypes.length === 0 || 
      selectedVehicleTypes.includes(service.vehicleTypeId);
    
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(service.categoryId);
    
    return matchesVehicleType && matchesCategory;
  });

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  const clearAllFilters = () => {
    setSelectedVehicleTypes([]);
    setSelectedCategories([]);
  };

  const totalActiveFilters = selectedVehicleTypes.length + selectedCategories.length;

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Compact Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            Our Services
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Professional car, bike, and home cleaning services
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <VehicleTypeFilter
                  vehicleTypes={vehicleTypes}
                  selectedTypes={selectedVehicleTypes}
                  onToggle={toggleVehicleType}
                  onClearAll={() => {
                    setSelectedVehicleTypes([]);
                    setSelectedCategories([]);
                  }}
                />

                {categories.length > 0 && (
                  <CategoryFilter
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onToggle={toggleCategory}
                    onClearAll={() => setSelectedCategories([])}
                  />
                )}
              </div>
            </aside>

            {/* Services grid */}
            <div className="flex-1 min-w-0">
              {/* Active Filters Pills */}
              {totalActiveFilters > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6 p-3 sm:p-4 bg-muted rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground">Filters:</span>
                  
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

                  {selectedCategories.map((categoryId) => {
                    const category = categories.find(c => c.id === categoryId);
                    return (
                      <Badge
                        key={categoryId}
                        variant="secondary"
                        className="cursor-pointer hover:opacity-80 transition-opacity text-xs"
                        onClick={() => toggleCategory(categoryId)}
                      >
                        {category?.name}
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
                    {paginatedServices.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 sm:mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        totalItems={filteredServices.length}
                      />
                    </div>
                  )}
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
                    Try adjusting your filters
                  </p>
                  <Button onClick={clearAllFilters} size="sm">
                    Clear Filters
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
            onClick={() => setShowFilters(true)}
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
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-2xl border-t-2 border-border max-h-[88vh] flex flex-col">
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
                onClick={() => setShowFilters(false)}
                className="rounded-full h-9 w-9"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
              <VehicleTypeFilter
                vehicleTypes={vehicleTypes}
                selectedTypes={selectedVehicleTypes}
                onToggle={toggleVehicleType}
                onClearAll={() => {
                  setSelectedVehicleTypes([]);
                  setSelectedCategories([]);
                }}
              />

              {categories.length > 0 && (
                <CategoryFilter
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onToggle={toggleCategory}
                  onClearAll={() => setSelectedCategories([])}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-border bg-muted/30 flex-shrink-0">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 font-semibold text-sm"
                  onClick={clearAllFilters}
                >
                  Clear
                </Button>
                <Button
                  className="flex-1 h-11 font-semibold text-sm shadow-md"
                  onClick={() => setShowFilters(false)}
                >
                  Show {filteredServices.length}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
