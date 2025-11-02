'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Clock, Ban, CheckCircle, AlertTriangle, Plus, Users, Calendar as CalendarIcon } from 'lucide-react';
import { useAdminSlots, useBlockSlot, useUnblockSlot } from '@/api/domains/admin-requests/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { useConfirmation } from '@/hooks/useConfirmation';
import { StatCard } from '@/components/admin/StatCard';
import { CreateSlotModal } from '@/components/admin/CreateSlotModal';
import { SlotFormInput } from '@/schemas/admin/slot';

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
  const blockAllConfirmation = useConfirmation();
  const enableAllConfirmation = useConfirmation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { data: slotsData, isLoading, error, refetch } = useAdminSlots();
  const blockSlotMutation = useBlockSlot();
  const unblockSlotMutation = useUnblockSlot();
  const [staffLeaves, setStaffLeaves] = useState<string[]>(['staff_002']);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

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

  const blockFullDay = async () => {
    const confirmed = await blockAllConfirmation.confirm({
      type: 'block',
      title: 'Block Full Day?',
      description: 'This will block all time slots for the selected date. Customers will not be able to book any appointments on this day.',
      confirmText: 'Yes, Block Full Day',
      cancelText: 'Cancel',
      itemName: selectedDate?.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
    });

    if (confirmed) {
      // Block all slots
      timeSlots.forEach(slot => {
        if (!blockedSlots.includes(slot)) {
          blockSlotMutation.mutate(slot);
        }
      });
      
      toast.success('Full day blocked');
    }
  };

  const unblockFullDay = async () => {
    const confirmed = await enableAllConfirmation.confirm({
      type: 'warning',
      title: 'Enable All Slots?',
      description: 'This will enable all blocked time slots for the selected date. Customers will be able to book appointments on this day.',
      confirmText: 'Yes, Enable All Slots',
      cancelText: 'Cancel',
      itemName: selectedDate?.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
    });

    if (confirmed) {
      // Unblock all slots
      blockedSlots.forEach(slot => {
        unblockSlotMutation.mutate(slot);
      });
      
      toast.success('Full day enabled');
    }
  };

  const handleCreateSlot = (data: SlotFormInput) => {
    try {
      // TODO: Call API to create slot
      console.log('Creating slot:', data);
      toast.success(`Slot created: ${data.time} (Capacity: ${data.capacity})`);
      setShowCreateDialog(false);
    } catch (error) {
      toast.error('Failed to create slot');
    }
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
          <Button variant="outline" onClick={blockFullDay} className="h-9 sm:h-10 text-xs sm:text-sm flex-1 sm:flex-initial border-2">
            <Ban className="mr-0 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Block Full Day</span>
            <span className="xs:hidden">Block All</span>
          </Button>
          <Button variant="outline" onClick={unblockFullDay} className="h-9 sm:h-10 text-xs sm:text-sm flex-1 sm:flex-initial border-2">
            <CheckCircle className="mr-0 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Enable All</span>
            <span className="xs:hidden">Enable All</span>
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} className="h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto border-2">
            <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Create Slot
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Clock}
          label="Total Slots"
          value={timeSlots.length}
          change="+0%"
          trend="up"
          description="Daily slots"
        />
        
        <StatCard
          icon={CheckCircle}
          label="Available"
          value={timeSlots.length - blockedSlots.length}
          valueClassName="text-primary"
          change="+5.2%"
          trend="up"
          description="Ready to book"
        />
        
        <StatCard
          icon={Ban}
          label="Blocked"
          value={blockedSlots.length}
          change="-2.1%"
          trend="down"
          description="Unavailable slots"
        />
        
        <StatCard
          icon={AlertTriangle}
          label="Staff on Leave"
          value={staffLeaves.length}
          valueClassName="text-primary"
          change="+1"
          trend="up"
          description="Today"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Calendar */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <CardTitle className="text-sm sm:text-base lg:text-lg">Select Date</CardTitle>
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
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Time Slots</CardTitle>
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
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">Staff Availability</CardTitle>
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
                    <div className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border-2 transition-colors ${
                      isOnLeave 
                        ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
                        : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                    }`}>
                      <Label htmlFor={`staff-${member.id}`} className="text-xs sm:text-sm font-medium cursor-pointer">
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

      {/* Create Slot Modal */}
      <CreateSlotModal
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateSlot={handleCreateSlot}
      />

      {/* Confirmation Dialogs */}
      <blockAllConfirmation.ConfirmDialog />
      <enableAllConfirmation.ConfirmDialog />
    </div>
  );
}
