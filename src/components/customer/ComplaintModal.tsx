'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCreateComplaint } from '@/api/domains/complaints/queries';
import {
    COMPLAINT_CATEGORY_OPTIONS,
    type ComplaintCategory
} from '@/types/complaint';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schema
const complaintSchema = z.object({
    category: z.enum(
        [
            'service_quality',
            'staff_behavior',
            'damage_loss',
            'wrong_service',
            'overcharged',
            'other',
        ]
    ),
    description: z
        .string()
        .min(20, 'Please provide at least 20 characters')
        .max(1000, 'Maximum 1000 characters allowed'),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

interface ComplaintModalProps {
    isOpen: boolean;
    onClose: () => void;
    referenceType: 'booking' | 'productOrder';
    referenceId: string;
    orderName: string;
    hoursRemaining?: number;
}

export function ComplaintModal({
    isOpen,
    onClose,
    referenceType,
    referenceId,
    orderName,
    hoursRemaining,
}: ComplaintModalProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const createComplaintMutation = useCreateComplaint();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        watch,
    } = useForm<ComplaintFormData>({
        resolver: zodResolver(complaintSchema),
        defaultValues: {
            category: undefined,
            description: '',
        },
    });

    const description = watch('description');

    // Handle mounting for animation
    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            setTimeout(() => {
                setShowContent(true);
            }, 10);
        } else {
            setShowContent(false);
        }
    }, [isOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [isOpen]);

    // Handle unmounting after animation
    const handleTransitionEnd = () => {
        if (!isOpen) {
            setMounted(false);
        }
    };

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset({
                category: undefined,
                description: '',
            });
            setShowSuccess(false);
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: ComplaintFormData) => {
        await createComplaintMutation.mutateAsync({
            referenceType,
            referenceId,
            category: data.category as ComplaintCategory,
            description: data.description.trim(),
        });

        setShowSuccess(true);
        setTimeout(() => {
            onClose();
            setShowSuccess(false);
        }, 2500);
    };

    if (!mounted && !isOpen) return null;

    const isLoading = createComplaintMutation.isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative w-full max-w-lg rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl border-2 border-border max-h-[92vh] sm:max-h-[90vh] overflow-y-auto force-sheet-bg transition-all duration-500 ease-in-out ${showContent
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-4'
                    }`}
                onTransitionEnd={handleTransitionEnd}
            >
                {/* Header */}
                <div className="sticky top-0 border-b border-border px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 flex items-center justify-between z-10 bg-muted/30 backdrop-blur-sm">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-lg">
                            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">
                                File a Complaint
                            </h2>
                            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground truncate">
                                {orderName}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Success State */}
                {showSuccess ? (
                    <div className="px-3 sm:px-4 lg:px-6 py-10 sm:py-12 lg:py-16 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mb-4 sm:mb-6 animate-scale-in">
                            <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                            Complaint Submitted
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            We&apos;ll review your complaint and get back to you soon
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
                        {/* Time remaining notice */}
                        {hoursRemaining !== undefined && hoursRemaining > 0 && (
                            <div className="p-2.5 sm:p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-400">
                                    ⏰ You have <strong>{hoursRemaining} {hoursRemaining === 1 ? 'hour' : 'hours'}</strong> remaining to file a complaint for this order
                                </p>
                            </div>
                        )}

                        {/* Category */}
                        <div className="space-y-2 sm:space-y-3">
                            <Label className="text-xs sm:text-sm lg:text-base font-medium">
                                What is your complaint about?
                                <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="h-10 sm:h-11 text-xs sm:text-sm">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COMPLAINT_CATEGORY_OPTIONS.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                    className="text-xs sm:text-sm"
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && (
                                <p className="text-xs text-red-600 dark:text-red-400">{errors.category.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor="description" className="text-xs sm:text-sm lg:text-base font-medium">
                                Describe your issue
                                <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                placeholder="Please provide details about your complaint. Include any relevant information that will help us understand and resolve your issue..."
                                rows={5}
                                className="resize-none text-xs sm:text-sm lg:text-base"
                            />
                            {errors.description && (
                                <p className="text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
                            )}
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                                {description?.length || 0}/1000 • Min 20 characters
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="p-2.5 sm:p-3 lg:p-4 bg-muted/50 border border-border rounded-lg sm:rounded-xl">
                            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground leading-relaxed">
                                📋 Your complaint will be reviewed by our team. We aim to respond within 24-48 hours. You can track the status of your complaint on this order page.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 h-10 sm:h-11 lg:h-12 text-xs sm:text-sm border-2"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                className="flex-1 h-10 sm:h-11 lg:h-12 shadow-lg text-xs sm:text-sm border-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    'Submitting...'
                                ) : (
                                    <>
                                        <Send className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        Submit Complaint
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
