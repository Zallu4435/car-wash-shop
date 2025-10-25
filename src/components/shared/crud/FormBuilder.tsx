'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ZodSchema } from 'zod';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'switch' | 'file';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: any;
}

interface FormBuilderProps {
  title: string;
  fields: Field[];
  schema: ZodSchema;
  onSubmit: (data: any) => void;
  defaultValues?: any;
  submitLabel?: string;
  isLoading?: boolean;
}

export function FormBuilder({
  title,
  fields,
  schema,
  onSubmit,
  defaultValues,
  submitLabel = 'Submit',
  isLoading = false,
}: FormBuilderProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name} required={field.required}>
                {field.label}
              </Label>

              {field.type === 'text' || field.type === 'email' || field.type === 'number' ? (
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.name, { valueAsNumber: field.type === 'number' })}
                  error={errors[field.name]?.message as string}
                />
              ) : field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  error={errors[field.name]?.message as string}
                  rows={4}
                />
              ) : field.type === 'select' ? (
                <Select
                  onValueChange={(value) => setValue(field.name, value)}
                  defaultValue={defaultValues?.[field.name]}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'switch' ? (
                <div className="flex items-center space-x-2">
                  <Switch
                    id={field.name}
                    checked={watch(field.name)}
                    onCheckedChange={(checked) => setValue(field.name, checked)}
                  />
                  <Label htmlFor={field.name} className="cursor-pointer">
                    {field.placeholder}
                  </Label>
                </div>
              ) : field.type === 'file' ? (
                <Input id={field.name} type="file" accept="image/*" {...register(field.name)} />
              ) : null}

              {errors[field.name] && (
                <p className="text-sm text-red-600 mt-1">{errors[field.name]?.message as string}</p>
              )}
            </div>
          ))}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
