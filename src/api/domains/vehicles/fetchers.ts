import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { Vehicle, VehicleInput } from '@/types/vehicle';
import { CustomerRoutes } from '@/lib/constants/routes';
import { mockVehicles, mockVehicleBrands, mockVehicleModels } from '@/mocks/data/customer-mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const vehicleFetchers = {
  async getVehicles(): Promise<Vehicle[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockVehicles;
    }
    
    const { data } = await apiClient.get<ApiResponse<Vehicle[]>>(CustomerRoutes.VEHICLES);
    return data.data!;
  },

  async createVehicle(input: VehicleInput): Promise<Vehicle> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newVehicle: Vehicle = {
        id: `vehicle_${Date.now()}`,
        userId: 'user_001',
        ...input,
        isPrimary: mockVehicles.length === 0, // First vehicle is primary
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockVehicles.push(newVehicle);
      return newVehicle;
    }
    
    const { data } = await apiClient.post<ApiResponse<Vehicle>>(
      CustomerRoutes.VEHICLES,
      input
    );
    return data.data!;
  },

  async updateVehicle(id: string, input: Partial<Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Vehicle> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockVehicles.findIndex(v => v.id === id);
      if (index !== -1) {
        // If setting this vehicle as primary, unset all other vehicles
        if (input.isPrimary === true) {
          mockVehicles.forEach((v, i) => {
            if (i !== index) {
              v.isPrimary = false;
            }
          });
        }
        
        mockVehicles[index] = {
          ...mockVehicles[index],
          ...input,
          updatedAt: new Date().toISOString(),
        };
        return mockVehicles[index];
      }
      throw new Error('Vehicle not found');
    }
    
    const { data } = await apiClient.patch<ApiResponse<Vehicle>>(
      `${CustomerRoutes.VEHICLES}/${id}`,
      input
    );
    return data.data!;
  },

  async deleteVehicle(id: string): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockVehicles.findIndex(v => v.id === id);
      if (index !== -1) {
        mockVehicles.splice(index, 1);
        return { message: 'Vehicle deleted successfully' };
      }
      throw new Error('Vehicle not found');
    }
    
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.VEHICLES}/${id}`
    );
    return data.data!;
  },
};
