import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
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
    <Card className={`border-2 border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className={actions.length > 1 ? 'space-y-3' : ''}>
        {actions.map((action, index) => {
          const Icon = action.buttonIcon;
          
          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
            >
              <div>
                <p className="font-semibold text-foreground">{action.title}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <Button
                variant={action.variant || 'destructive'}
                onClick={action.onClick}
                className={action.buttonClassName}
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
