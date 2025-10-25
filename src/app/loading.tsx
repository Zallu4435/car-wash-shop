import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-base font-medium text-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}
