'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { FormBuilder } from '@/components/shared/crud/FormBuilder';
import { z } from 'zod';
import { toast } from 'sonner';

const bannerSchema = z.object({
  title: z.string().min(5),
  subtitle: z.string().optional(),
  position: z.enum(['hero', 'middle', 'sidebar']),
  pages: z.string(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.boolean(),
});

export default function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const fields = [
    { name: 'title', label: 'Title', type: 'text' as const, required: true },
    { name: 'subtitle', label: 'Subtitle', type: 'text' as const },
    {
      name: 'position',
      label: 'Position',
      type: 'select' as const,
      options: [
        { value: 'hero', label: 'Hero' },
        { value: 'middle', label: 'Middle' },
        { value: 'sidebar', label: 'Sidebar' },
      ],
      required: true,
    },
    { name: 'pages', label: 'Pages', type: 'text' as const, required: true },
    { name: 'ctaText', label: 'Button Text', type: 'text' as const },
    { name: 'ctaLink', label: 'Button Link', type: 'text' as const },
    { name: 'startDate', label: 'Start Date', type: 'text' as const, required: true },
    { name: 'endDate', label: 'End Date', type: 'text' as const, required: true },
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
        defaultValues={{ title: 'Premium Wash - 20% Off', position: 'hero', pages: 'Home', startDate: '2025-10-20', endDate: '2025-11-30', active: true }}
        submitLabel="Update Banner"
      />
    </div>
  );
}
