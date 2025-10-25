'use client';

import Link from 'next/link';
import { MessageSquare, Phone, Mail, FileQuestion, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-12 lg:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Support Center
            </h1>
            <p className="text-lg text-muted-foreground">
              How can we help you today?
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Submit Complaint */}
              <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2">
                <CardHeader>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl w-fit mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-xl">Submit a Complaint</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Had an issue with your service or order? Let us know and we'll resolve it quickly.
                  </p>
                  <Button asChild className="w-full shadow-md">
                    <Link href="/support/complaints">Submit Complaint</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* FAQs */}
              <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                    <FileQuestion className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Find quick answers to commonly asked questions about our services.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/support/faq">View FAQs</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Get in Touch</CardTitle>
                </div>
                <p className="text-muted-foreground">
                  Our support team is here to help you
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Phone */}
                  <div className="flex flex-col gap-3 p-5 bg-muted rounded-xl hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-background rounded-lg">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-semibold text-foreground">Phone</p>
                    </div>
                    <a 
                      href="tel:+918848919507" 
                      className="text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      +91 88489 19507
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-3 p-5 bg-muted rounded-xl hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-background rounded-lg">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-semibold text-foreground">Email</p>
                    </div>
                    <a 
                      href="mailto:support@carwash.com" 
                      className="text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      support@carwash.com
                    </a>
                  </div>

                  {/* Live Chat */}
                  <div className="flex flex-col gap-3 p-5 bg-muted rounded-xl hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-background rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-semibold text-foreground">Live Chat</p>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">
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
