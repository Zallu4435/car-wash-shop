'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
    <Card className="p-4 sm:p-6 border-2 border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">Categories</h3>
        </div>
        {selectedCategories.length > 0 && (
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

      {/* Category List */}
      <div className="space-y-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <button
              key={category.id}
              onClick={() => onToggle(category.id)}
              className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 group ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                {/* Checkbox */}
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'border-border group-hover:border-primary'
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>

                {/* Category Name */}
                <span
                  className={`font-medium text-xs sm:text-sm truncate ${
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
                  className="font-semibold text-xs ml-2 flex-shrink-0"
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
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">
              {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
            </span>
            <button
              onClick={onClearAll}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
