'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, MapPin, Trash2, Edit, Home, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Address added successfully');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <Button
            variant="ghost"
            onClick={() => router.push('/profile')}
            className="mb-4 hover:bg-muted"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Saved Addresses</h1>
                <p className="text-muted-foreground mt-1">{addresses.length} address{addresses.length !== 1 ? 'es' : ''} saved</p>
              </div>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Address</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {addresses.map((addr) => (
              <Card key={addr.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        addr.label === 'Home' 
                          ? 'bg-blue-100 dark:bg-blue-950/30' 
                          : 'bg-purple-100 dark:bg-purple-950/30'
                      }`}>
                        {addr.label === 'Home' ? (
                          <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <span className="font-semibold text-foreground text-lg">{addr.label}</span>
                    </div>
                    {addr.isDefault && (
                      <Badge variant="default" className="shadow-sm">Default</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {addr.address}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => handleDelete(addr.id)}
                      disabled={addr.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAddress} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input id="label" placeholder="e.g., Home, Office" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Complete Address</Label>
              <Textarea
                id="address"
                placeholder="Street, Area, City, State, Pincode"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input id="landmark" placeholder="e.g., Near Metro Station" />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Add Address
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
