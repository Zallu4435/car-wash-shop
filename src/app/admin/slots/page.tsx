'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Clock, Ban, CheckCircle, AlertTriangle, Plus, Users, Calendar as CalendarIcon } from 'lucide-react';
import { useAdminSlots, useBlockSlot, useUnblockSlot } from '@/api/domains/admin-requests/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM'
];

const staff = [
  { id: 'staff_001', name: 'Rahul Kumar', role: 'Senior Detailer' },
  { id: 'staff_002', name: 'Amit Sharma', role: 'Detailer' },
  { id: 'staff_003', name: 'Vijay Patel', role: 'Senior Detailer' },
];

export default function SlotManagementPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { data: slotsData, isLoading, error, refetch } = useAdminSlots();
  const blockSlotMutation = useBlockSlot();
  const unblockSlotMutation = useUnblockSlot();
  const [staffLeaves, setStaffLeaves] = useState<string[]>(['staff_002']);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newSlotCapacity, setNewSlotCapacity] = useState('5');

  // Use data from API
  const blockedSlots = slotsData?.blockedSlots || [];

  if (isLoading) {
    return <Loading text="Loading slots..." />;
  }

  if (error) {
    return <Error message="Failed to load slots" details={(error as any)?.message} onRetry={() => refetch()} />;
  }

  const toggleSlot = (slot: string) => {
    const isCurrentlyBlocked = blockedSlots.includes(slot);
    
    if (isCurrentlyBlocked) {
      unblockSlotMutation.mutate(slot, {
        onSuccess: () => {
          refetch();
        },
      });
    } else {
      blockSlotMutation.mutate(slot, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const toggleStaffLeave = (staffId: string) => {
    if (staffLeaves.includes(staffId)) {
      setStaffLeaves(staffLeaves.filter(s => s !== staffId));
      toast.success('Staff leave removed');
    } else {
      setStaffLeaves([...staffLeaves, staffId]);
      toast.success('Staff marked on leave');
    }
  };

  const blockFullDay = () => {
    // Block all slots
    timeSlots.forEach(slot => {
      if (!blockedSlots.includes(slot)) {
        blockSlotMutation.mutate(slot);
      }
    });
    setTimeout(() => refetch(), 500);
    toast.success('Full day blocked');
  };

  const unblockFullDay = () => {
    // Unblock all slots
    blockedSlots.forEach(slot => {
      unblockSlotMutation.mutate(slot);
    });
    setTimeout(() => refetch(), 500);
    toast.success('All slots enabled');
  };

  const handleCreateSlot = () => {
    if (!newSlotTime) {
      toast.error('Please enter a time');
      return;
    }
    toast.success(`Slot created: ${newSlotTime} (Capacity: ${newSlotCapacity})`);
    setShowCreateDialog(false);
    setNewSlotTime('');
    setNewSlotCapacity('5');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Slot Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage time slots and staff availability
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={blockFullDay} className="h-9 sm:h-10 text-xs sm:text-sm flex-1 sm:flex-initial">
            <Ban className="mr-0 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Block Full Day</span>
            <span className="xs:hidden">Block All</span>
          </Button>
          <Button variant="outline" onClick={unblockFullDay} className="h-9 sm:h-10 text-xs sm:text-sm flex-1 sm:flex-initial">
            <CheckCircle className="mr-0 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Enable All</span>
            <span className="xs:hidden">Enable</span>
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} className="h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto">
            <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Create Slot
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Clock, label: 'Total Slots', value: timeSlots.length, color: 'primary' },
          { icon: CheckCircle, label: 'Available', value: timeSlots.length - blockedSlots.length, color: 'primary' },
          { icon: Ban, label: 'Blocked', value: blockedSlots.length, color: 'destructive' },
          { icon: AlertTriangle, label: 'Staff on Leave', value: staffLeaves.length, color: 'primary' },
        ].map((stat, index) => (
          <Card key={index} className={`border-2 border-border ${index === 3 ? 'col-span-2 lg:col-span-1' : ''}`}>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className={`p-2 sm:p-3 ${stat.color === 'destructive' ? 'bg-destructive/10' : 'bg-primary/10'} rounded-lg sm:rounded-xl flex-shrink-0`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color === 'destructive' ? 'text-destructive' : 'text-primary'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                </div>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold ${stat.color === 'destructive' ? 'text-destructive' : stat.label === 'Available' || stat.label === 'Staff on Leave' ? 'text-primary' : 'text-foreground'}`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Calendar */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <CardTitle className="text-base sm:text-lg">Select Date</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md mx-auto"
            />
            {selectedDate && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  {selectedDate.toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="lg:col-span-2 border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">Time Slots</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800 text-xs">
                  <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  Available
                </Badge>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                  <Ban className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  Blocked
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {timeSlots.map((slot) => {
                const isBlocked = blockedSlots.includes(slot);
                const isProcessing = blockSlotMutation.isPending || unblockSlotMutation.isPending;
                
                return (
                  <button
                    key={slot}
                    onClick={() => toggleSlot(slot)}
                    disabled={isProcessing}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 hover:shadow-md active:scale-95 ${
                      isBlocked
                        ? 'border-destructive bg-destructive/10 hover:bg-destructive/15'
                        : 'border-border bg-muted hover:bg-muted/80'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <Clock className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${isBlocked ? 'text-destructive' : 'text-foreground'}`} />
                      {isBlocked ? (
                        <Ban className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive animate-in fade-in duration-300" />
                      ) : (
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400 animate-in fade-in duration-300" />
                      )}
                    </div>
                    <p className={`font-bold text-sm sm:text-base mb-1.5 sm:mb-2 transition-colors ${
                      isBlocked ? 'text-destructive' : 'text-foreground'
                    }`}>{slot}</p>
                    <Badge 
                      className={`text-xs transition-all ${
                        isBlocked 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800'
                      }`}
                    >
                      {isBlocked ? 'Blocked' : 'Available'}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Management */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">Staff Availability</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5 sm:space-y-3">
            {staff.map((member) => {
              const isOnLeave = staffLeaves.includes(member.id);
              return (
                <div
                  key={member.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                    isOnLeave 
                      ? 'bg-destructive/5 border-destructive/20' 
                      : 'bg-muted border-border'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0 ${
                      isOnLeave 
                        ? 'bg-destructive/10 text-destructive' 
                        : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm sm:text-base text-foreground truncate">{member.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <Badge 
                      className={`text-xs ${
                        isOnLeave 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800'
                      }`}
                    >
                      {isOnLeave ? 'On Leave' : 'Available'}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`staff-${member.id}`} className="text-xs sm:text-sm text-foreground cursor-pointer">
                        {isOnLeave ? 'Mark Available' : 'Mark on Leave'}
                      </Label>
                      <Switch
                        id={`staff-${member.id}`}
                        checked={isOnLeave}
                        onCheckedChange={() => toggleStaffLeave(member.id)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create Slot Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Create New Time Slot</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Add a new time slot for service bookings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="slot-time" className="text-xs sm:text-sm">Time Slot</Label>
              <Input
                id="slot-time"
                type="time"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                placeholder="Select time"
                className="h-10 sm:h-11 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="slot-capacity" className="text-xs sm:text-sm">Capacity</Label>
              <Select value={newSlotCapacity} onValueChange={setNewSlotCapacity}>
                <SelectTrigger id="slot-capacity" className="h-10 sm:h-11 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 booking</SelectItem>
                  <SelectItem value="3">3 bookings</SelectItem>
                  <SelectItem value="5">5 bookings</SelectItem>
                  <SelectItem value="10">10 bookings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="h-9 sm:h-10 text-xs sm:text-sm">
              Cancel
            </Button>
            <Button onClick={handleCreateSlot} className="h-9 sm:h-10 text-xs sm:text-sm">
              <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Create Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
