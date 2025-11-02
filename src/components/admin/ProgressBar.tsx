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
    <div className="space-y-1 sm:space-y-1.5 lg:space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between text-[10px] sm:text-xs lg:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 min-w-0 flex-1">
            {Icon ? (
              <div 
                className="p-1 sm:p-1.5 lg:p-2 rounded-md sm:rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" style={{ color }} />
              </div>
            ) : color ? (
              <div 
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: color, opacity }}
              />
            ) : null}
            {label && <span className="font-medium text-foreground truncate text-[10px] sm:text-xs lg:text-sm">{label}</span>}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
            {value !== undefined && <span className="text-muted-foreground text-[10px] sm:text-xs">{value}</span>}
            <span className="font-bold text-foreground w-8 sm:w-10 lg:w-12 text-right text-[10px] sm:text-xs lg:text-sm">
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
