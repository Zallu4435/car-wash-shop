import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { Vehicle, VehicleInput } from '@/types/vehicle';

const VEHICLES_API = '/vehicles';

export const vehicleFetchers = {
  async getVehicles(): Promise<Vehicle[]> {
    const { data } = await apiClient.get<ApiResponse<Vehicle[]>>(VEHICLES_API);
    return data.data!;
  },

  async createVehicle(input: VehicleInput): Promise<Vehicle> {
    const { data } = await apiClient.post<ApiResponse<Vehicle>>(VEHICLES_API, input);
    return data.data!;
  },

  async updateVehicle(
    id: string,
    input: Partial<Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Vehicle> {
    const { data } = await apiClient.patch<ApiResponse<Vehicle>>(
      `${VEHICLES_API}/${id}`,
      input
    );
    return data.data!;
  },

  async deleteVehicle(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${VEHICLES_API}/${id}`
    );
    return data.data!;
  },
};
