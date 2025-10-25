'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/customer/ProductCard';
import { CategoryFilter } from '@/components/shared/selectors/CategoryFilter';
import { Pagination } from '@/components/shared/crud/Pagination';
import { getMockData } from '@/lib/api/mockData';
import { Search, SlidersHorizontal, X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ITEMS_PER_PAGE = 8; // Show 8 products per page

export default function ProductsPage() {
  const products = getMockData.products();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { id: 'cat_clean', name: 'Cleaning Products', count: 2 },
    { id: 'cat_polish', name: 'Polish & Wax', count: 1 },
    { id: 'cat_accessories', name: 'Accessories', count: 1 },
  ];

  // Prevent body scroll when modal is open
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

  // Reset to page 1 when filters change
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

  const filteredProducts = selectedCategories.length > 0
    ? products.filter(p => selectedCategories.includes(p.categoryId))
    : products;

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      {/* Compact Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Shop Products
          </h1>
          <p className="text-muted-foreground">
            Premium car care products for professional results
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
            {/* Desktop Sidebar with filters */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <CategoryFilter
                  categories={categories}
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
                <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-muted rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground">Active filters:</span>
                  {selectedCategories.map((categoryId) => {
                    const category = categories.find(c => c.id === categoryId);
                    return (
                      <Badge
                        key={categoryId}
                        variant="default"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
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
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> to{' '}
                  <span className="font-semibold text-foreground">{Math.min(endIndex, filteredProducts.length)}</span> of{' '}
                  <span className="font-semibold text-foreground">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Products Grid */}
              {paginatedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        totalItems={filteredProducts.length}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                    <Search className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No products found
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Try adjusting your filters to see more results
                  </p>
                  <Button onClick={() => setSelectedCategories([])}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Sticky Bottom Filter Button (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-gradient-to-t from-background via-background to-transparent pb-4 pt-8 px-4">
          <Button
            variant="default"
            size="lg"
            className="w-full shadow-2xl h-14 text-base font-semibold"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filters
            {selectedCategories.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-primary-foreground text-primary font-bold"
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
          {/* Backdrop Overlay */}
          <div 
            className="lg:hidden fixed inset-0 z-50 bg-black/70"
            onClick={() => setShowFilters(false)}
          />
          
          {/* Modal Content */}
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl shadow-2xl border-t-2 border-border max-h-[85vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Filters</h2>
                  <p className="text-xs text-muted-foreground">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
                className="rounded-full hover:bg-muted h-10 w-10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto flex-1 px-6 py-6">
              <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                onToggle={toggleCategory}
                onClearAll={() => setSelectedCategories([])}
              />
            </div>

            {/* Modal Footer - Fixed */}
            <div className="px-6 py-5 border-t-2 border-border bg-muted/20 flex-shrink-0">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 font-semibold"
                  onClick={() => setSelectedCategories([])}
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1 h-12 font-semibold shadow-lg"
                  onClick={() => setShowFilters(false)}
                >
                  Show {filteredProducts.length} Result{filteredProducts.length !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
