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
import { useAddresses, useDeleteAddress, useSetPrimaryAddress } from '@/api/domains/addresses/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { CustomerRoutes } from '@/lib/constants/routes';

export default function AddressesPage() {
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { data: addresses, isLoading, error, refetch } = useAddresses();
  const deleteMutation = useDeleteAddress();
  const setPrimaryMutation = useSetPrimaryAddress();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Address deleted successfully');
          refetch();
        },
        onError: () => {
          toast.error('Failed to delete address');
        },
      });
    }
  };

  const handleSetPrimary = (id: string) => {
    setPrimaryMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Primary address updated');
        refetch();
      },
      onError: () => {
        toast.error('Failed to update primary address');
      },
    });
  };

  const handleAddressAdded = () => {
    toast.success('Address added successfully');
    refetch();
    setIsAddDialogOpen(false);
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message="Failed to load addresses" onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <Button
            variant="ghost"
            onClick={() => router.push(CustomerRoutes.PROFILE)}
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
                  {addresses?.length || 0} address{addresses?.length !== 1 ? 'es' : ''} saved
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="shadow-lg border-2 h-9 sm:h-10 flex-shrink-0"
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
            {addresses?.map((addr) => {
              const fullAddress = `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
              
              return (
                <Card key={addr.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl flex-shrink-0 ${
                          addr.label?.toLowerCase() === 'home' 
                            ? 'bg-blue-100 dark:bg-blue-950/30' 
                            : 'bg-purple-100 dark:bg-purple-950/30'
                        }`}>
                          {addr.label?.toLowerCase() === 'home' ? (
                            <Home className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        <span className="font-semibold text-foreground text-base sm:text-lg truncate capitalize">
                          {addr.label}
                        </span>
                      </div>
                      {addr.isPrimary && (
                        <Badge variant="default" className="shadow-sm text-xs flex-shrink-0">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                      {fullAddress}
                    </p>
                    {addr.landmark && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                        <span className="font-medium">Landmark:</span> {addr.landmark}
                      </p>
                    )}
                  <div className="flex flex-col gap-2">
                    {!addr.isPrimary && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full border-2 h-9 sm:h-10 text-xs sm:text-sm"
                        onClick={() => handleSetPrimary(addr.id)}
                        disabled={setPrimaryMutation.isPending}
                      >
                        Make Primary
                      </Button>
                    )}
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
                        disabled={addr.isPrimary}
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
            
            {addresses?.length === 0 && (
              <div className="col-span-full text-center py-12">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first address to get started
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="shadow-lg border-2 h-10 sm:h-11" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Address
                </Button>
              </div>
            )}
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
