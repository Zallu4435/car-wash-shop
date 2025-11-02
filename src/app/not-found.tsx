// app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CustomerRoutes } from '@/lib/constants/routes';
import { FileQuestion, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-2 border-border shadow-lg">
        <CardContent className="pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8 text-center">
          {/* 404 Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-4 sm:mb-6">
            <FileQuestion className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>

          {/* 404 Number */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary mb-2 sm:mb-3">
              404
            </h1>
            <div className="h-1 w-16 sm:w-20 bg-primary rounded-full mx-auto"></div>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3 px-2">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-6 sm:mb-8 max-w-sm mx-auto px-2 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3">
            <Button 
              asChild 
              className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" 
              size="lg"
            >
              <Link href={CustomerRoutes.HOME}>
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="w-full h-11 sm:h-12 text-sm sm:text-base"
              size="lg"
            >
              <Link href={CustomerRoutes.PRODUCTS}>
                <Search className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 font-medium">
              Quick Links
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
              <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                <Link href={CustomerRoutes.SERVICES}>Services</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                <Link href={CustomerRoutes.PRODUCTS}>Products</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                <Link href={CustomerRoutes.SUPPORT}>Support</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                <Link href={CustomerRoutes.LOGIN}>Login</Link>
              </Button>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-4 sm:mt-6">
            <Button 
              asChild 
              variant="link" 
              size="sm"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
            >
              <Link href="javascript:history.back()">
                ← Go back to previous page
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
