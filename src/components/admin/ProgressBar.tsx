import { LucideIcon } from 'lucide-react';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  opacity?: number;
  height?: 'sm' | 'md';
  showLabel?: boolean;
  label?: string;
  value?: string | number;
  icon?: LucideIcon;
}

export function ProgressBar({ 
  percentage, 
  color, 
  opacity = 1,
  height = 'sm',
  showLabel = true,
  label,
  value,
  icon: Icon
}: ProgressBarProps) {
  const heightClass = height === 'md' ? 'h-2 sm:h-3' : 'h-1.5 sm:h-2';
  
  return (
    <div className="space-y-1.5 sm:space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {Icon ? (
              <div 
                className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color }} />
              </div>
            ) : color ? (
              <div 
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: color, opacity }}
              />
            ) : null}
            {label && <span className="font-medium text-foreground truncate">{label}</span>}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {value !== undefined && <span className="text-muted-foreground">{value}</span>}
            <span className="font-bold text-foreground w-10 sm:w-12 text-right">
              {percentage}%
            </span>
          </div>
        </div>
      )}
      <div className={`${heightClass} bg-muted rounded-full overflow-hidden`}>
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            opacity
          }}
        />
      </div>
    </div>
  );
}
