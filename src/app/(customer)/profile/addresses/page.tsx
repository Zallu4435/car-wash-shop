// app/profile/addresses/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, MapPin, Trash2, Edit, Home, Building2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddAddressDialog } from '@/components/shared/dialogs/AddAddressDialog';
import { EditAddressDialog } from '@/components/shared/dialogs/EditAddressDialog';
import { toast } from 'sonner';
import { useAddresses, useDeleteAddress, useSetPrimaryAddress } from '@/api/domains/addresses/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { CustomerRoutes } from '@/lib/constants/routes';
import { useConfirmation } from '@/hooks/useConfirmation';

export default function AddressesPage() {
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<any | null>(null);
  const { confirm, ConfirmDialog } = useConfirmation();
  
  const { data: addresses, isLoading, error, refetch } = useAddresses();
  const deleteMutation = useDeleteAddress();
  const setPrimaryMutation = useSetPrimaryAddress();

  const handleDelete = async (addr: any) => {
    const ok = await confirm({
      title: 'Delete this address?',
      description: '',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'delete',
      minimal: true,
    });
    if (!ok) return;
    deleteMutation.mutate(addr.id, {
      onSuccess: () => {
        toast.success('Address deleted successfully');
        refetch();
      },
      onError: () => {
        toast.error('Failed to delete address');
      },
    });
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

  const handleEdit = (addr: any) => {
    setAddressToEdit(addr);
    setIsEditDialogOpen(true);
  };

  const handleAddressUpdated = () => {
    toast.success('Address updated successfully');
    refetch();
    setIsEditDialogOpen(false);
    setAddressToEdit(null);
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message="Failed to load addresses" onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-sm">
  <div className="container-custom py-4 sm:py-6">
    <Button
      variant="ghost"
      onClick={() => router.push(CustomerRoutes.PROFILE)}
      className="mb-4 h-9 px-3 text-sm hover:bg-muted/80 transition-colors"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
    
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Addresses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {addresses?.length || 0} {addresses?.length === 1 ? 'address' : 'addresses'} saved
          </p>
        </div>
      </div>
      
      <Button 
        onClick={() => setIsAddDialogOpen(true)} 
        className="h-11 px-6 gap-2 whitespace-nowrap font-semibold"
      >
        <Plus className="h-5 w-5" />
        <span className="hidden sm:inline">Add New</span>
      </Button>
    </div>
  </div>
</section>


      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="container-custom">
          {addresses && addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
              {addresses.map((addr) => {
                const fullAddress = `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
                
                return (
                  <Card 
                    key={addr.id} 
                    className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg border-2 group ${
                      addr.isPrimary 
                        ? 'border-primary/60 bg-gradient-to-br from-primary/5 to-background shadow-md' 
                        : 'border-border/60 hover:border-border bg-card'
                    }`}
                  >
                    {/* Top accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${
                      addr.isPrimary ? 'bg-gradient-to-r from-primary to-primary/50' : 'bg-muted'
                    }`} />

                    <CardContent className="p-6">
                      {/* Header with label and primary badge */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-2.5 rounded-lg flex-shrink-0 ${
                            addr.label?.toLowerCase() === 'home' 
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' 
                              : addr.label?.toLowerCase() === 'work'
                              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                              : 'bg-orange-500/15 text-orange-600 dark:text-orange-400'
                          }`}>
                            {addr.label?.toLowerCase() === 'home' ? (
                              <Home className="h-5 w-5" />
                            ) : addr.label?.toLowerCase() === 'work' ? (
                              <Building2 className="h-5 w-5" />
                            ) : (
                              <MapPin className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground capitalize text-base">
                              {addr.label}
                            </h3>
                            {addr.isPrimary && (
                              <p className="text-xs text-muted-foreground">Default address</p>
                            )}
                          </div>
                        </div>
                        
                        {addr.isPrimary && (
                          <Badge className="flex items-center gap-1 bg-primary/90 text-primary-foreground shrink-0">
                            <Star className="h-3 w-3 fill-current" />
                            Primary
                          </Badge>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-border/40 my-4" />

                      {/* Address details */}
                      <div className="space-y-3 mb-5">
                        <div>
                          <p className="text-sm text-foreground font-medium">Address</p>
                          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                            {fullAddress}
                          </p>
                        </div>
                        
                        {addr.landmark && (
                          <div>
                            <p className="text-sm text-foreground font-medium">Landmark</p>
                            <p className="text-sm text-muted-foreground">{addr.landmark}</p>
                          </div>
                        )}

                        {addr.phone && (
                          <div>
                            <p className="text-sm text-foreground font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">{addr.phone}</p>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-border/40 my-5" />

                      {/* Action buttons */}
                      <div className="space-y-2">
                        {!addr.isPrimary && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full h-9 text-sm font-medium border border-border/80 hover:bg-muted/60 transition-colors"
                            onClick={() => handleSetPrimary(addr.id)}
                            disabled={setPrimaryMutation.isPending}
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Set as Primary
                          </Button>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 h-9 text-sm font-medium border border-border/80 hover:bg-muted/60 transition-colors"
                            onClick={() => handleEdit(addr)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-9 text-sm font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 hover:border-destructive/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDelete(addr)}
                            disabled={addr.isPrimary || deleteMutation.isPending}
                            title={addr.isPrimary ? "Cannot delete primary address" : "Delete address"}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="mb-6 p-4 rounded-full bg-muted/50">
                <MapPin className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No addresses yet</h3>
              <p className="text-muted-foreground text-center max-w-sm mb-8">
                Add your first delivery address to get started with your orders
              </p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)} 
                className="h-11 px-8 text-base font-medium"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add First Address
              </Button>
            </div>
          )}
        </div>
      </section>

      <AddAddressDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddressAdded={handleAddressAdded}
      />
      <EditAddressDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        address={addressToEdit}
        onAddressUpdated={handleAddressUpdated}
      />
      <ConfirmDialog />
    </div>
  );
}
