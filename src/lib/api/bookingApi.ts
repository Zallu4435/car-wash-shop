// lib/api/bookingApi.ts
export interface ServiceType {
    id: string;
    name: string;
    icon: string;
    description: string;
  }
  
  export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    vehicleTypeId: string;
    features: string[];
    popular?: boolean;
  }
  
  export interface VehicleBrand {
    id: string;
    name: string;
    vehicleTypeId: string;
  }
  
  export interface VehicleModel {
    id: string;
    name: string;
    brandId: string;
  }
  
  export interface Vehicle {
    id: string;
    brandId: string;
    brandName: string;
    modelId: string;
    modelName: string;
    plateNumber?: string;
    year: number;
    vehicleTypeId: string;
  }
  
  export interface Address {
    id: string;
    label: string;
    address: string;
    landmark?: string;
    isPrimary?: boolean;
  }
  
  export interface AddOn {
    id: string;
    name: string;
    description: string;
    price: number;
    vehicleTypeId: string;
  }
  
  // Mock API - Replace with actual API calls
  export const bookingApi = {
    // Get all service types (Car, Bike, Home)
    async getServiceTypes(): Promise<ServiceType[]> {
      return [
        { id: 'car', name: 'Car Services', icon: 'Car', description: 'Professional car wash and detailing' },
        { id: 'bike', name: 'Bike Services', icon: 'Bike', description: 'Quick bike wash and maintenance' },
        { id: 'home', name: 'Home Cleaning', icon: 'Home', description: 'Complete home cleaning services' },
      ];
    },
  
    // Get services by vehicle type
    async getServicesByType(vehicleTypeId: string): Promise<Service[]> {
      const allServices = [
        // Car services
        { id: 'srv_car_001', name: 'Basic Car Wash', description: 'Exterior wash with foam', price: 299, duration: '30 mins', vehicleTypeId: 'car', features: ['Exterior wash', 'Foam application', 'Pressure wash', 'Tire cleaning'] },
        { id: 'srv_car_002', name: 'Premium Car Wash', description: 'Complete wash with interior', price: 599, duration: '60 mins', vehicleTypeId: 'car', features: ['Everything in Basic', 'Interior vacuuming', 'Dashboard cleaning', 'Window cleaning'], popular: true },
        { id: 'srv_car_003', name: 'Deluxe Car Detailing', description: 'Full detailing with wax', price: 1299, duration: '2 hours', vehicleTypeId: 'car', features: ['Everything in Premium', 'Wax application', 'Polish', 'Engine cleaning'] },
        
        // Bike services
        { id: 'srv_bike_001', name: 'Basic Bike Wash', description: 'Quick exterior bike wash', price: 149, duration: '15 mins', vehicleTypeId: 'bike', features: ['Exterior wash', 'Chain cleaning', 'Tire cleaning'] },
        { id: 'srv_bike_002', name: 'Premium Bike Wash', description: 'Complete bike wash with polish', price: 249, duration: '30 mins', vehicleTypeId: 'bike', features: ['Everything in Basic', 'Body polish', 'Chrome polishing', 'Seat cleaning'], popular: true },
        
        // Home services
        { id: 'srv_home_001', name: 'Regular Home Cleaning', description: 'Daily cleaning and maintenance', price: 899, duration: '2 hours', vehicleTypeId: 'home', features: ['Dusting', 'Vacuuming', 'Mopping', 'Kitchen cleaning'] },
        { id: 'srv_home_002', name: 'Deep Home Cleaning', description: 'Complete deep cleaning', price: 1999, duration: '4 hours', vehicleTypeId: 'home', features: ['Everything in Regular', 'Bathroom deep clean', 'Window cleaning', 'Appliance cleaning'], popular: true },
      ];
  
      return allServices.filter(s => s.vehicleTypeId === vehicleTypeId);
    },
  
    // Get vehicle brands by type
    async getVehicleBrands(vehicleTypeId: string): Promise<VehicleBrand[]> {
      const allBrands = [
        // Car brands
        { id: 'brand_car_001', name: 'Toyota', vehicleTypeId: 'car' },
        { id: 'brand_car_002', name: 'Honda', vehicleTypeId: 'car' },
        { id: 'brand_car_003', name: 'Maruti Suzuki', vehicleTypeId: 'car' },
        { id: 'brand_car_004', name: 'Hyundai', vehicleTypeId: 'car' },
        
        // Bike brands
        { id: 'brand_bike_001', name: 'Hero', vehicleTypeId: 'bike' },
        { id: 'brand_bike_002', name: 'Honda', vehicleTypeId: 'bike' },
        { id: 'brand_bike_003', name: 'Bajaj', vehicleTypeId: 'bike' },
        { id: 'brand_bike_004', name: 'Royal Enfield', vehicleTypeId: 'bike' },
      ];
  
      return allBrands.filter(b => b.vehicleTypeId === vehicleTypeId);
    },
  
    // Get models by brand
    async getModelsByBrand(brandId: string): Promise<VehicleModel[]> {
      const allModels: Record<string, VehicleModel[]> = {
        'brand_car_001': [
          { id: 'model_car_001', name: 'Camry', brandId: 'brand_car_001' },
          { id: 'model_car_002', name: 'Fortuner', brandId: 'brand_car_001' },
          { id: 'model_car_003', name: 'Innova', brandId: 'brand_car_001' },
        ],
        'brand_car_002': [
          { id: 'model_car_004', name: 'City', brandId: 'brand_car_002' },
          { id: 'model_car_005', name: 'Civic', brandId: 'brand_car_002' },
          { id: 'model_car_006', name: 'Amaze', brandId: 'brand_car_002' },
        ],
        'brand_bike_001': [
          { id: 'model_bike_001', name: 'Splendor', brandId: 'brand_bike_001' },
          { id: 'model_bike_002', name: 'Passion', brandId: 'brand_bike_001' },
        ],
        'brand_bike_002': [
          { id: 'model_bike_003', name: 'Activa', brandId: 'brand_bike_002' },
          { id: 'model_bike_004', name: 'Shine', brandId: 'brand_bike_002' },
        ],
      };
  
      return allModels[brandId] || [];
    },
  
    // Get user's vehicles
    async getUserVehicles(vehicleTypeId: string): Promise<Vehicle[]> {
      const allVehicles = [
        { id: 'veh_001', brandId: 'brand_car_001', brandName: 'Toyota', modelId: 'model_car_001', modelName: 'Camry', plateNumber: 'MH12AB1234', year: 2023, vehicleTypeId: 'car' },
        { id: 'veh_002', brandId: 'brand_car_002', brandName: 'Honda', modelId: 'model_car_004', modelName: 'City', plateNumber: 'MH14CD5678', year: 2022, vehicleTypeId: 'car' },
        { id: 'veh_003', brandId: 'brand_bike_001', brandName: 'Hero', modelId: 'model_bike_001', modelName: 'Splendor', plateNumber: 'MH12EF9012', year: 2023, vehicleTypeId: 'bike' },
      ];
  
      return allVehicles.filter(v => v.vehicleTypeId === vehicleTypeId);
    },
  
    // Get user's addresses
    async getUserAddresses(): Promise<Address[]> {
      return [
        { id: 'addr_001', label: 'Home', address: '123 Main St, Apartment 4B, Mumbai, Maharashtra - 400001', isPrimary: true },
        { id: 'addr_002', label: 'Office', address: '456 Business Park, Floor 3, Andheri East, Mumbai - 400069' },
      ];
    },
  
    // Get add-ons by vehicle type
    async getAddOnsByType(vehicleTypeId: string): Promise<AddOn[]> {
      const allAddOns = [
        // Car add-ons
        { id: 'addon_car_001', name: 'Tire Polish', description: 'Premium tire shine', price: 99, vehicleTypeId: 'car' },
        { id: 'addon_car_002', name: 'Dashboard Polish', description: 'Deep dashboard cleaning', price: 149, vehicleTypeId: 'car' },
        { id: 'addon_car_003', name: 'Perfume', description: 'Fresh car fragrance', price: 79, vehicleTypeId: 'car' },
        
        // Bike add-ons
        { id: 'addon_bike_001', name: 'Chain Lubrication', description: 'Professional chain service', price: 49, vehicleTypeId: 'bike' },
        { id: 'addon_bike_002', name: 'Polish & Shine', description: 'Extra gloss finish', price: 99, vehicleTypeId: 'bike' },
        
        // Home add-ons
        { id: 'addon_home_001', name: 'Carpet Shampooing', description: 'Deep carpet cleaning', price: 599, vehicleTypeId: 'home' },
        { id: 'addon_home_002', name: 'Balcony Cleaning', description: 'Complete balcony wash', price: 399, vehicleTypeId: 'home' },
      ];
  
      return allAddOns.filter(a => a.vehicleTypeId === vehicleTypeId);
    },
  
    // Add vehicle
    async addVehicle(vehicle: Omit<Vehicle, 'id' | 'brandName' | 'modelName'>): Promise<Vehicle> {
      // In real implementation, this would call your backend API
      const brands = await this.getVehicleBrands(vehicle.vehicleTypeId);
      const brand = brands.find(b => b.id === vehicle.brandId);
      const models = await this.getModelsByBrand(vehicle.brandId);
      const model = models.find(m => m.id === vehicle.modelId);
  
      return {
        id: `veh_${Date.now()}`,
        ...vehicle,
        brandName: brand?.name || '',
        modelName: model?.name || '',
      };
    },
  
    // Add address
    async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
      return {
        id: `addr_${Date.now()}`,
        ...address,
      };
    },
  };
  