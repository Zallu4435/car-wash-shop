'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, Ban, AlertCircle, Info, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ConfirmationType = 'delete' | 'block' | 'warning' | 'info' | 'danger';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  isLoading?: boolean;
  itemName?: string;
}

const typeConfig = {
  delete: {
    icon: Trash2,
    iconBg: 'bg-red-100 dark:bg-red-950/30',
    iconColor: 'text-red-600 dark:text-red-400',
    confirmBg: 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700',
    borderColor: 'border-red-200 dark:border-red-900',
  },
  block: {
    icon: Ban,
    iconBg: 'bg-orange-100 dark:bg-orange-950/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    confirmBg: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700',
    borderColor: 'border-orange-200 dark:border-orange-900',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-yellow-100 dark:bg-yellow-950/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    confirmBg: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700',
    borderColor: 'border-yellow-200 dark:border-yellow-900',
  },
  danger: {
    icon: AlertCircle,
    iconBg: 'bg-red-100 dark:bg-red-950/30',
    iconColor: 'text-red-600 dark:text-red-400',
    confirmBg: 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700',
    borderColor: 'border-red-200 dark:border-red-900',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-100 dark:bg-blue-950/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    confirmBg: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700',
    borderColor: 'border-blue-200 dark:border-blue-900',
  },
};

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
  itemName,
}: ConfirmationDialogProps) {
  const [isDark, setIsDark] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const config = typeConfig[type];
  const Icon = config.icon;

  // Check if dark mode is active
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

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

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const loading = isLoading || isProcessing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-xl sm:rounded-2xl shadow-2xl border-2 animate-scale-in ${config.borderColor} ${isDark ? '!bg-gray-900' : '!bg-white'}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${config.iconBg} flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
            <Icon className={`h-7 w-7 sm:h-8 sm:w-8 ${config.iconColor}`} />
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-3 sm:mb-4">
            {title}
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-center text-muted-foreground leading-relaxed mb-6 sm:mb-8">
            {description}
          </p>

          {/* Item Name (if provided) */}
          {itemName && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-muted rounded-lg border border-border">
              <p className="text-xs sm:text-sm text-muted-foreground text-center mb-1">
                {type === 'delete' ? 'Item to be deleted:' : 'Target:'}
              </p>
              <p className="text-sm sm:text-base font-semibold text-foreground text-center truncate">
                {itemName}
              </p>
            </div>
          )}

          {/* Warning Message */}
          {(type === 'delete' || type === 'danger') && (
            <div className={`mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg border ${config.borderColor} ${config.iconBg}`}>
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle className={`h-4 w-4 sm:h-5 sm:w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                <div>
                  <p className={`text-xs sm:text-sm font-semibold ${config.iconColor} mb-1`}>
                    Warning: This action cannot be undone
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please make sure you want to proceed with this action.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-11 sm:h-12 text-sm sm:text-base font-medium"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-1 h-11 sm:h-12 text-sm sm:text-base font-semibold text-white shadow-lg ${config.confirmBg}`}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
