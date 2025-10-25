'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full border-2 border-border">
        <CardContent className="pt-8 pb-8 px-6 text-center">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Something went wrong
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-6">
            An unexpected error occurred. Please try again.
          </p>

          {/* Action Button */}
          <Button 
            onClick={reset}
            className="w-full" 
            size="lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
