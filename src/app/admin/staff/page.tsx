'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  UserCog, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Phone,
  MapPin,
  Briefcase
} from 'lucide-react';
import { useState } from 'react';

const staff = [
  {
    id: 'staff_001',
    name: 'Rahul Kumar',
    phone: '+91 98765 43210',
    role: 'Senior Detailer',
    area: 'Bandra, Khar',
    active: true,
    completedJobs: 156,
    rating: 4.8,
  },
  {
    id: 'staff_002',
    name: 'Amit Sharma',
    phone: '+91 98765 43211',
    role: 'Detailer',
    area: 'Andheri, Vile Parle',
    active: true,
    completedJobs: 89,
    rating: 4.6,
  },
  {
    id: 'staff_003',
    name: 'Vijay Patel',
    phone: '+91 98765 43212',
    role: 'Delivery Staff',
    area: 'Borivali, Kandivali',
    active: true,
    completedJobs: 203,
    rating: 4.7,
  },
];

export default function StaffPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Staff Members</h1>
          <p className="text-muted-foreground mt-1">Manage your team and their performance</p>
        </div>
        <Button onClick={() => router.push('/admin/staff/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Staff</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{staff.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{staff.filter(s => s.active).length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{staff.reduce((sum, s) => sum + s.completedJobs, 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCog className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>All Staff Members</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredStaff.map((member) => (
              <Card key={member.id} className="border-2 border-border hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <UserCog className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Badge variant={member.active ? 'default' : 'secondary'}>
                      {member.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{member.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Completed Jobs</p>
                      <p className="text-lg font-bold text-foreground">{member.completedJobs}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="text-lg font-bold text-foreground">⭐ {member.rating}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/admin/staff/${member.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/admin/staff/${member.id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
