import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const statusVariants: Record<string, 'default' | 'success' | 'error' | 'outline' | 'secondary' | 'warning' | 'info'> = {
  pending: 'outline',
  confirmed: 'default',
  processing: 'default',
  'in-progress': 'default',
  completed: 'success',
  delivered: 'success',
  cancelled: 'error',
  failed: 'error',
  active: 'success',
  inactive: 'outline',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = statusVariants[status.toLowerCase()] || 'default';
  
  return (
    <Badge variant={variant} className="capitalize">
      {status.replace('-', ' ')}
    </Badge>
  );
}
