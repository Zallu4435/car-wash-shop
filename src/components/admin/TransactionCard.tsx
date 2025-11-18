'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface InfoBox {
  icon: LucideIcon;
  label: string;
  value: string | number;
  valueClassName?: string;
}

interface ActionButton {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'destructive';
  className?: string;
  disabled?: boolean;
  hideTextOnMobile?: boolean;
}

interface TransactionCardProps {
  id: string;
  icon: LucideIcon;
  imageUrl?: string;
  primaryBadge: {
    label: string;
    variant?: 'default' | 'outline' | 'secondary';
    className?: string;
  };
  statusBadge: {
    label: string;
    className?: string;
  };
  title: string;
  subtitle: string | ReactNode;
  description?: string;
  infoBoxes?: InfoBox[];
  amount?: string | number;
  amountLabel?: string;
  onView?: () => void;
  viewButtonText?: string;
  actionButtons?: ActionButton[];
  additionalContent?: ReactNode;
  layout?: 'horizontal' | 'vertical';
}

export function TransactionCard({
  id,
  icon: Icon,
  imageUrl,
  primaryBadge,
  statusBadge,
  title,
  subtitle,
  description,
  infoBoxes,
  amount,
  amountLabel = 'Amount',
  onView,
  viewButtonText = 'View',
  actionButtons,
  additionalContent,
  layout = 'horizontal',
}: TransactionCardProps) {
  // If using vertical layout (for services), render differently
  if (layout === 'vertical') {
    return (
      <Card className="border-2 border-border hover:shadow-lg transition-all rounded-lg sm:rounded-xl">
        <CardContent className="p-3 sm:p-4 lg:p-5">
          <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {imageUrl ? (
                <img src={imageUrl} alt="thumb" className="h-8 w-8 sm:h-10 sm:w-10 rounded-md object-cover border-2 border-border flex-shrink-0" />
              ) : (
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-xs sm:text-sm lg:text-base text-foreground truncate">
                  {title}
                </h3>
                <Badge variant={primaryBadge.variant || 'outline'} className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${primaryBadge.className || ''}`}>
                  {subtitle}
                </Badge>
              </div>
            </div>
            <Badge className={`text-[10px] sm:text-xs flex-shrink-0 ${statusBadge.className || ''}`}>
              {statusBadge.label}
            </Badge>
          </div>

          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 lg:mb-4 line-clamp-2">
              {description}
            </p>
          )}

          {infoBoxes && infoBoxes.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
              {infoBoxes.map((box, index) => {
                const BoxIcon = box.icon;
                return (
                  <div key={index} className="p-2 sm:p-2.5 lg:p-3 bg-muted rounded-lg border-2 border-border">
                    <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 mb-0.5 sm:mb-1">
                      <BoxIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground">{box.label}</p>
                    </div>
                    <p className={`text-sm sm:text-base lg:text-lg font-bold ${box.valueClassName || 'text-foreground'}`}>
                      {box.value}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {actionButtons && actionButtons.length > 0 && (
            <div className="flex gap-1.5 sm:gap-2">
              {actionButtons.map((btn, index) => {
                const BtnIcon = btn.icon;
                return (
                  <Button
                    key={index}
                    variant={btn.variant || 'outline'}
                    size="sm"
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                    className={`flex-1 h-8 sm:h-9 text-[10px] sm:text-xs lg:text-sm border-2 rounded-lg ${btn.className || ''}`}
                  >
                    <BtnIcon className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                    {btn.hideTextOnMobile ? (
                      <span className="hidden xs:inline">{btn.label}</span>
                    ) : (
                      <span>{btn.label}</span>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Horizontal layout (for orders, payments, requests)
  return (
    <Card className="border-2 border-border hover:shadow-lg transition-all rounded-lg sm:rounded-xl">
      <CardContent className="p-3 sm:p-4 md:p-5">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {imageUrl ? (
              <img src={imageUrl} alt="thumb" className="h-10 w-10 rounded-md object-cover border-2 border-border flex-shrink-0" />
            ) : (
              <Icon className="h-6 w-6 text-primary flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge 
                  variant={primaryBadge.variant || 'outline'} 
                  className={`font-mono text-xs ${primaryBadge.className || ''}`}
                >
                  {primaryBadge.label}
                </Badge>
                <Badge className={`text-xs capitalize ${statusBadge.className || ''}`}>
                  {statusBadge.label}
                </Badge>
              </div>
              <p className="font-semibold text-foreground truncate">{title}</p>
              <div className="text-sm text-muted-foreground truncate">{subtitle}</div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {amount !== undefined && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">{amountLabel}</p>
                <p className="text-xl font-bold text-primary">
                  {typeof amount === 'number' ? `₹${amount}` : amount}
                </p>
              </div>
            )}
            {onView && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onView}
                className="h-9 text-xs sm:text-sm border-2 rounded-lg"
              >
                <Eye className="mr-2 h-4 w-4" />
                {viewButtonText}
              </Button>
            )}
            {actionButtons && actionButtons.length > 0 && (
              <div className="flex gap-1.5 sm:gap-2">
                {actionButtons.map((btn, index) => {
                  const BtnIcon = btn.icon;
                  return (
                    <Button
                      key={index}
                      variant={btn.variant || 'outline'}
                      size="sm"
                      onClick={btn.onClick}
                      disabled={btn.disabled}
                      className={`h-8 sm:h-9 text-xs border-2 rounded-lg ${btn.className || ''}`}
                    >
                      <BtnIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {btn.hideTextOnMobile ? (
                        <span className="hidden lg:inline ml-1.5">{btn.label}</span>
                      ) : btn.label ? (
                        <span className="ml-1.5">{btn.label}</span>
                      ) : null}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="md:hidden space-y-3">
          <div className="flex items-start gap-3">
            {imageUrl ? (
              <img src={imageUrl} alt="thumb" className="h-8 w-8 rounded-md object-cover border-2 border-border flex-shrink-0" />
            ) : (
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                <Badge 
                  variant={primaryBadge.variant || 'outline'} 
                  className={`font-mono text-xs ${primaryBadge.className || ''}`}
                >
                  {primaryBadge.label}
                </Badge>
                <Badge className={`text-xs capitalize ${statusBadge.className || ''}`}>
                  {statusBadge.label}
                </Badge>
              </div>
              <p className="font-semibold text-sm sm:text-base text-foreground truncate">{title}</p>
              <div className="text-xs sm:text-sm text-muted-foreground truncate">{subtitle}</div>
              {amount !== undefined && (
                <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{amountLabel}</p>
                    <p className="text-lg sm:text-xl font-bold text-primary">
                      {typeof amount === 'number' ? `₹${amount}` : amount}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {additionalContent}
          <div className="flex gap-2">
            {onView && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onView}
                className="flex-1 h-9 text-xs sm:text-sm border-2 rounded-lg"
              >
                <Eye className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {viewButtonText} Details
              </Button>
            )}
            {actionButtons && actionButtons.length > 0 && (
              <>
                {actionButtons.map((btn, index) => {
                  const BtnIcon = btn.icon;
                  return (
                    <Button
                      key={index}
                      variant={btn.variant || 'outline'}
                      size="sm"
                      onClick={btn.onClick}
                      disabled={btn.disabled}
                      className={`${onView ? 'flex-initial px-3' : 'flex-1'} h-9 text-xs border-2 rounded-lg ${btn.className || ''}`}
                    >
                      <BtnIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {btn.hideTextOnMobile ? (
                        <span className="hidden xs:inline ml-1.5">{btn.label}</span>
                      ) : btn.label ? (
                        <span className="ml-1.5">{btn.label}</span>
                      ) : null}
                    </Button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
