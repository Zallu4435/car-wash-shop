'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, FileText, Building, User, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminRoutes } from '@/lib/constants/routes';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAdminOrderDetail } from '@/api/domains/admin-orders/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { adminOrdersFetchers } from '@/api/domains/admin-orders/fetchers';
import { toast } from 'sonner';

const COMPANY_INFO = {
  name: 'Eazy Wash Services',
  address: '456 Service Road, Sector 5',
  city: 'Bengaluru, Karnataka - 560103',
  phone: '+91 80 5555 1111',
  email: 'billing@eazywash.com',
  gst: 'GSTIN29ABCDE1234F1Z5',
};

const formatCurrency = (value?: number) =>
  `₹${(value ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const formatAddress = (address?: {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
}) => {
  if (!address) return 'Address not available';
  return [address.line1, address.line2, address.city, address.state, address.pincode].filter(Boolean).join(', ');
};

export default function AdminOrderInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading, error, refetch } = useAdminOrderDetail(id);

  const handleDownload = async () => {
    try {
      const blob = await adminOrdersFetchers.getOrderInvoice(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order?.orderNumber ?? id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download invoice';
      toast.error(message);
    }
  };

  if (isLoading) {
    return <Loading text="Preparing invoice..." />;
  }

  if (error || !order) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    return (
      <Error
        message="Unable to load invoice"
        details={errorMessage}
        onRetry={() => refetch()}
      />
    );
  }

  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    dateStyle: 'medium',
  });
  const dueDate = new Date(order.createdAt);
  dueDate.setDate(dueDate.getDate() + 7);

  const items = order.items || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.ORDER_DETAIL(id))} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Order
        </Button>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-xl">
                <FileText className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">INVOICE</h1>
                <p className="text-sm text-muted-foreground">#{order.orderNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono font-bold text-foreground">{order.id}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-5 bg-muted rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Building className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">From:</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-bold text-foreground">{COMPANY_INFO.name}</p>
                <p className="text-muted-foreground">{COMPANY_INFO.address}</p>
                <p className="text-muted-foreground">{COMPANY_INFO.city}</p>
                <p className="text-muted-foreground flex items-center gap-2 mt-2">
                  <Phone className="h-3 w-3" />
                  {COMPANY_INFO.phone}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  {COMPANY_INFO.email}
                </p>
                <p className="text-muted-foreground mt-2 font-mono text-xs">
                  GST: {COMPANY_INFO.gst}
                </p>
              </div>
            </div>

            <div className="p-5 bg-muted rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Bill To:</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-bold text-foreground">{order.customer?.name || 'Guest user'}</p>
                <p className="text-muted-foreground">{formatAddress(order.deliveryAddress)}</p>
                {order.customer?.phone && (
                  <p className="text-muted-foreground flex items-center gap-2 mt-2">
                    <Phone className="h-3 w-3" />
                    {order.customer.phone}
                  </p>
                )}
                {order.customer?.email && (
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {order.customer.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Invoice Date</p>
              </div>
              <p className="font-semibold text-foreground">{invoiceDate}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</p>
              </div>
              <p className="font-semibold text-foreground">
                {dueDate.toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Items</h3>
            <div className="border-2 border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-sm font-semibold text-foreground">Item</th>
                    <th className="px-4 py-3 text-sm font-semibold text-foreground text-center">Qty</th>
                    <th className="px-4 py-3 text-sm font-semibold text-foreground text-right">Price</th>
                    <th className="px-4 py-3 text-sm font-semibold text-foreground text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const total = item.subtotal ?? item.price * item.quantity;
                    return (
                      <tr
                        key={`${item.id}-${item.productId}`}
                        className={index !== items.length - 1 ? 'border-b border-border' : ''}
                      >
                        <td className="px-4 py-4 text-sm text-foreground">{item.name}</td>
                        <td className="px-4 py-4 text-sm text-foreground text-center">{item.quantity}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground text-right">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-foreground text-right">{formatCurrency(total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 dark:text-green-400">Discount</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    -{formatCurrency(order.discount)}
                  </span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-semibold text-foreground">{formatCurrency(order.tax)}</span>
                </div>
              )}
              {order.shippingFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-foreground">{formatCurrency(order.shippingFee)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between p-4 bg-primary/10 rounded-lg">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Thank you for your business! For any queries, please contact us at {COMPANY_INFO.email}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
