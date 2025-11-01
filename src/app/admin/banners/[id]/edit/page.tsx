'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { FormBuilder } from '@/components/shared/crud/FormBuilder';
import { toast } from 'sonner';
import { bannerSchema } from '@/schemas/admin/banner';

export default function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const fields = [
    { name: 'title', label: 'Title', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'text' as const },
    { name: 'image', label: 'Image URL', type: 'text' as const, required: true },
    { name: 'link', label: 'Link URL', type: 'text' as const },
    { name: 'displayOrder', label: 'Display Order', type: 'number' as const },
    { name: 'startDate', label: 'Start Date', type: 'text' as const },
    { name: 'endDate', label: 'End Date', type: 'text' as const },
    { name: 'active', label: 'Active', type: 'switch' as const },
  ];

  const handleSubmit = (data: any) => {
    toast.success('Banner updated!');
    router.push(AdminRoutes.BANNERS);
  };

  return (
    <div className="max-w-2xl">
      <Link href={AdminRoutes.BANNERS}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      <FormBuilder
        title={`Edit Banner - ${id}`}
        fields={fields}
        schema={bannerSchema}
        onSubmit={handleSubmit}
        defaultValues={{ 
          title: 'Premium Wash - 20% Off', 
          description: 'Get 20% off on your first premium wash service',
          image: 'https://example.com/banner.jpg',
          link: 'https://example.com/services',
          displayOrder: 1,
          startDate: '2025-10-20', 
          endDate: '2025-11-30', 
          active: true 
        }}
        submitLabel="Update Banner"
      />
    </div>
  );
}
