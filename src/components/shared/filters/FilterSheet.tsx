'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
  resultCount: number;
  children: React.ReactNode;
}

export function FilterSheet({ isOpen, onClose, onClearAll, resultCount, children }: FilterSheetProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500);
  };

  useEffect(() => {
    if (isOpen) {
      setIsOpening(true);
      setTimeout(() => {
        setIsOpening(false);
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={handleClose}
      />
      
      {/* Filter Sheet */}
      <div className={`lg:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl shadow-2xl border-t-2 border-border max-h-[88vh] flex flex-col force-sheet-bg transition-all duration-500 ease-in-out ${
          isOpening ? 'translate-y-full' : isClosing ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">Filters</h2>
              <p className="text-xs text-muted-foreground">
                {resultCount} result{resultCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full h-9 w-9"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 border-t border-border bg-muted/30 flex-shrink-0">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-2 flex-1 h-11 font-semibold text-sm"
              onClick={onClearAll}
            >
              Clear All
            </Button>
            <Button
              className="border-2 flex-1 h-11 font-semibold text-sm shadow-md"
              onClick={handleClose}
            >
              Show {resultCount} Result{resultCount !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
