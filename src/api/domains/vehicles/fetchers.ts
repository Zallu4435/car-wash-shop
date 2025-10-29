import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { Vehicle, VehicleInput } from '@/types/vehicle';
import { CustomerRoutes } from '@/lib/constants/routes';
import { mockVehicleBrands, mockVehicleModels } from '@/mocks/data/customer-mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock user vehicles
const mockUserVehicles = [
  {
    id: 'vehicle_001',
    brand: 'Honda',
    model: 'City',
    number: 'KA01AB1234',
    type: 'sedan',
    isDefault: true,
  },
  {
    id: 'vehicle_002',
    brand: 'Maruti',
    model: 'Swift',
    number: 'KA02CD5678',
    type: 'hatchback',
    isDefault: false,
  },
];

export const vehicleFetchers = {
  async getVehicles(): Promise<Vehicle[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockUserVehicles as any;
    }
    
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
