import { Controller, Control } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ActiveStatusFieldProps {
    control: Control<any>;
    description: string;
    className?: string;
}

export function ActiveStatusField({ control, description, className = '' }: ActiveStatusFieldProps) {
    return (
        <div className={`flex items-center justify-between p-3 sm:p-4 bg-card rounded-lg sm:rounded-xl border-2 border-border ${className}`}>
            <div className="min-w-0 flex-1 mr-3">
                <Label htmlFor="active" className="cursor-pointer text-xs sm:text-sm font-medium">Active Status</Label>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    {description}
                </p>
            </div>
            <Controller
                name="active"
                control={control}
                render={({ field }) => (
                    <Switch
                        id="active"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="flex-shrink-0 bg-slate-300 data-[state=checked]:bg-primary [&>span]:bg-white [&>span]:data-[state=checked]:bg-slate-700"
                    />
                )}
            />
        </div>
    );
}
