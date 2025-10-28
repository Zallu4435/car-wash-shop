'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onToggle: (categoryId: string) => void;
  onClearAll: () => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onToggle,
  onClearAll,
}: CategoryFilterProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Filter className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-base font-bold text-foreground">Categories</h3>
        </div>
        {selectedCategories.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="text-xs font-medium text-primary hover:text-primary/80 h-8 px-3"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <button
              key={category.id}
              onClick={() => onToggle(category.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground bg-background'
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>

                {/* Category Name */}
                <span
                  className={`font-semibold text-sm truncate ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {category.name}
                </span>
              </div>

              {/* Count Badge */}
              {category.count !== undefined && (
                <Badge
                  variant={isSelected ? 'default' : 'secondary'}
                  className="font-bold text-xs ml-2 flex-shrink-0 min-w-[28px] justify-center"
                >
                  {category.count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Count */}
      {selectedCategories.length > 0 && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">
              {selectedCategories.length} selected
            </span>
            <button
              onClick={onClearAll}
              className="text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
