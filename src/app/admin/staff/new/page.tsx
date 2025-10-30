'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function NewStaffPage() {
  const router = useRouter();
  const [active, setActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Staff member added successfully!');
    router.push('/admin/staff');
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/staff')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Staff
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Add New Staff Member</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Enter staff details below</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g., Rahul Kumar"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="9876543210"
                required
              />
              <p className="text-xs text-muted-foreground">Enter 10-digit mobile number</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-xs text-muted-foreground">(Optional)</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="rahul@example.com"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="senior">Senior Detailer</SelectItem>
                  <SelectItem value="detailer">Detailer</SelectItem>
                  <SelectItem value="delivery">Delivery Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Service Area */}
            <div className="space-y-2">
              <Label htmlFor="area">Service Area</Label>
              <Input
                id="area"
                placeholder="e.g., Bandra, Khar"
                required
              />
              <p className="text-xs text-muted-foreground">Comma-separated locations</p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">Staff member can receive jobs</p>
              </div>
              <Switch id="active" checked={active} onCheckedChange={setActive} />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg" size="lg">
              <UserPlus className="mr-2 h-5 w-5" />
              Add Staff Member
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
