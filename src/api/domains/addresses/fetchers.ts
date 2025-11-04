import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { Address, AddressInput } from '@/types/address';

const ADDRESSES_API = '/addresses';

export const addressFetchers = {
  async getAddresses(): Promise<Address[]> {
    const { data } = await apiClient.get<ApiResponse<Address[]>>(ADDRESSES_API);
    return data.data!;
  },

  async createAddress(input: AddressInput): Promise<Address> {
    const { data } = await apiClient.post<ApiResponse<Address>>(ADDRESSES_API, input);
    return data.data!;
  },

  async updateAddress(id: string, input: Partial<AddressInput>): Promise<Address> {
    const { data } = await apiClient.patch<ApiResponse<Address>>(
      `${ADDRESSES_API}/${id}`,
      input
    );
    return data.data!;
  },

  async deleteAddress(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${ADDRESSES_API}/${id}`
    );
    return data.data!;
  },

  async setPrimaryAddress(id: string): Promise<Address> {
    const { data } = await apiClient.post<ApiResponse<Address>>(
      `${ADDRESSES_API}/${id}/primary`
    );
    return data.data!;
  },
};
