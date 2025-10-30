'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [active, setActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Staff updated successfully!');
    router.push('/admin/staff');
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(`/admin/staff/${id}`)} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Staff Details
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Save className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Edit Staff Member</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Staff ID: {id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Same form fields as NewStaffPage but with defaultValues */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                defaultValue="Rahul Kumar"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                defaultValue="9876543210"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="rahul@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue="senior" required>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="senior">Senior Detailer</SelectItem>
                  <SelectItem value="detailer">Detailer</SelectItem>
                  <SelectItem value="delivery">Delivery Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Service Area</Label>
              <Input
                id="area"
                defaultValue="Bandra, Khar"
                required
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">Staff member can receive jobs</p>
              </div>
              <Switch id="active" checked={active} onCheckedChange={setActive} />
            </div>

            <Button type="submit" className="w-full shadow-lg" size="lg">
              <Save className="mr-2 h-5 w-5" />
              Update Staff Member
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
