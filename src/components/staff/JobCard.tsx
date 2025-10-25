import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, User, Briefcase, Navigation } from 'lucide-react';
import Link from 'next/link';

interface Job {
  id: string;
  customer: string;
  phone: string;
  service: string;
  time: string;
  address: string;
  status: string;
}

interface JobCardProps {
  job: Job;
}

const statusConfig = {
  'pending': { 
    variant: 'secondary' as const, 
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-950/30',
    label: 'Pending'
  },
  'confirmed': { 
    variant: 'default' as const, 
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-950/30',
    label: 'Confirmed'
  },
  'in-progress': { 
    variant: 'default' as const, 
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-950/30',
    label: 'In Progress'
  },
  'completed': { 
    variant: 'outline' as const, 
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-950/30',
    label: 'Completed'
  },
};

export function JobCard({ job }: JobCardProps) {
  const status = statusConfig[job.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Card className="border-2 hover:shadow-lg transition-all">
      <CardContent className="p-5">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="font-mono text-xs">
                {job.id}
              </Badge>
              <Badge className={status.bgColor}>
                <span className={status.color}>{status.label}</span>
              </Badge>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <User className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-bold text-foreground">{job.customer}</h3>
            </div>
            <a 
              href={`tel:${job.phone}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{job.phone}</span>
            </a>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-xl">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-primary">{job.time}</span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-3 mb-4 p-4 bg-muted rounded-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Service</p>
            </div>
            <p className="font-semibold text-foreground">{job.service}</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Location</p>
            </div>
            <p className="font-medium text-foreground leading-relaxed">{job.address}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1 shadow-md" asChild>
            <Link href={`/staff/jobs/${job.id}`}>
              View Details
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            asChild
          >
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
