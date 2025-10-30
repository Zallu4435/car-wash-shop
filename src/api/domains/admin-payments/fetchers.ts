import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import { AdminRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Types
export interface PaymentTransaction {
  id: string;
  type: 'Service' | 'Product';
  amount: number;
  method: 'UPI' | 'Card' | 'COD' | 'Net Banking';
  status: 'Success' | 'Pending' | 'Failed';
  date: string;
  orderId?: string;
  customerId?: string;
  customerName?: string;
}

export interface PaymentReport {
  totalRevenue: number;
  revenueGrowth: number;
  onlineTotal: number;
  onlinePercentage: number;
  codTotal: number;
  codPercentage: number;
  upiTotal: number;
  upiPercentage: number;
  cardTotal: number;
  cardPercentage: number;
  netBankingTotal: number;
  netBankingPercentage: number;
}

// Mock data
const mockTransactions: PaymentTransaction[] = [
  { id: 'TXN001', type: 'Service', amount: 1299, method: 'UPI', status: 'Success', date: '2025-10-24', customerName: 'Rajesh Kumar' },
  { id: 'TXN002', type: 'Product', amount: 2450, method: 'Card', status: 'Success', date: '2025-10-24', customerName: 'Priya Sharma' },
  { id: 'TXN003', type: 'Service', amount: 899, method: 'COD', status: 'Pending', date: '2025-10-23', customerName: 'Amit Patel' },
  { id: 'TXN004', type: 'Product', amount: 1850, method: 'Net Banking', status: 'Success', date: '2025-10-23', customerName: 'Sneha Reddy' },
  { id: 'TXN005', type: 'Service', amount: 1599, method: 'UPI', status: 'Success', date: '2025-10-22', customerName: 'Vikram Singh' },
  { id: 'TXN006', type: 'Product', amount: 3200, method: 'Card', status: 'Success', date: '2025-10-22', customerName: 'Anita Desai' },
  { id: 'TXN007', type: 'Service', amount: 799, method: 'UPI', status: 'Success', date: '2025-10-21', customerName: 'Rahul Verma' },
  { id: 'TXN008', type: 'Product', amount: 1200, method: 'COD', status: 'Pending', date: '2025-10-21', customerName: 'Pooja Gupta' },
  { id: 'TXN009', type: 'Service', amount: 1499, method: 'Net Banking', status: 'Success', date: '2025-10-20', customerName: 'Suresh Iyer' },
  { id: 'TXN010', type: 'Product', amount: 2800, method: 'Card', status: 'Failed', date: '2025-10-20', customerName: 'Meena Nair' },
];

const mockReport: PaymentReport = {
  totalRevenue: 181770,
  revenueGrowth: 12.5,
  onlineTotal: 135540,
  onlinePercentage: 74.6,
  codTotal: 46230,
  codPercentage: 25.4,
  upiTotal: 78450,
  upiPercentage: 43.2,
  cardTotal: 45678,
  cardPercentage: 25.1,
  netBankingTotal: 11412,
  netBankingPercentage: 6.3,
};

export const adminPaymentFetchers = {
  async getPaymentTransactions(filters?: { 
    search?: string;
    status?: string; 
    method?: string;
    dateRange?: string;
  }): Promise<PaymentTransaction[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...mockTransactions];
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(t => 
          t.id.toLowerCase().includes(searchLower) ||
          t.type.toLowerCase().includes(searchLower) ||
          t.customerName?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters?.status) {
        filtered = filtered.filter(t => t.status.toLowerCase() === filters.status?.toLowerCase());
      }
      
      if (filters?.method) {
        const methodMap: Record<string, string> = {
          'upi': 'UPI',
          'card': 'Card',
          'cod': 'COD',
          'netbanking': 'Net Banking',
        };
        const mappedMethod = methodMap[filters.method.toLowerCase()] || filters.method;
        filtered = filtered.filter(t => t.method === mappedMethod);
      }
      
      if (filters?.dateRange) {
        // Filter by date range logic here
        // For now, just return filtered
      }
      
      return filtered;
    }

    const { data } = await apiClient.get<ApiResponse<PaymentTransaction[]>>(
      `${AdminRoutes.PAYMENTS}/transactions`,
      { params: filters }
    );
    return data.data!;
  },

  async getPaymentReport(fromDate?: string, toDate?: string): Promise<PaymentReport> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockReport;
    }

    const { data } = await apiClient.get<ApiResponse<PaymentReport>>(
      `${AdminRoutes.PAYMENTS}/report`,
      { params: { fromDate, toDate } }
    );
    return data.data!;
  },

  async verifyTransaction(transactionId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    await apiClient.post(`${AdminRoutes.PAYMENTS}/${transactionId}/verify`);
  },
};
