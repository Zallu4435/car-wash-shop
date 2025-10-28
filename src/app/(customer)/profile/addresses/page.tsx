// app/profile/addresses/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, MapPin, Trash2, Edit, Home, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddAddressDialog } from '@/components/shared/dialogs/AddAddressDialog';
import { toast } from 'sonner';

const mockAddresses = [
  { id: 'addr_001', label: 'Home', address: '123, MG Road, Bandra West, Mumbai - 400050', isDefault: true },
  { id: 'addr_002', label: 'Office', address: '456, Linking Road, Khar, Mumbai - 400052', isDefault: false },
];

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast.success('Address deleted successfully');
  };

  const handleAddressAdded = () => {
    // Reload addresses from API
    // For now with mock data, just close dialog
    toast.success('Address added successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <Button
            variant="ghost"
            onClick={() => router.push('/profile')}
            className="mb-3 sm:mb-4 hover:bg-muted h-9 sm:h-10"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Back to Profile</span>
          </Button>
          <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                <MapPin className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                  Saved Addresses
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                  {addresses.length} address{addresses.length !== 1 ? 'es' : ''} saved
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="shadow-lg h-9 sm:h-10 flex-shrink-0"
              size="sm"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline text-xs sm:text-sm">Add Address</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {addresses.map((addr) => (
              <Card key={addr.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl flex-shrink-0 ${
                        addr.label === 'Home' 
                          ? 'bg-blue-100 dark:bg-blue-950/30' 
                          : 'bg-purple-100 dark:bg-purple-950/30'
                      }`}>
                        {addr.label === 'Home' ? (
                          <Home className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <span className="font-semibold text-foreground text-base sm:text-lg truncate capitalize">
                        {addr.label}
                      </span>
                    </div>
                    {addr.isDefault && (
                      <Badge variant="default" className="shadow-sm text-xs flex-shrink-0">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                    {addr.address}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-9 sm:h-10 text-xs sm:text-sm">
                      <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 sm:h-10 px-3"
                      onClick={() => handleDelete(addr.id)}
                      disabled={addr.isDefault}
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <AddAddressDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddressAdded={handleAddressAdded}
      />
    </div>
  );
}
