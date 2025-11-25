'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerRoutes } from '@/lib/constants/routes';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isService = id.startsWith('booking_');
  const detailHref = isService
    ? CustomerRoutes.ORDER_SERVICE_DETAIL(id)
    : CustomerRoutes.ORDER_PRODUCT_DETAIL(id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8">
          <Link href={detailHref}>
            <Button variant="ghost" className="mb-4 hover:bg-muted">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isService ? 'Back to Booking' : 'Back to Order'}
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Invoice</h1>
              <p className="text-muted-foreground mt-1">Order #{id}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8 md:p-12">
                {/* Header with Download Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 pb-8 border-b border-border">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">INVOICE</h2>
                    <p className="text-muted-foreground">Invoice #INV-{id}</p>
                    <p className="text-sm text-muted-foreground mt-1">Date: Oct 24, 2025</p>
                  </div>
                  <Button className="">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>

                {/* Business Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* From */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">From:</h3>
                    </div>
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="font-semibold text-foreground">CarWash Services</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        MG Road, Bandra West<br />
                        Mumbai - 400050<br />
                        Maharashtra, India<br />
                        GST: 27XXXXX1234X1ZX
                      </p>
                    </div>
                  </div>

                  {/* To */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">To:</h3>
                    </div>
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="font-semibold text-foreground">John Doe</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        +91 98765 43210<br />
                        john.doe@email.com<br />
                        Mumbai, India
                      </p>
                    </div>
                  </div>
                </div>

                {/* Invoice Table */}
                <div className="overflow-x-auto mb-8">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left pb-3 text-sm font-semibold text-foreground">Item</th>
                        <th className="text-center pb-3 text-sm font-semibold text-foreground">Qty</th>
                        <th className="text-right pb-3 text-sm font-semibold text-foreground">Price</th>
                        <th className="text-right pb-3 text-sm font-semibold text-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-4 text-foreground">Premium Car Shampoo</td>
                        <td className="py-4 text-center text-muted-foreground">2</td>
                        <td className="py-4 text-right text-muted-foreground">₹299</td>
                        <td className="py-4 text-right font-medium text-foreground">₹598</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-4 text-foreground">Microfiber Cloth Set</td>
                        <td className="py-4 text-center text-muted-foreground">1</td>
                        <td className="py-4 text-right text-muted-foreground">₹199</td>
                        <td className="py-4 text-right font-medium text-foreground">₹199</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="space-y-3 max-w-sm ml-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium text-foreground">₹797</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 dark:text-green-400">Discount:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">-₹100</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg text-foreground">Total:</span>
                    <span className="font-bold text-2xl text-primary">₹697</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground">
                    Thank you for your business! This is a computer-generated invoice.
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
