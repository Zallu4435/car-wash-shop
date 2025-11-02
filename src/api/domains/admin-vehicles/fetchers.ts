import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  VehicleBrand,
  VehicleModel,
  CreateVehicleBrandInput,
  CreateVehicleModelInput,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockBrands: VehicleBrand[] = [
  { id: 'BRD001', name: 'Honda', logo: '/images/brands/honda.png', modelCount: 5, status: 'active', createdAt: '2023-01-01' },
  { id: 'BRD002', name: 'Maruti Suzuki', logo: '/images/brands/maruti.png', modelCount: 8, status: 'active', createdAt: '2023-01-01' },
  { id: 'BRD003', name: 'Hyundai', logo: '/images/brands/hyundai.png', modelCount: 6, status: 'active', createdAt: '2023-01-01' },
  { id: 'BRD004', name: 'Tata', logo: '/images/brands/tata.png', modelCount: 4, status: 'active', createdAt: '2023-01-01' },
];

const mockModels: VehicleModel[] = [
  { id: 'MDL001', brandId: 'BRD001', brandName: 'Honda', name: 'City', type: 'sedan', status: 'active', createdAt: '2023-01-01' },
  { id: 'MDL002', brandId: 'BRD001', brandName: 'Honda', name: 'Amaze', type: 'sedan', status: 'active', createdAt: '2023-01-01' },
  { id: 'MDL003', brandId: 'BRD002', brandName: 'Maruti Suzuki', name: 'Swift', type: 'hatchback', status: 'active', createdAt: '2023-01-01' },
  { id: 'MDL004', brandId: 'BRD002', brandName: 'Maruti Suzuki', name: 'Baleno', type: 'hatchback', status: 'active', createdAt: '2023-01-01' },
];

export const adminVehiclesFetchers = {
  // Brands
  async getVehicleBrands(): Promise<VehicleBrand[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockBrands;
    }

    const { data } = await apiClient.get<ApiResponse<VehicleBrand[]>>(
      AdminRoutes.VEHICLE_BRANDS_API
    );
    return data.data!;
  },

  async createVehicleBrand(input: CreateVehicleBrandInput): Promise<VehicleBrand> {
    const { data } = await apiClient.post<ApiResponse<VehicleBrand>>(
      AdminRoutes.VEHICLE_BRANDS_API,
      input
    );
    return data.data!;
  },

  async updateVehicleBrand(
    brandId: string,
    input: Partial<CreateVehicleBrandInput>
  ): Promise<VehicleBrand> {
    const { data } = await apiClient.patch<ApiResponse<VehicleBrand>>(
      `${AdminRoutes.VEHICLE_BRANDS_API}/${brandId}`,
      input
    );
    return data.data!;
  },

  async deleteVehicleBrand(brandId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.VEHICLE_BRANDS_API}/${brandId}`
    );
    return data.data!;
  },

  // Models
  async getVehicleModels(): Promise<VehicleModel[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockModels;
    }

    const { data } = await apiClient.get<ApiResponse<VehicleModel[]>>(
      AdminRoutes.VEHICLE_MODELS_API
    );
    return data.data!;
  },

  async createVehicleModel(input: CreateVehicleModelInput): Promise<VehicleModel> {
    const { data } = await apiClient.post<ApiResponse<VehicleModel>>(
      AdminRoutes.VEHICLE_MODELS_API,
      input
    );
    return data.data!;
  },

  async updateVehicleModel(
    modelId: string,
    input: Partial<CreateVehicleModelInput>
  ): Promise<VehicleModel> {
    const { data } = await apiClient.patch<ApiResponse<VehicleModel>>(
      `${AdminRoutes.VEHICLE_MODELS_API}/${modelId}`,
      input
    );
    return data.data!;
  },

  async deleteVehicleModel(modelId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.VEHICLE_MODELS_API}/${modelId}`
    );
    return data.data!;
  },
};
