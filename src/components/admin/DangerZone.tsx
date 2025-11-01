import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon, AlertTriangle } from 'lucide-react';
import { ReactNode } from 'react';

export interface DangerZoneAction {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: LucideIcon;
  onClick: () => void;
  variant?: 'destructive' | 'outline';
  buttonClassName?: string;
  disabled?: boolean;
}

interface DangerZoneProps {
  title?: string;
  description?: string;
  actions: DangerZoneAction[];
  className?: string;
}

export function DangerZone({
  title = 'Danger Zone',
  description = 'Irreversible actions',
  actions,
  className = '',
}: DangerZoneProps) {
  return (
    <Card className={`border-2 border-red-200 dark:border-red-900/50 ${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base sm:text-lg text-red-600 dark:text-red-400">{title}</CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className={actions.length > 1 ? 'space-y-3 sm:space-y-4' : ''}>
        {actions.map((action, index) => {
          const Icon = action.buttonIcon;
          
          return (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-destructive/5 rounded-lg border border-destructive/20"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-foreground mb-1">{action.title}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{action.description}</p>
              </div>
              <Button
                variant={action.variant || 'destructive'}
                onClick={action.onClick}
                className={`w-full sm:w-auto flex-shrink-0 border-2 ${action.buttonClassName || ''}`}
                disabled={action.disabled}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.buttonText}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
