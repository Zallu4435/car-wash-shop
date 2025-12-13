'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerRoutes } from '@/lib/constants/routes';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Hero Section - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8 sm:py-10 lg:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Support Center
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              How can we help you today?
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
              {/* Submit Complaint */}
              <Card className="hover:shadow-lg transition-all duration-300 border-2">
                <CardHeader>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-red-500/10 rounded-lg sm:rounded-xl flex-shrink-0">
                      <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-lg md:text-xl">Submit a Complaint</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                    Had an issue with your service or order? Let us know and we'll resolve it quickly.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button asChild className="w-full border-2 h-9 sm:h-10">
                      <Link href={CustomerRoutes.COMPLAINTS} className="text-xs sm:text-sm">Submit Complaint</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-2 h-9 sm:h-10">
                      <Link href={CustomerRoutes.COMPLAINTS_LIST} className="text-xs sm:text-sm">View My Complaints</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
