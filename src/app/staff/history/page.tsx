'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Calendar, 
  DollarSign, 
  User, 
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp
} from 'lucide-react';

const completedJobs = [
  { 
    id: 'BK045', 
    customer: 'Amit Shah', 
    service: 'Premium Wash', 
    date: '2025-10-24', 
    amount: 499, 
    rating: 5,
    duration: '45 mins'
  },
  { 
    id: 'BK044', 
    customer: 'Priya Kumar', 
    service: 'Interior Detailing', 
    date: '2025-10-23', 
    amount: 699, 
    rating: 5,
    duration: '1 hour 30 mins'
  },
  { 
    id: 'BK043', 
    customer: 'Rahul Verma', 
    service: 'Full Detailing', 
    date: '2025-10-22', 
    amount: 1299, 
    rating: 4,
    duration: '2 hours'
  },
  { 
    id: 'BK042', 
    customer: 'Sneha Patel', 
    service: 'Basic Wash', 
    date: '2025-10-21', 
    amount: 299, 
    rating: 5,
    duration: '30 mins'
  },
];

const cancelledJobs = [
  {
    id: 'BK041',
    customer: 'Vikram Singh',
    service: 'Premium Wash',
    date: '2025-10-20',
    reason: 'Customer requested cancellation',
  },
];

export default function StaffHistoryPage() {
  const totalEarnings = completedJobs.reduce((sum, job) => sum + job.amount, 0);
  const averageRating = (completedJobs.reduce((sum, job) => sum + job.rating, 0) / completedJobs.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Job History</h1>
        <p className="text-muted-foreground mt-1">Track your completed and cancelled jobs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{completedJobs.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Earned</p>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{totalEarnings}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-950/30 rounded-lg">
                <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{averageRating} ⭐</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="completed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedJobs.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="gap-2">
            <XCircle className="h-4 w-4" />
            Cancelled ({cancelledJobs.length})
          </TabsTrigger>
        </TabsList>

        {/* Completed Jobs */}
        <TabsContent value="completed">
          <Card className="border-2 border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Completed Jobs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow border-2 border-border">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="font-mono">
                              {job.id}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: job.rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <p className="font-semibold text-foreground">{job.customer}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{job.service}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{job.date}</span>
                              </div>
                              <span>Duration: {job.duration}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">Earned</p>
                            <p className="text-2xl font-bold text-primary">₹{job.amount}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cancelled Jobs */}
        <TabsContent value="cancelled">
          <Card className="border-2 border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <CardTitle>Cancelled Jobs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {cancelledJobs.length > 0 ? (
                <div className="space-y-3">
                  {cancelledJobs.map((job) => (
                    <Card key={job.id} className="border-2 border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <Badge variant="outline" className="font-mono mb-2">
                              {job.id}
                            </Badge>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <p className="font-semibold text-foreground">{job.customer}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">{job.service}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{job.date}</span>
                              </div>
                              <p className="text-xs text-destructive mt-2">
                                Reason: {job.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-1">
                    Great job! No cancelled jobs
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Keep up the excellent work
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
