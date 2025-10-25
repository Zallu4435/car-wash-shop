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
import { useState } from 'react';

const categories = [
  { id: 'cat_001', name: 'Exterior Wash', type: 'service', active: true, count: 5 },
  { id: 'cat_002', name: 'Interior Detailing', type: 'service', active: true, count: 3 },
  { id: 'cat_003', name: 'Cleaning Products', type: 'product', active: true, count: 12 },
  { id: 'cat_004', name: 'Car Care', type: 'product', active: true, count: 8 },
];

export default function CategoriesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize services and products</p>
        </div>
        <Button onClick={() => router.push('/admin/categories/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>All Categories</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Folder className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{category.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1 capitalize">{category.type}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Items</p>
                    <p className="text-2xl font-bold text-foreground">{category.count}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4" />
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
