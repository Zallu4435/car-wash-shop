import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  description?: string;
  className?: string;
  valueClassName?: string;
  iconClassName?: string;
  iconBgClassName?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend,
  description,
  className,
  valueClassName,
  iconClassName = 'h-5 w-5 sm:h-6 sm:w-6 text-primary',
  iconBgClassName = '',
}: StatCardProps) {
  return (
    <Card className={cn('border-2 border-border', className)}>
      <CardContent className="p-3 sm:p-4 lg:p-5">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <Icon className={iconClassName} />
          {change && (
            <Badge 
              variant="outline" 
              className={cn(
                'gap-0.5 sm:gap-1 text-[10px] sm:text-xs',
                trend === 'up' && 'text-green-600 dark:text-green-400',
                trend === 'down' && 'text-red-600 dark:text-red-400'
              )}
            >
              {trend === 'up' && <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
              {trend === 'down' && <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
              {change}
            </Badge>
          )}
        </div>
        <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground truncate">{label}</p>
        <p className={cn('text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mt-0.5 sm:mt-1', valueClassName)}>
          {value}
        </p>
        {description && (
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
