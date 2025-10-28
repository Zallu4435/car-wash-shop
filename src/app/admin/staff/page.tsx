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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Staff Members
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage your team and their performance
          </p>
        </div>
        <Button onClick={() => router.push('/admin/staff/new')} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Staff
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: UserCog, label: 'Total Staff', value: staff.length },
          { icon: Briefcase, label: 'Active Members', value: staff.filter(s => s.active).length },
          { icon: Briefcase, label: 'Total Jobs', value: staff.reduce((sum, s) => sum + s.completedJobs, 0) },
        ].map((stat, index) => (
          <Card key={index} className={`border-2 border-border ${index === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Bar */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <UserCog className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Staff Members</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {filteredStaff.map((member) => (
              <Card key={member.id} className="border-2 border-border hover:shadow-lg transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserCog className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <Badge variant={member.active ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                      {member.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{member.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted rounded-lg mb-3 sm:mb-4">
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Completed Jobs</p>
                      <p className="text-base sm:text-lg font-bold text-foreground">{member.completedJobs}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Rating</p>
                      <p className="text-base sm:text-lg font-bold text-foreground">⭐ {member.rating}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(`/admin/staff/${member.id}`)}
                    >
                      <Eye className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">View</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(`/admin/staff/${member.id}/edit`)}
                    >
                      <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 px-3"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
