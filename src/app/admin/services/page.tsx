'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Car, 
  Plus, 
  Search, 
  Eye, 
  Edit,
  Trash2,
  Clock,
  IndianRupee,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';

const services = [
  {
    id: 'svc_001',
    name: 'Premium Wash',
    category: 'Exterior Wash',
    price: 499,
    duration: 30,
    active: true,
    description: 'Complete exterior wash with premium products',
  },
  {
    id: 'svc_002',
    name: 'Interior Detailing',
    category: 'Interior Detailing',
    price: 699,
    duration: 45,
    active: true,
    description: 'Deep cleaning of interior surfaces',
  },
  {
    id: 'svc_003',
    name: 'Full Detailing',
    category: 'Complete Detailing',
    price: 1299,
    duration: 90,
    active: true,
    description: 'Complete interior and exterior detailing',
  },
  {
    id: 'svc_004',
    name: 'Express Wash',
    category: 'Exterior Wash',
    price: 299,
    duration: 15,
    active: false,
    description: 'Quick exterior wash',
  },
];

export default function ServicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeServices = services.filter(s => s.active).length;
  const totalRevenue = services.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground mt-1">Manage your service offerings</p>
        </div>
        <Button onClick={() => router.push('/admin/services/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
                <Car className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Services</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{services.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Services</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{activeServices}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/30 rounded-xl">
                <IndianRupee className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Price</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">₹{Math.round(totalRevenue / services.length)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>All Services</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{service.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">{service.category}</Badge>
                      </div>
                    </div>
                    <Badge variant={service.active ? 'default' : 'secondary'}>
                      {service.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Price</p>
                      </div>
                      <p className="text-lg font-bold text-primary">₹{service.price}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">{service.duration} min</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/admin/services/${service.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/admin/services/${service.id}/edit`)}
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
