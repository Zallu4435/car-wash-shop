'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-2">
        <CardContent className="pt-12 pb-8 text-center">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Oops! Something went wrong
          </h2>

          {/* Error Message */}
          <p className="text-muted-foreground mb-2">
            We encountered an unexpected error
          </p>
          {error.message && (
            <p className="text-sm text-muted-foreground mb-6 p-3 bg-muted rounded-lg font-mono">
              {error.message}
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => reset()} 
              className="w-full shadow-lg" 
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              If the problem persists, please{' '}
              <Link href="/support" className="text-primary hover:underline">
                contact support
              </Link>
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
