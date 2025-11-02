import { Badge } from '@/components/ui/badge';

interface MetricData {
  label: string;
  value: string | number;
  highlight?: boolean;
}

interface PerformanceCardProps {
  id: string;
  name: string;
  rating: number;
  metrics: MetricData[];
  badge?: {
    label: string;
    value: string | number;
  };
}

export function PerformanceCard({
  id,
  name,
  rating,
  metrics,
  badge,
}: PerformanceCardProps) {
  return (
    <div className="p-3 sm:p-4 border-2 border-border rounded-lg sm:rounded-xl">
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm sm:text-base lg:text-lg truncate">{name}</h3>
          <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground truncate">ID: {id}</p>
        </div>
        <Badge variant="outline" className="gap-0.5 sm:gap-1 text-[10px] sm:text-xs flex-shrink-0">
          ⭐ {rating.toFixed(1)}
        </Badge>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {metrics.map((metric, index) => (
          <div key={index}>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{metric.label}</p>
            <p className={`text-base sm:text-lg lg:text-xl font-bold ${
              metric.highlight ? 'text-primary' : 'text-foreground'
            }`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>
      {badge && (
        <div className="mt-2 sm:mt-3">
          <Badge variant="outline" className="text-[10px] sm:text-xs">
            {badge.label}: {badge.value}
          </Badge>
        </div>
      )}
    </div>
  );
}
