'use client';

import { useState, useRef } from 'react';
import { Upload, X, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';

interface AvatarUploaderProps {
  currentAvatar?: string;
  onUpload: (file: File) => void;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export function AvatarUploader({
  currentAvatar,
  onUpload,
  onRemove,
  size = 'md',
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isValidating, setIsValidating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  const validateFile = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
        resolve(false);
        return;
      }

      // Check file size (convert MB to bytes)
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        toast.error(`File size must be less than ${maxSizeMB}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
        resolve(false);
        return;
      }

      // Check image dimensions
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        // Check minimum dimensions
        if (img.width < 200 || img.height < 200) {
          toast.error('Image must be at least 200x200 pixels.');
          resolve(false);
          return;
        }

        // Check maximum dimensions
        if (img.width > 4000 || img.height > 4000) {
          toast.error('Image must not exceed 4000x4000 pixels.');
          resolve(false);
          return;
        }

        resolve(true);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        toast.error('Failed to load image. Please try another file.');
        resolve(false);
      };

      img.src = objectUrl;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsValidating(true);

    const isValid = await validateFile(file);

    if (isValid) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setIsValidating(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read file. Please try again.');
        setIsValidating(false);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    } else {
      setIsValidating(false);
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
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
          disabled={isValidating}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isValidating ? 'Validating...' : preview ? 'Change' : 'Upload'} Photo
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, or WebP • Max {maxSizeMB}MB
        </p>
        <p className="text-xs text-muted-foreground">
          Minimum 200x200px • Recommended: Square image
        </p>
      </div>
    </div>
  );
}
