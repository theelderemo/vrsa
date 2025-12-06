/**
 * Banner Component
 * Dismissable notification banner with variants
 */

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';
import { Button } from './Button';

const bannerVariants = cva(
  'relative overflow-hidden rounded-md border shadow-lg text-sm',
  {
    variants: {
      variant: {
        default: 'bg-slate-800/60 border-slate-700/80 text-slate-200',
        success:
          'bg-green-900/30 border-green-700 text-green-100',
        warning:
          'bg-amber-900/30 border-amber-700 text-amber-100',
        info: 'bg-blue-900/30 border-blue-700 text-blue-100',
        premium:
          'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700 text-purple-100',
        gradient:
          'bg-slate-800 border-slate-700 text-slate-100',
      },
      size: {
        default: 'py-1.5 px-2.5',
        sm: 'text-xs py-1 px-2',
        lg: 'text-lg py-4 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export function Banner({
  variant = 'default',
  size = 'default',
  title,
  description,
  icon,
  showShade = false,
  show,
  onHide,
  action,
  closable = false,
  className,
  autoHide,
  ...props
}) {
  React.useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        onHide?.();
      }, autoHide);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onHide]);

  if (!show) return null;

  return (
    <div
      className={cn(bannerVariants({ variant, size }), className)}
      role={variant === 'warning' || variant === 'default' ? 'alert' : 'status'}
      {...props}
    >
      {/* Shimmer effect */}
      {showShade && (
        <div className="absolute inset-0 -z-10 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {icon && <div className="flex-shrink-0">{icon}</div>}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center">
              <p className="truncate font-semibold">{title}</p>
            </div>
            {description && <p className="text-xs opacity-80">{description}</p>}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          {action && action}

          {closable && (
            <Button onClick={onHide} size="icon" variant="ghost" className="h-8 w-8">
              <X size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
