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
import { Clock, Ban, CheckCircle, AlertTriangle, Plus, Edit, Trash2, Users, Calendar as CalendarIcon } from 'lucide-react';

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
  const [blockedSlots, setBlockedSlots] = useState<string[]>(['02:00 PM', '03:00 PM']);
  const [staffLeaves, setStaffLeaves] = useState<string[]>(['staff_002']);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newSlotCapacity, setNewSlotCapacity] = useState('5');

  const toggleSlot = (slot: string) => {
    if (blockedSlots.includes(slot)) {
      setBlockedSlots(blockedSlots.filter(s => s !== slot));
      toast.success(`${slot} slot enabled`);
    } else {
      setBlockedSlots([...blockedSlots, slot]);
      toast.success(`${slot} slot blocked`);
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
    setBlockedSlots(timeSlots);
    toast.success('Full day blocked');
  };

  const unblockFullDay = () => {
    setBlockedSlots([]);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Slot Management</h1>
          <p className="text-muted-foreground mt-1">Manage time slots and staff availability</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={blockFullDay}>
            <Ban className="mr-2 h-4 w-4" />
            Block Full Day
          </Button>
          <Button variant="outline" onClick={unblockFullDay}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Enable All
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Slot
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Slots</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{timeSlots.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">
              {timeSlots.length - blockedSlots.length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-destructive/10 rounded-xl">
                <Ban className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-destructive">{blockedSlots.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Staff on Leave</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">{staffLeaves.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="border-2 border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Select Date</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
            />
            {selectedDate && (
              <div className="mt-4 p-4 bg-primary/10 rounded-xl border-2 border-primary/20">
                <p className="text-sm font-semibold text-foreground">
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
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Time Slots</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Available
                </Badge>
                <Badge variant="outline" className="bg-destructive/10">
                  <Ban className="h-3 w-3 mr-1" />
                  Blocked
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {timeSlots.map((slot) => {
                const isBlocked = blockedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    onClick={() => toggleSlot(slot)}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                      isBlocked
                        ? 'border-destructive/20 bg-destructive/5'
                        : 'border-primary/20 bg-primary/5 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Clock className={`h-4 w-4 ${isBlocked ? 'text-destructive' : 'text-primary'}`} />
                      {isBlocked ? (
                        <Ban className="h-4 w-4 text-destructive" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="font-bold text-foreground mb-2">{slot}</p>
                    <Badge 
                      variant={isBlocked ? 'destructive' : 'default'}
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
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Staff Availability</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {staff.map((member) => {
              const isOnLeave = staffLeaves.includes(member.id);
              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    isOnLeave 
                      ? 'bg-destructive/5 border-destructive/20' 
                      : 'bg-muted border-border'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      isOnLeave 
                        ? 'bg-destructive/10 text-destructive' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={isOnLeave ? 'destructive' : 'default'}>
                      {isOnLeave ? 'On Leave' : 'Available'}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`staff-${member.id}`} className="text-sm text-foreground cursor-pointer">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Time Slot</DialogTitle>
            <DialogDescription>
              Add a new time slot for service bookings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="slot-time">Time Slot</Label>
              <Input
                id="slot-time"
                type="time"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                placeholder="Select time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slot-capacity">Capacity</Label>
              <Select value={newSlotCapacity} onValueChange={setNewSlotCapacity}>
                <SelectTrigger id="slot-capacity">
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSlot}>
              <Plus className="mr-2 h-4 w-4" />
              Create Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
