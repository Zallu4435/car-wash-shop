'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/customer/ProductCard';
import { CategoryFilter } from '@/components/shared/selectors/CategoryFilter';
import { Pagination } from '@/components/shared/crud/Pagination';
import { useProducts, useProductCategories } from '@/api/domains/products/queries';
import { Search, SlidersHorizontal, X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ProductFilters } from '@/types/product';
import Loading from '@/components/shared/display/Loading';

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // API filters
  const filters: ProductFilters = {
    category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  };

  // API calls
  const { data: productsResponse, isLoading: productsLoading } = useProducts(filters);
  const { data: categories = [], isLoading: categoriesLoading } = useProductCategories();

  const products = productsResponse?.data || [];
  const totalPages = productsResponse?.totalPages || 1;

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
  }, [selectedCategories]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Convert categories to the expected format
  const categoryFilters = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    count: products.filter(p => p.category === cat.id).length,
  }));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Loading state
  if (productsLoading || categoriesLoading) {
    return <Loading text="Loading products..." />;
  }

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            Shop Products
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Premium car care products for professional results
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <CategoryFilter
                  categories={categoryFilters}
                  selectedCategories={selectedCategories}
                  onToggle={toggleCategory}
                  onClearAll={() => setSelectedCategories([])}
                />
              </div>
            </aside>

            {/* Products grid */}
            <div className="flex-1 min-w-0">
              {/* Active Filters Pills */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6 p-3 sm:p-4 bg-muted rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground">Filters:</span>
                  {selectedCategories.map((categoryId) => {
                    const category = categoryFilters.find(c => c.id === categoryId);
                    return (
                      <Badge
                        key={categoryId}
                        variant="default"
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
                    onClick={() => setSelectedCategories([])}
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
                  <span className="font-semibold text-foreground">{Math.min(endIndex, products.length)}</span> of{' '}
                  <span className="font-semibold text-foreground">{products.length}</span> results
                </p>
              </div>

              {/* Products Grid */}
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product as any} />
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
                        totalItems={products.length}
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
                    No products found
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                    Try adjusting your filters
                  </p>
                  <Button onClick={() => setSelectedCategories([])} size="sm">
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
            {selectedCategories.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-accent text-accent-foreground font-bold text-xs"
              >
                {selectedCategories.length}
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
          
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl shadow-2xl border-t-2 border-border max-h-[88vh] flex flex-col force-sheet-bg">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">Filters</h2>
                  <p className="text-xs text-muted-foreground">
                    {products.length} result{products.length !== 1 ? 's' : ''}
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
            <div className="overflow-y-auto flex-1 px-5 py-5">
              <CategoryFilter
                categories={categoryFilters}
                selectedCategories={selectedCategories}
                onToggle={toggleCategory}
                onClearAll={() => setSelectedCategories([])}
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-border bg-muted/30 flex-shrink-0">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 font-semibold text-sm"
                  onClick={() => setSelectedCategories([])}
                >
                  Clear
                </Button>
                <Button
                  className="flex-1 h-11 font-semibold text-sm shadow-md"
                  onClick={() => setShowFilters(false)}
                >
                  Show {products.length}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
