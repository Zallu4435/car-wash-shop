// components/shared/dialogs/AddAddressDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useCreateAddress } from '@/api/domains/addresses/queries';

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddressAdded: () => void;
}

export function AddAddressDialog({ open, onOpenChange, onAddressAdded }: AddAddressDialogProps) {
  const createAddressMutation = useCreateAddress();
  const [addressLabel, setAddressLabel] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addressLabel || !line1 || !city || !state || !pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    createAddressMutation.mutate({
      label: addressLabel,
      line1,
      line2: line2 || undefined,
      city,
      state,
      pincode,
      landmark: landmark || undefined,
    }, {
      onSuccess: () => {
        // Reset form
        setAddressLabel('');
        setLine1('');
        setLine2('');
        setCity('');
        setState('');
        setPincode('');
        setLandmark('');
        onOpenChange(false);
        onAddressAdded();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3 sm:pb-4">
          <DialogTitle className="text-base sm:text-lg md:text-xl">Add New Address</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="label" className="text-xs sm:text-sm font-medium">
              Label <span className="text-red-500">*</span>
            </Label>
            <Select value={addressLabel} onValueChange={setAddressLabel}>
              <SelectTrigger id="label" className="h-10 sm:h-11 text-xs sm:text-sm">
                <SelectValue placeholder="Select label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="line1" className="text-xs sm:text-sm font-medium">
              Address Line 1 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="line1"
              placeholder="House/Flat No., Street Name"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              required
              className="h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="line2" className="text-xs sm:text-sm font-medium">
              Address Line 2 <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="line2"
              placeholder="Area, Locality"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              className="h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="city" className="text-xs sm:text-sm font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="h-10 sm:h-11 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="state" className="text-xs sm:text-sm font-medium">
                State <span className="text-red-500">*</span>
              </Label>
              <Input
                id="state"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="h-10 sm:h-11 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="pincode" className="text-xs sm:text-sm font-medium">
              Pincode <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pincode"
              placeholder="6-digit pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              required
              maxLength={6}
              className="h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="landmark" className="text-xs sm:text-sm font-medium">
              Landmark <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input 
              id="landmark" 
              placeholder="e.g., Near Metro Station"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>

          <div className="flex gap-2 pt-2 sm:pt-3">
            <Button 
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-10 sm:h-11 text-xs sm:text-sm"
              disabled={createAddressMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-10 sm:h-11 text-xs sm:text-sm shadow-md" 
              disabled={createAddressMutation.isPending}
            >
              {createAddressMutation.isPending ? 'Adding...' : 'Add Address'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
