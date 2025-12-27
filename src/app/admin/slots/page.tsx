'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { Clock, Ban, CheckCircle, AlertTriangle, Users, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import {
  useAdminSlots,
  useGenerateSlots,
  useUpdateSlotStatus,
  useUpdateSlotsStatus,
} from '@/api/domains/admin-requests/queries';
import {
  useAdminStaffList,
  useStaffLeavesByDate,
  useMarkStaffLeave,
  useRemoveStaffLeave,
} from '@/api/domains/admin-staff/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { useConfirmation } from '@/hooks/useConfirmation';
import { StatCard } from '@/components/admin/StatCard';
import { CreateSlotModal } from '@/components/admin/CreateSlotModal';


const formatTime = (time: string) => {
  if (!time) return '';
  const [hourString, minuteString = '00'] = time.split(':');
  let hours = parseInt(hourString, 10);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  if (hours === 0) hours = 12;
  if (hours > 12) hours -= 12;
  return `${hours}:${minuteString} ${suffix}`;
};

export default function SlotManagementPage() {
  const markUnavailableConfirmation = useConfirmation();
  const markAvailableConfirmation = useConfirmation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const selectedDateISO = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined;
  const { data: slotsData, isLoading, error, refetch } = useAdminSlots(selectedDateISO);
  const generateSlotsMutation = useGenerateSlots();
  const updateSlotStatusMutation = useUpdateSlotStatus();
  const updateSlotsStatusMutation = useUpdateSlotsStatus();

  // Dynamic staff and leave data
  const { data: staffData, isLoading: isLoadingStaff } = useAdminStaffList({ status: 'active', limit: 100 });
  const { data: leavesData } = useStaffLeavesByDate(selectedDateISO);
  const markLeaveMutation = useMarkStaffLeave();
  const removeLeaveMutation = useRemoveStaffLeave();

  const staffList = useMemo(() => staffData?.data || [], [staffData?.data]);
  const staffLeaveIds = useMemo(() => new Set(leavesData?.map((l) => l.staffId) || []), [leavesData]);

  const slots = useMemo(() => slotsData?.slots ?? [], [slotsData?.slots]);

  const availableCount = useMemo(() => slots.filter((slot: any) => slot.status === 'available').length, [slots]);
  const unavailableCount = useMemo(() => slots.filter((slot: any) => slot.status === 'unavailable').length, [slots]);
  const bookedCount = useMemo(() => slots.filter((slot: any) => slot.booked).length, [slots]);

  if (isLoading || isLoadingStaff) {
    return <Loading text="Loading slots..." />;
  }

  if (error) {
    return <Error message="Failed to load slots" details={(error as any)?.message} onRetry={() => refetch()} />;
  }

  const toggleSlot = (slot: { id: string; status: 'available' | 'unavailable'; booked?: boolean }) => {
    if (!selectedDateISO) {
      toast.error('Please select a date first');
      return;
    }

    // Prevent toggling booked slots
    if (slot.booked) {
      toast.error('Cannot change status of a booked slot');
      return;
    }

    const nextStatus = slot.status === 'available' ? 'unavailable' : 'available';
    updateSlotStatusMutation.mutate(
      { slotId: slot.id, date: selectedDateISO, status: nextStatus },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to update slot');
        },
      }
    );
  };

  const toggleStaffLeave = (staffId: string, staffName: string) => {
    if (!selectedDateISO) {
      toast.error('Please select a date first');
      return;
    }

    const isOnLeave = staffLeaveIds.has(staffId);
    if (isOnLeave) {
      removeLeaveMutation.mutate({ staffId, date: selectedDateISO });
    } else {
      markLeaveMutation.mutate({ staffId, date: selectedDateISO });
    }
  };

  const markDayStatus = async (status: 'available' | 'unavailable') => {
    if (!selectedDateISO) {
      toast.error('Please select a date first');
      return;
    }

    const confirmation = status === 'unavailable' ? markUnavailableConfirmation : markAvailableConfirmation;

    const confirmed = await confirmation.confirm({
      type: status === 'unavailable' ? 'warning' : 'info',
      title: status === 'unavailable' ? 'Mark all slots as unavailable?' : 'Enable all slots?',
      description:
        status === 'unavailable'
          ? 'All slots for this date will be marked unavailable. Customers cannot book these slots.'
          : 'All slots for this date will be marked available for booking.',
      confirmText: status === 'unavailable' ? 'Mark Unavailable' : 'Mark Available',
      cancelText: 'Cancel',
      itemName: selectedDate?.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });

    if (confirmed) {
      updateSlotsStatusMutation.mutate(
        { date: selectedDateISO, status },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    }
  };

  const handleGenerateSlots = (formData: {
    startDate: string;
    endDate: string;
    weekdayStartTime: string;
    weekdayEndTime: string;
    weekendStartTime: string;
    weekendEndTime: string;
    makeAvailable: boolean;
  }) => {
    const payload = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      weekdayStartTime: formData.weekdayStartTime,
      weekdayEndTime: formData.weekdayEndTime,
      weekendStartTime: formData.weekendStartTime,
      weekendEndTime: formData.weekendEndTime,
      initialStatus: formData.makeAvailable ? 'available' as const : 'unavailable' as const,
    };

    generateSlotsMutation.mutate(payload, {
      onSuccess: () => {
        setShowGenerateModal(false);
        refetch();
      },
    });
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
          <Button
            variant="outline"
            onClick={() => markDayStatus('unavailable')}
            className="h-9 sm:h-10 text-xs sm:text-sm flex-1 sm:flex-initial border-2"
            disabled={!selectedDateISO || slots.length === 0 || updateSlotsStatusMutation.isPending}
          >
            <Ban className="mr-0 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Mark All Unavailable</span>
            <span className="xs:hidden">Unavailable All</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => markDayStatus('available')}
            className="h-9 sm:h-10 text-xs sm:text-sm flex-1 sm:flex-initial border-2"
            disabled={!selectedDateISO || slots.length === 0 || updateSlotsStatusMutation.isPending}
          >
            <CheckCircle className="mr-0 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Enable All</span>
            <span className="xs:hidden">Enable All</span>
          </Button>
          <Button
            onClick={() => setShowGenerateModal(true)}
            className="h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto border-2"
          >
            <Sparkles className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Generate Slots
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Clock}
          label="Total Slots"
          value={slots.length}
          change="+0%"
          trend="up"
          description="Daily slots"
        />

        <StatCard
          icon={CheckCircle}
          label="Available"
          value={availableCount}
          valueClassName="text-primary"
          change="+5.2%"
          trend="up"
          description="Ready to book"
        />

        <StatCard
          icon={Ban}
          label="Unavailable"
          value={unavailableCount}
          change="-2.1%"
          trend="down"
          description="Unavailable slots"
        />

        <StatCard
          icon={AlertTriangle}
          label="Booked"
          value={bookedCount}
          valueClassName="text-primary"
          description="Already assigned"
        />

        <StatCard
          icon={AlertTriangle}
          label="Staff on Leave"
          value={staffLeaveIds.size}
          valueClassName="text-primary"
          description="Selected date"
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
                  Unavailable
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {slots.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-xl">
                <p className="text-sm text-muted-foreground">No slots for this date. Generate slots to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {slots.map((slot: any) => {
                  const isAvailable = slot.status === 'available';
                  const isProcessing = updateSlotStatusMutation.isPending;
                  const isBooked = slot.booked;
                  const isDisabled = isProcessing || isBooked;

                  return (
                    <button
                      key={slot.id}
                      onClick={() => toggleSlot(slot)}
                      disabled={isDisabled}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${isBooked
                        ? 'opacity-60 cursor-not-allowed'
                        : isProcessing
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-md active:scale-95 cursor-pointer'
                        } ${isAvailable
                          ? 'border-green-300 bg-green-50 dark:bg-green-950/20 hover:bg-green-100/70'
                          : 'border-destructive bg-destructive/10 hover:bg-destructive/15'
                        }`}
                      title={isBooked ? 'This slot is booked and cannot be modified' : ''}
                    >
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <Clock
                          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${isAvailable ? 'text-green-600 dark:text-green-400' : 'text-destructive'
                            }`}
                        />
                        {slot.booked && (
                          <Badge variant="outline" className="text-[10px] bg-amber-100 text-amber-700 border-amber-200">
                            Booked
                          </Badge>
                        )}
                      </div>
                      <p
                        className={`font-bold text-sm sm:text-base mb-1.5 sm:mb-2 transition-colors ${isAvailable ? 'text-foreground' : 'text-destructive'
                          }`}
                      >
                        {formatTime(slot.time)}
                      </p>
                      <Badge
                        className={`text-xs transition-all ${isAvailable
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800'
                          }`}
                      >
                        {isAvailable ? 'Available' : 'Unavailable'}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            )}
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
            {staffList.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-xl">
                <p className="text-sm text-muted-foreground">No active staff found.</p>
              </div>
            ) : (
              staffList.map((member) => {
                const isOnLeave = staffLeaveIds.has(member.id);
                const isMutating = markLeaveMutation.isPending || removeLeaveMutation.isPending;
                return (
                  <div
                    key={member.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${isOnLeave
                      ? 'bg-destructive/5 border-destructive/20'
                      : 'bg-muted border-border'
                      }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0 ${isOnLeave
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        }`}>
                        {member.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm sm:text-base text-foreground truncate">{member.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{member.role || 'Staff'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      <Badge
                        className={`text-xs ${isOnLeave
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800'
                          }`}
                      >
                        {isOnLeave ? 'On Leave' : 'Available'}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => toggleStaffLeave(member.id, member.name)}
                        disabled={isMutating}
                        className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 ${isOnLeave
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                      >
                        {isOnLeave ? 'Mark Available' : 'Mark on Leave'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generate Slots Modal */}
      <CreateSlotModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={handleGenerateSlots}
      />

      {/* Confirmation Dialogs */}
      <markUnavailableConfirmation.ConfirmDialog />
      <markAvailableConfirmation.ConfirmDialog />
    </div>
  );
}
