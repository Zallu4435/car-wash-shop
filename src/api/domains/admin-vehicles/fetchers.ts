import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  VehicleBrand,
  VehicleModel,
  CreateVehicleBrandInput,
  CreateVehicleModelInput,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminVehiclesFetchers = {
  // Brands
  async getVehicleBrands(): Promise<VehicleBrand[]> {
    const { data } = await apiClient.get<ApiResponse<VehicleBrand[]>>(
      AdminRoutes.VEHICLE_BRANDS
    );
    return data.data!;
  },

  async createVehicleBrand(input: CreateVehicleBrandInput): Promise<VehicleBrand> {
    const { data } = await apiClient.post<ApiResponse<VehicleBrand>>(
      AdminRoutes.VEHICLE_BRANDS,
      input
    );
    return data.data!;
  },

  async updateVehicleBrand(
    brandId: string,
    input: Partial<CreateVehicleBrandInput>
  ): Promise<VehicleBrand> {
    const { data } = await apiClient.patch<ApiResponse<VehicleBrand>>(
      `${AdminRoutes.VEHICLE_BRANDS}/${brandId}`,
      input
    );
    return data.data!;
  },

  async deleteVehicleBrand(brandId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.VEHICLE_BRANDS}/${brandId}`
    );
    return data.data!;
  },

  // Models
  async getVehicleModels(): Promise<VehicleModel[]> {
    const { data } = await apiClient.get<ApiResponse<VehicleModel[]>>(
      AdminRoutes.VEHICLE_MODELS
    );
    return data.data!;
  },

  async createVehicleModel(input: CreateVehicleModelInput): Promise<VehicleModel> {
    const { data } = await apiClient.post<ApiResponse<VehicleModel>>(
      AdminRoutes.VEHICLE_MODELS,
      input
    );
    return data.data!;
  },

  async updateVehicleModel(
    modelId: string,
    input: Partial<CreateVehicleModelInput>
  ): Promise<VehicleModel> {
    const { data } = await apiClient.patch<ApiResponse<VehicleModel>>(
      `${AdminRoutes.VEHICLE_MODELS}/${modelId}`,
      input
    );
    return data.data!;
  },

  async deleteVehicleModel(modelId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.VEHICLE_MODELS}/${modelId}`
    );
    return data.data!;
  },
};
