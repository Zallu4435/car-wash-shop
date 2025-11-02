'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Staff {
  id: string;
  name: string;
  area: string;
  rating: number;
  completedJobs: number;
  phone?: string;
}

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableStaff: Staff[];
  currentStaffId?: string;
  onAssign: (staffId: string) => void;
  mode?: 'assign' | 'change';
}

export function AssignStaffModal({
  isOpen,
  onClose,
  availableStaff,
  currentStaffId,
  onAssign,
  mode = 'assign',
}: AssignStaffModalProps) {
  const [selectedStaff, setSelectedStaff] = useState(currentStaffId || '');

  const handleAssign = () => {
    if (!selectedStaff) {
      toast.error('Please select a staff member');
      return;
    }
    onAssign(selectedStaff);
    onClose();
  };

  const handleClose = () => {
    setSelectedStaff(currentStaffId || '');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-md rounded-xl sm:rounded-2xl">
        <DialogHeader className="space-y-1 sm:space-y-2">
          <DialogTitle className="text-sm sm:text-base lg:text-lg">
            {mode === 'change' ? 'Change Assigned Staff' : 'Assign Staff Member'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {mode === 'change' 
              ? 'Select a new staff member to assign to this booking'
              : 'Select a staff member to assign to this booking'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-2 sm:py-3">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="staff" className="text-xs sm:text-sm font-medium">
              Select Staff Member
            </Label>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger id="staff" className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                <SelectValue placeholder="Choose a staff member..." />
              </SelectTrigger>
              <SelectContent className="force-sheet-bg border-2 rounded-lg">
                {availableStaff.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id} className="cursor-pointer text-xs sm:text-sm rounded-md">
                    <div className="flex items-center justify-between gap-3 w-full">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">{staff.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{staff.area}</p>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-[9px] sm:text-[10px]">
                          ⭐ {staff.rating}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] sm:text-[10px]">
                          {staff.completedJobs} jobs
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStaff && (
            <div className="p-2.5 sm:p-3 lg:p-4 bg-primary/5 border-2 border-primary/20 rounded-lg sm:rounded-xl">
              {(() => {
                const staff = availableStaff.find(s => s.id === selectedStaff);
                if (!staff) return null;
                return (
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-xs sm:text-sm font-semibold text-foreground">{staff.name}</p>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                      <span>📍 {staff.area}</span>
                      <span>•</span>
                      <span>⭐ {staff.rating} rating</span>
                      <span>•</span>
                      <span>{staff.completedJobs} completed jobs</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2 sm:pt-3">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAssign}
            className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg"
          >
            {mode === 'change' ? 'Change Staff' : 'Assign Staff'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
