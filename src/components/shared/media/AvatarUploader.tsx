'use client';

import { useState, useRef } from 'react';
import { Upload, X, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface AvatarUploaderProps {
  currentAvatar?: string;
  onUpload: (file: File) => void;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarUploader({
  currentAvatar,
  onUpload,
  onRemove,
  size = 'md',
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onRemove?.();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div
          className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-border bg-muted transition-all group-hover:border-primary`}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Avatar"
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-1/2 w-1/2 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Camera Overlay */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera className="h-8 w-8 text-white" />
        </button>

        {preview && onRemove && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {preview ? 'Change' : 'Upload'} Photo
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground text-center">
        Recommended: Square image, at least 400x400px
      </p>
    </div>
  );
}
