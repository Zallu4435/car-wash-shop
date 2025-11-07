'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormBuilder } from '@/components/shared/crud/FormBuilder';
import { toast } from 'sonner';
import { categorySchema } from '@/schemas/admin/category';
import { AdminRoutes } from '@/lib/constants/routes';
import { useAdminCategoryDetail, useUpdateCategory } from '@/api/domains/admin-catalog/queries';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: category } = useAdminCategoryDetail(id);
  const updateCategory = useUpdateCategory();

  const fields = [
    { name: 'name', label: 'Category Name', type: 'text' as const, required: true },
    {
      name: 'type',
      label: 'Type',
      type: 'select' as const,
      options: [
        { value: 'service', label: 'Service' },
        { value: 'product', label: 'Product' },
      ],
      required: true,
    },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'active', label: 'Active', type: 'switch' as const },
  ];

  const handleSubmit = async (data: any) => {
    try {
      await updateCategory.mutateAsync({ categoryId: id, input: data });
      toast.success('Category updated successfully!');
      router.push(AdminRoutes.CATEGORIES);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update category');
    }
  };

  const defaultValues = category ? {
    name: category.name,
    type: category.type,
    description: category.description || '',
    active: category.active ?? category.status === 'active',
  } : undefined;

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      <div>
        <Link href={AdminRoutes.CATEGORIES}>
          <Button variant="ghost" className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
            <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back to Categories
          </Button>
        </Link>
      </div>
      {category && (
        <FormBuilder
          title={`Edit Category - ${category.name}`}
          fields={fields}
          schema={categorySchema}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          submitLabel="Update Category"
          isLoading={updateCategory.isPending}
        />
      )}
    </div>
  );
}
