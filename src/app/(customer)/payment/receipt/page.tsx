'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, FileText, Calendar, CreditCard, Package, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function PaymentReceiptPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8">
          <Link href="/orders">
            <Button variant="ghost" className="mb-3 sm:mb-4 hover:bg-muted h-9 sm:h-10">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Back to Orders</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
              <FileText className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                Payment Receipt
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                Transaction details and invoice
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-border">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 border-4 border-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3">
                    Payment Successful
                  </CardTitle>
                  <div className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-muted rounded-full">
                    <span className="text-xs sm:text-sm text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono font-semibold text-xs sm:text-sm text-foreground break-all">
                      TXN123456789
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6">
                {/* Transaction Details */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="p-1.5 sm:p-2 bg-background rounded-lg flex-shrink-0">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">Date & Time</p>
                        <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                          Oct 24, 2025 • 3:30 PM
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="p-1.5 sm:p-2 bg-background rounded-lg flex-shrink-0">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">Order ID</p>
                        <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                          ORD001
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="p-1.5 sm:p-2 bg-background rounded-lg flex-shrink-0">
                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">Payment Method</p>
                        <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                          Online Payment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Amount Section */}
                <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-0.5 sm:mb-1">
                        Amount Paid
                      </p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">₹697</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-background rounded-lg sm:rounded-xl flex-shrink-0">
                      <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4">
                  <Button className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" size="lg">
                    <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Download Receipt
                  </Button>
                  <Button asChild variant="outline" className="w-full h-11 sm:h-12 text-sm sm:text-base">
                    <Link href="/orders">View All Orders</Link>
                  </Button>
                </div>

                {/* Footer Note */}
                <div className="pt-4 sm:pt-6 border-t border-border">
                  <p className="text-[10px] sm:text-xs text-center text-muted-foreground px-4">
                    A copy of this receipt has been sent to your registered email address.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
