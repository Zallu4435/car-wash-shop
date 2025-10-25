'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crop, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export function ImageCropper({
  imageUrl,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
}: ImageCropperProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleCrop = () => {
    // In production, use a library like react-easy-crop
    // For now, just return the original image
    onCropComplete(imageUrl);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold">Crop Image</h3>

        {/* Image display area */}
        <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Crop preview"
            className="w-full h-full object-contain"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          />
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.min(3, zoom + 0.1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setRotation((rotation - 90) % 360)}
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Rotate Left
            </Button>
            <Button
              variant="outline"
              onClick={() => setRotation((rotation + 90) % 360)}
            >
              Rotate Right
              <RotateCw className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleCrop} className="flex-1">
            <Crop className="mr-2 h-4 w-4" />
            Apply Crop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
