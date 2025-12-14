'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, Building2, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerRoutes } from '@/lib/constants/routes';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrder, useDownloadInvoice } from '@/api/domains/orders/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { useAuth } from '@/context/AuthContext';

// Fallback company info for old orders without invoiceDetails snapshot
const FALLBACK_COMPANY_INFO = {
  companyName: 'Eazy Wash Services',
  address: '456 Service Road, Sector 5',
  city: 'Bengaluru, Karnataka - 560103',
  phone: '+91 80 5555 1111',
  email: 'billing@eazywash.com',
  gst: 'GSTIN29ABCDE1234F1Z5',
  website: 'www.eazywash.com',
};

const formatCurrency = (value?: number) =>
  `₹${(value ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const formatAddress = (address?: {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
} | string) => {
  if (!address) return 'Address not available';
  if (typeof address === 'string') return address;
  return [address.line1, address.line2, address.city, address.state, address.pincode].filter(Boolean).join(', ');
};

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const isService = id.startsWith('booking_');
  const detailHref = isService
    ? CustomerRoutes.ORDER_SERVICE_DETAIL(id)
    : CustomerRoutes.ORDER_PRODUCT_DETAIL(id);

  const { data: order, isLoading, error, refetch } = useOrder(id);
  const downloadInvoice = useDownloadInvoice();

  const handleDownload = () => {
    downloadInvoice.mutate(id);
  };

  if (isLoading) {
    return <Loading text="Loading invoice..." />;
  }

  if (error || !order) {
    return (
      <Error
        message="Unable to load invoice"
        details={error instanceof Error ? error.message : 'Order not found'}
        onRetry={() => refetch()}
      />
    );
  }

  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    dateStyle: 'medium',
  });

  const items = order.items || [];

  // Use snapshotted invoice details from order, fallback for old orders without snapshot
  const COMPANY_INFO = order.invoiceDetails || FALLBACK_COMPANY_INFO;

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
              <p className="text-muted-foreground mt-1">Order #{order.orderNumber}</p>
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
                    <p className="text-muted-foreground">Invoice #INV-{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground mt-1">Date: {invoiceDate}</p>
                  </div>
                  <Button onClick={handleDownload} disabled={downloadInvoice.isPending}>
                    <Download className="mr-2 h-4 w-4" />
                    {downloadInvoice.isPending ? 'Downloading...' : 'Download PDF'}
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
                    <div className="p-4 bg-muted rounded-xl space-y-1 text-sm">
                      <p className="font-semibold text-foreground">{COMPANY_INFO.companyName}</p>
                      <p className="text-muted-foreground">{COMPANY_INFO.address}</p>
                      <p className="text-muted-foreground">{COMPANY_INFO.city}</p>
                      {COMPANY_INFO.phone && (
                        <p className="text-muted-foreground flex items-center gap-2 mt-2">
                          <Phone className="h-3 w-3" />
                          {COMPANY_INFO.phone}
                        </p>
                      )}
                      {COMPANY_INFO.email && (
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {COMPANY_INFO.email}
                        </p>
                      )}
                      {COMPANY_INFO.gst && (
                        <p className="text-muted-foreground mt-2 font-mono text-xs">
                          GST: {COMPANY_INFO.gst}
                        </p>
                      )}
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
                    <div className="p-4 bg-muted rounded-xl space-y-1 text-sm">
                      <p className="font-semibold text-foreground">{user?.name || 'Customer'}</p>
                      {user?.phone && (
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </p>
                      )}
                      {user?.email && (
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>
                      )}
                      <p className="text-muted-foreground mt-2">
                        {formatAddress(order.deliveryAddress)}
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
                      {items.map((item, index) => {
                        const unitPrice = item.unitPrice ?? item.price ?? 0;
                        const subtotal = item.subtotal ?? unitPrice * item.quantity;
                        return (
                          <tr key={`${item.productId}-${index}`} className="border-b border-border">
                            <td className="py-4 text-foreground">{item.productName}</td>
                            <td className="py-4 text-center text-muted-foreground">{item.quantity}</td>
                            <td className="py-4 text-right text-muted-foreground">{formatCurrency(unitPrice)}</td>
                            <td className="py-4 text-right font-medium text-foreground">{formatCurrency(subtotal)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="space-y-3 max-w-sm ml-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium text-foreground">{formatCurrency(order.subtotal)}</span>
                  </div>
                  {(order.discount ?? 0) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 dark:text-green-400">Discount:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        -{formatCurrency(order.discount)}
                      </span>
                    </div>
                  )}
                  {(order.tax ?? 0) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax:</span>
                      <span className="font-medium text-foreground">{formatCurrency(order.tax)}</span>
                    </div>
                  )}
                  {(order.shippingFee ?? 0) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span className="font-medium text-foreground">{formatCurrency(order.shippingFee)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg text-foreground">Total:</span>
                    <span className="font-bold text-2xl text-primary">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground">
                    Thank you for your business! This is a computer-generated invoice.
                    {COMPANY_INFO.email && ` For any queries, contact us at ${COMPANY_INFO.email}`}
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
