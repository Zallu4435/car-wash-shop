'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export interface FilterOption {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  type?: 'select' | 'dateRange';
}

interface SearchFilterProps {
  searchPlaceholder?: string;
  onSearchChange: (search: string) => void;
  filterOptions?: FilterOption[];
  onFilterChange?: (filters: Record<string, string>) => void;
  debounceMs?: number;
  className?: string;
}

export function SearchFilter({
  searchPlaceholder = 'Search...',
  onSearchChange,
  filterOptions = [],
  onFilterChange,
  debounceMs = 300,
  className = '',
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs, onSearchChange]);

  // Notify parent of filter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (value === '' || !value) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  };

  const clearFilter = (key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setDateRange({});
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        {filterOptions.length > 0 && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 sm:h-10 px-3 sm:px-4 gap-2 flex-shrink-0 w-full sm:w-auto text-xs sm:text-sm"
              >
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="default"
                    className="h-4 sm:h-5 min-w-[16px] sm:min-w-[20px] rounded-full px-1 flex items-center justify-center text-[9px] sm:text-[10px] font-medium"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] max-w-[280px] sm:max-w-sm p-3 sm:p-4" align="end" sideOffset={8}>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h4 className="font-semibold text-xs sm:text-sm">Filters</h4>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {filterOptions.map((filterOption) => (
                  <div key={filterOption.value} className="space-y-1.5 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-medium">
                      {filterOption.label}
                    </label>
                    
                    {filterOption.type === 'dateRange' ? (
                      <div className="space-y-2">
                        <Select
                          value={filters[filterOption.value] || 'all'}
                          onValueChange={(value) => {
                            if (value === 'all' || value === '') {
                              clearFilter(filterOption.value);
                            } else if (value === 'custom') {
                              handleFilterChange(filterOption.value, 'custom');
                            } else {
                              handleFilterChange(filterOption.value, value);
                              setDateRange({});
                            }
                          }}
                        >
                          <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                            <SelectValue placeholder={`Select ${filterOption.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOption.options.map((option) => (
                              <SelectItem
                                key={option.value || 'all'}
                                value={option.value || 'all'}
                                className="text-sm"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom" className="text-sm">
                              Custom Range
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {filters[filterOption.value] === 'custom' && (
                          <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
                            <p className="text-xs font-medium">Custom Date Range</p>
                            <div className="space-y-2">
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">From</label>
                                <Input
                                  type="date"
                                  value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                                  onChange={(e) => {
                                    const newFrom = e.target.value ? new Date(e.target.value) : undefined;
                                    setDateRange(prev => ({ ...prev, from: newFrom }));
                                    if (newFrom && dateRange.to) {
                                      const customValue = `${format(newFrom, 'yyyy-MM-dd')}_${format(dateRange.to, 'yyyy-MM-dd')}`;
                                      handleFilterChange(filterOption.value, customValue);
                                    }
                                  }}
                                  className="h-9 text-sm"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">To</label>
                                <Input
                                  type="date"
                                  value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                                  onChange={(e) => {
                                    const newTo = e.target.value ? new Date(e.target.value) : undefined;
                                    setDateRange(prev => ({ ...prev, to: newTo }));
                                    if (dateRange.from && newTo) {
                                      const customValue = `${format(dateRange.from, 'yyyy-MM-dd')}_${format(newTo, 'yyyy-MM-dd')}`;
                                      handleFilterChange(filterOption.value, customValue);
                                    }
                                  }}
                                  min={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined}
                                  className="h-9 text-sm"
                                />
                              </div>
                            </div>
                            {dateRange.from && dateRange.to && (
                              <div className="pt-2 border-t">
                                <p className="text-xs text-center font-medium text-primary">
                                  {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Select
                        value={filters[filterOption.value] || 'all'}
                        onValueChange={(value) => {
                          if (value === 'all' || value === '') {
                            clearFilter(filterOption.value);
                          } else {
                            handleFilterChange(filterOption.value, value);
                          }
                        }}
                      >
                        <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                          <SelectValue placeholder={`Select ${filterOption.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOption.options.map((option) => (
                            <SelectItem
                              key={option.value || 'all'}
                              value={option.value || 'all'}
                              className="text-sm"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {Object.entries(filters).map(([key, value]) => {
            const filterOption = filterOptions.find((f) => f.value === key);
            const optionLabel = filterOption?.options.find(
              (o) => o.value === value
            )?.label;
            return (
              <Badge
                key={key}
                variant="secondary"
                className="gap-1 sm:gap-1.5 pr-0.5 sm:pr-1 text-[10px] sm:text-xs h-6 sm:h-7"
              >
                <span className="font-medium">{filterOption?.label}:</span>
                <span>{optionLabel}</span>
                <button
                  onClick={() => clearFilter(key)}
                  className="ml-0.5 hover:bg-muted rounded-full p-0.5 transition-colors cursor-pointer"
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
