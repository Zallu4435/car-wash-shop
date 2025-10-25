'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, FileText, Calendar, CreditCard, Package, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function PaymentReceiptPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8">
          <Link href="/orders">
            <Button variant="ghost" className="mb-4 hover:bg-muted">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Payment Receipt</h1>
              <p className="text-muted-foreground mt-1">Transaction details and invoice</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-border">
              <CardHeader>
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 border-4 border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Payment Successful</CardTitle>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                    <span className="text-sm text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono font-semibold text-foreground">TXN123456789</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Transaction Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date & Time</p>
                        <p className="font-semibold text-foreground">Oct 24, 2025 • 3:30 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-semibold text-foreground">ORD001</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p className="font-semibold text-foreground">Online Payment</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Amount Section */}
                <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Amount Paid</p>
                      <p className="text-3xl font-bold text-primary">₹697</p>
                    </div>
                    <div className="p-4 bg-background rounded-xl">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button className="w-full shadow-lg" size="lg">
                    <Download className="mr-2 h-5 w-5" />
                    Download Receipt
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/orders">View All Orders</Link>
                  </Button>
                </div>

                {/* Footer Note */}
                <div className="pt-6 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground">
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
