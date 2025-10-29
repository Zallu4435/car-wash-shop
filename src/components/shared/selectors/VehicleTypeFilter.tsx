'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Car, Bike, Home, Layers, Search, X } from 'lucide-react';

interface VehicleType {
  id: string;
  name: string;
  icon: string;
  count?: number;
}

interface VehicleTypeFilterProps {
  vehicleTypes: VehicleType[];
  selectedTypes: string[];
  onToggle: (typeId: string) => void;
  onClearAll: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

const iconMap = {
  Car,
  Bike,
  Home,
  Layers,
};

export function VehicleTypeFilter({
  vehicleTypes,
  selectedTypes,
  onToggle,
  onClearAll,
  searchValue = '',
  onSearchChange,
  showSearch = false,
}: VehicleTypeFilterProps) {
  return (
    <Card className="p-4 sm:p-6 border-2 border-border">
      {/* Search Bar */}
      {showSearch && onSearchChange && (
        <div className="space-y-2 mb-4 sm:mb-6">
          <label className="text-sm font-semibold text-foreground block">
            Search Services
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground transition-all"
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
            <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">Service Type</h3>
        </div>
        {selectedTypes.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground h-7 sm:h-8 px-2 sm:px-3"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Vehicle Type List */}
      <div className="space-y-2">
        {vehicleTypes.map((type) => {
          const isSelected = selectedTypes.includes(type.id);
          const Icon = iconMap[type.icon as keyof typeof iconMap] || Layers;
          
          return (
            <button
              key={type.id}
              onClick={() => onToggle(type.id)}
              className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 group cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                {/* Icon */}
                <div
                  className={`p-1.5 sm:p-2 rounded-lg transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-primary/10'
                      : 'bg-muted group-hover:bg-primary/10'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>

                {/* Type Name */}
                <span
                  className={`font-medium text-xs sm:text-sm truncate ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {type.name}
                </span>
              </div>

              {/* Count Badge */}
              {type.count !== undefined && (
                <Badge
                  variant={isSelected ? 'default' : 'secondary'}
                  className="font-semibold text-xs ml-2 flex-shrink-0"
                >
                  {type.count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Count */}
      {selectedTypes.length > 0 && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">
              {selectedTypes.length} {selectedTypes.length === 1 ? 'type' : 'types'} selected
            </span>
            <button
              onClick={onClearAll}
              className="text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
