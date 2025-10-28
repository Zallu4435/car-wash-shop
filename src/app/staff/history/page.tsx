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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Job History
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Track your completed and cancelled jobs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{completedJobs.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Earned</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">₹{totalEarnings}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border col-span-2 md:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-950/30 rounded-lg">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Avg Rating</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{averageRating} ⭐</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="completed" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="completed" className="gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Completed</span>
            <span className="xs:hidden">Done</span>
            <span>({completedJobs.length})</span>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Cancelled</span>
            <span className="xs:hidden">Cancel</span>
            <span>({cancelledJobs.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Completed Jobs */}
        <TabsContent value="completed">
          <Card className="border-2 border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">Completed Jobs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow border-2 border-border">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                        {/* Left Section */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              {job.id}
                            </Badge>
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              {Array.from({ length: job.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <div className="space-y-0.5 sm:space-y-1">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                              <p className="font-semibold text-sm sm:text-base text-foreground truncate">{job.customer}</p>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">{job.service}</p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span>{job.date}</span>
                              </div>
                              <span>Duration: {job.duration}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4">
                          <div className="text-left md:text-right">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Earned</p>
                            <p className="text-xl sm:text-2xl font-bold text-primary">₹{job.amount}</p>
                          </div>
                          <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm flex-shrink-0">
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
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-destructive/10 rounded-lg">
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                </div>
                <CardTitle className="text-base sm:text-lg">Cancelled Jobs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {cancelledJobs.length > 0 ? (
                <div className="space-y-3">
                  {cancelledJobs.map((job) => (
                    <Card key={job.id} className="border-2 border-border">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Badge variant="outline" className="font-mono text-xs mb-1.5 sm:mb-2">
                              {job.id}
                            </Badge>
                            <div className="space-y-0.5 sm:space-y-1">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                <p className="font-semibold text-sm sm:text-base text-foreground truncate">{job.customer}</p>
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground">{job.service}</p>
                              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span>{job.date}</span>
                              </div>
                              <p className="text-[10px] sm:text-xs text-destructive mt-1.5 sm:mt-2">
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
                <div className="py-10 sm:py-12 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4">
                    <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-foreground mb-1">
                    Great job! No cancelled jobs
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
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
