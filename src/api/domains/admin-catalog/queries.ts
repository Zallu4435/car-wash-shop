import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCatalogFetchers } from './fetchers';
import type {
  CreateServiceInput,
  UpdateServiceInput,
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/admin';
import { toast } from 'sonner';

export const adminCatalogKeys = {
  all: ['admin-catalog'] as const,
  services: () => [...adminCatalogKeys.all, 'services'] as const,
  servicesList: () => [...adminCatalogKeys.services(), 'list'] as const,
  serviceDetail: (id: string) => [...adminCatalogKeys.services(), 'detail', id] as const,
  products: () => [...adminCatalogKeys.all, 'products'] as const,
  productsList: () => [...adminCatalogKeys.products(), 'list'] as const,
  productDetail: (id: string) => [...adminCatalogKeys.products(), 'detail', id] as const,
  categories: () => [...adminCatalogKeys.all, 'categories'] as const,
  categoriesList: () => [...adminCatalogKeys.categories(), 'list'] as const,
  categoryDetail: (id: string) => [...adminCatalogKeys.categories(), 'detail', id] as const,
};

// Services
export const useAdminServiceList = () => {
  return useQuery({
    queryKey: adminCatalogKeys.servicesList(),
    queryFn: adminCatalogFetchers.getServiceList,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminServiceDetail = (serviceId: string) => {
  return useQuery({
    queryKey: adminCatalogKeys.serviceDetail(serviceId),
    queryFn: () => adminCatalogFetchers.getServiceById(serviceId),
    enabled: !!serviceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateServiceInput) => adminCatalogFetchers.createService(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCatalogKeys.services() });
      toast.success('Service created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create service');
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, input }: { serviceId: string; input: UpdateServiceInput }) =>
      adminCatalogFetchers.updateService(serviceId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminCatalogKeys.serviceDetail(variables.serviceId), data);
      queryClient.invalidateQueries({ queryKey: adminCatalogKeys.services() });
      toast.success('Service updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update service');
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceId: string) => adminCatalogFetchers.deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCatalogKeys.services() });
      toast.success('Service deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete service');
    },
  });
};

// Products
export const useAdminProductList = () => {
  return useQuery({
    queryKey: adminCatalogKeys.productsList(),
    queryFn: adminCatalogFetchers.getProductList,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminProductDetail = (productId: string) => {
  return useQuery({
    queryKey: adminCatalogKeys.productDetail(productId),
    queryFn: () => adminCatalogFetchers.getProductById(productId),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) => adminCatalogFetchers.createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCatalogKeys.products() });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, input }: { productId: string; input: UpdateProductInput }) =>
      adminCatalogFetchers.updateProduct(productId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminCatalogKeys.productDetail(variables.productId), data);
      queryClient.invalidateQueries({ queryKey: adminCatalogKeys.products() });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => adminCatalogFetchers.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCatalogKeys.products() });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });
};

// Categories
export const useAdminCategoryList = () => {
  return useQuery({
    queryKey: adminCatalogKeys.categoriesList(),
    queryFn: adminCatalogFetchers.getCategoryList,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAdminCategoryDetail = (categoryId: string) => {
  return useQuery({
    queryKey: adminCatalogKeys.categoryDetail(categoryId),
    queryFn: () => adminCatalogFetchers.getCategoryById(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => adminCatalogFetchers.createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCatalogKeys.categories() });
      toast.success('Category created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, input }: { categoryId: string; input: UpdateCategoryInput }) =>
      adminCatalogFetchers.updateCategory(categoryId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminCatalogKeys.categoryDetail(variables.categoryId), data);
      queryClient.invalidateQueries({ queryKey: adminCatalogKeys.categories() });
      toast.success('Category updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update category');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => adminCatalogFetchers.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCatalogKeys.categories() });
      toast.success('Category deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });
};
