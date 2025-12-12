'use client';

import Link from 'next/link';
import { MessageSquare, Phone, Mail, FileQuestion, AlertCircle, Clock } from 'lucide-react';
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

              {/* FAQs */}
              <Card className="hover:shadow-lg transition-all duration-300 border-2">
                <CardHeader>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                      <FileQuestion className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-lg md:text-xl">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                    Find quick answers to commonly asked questions about our services.
                  </p>
                  <Button asChild variant="outline" className="w-full border-2 h-9 sm:h-10">
                    <Link href={CustomerRoutes.SUPPORT_FAQ} className="text-xs sm:text-sm">View FAQs</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl md:text-2xl">Get in Touch</CardTitle>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Our support team is here to help you
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Phone */}
                  <div className="flex flex-col gap-2 sm:gap-3 p-4 sm:p-5 bg-muted rounded-lg sm:rounded-xl hover:bg-accent transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-2 sm:p-2.5 bg-background rounded-lg">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-foreground">Phone</p>
                    </div>
                    <a
                      href="tel:+918848919507"
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors font-medium break-all"
                    >
                      +91 88489 19507
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2 sm:gap-3 p-4 sm:p-5 bg-muted rounded-lg sm:rounded-xl hover:bg-accent transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-2 sm:p-2.5 bg-background rounded-lg">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-foreground">Email</p>
                    </div>
                    <a
                      href="mailto:support@eazywash.com"
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors font-medium break-all"
                    >
                      support@eazywash.com
                    </a>
                  </div>

                  {/* Live Chat */}
                  <div className="flex flex-col gap-2 sm:gap-3 p-4 sm:p-5 bg-muted rounded-lg sm:rounded-xl hover:bg-accent transition-colors sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-2 sm:p-2.5 bg-background rounded-lg">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-foreground">Live Chat</p>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Mon-Sat, 9 AM - 6 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
