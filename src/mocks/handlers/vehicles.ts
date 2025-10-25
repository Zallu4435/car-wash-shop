import { http, HttpResponse } from 'msw';
import vehiclesData from '../data/vehicles.json';

export const vehicleHandlers = [
  http.get('/api/vehicles/brands', () => {
    return HttpResponse.json({
      success: true,
      data: vehiclesData.brands,
    });
  }),

  http.get('/api/vehicles/models', () => {
    return HttpResponse.json({
      success: true,
      data: vehiclesData.models,
    });
  }),
];
