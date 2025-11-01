import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
  details?: string;
}

export default function Error({ message = 'Something went wrong', onRetry, details }: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full border-2 border-border shadow-lg">
        <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-destructive/10 rounded-full mb-3 sm:mb-4">
            <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-destructive" />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 px-2">
            {message}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 px-2 leading-relaxed">
            An unexpected error occurred. Please try again.
          </p>
          {details && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-muted rounded-lg border border-border text-left">
              <p className="text-xs font-mono text-muted-foreground break-words">{details}</p>
            </div>
          )}
          {onRetry && (
            <Button onClick={onRetry} className="w-full shadow-lg border-2 h-11 sm:h-12 text-sm sm:text-base" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
