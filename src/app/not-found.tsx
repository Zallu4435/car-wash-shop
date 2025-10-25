import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-2">
        <CardContent className="pt-12 pb-8 text-center">
          {/* 404 Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <FileQuestion className="h-10 w-10 text-primary" />
          </div>

          {/* 404 Number */}
          <div className="mb-4">
            <h1 className="text-8xl font-bold text-primary mb-2">404</h1>
            <div className="h-1 w-20 bg-primary rounded-full mx-auto"></div>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              asChild 
              className="w-full shadow-lg" 
              size="lg"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              <Link href="/products">
                <Search className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Quick Links</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button asChild variant="ghost" size="sm">
                <Link href="/services">Services</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/support">Support</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
