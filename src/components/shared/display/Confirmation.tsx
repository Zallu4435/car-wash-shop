import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface ConfirmationProps {
  title: string;
  message?: string;
  details?: string;
  icon?: React.ReactNode;
  primaryAction?: { label: string; onClick?: () => void; href?: string };
  secondaryAction?: { label: string; onClick?: () => void; href?: string };
}

const Confirmation: React.FC<ConfirmationProps> = ({
  title,
  message,
  details,
  icon,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] py-8 sm:py-12 px-4">
      <Card className="w-full max-w-md border-2 border-border shadow-lg">
        <CardContent className="py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center">
          {icon && (
            <div className="flex items-center justify-center mb-4 sm:mb-5">
              <span className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full text-3xl sm:text-4xl">
                {icon}
              </span>
            </div>
          )}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h2>
          {message && <p className="text-sm sm:text-base text-muted-foreground mb-4">{message}</p>}
          {details && (
            <div className="mb-4 p-2.5 sm:p-3 bg-muted rounded-lg border border-border text-left">
              <p className="text-[10px] sm:text-xs font-mono text-muted-foreground break-words">{details}</p>
            </div>
          )}
          {primaryAction && (
            primaryAction.href ? (
              <Button
                asChild
                className="w-full shadow-lg border-2 h-11 sm:h-12 text-sm sm:text-base mt-2"
                size="lg"
              >
                <a href={primaryAction.href}>{primaryAction.label}</a>
              </Button>
            ) : (
              <Button
                className="w-full shadow-lg border-2 h-11 sm:h-12 text-sm sm:text-base mt-2"
                size="lg"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )
          )}
          {secondaryAction && (
            <div className="mt-3 sm:mt-4">
              {secondaryAction.href ? (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-2 h-10 sm:h-11 text-xs sm:text-sm"
                  size="lg"
                >
                  <a href={secondaryAction.href}>{secondaryAction.label}</a>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-2 h-10 sm:h-11 text-xs sm:text-sm"
                  size="lg"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Confirmation;
