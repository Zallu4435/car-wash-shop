import { useState } from 'react';
import { ConfirmationDialog } from '@/components/shared/dialogs/ConfirmationDialog';
import type { ConfirmationType } from '@/components/shared/dialogs/ConfirmationDialog';

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  itemName?: string;
  minimal?: boolean;
}

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    description: '',
  });
  const [resolveCallback, setResolveCallback] = useState<((value: boolean) => void) | null>(null);

  const confirm = (opts: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(opts);
      setIsOpen(true);
      setResolveCallback(() => resolve);
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    if (resolveCallback) {
      resolveCallback(false);
      setResolveCallback(null);
    }
  };

  const handleConfirm = async () => {
    setIsOpen(false);
    if (resolveCallback) {
      resolveCallback(true);
      setResolveCallback(null);
    }
  };

  // Return the dialog component along with the confirm function
  const ConfirmDialog = () => {
    return (
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        type={options.type}
        title={options.title}
        description={options.description}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        itemName={options.itemName}
        minimal={options.minimal}
      />
    );
  };

  return {
    confirm,
    ConfirmDialog,
  };
}
