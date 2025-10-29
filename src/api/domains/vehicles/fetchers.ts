import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { Vehicle, VehicleInput } from '@/types/vehicle';
import { CustomerRoutes } from '@/lib/constants/routes';

export const vehicleFetchers = {
  async getVehicles(): Promise<Vehicle[]> {
    const { data } = await apiClient.get<ApiResponse<Vehicle[]>>(CustomerRoutes.VEHICLES);
    return data.data!;
  },

  async createVehicle(input: VehicleInput): Promise<Vehicle> {
    const { data } = await apiClient.post<ApiResponse<Vehicle>>(
      CustomerRoutes.VEHICLES,
      input
    );
    return data.data!;
  },

  async updateVehicle(id: string, input: Partial<VehicleInput>): Promise<Vehicle> {
    const { data } = await apiClient.patch<ApiResponse<Vehicle>>(
      `${CustomerRoutes.VEHICLES}/${id}`,
      input
    );
    return data.data!;
  },

  async deleteVehicle(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.VEHICLES}/${id}`
    );
    return data.data!;
  },
};
