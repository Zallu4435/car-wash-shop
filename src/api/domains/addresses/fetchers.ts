import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { Address, AddressInput } from '@/types/address';
import { CustomerRoutes } from '@/lib/constants/routes';

export const addressFetchers = {
  async getAddresses(): Promise<Address[]> {
    const { data } = await apiClient.get<ApiResponse<Address[]>>(CustomerRoutes.ADDRESSES);
    return data.data!;
  },

  async createAddress(input: AddressInput): Promise<Address> {
    const { data } = await apiClient.post<ApiResponse<Address>>(
      CustomerRoutes.ADDRESSES,
      input
    );
    return data.data!;
  },

  async updateAddress(id: string, input: Partial<AddressInput>): Promise<Address> {
    const { data } = await apiClient.patch<ApiResponse<Address>>(
      `${CustomerRoutes.ADDRESSES}/${id}`,
      input
    );
    return data.data!;
  },

  async deleteAddress(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.ADDRESSES}/${id}`
    );
    return data.data!;
  },

  async setPrimaryAddress(id: string): Promise<Address> {
    const { data } = await apiClient.post<ApiResponse<Address>>(
      `${CustomerRoutes.ADDRESSES}/${id}/${CustomerRoutes.ADDRESSES_PRIMARY}`
    );
    return data.data!;
  },
};
