'use client';

import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation, MapPin } from 'lucide-react';

export default function NavigatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-6 w-6" />
            Navigate to Job Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Destination</p>
            <p className="font-medium flex items-start gap-2">
              <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
              123, MG Road, Bandra West, Mumbai - 400050
            </p>
          </div>
          <div className="space-y-2">
            <Button className="w-full">Open in Google Maps</Button>
            <Button variant="outline" className="w-full">Call Customer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
