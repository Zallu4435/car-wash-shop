'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Folder, 
  Plus, 
  Search, 
  Edit,
  Trash2
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminCategoryList, useDeleteCategory } from '@/api/domains/admin-catalog/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';

export default function CategoriesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: categoriesData, isLoading, error, refetch } = useAdminCategoryList();
  const deleteCategoryMutation = useDeleteCategory();

  const categories = categoriesData || [];

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategoryMutation.mutateAsync(categoryId);
    }
  };

  if (isLoading) {
    return <Loading text="Loading categories..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load categories" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const filteredCategories = useMemo(() => categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  ), [categories, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Categories
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Organize services and products
          </p>
        </div>
        <Button onClick={() => router.push('/admin/categories/new')} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Folder className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Categories</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                        <Folder className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                          {category.name}
                        </h3>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {category.itemCount} items
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 bg-muted rounded-lg mb-3 sm:mb-4">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Items</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{category.itemCount}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                    >
                      <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 px-3"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
