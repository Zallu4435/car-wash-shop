// components/shared/dialogs/AddAddressDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { bookingApi } from '@/lib/api/bookingApi';

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddressAdded: () => void;
}

export function AddAddressDialog({ open, onOpenChange, onAddressAdded }: AddAddressDialogProps) {
  const [loading, setLoading] = useState(false);
  const [addressLabel, setAddressLabel] = useState('');
  const [addressText, setAddressText] = useState('');
  const [landmark, setLandmark] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!addressLabel || !addressText) {
        toast.error('Please fill all required fields');
        return;
      }

      await bookingApi.addAddress({
        label: addressLabel,
        address: addressText,
        landmark: landmark || undefined,
      });

      toast.success('Address added successfully');

      // Reset form
      setAddressLabel('');
      setAddressText('');
      setLandmark('');
      onOpenChange(false);
      
      // Notify parent
      onAddressAdded();
    } catch (error) {
      toast.error('Failed to add address');
    } finally {
      setLoading(false);
    }
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
            <Label htmlFor="address" className="text-xs sm:text-sm font-medium">
              Complete Address <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              placeholder="Street, Area, City, State, Pincode"
              rows={4}
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              required
              className="text-xs sm:text-sm resize-none"
            />
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Enter your complete address with all details
            </p>
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-10 sm:h-11 text-xs sm:text-sm shadow-md" 
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Address'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
