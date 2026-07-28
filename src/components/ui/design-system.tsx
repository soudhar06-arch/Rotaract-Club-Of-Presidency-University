'use client';

import * as React from 'react';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  LoaderCircle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F5A623] disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-950',
  {
    variants: {
      variant: {
        primary:
          'bg-[#003F87] text-white shadow-sm hover:bg-[#002f68] active:scale-[0.98] dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8]',
        secondary:
          'border border-[#003F87] bg-transparent text-[#003F87] hover:bg-[#003F87] hover:text-white dark:border-[#60a5fa] dark:text-[#bfdbfe] dark:hover:bg-[#1d4ed8]',
        ghost:
          'bg-transparent text-[#003F87] hover:bg-[#F3F4F6] dark:text-[#bfdbfe] dark:hover:bg-slate-800',
        destructive:
          'bg-[#EF4444] text-white hover:bg-[#dc2626] active:scale-[0.98]',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

const inputVariants = cva(
  'flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#003F87] focus:ring-2 focus:ring-[#F5A623]/40 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, label, description, error, leftIcon, id, ...props }, ref) => {
    const inputId = React.useId();
    const resolvedId = id ?? inputId;

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label htmlFor={resolvedId} className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {label}
          </label>
        ) : null}
        <div className="relative">
          {leftIcon ? (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
              {leftIcon}
            </span>
          ) : null}
          <input
            id={resolvedId}
            ref={ref}
            className={cn(inputVariants({ variant, className }), leftIcon && 'pl-10')}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-sm text-[#EF4444]">{error}</p>
        ) : description ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, label, description, error, id, ...props }, ref) => {
    const textareaId = React.useId();
    const resolvedId = id ?? textareaId;

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label htmlFor={resolvedId} className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {label}
          </label>
        ) : null}
        <textarea
          id={resolvedId}
          ref={ref}
          className={cn(inputVariants({ variant, className }), 'min-h-[120px] resize-y')}
          {...props}
        />
        {error ? (
          <p className="text-sm text-[#EF4444]">{error}</p>
        ) : description ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, label, description, error, id, children, ...props }, ref) => {
    const selectId = React.useId();
    const resolvedId = id ?? selectId;

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label htmlFor={resolvedId} className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            id={resolvedId}
            ref={ref}
            className={cn(inputVariants({ variant, className }), 'appearance-none pr-10')}
            {...props}
          >
            {children}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
        {error ? (
          <p className="text-sm text-[#EF4444]">{error}</p>
        ) : description ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        ) : null}
      </div>
    );
  },
);
Select.displayName = 'Select';

const cardVariants = cva('rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100', {
  variants: {
    variant: {
      default: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
      elevated: 'shadow-md hover:-translate-y-0.5 hover:shadow-lg',
      outline: 'border-[#D1D5DB] bg-transparent shadow-none',
      interactive: 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, ...props }, ref) => {
  return <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />;
});
Card.displayName = 'Card';

const badgeVariants = cva('inline-flex items-center rounded-full font-medium', {
  variants: {
    variant: {
      default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
      primary: 'bg-[#003F87] text-white',
      secondary: 'border border-[#003F87] text-[#003F87] dark:border-[#60a5fa] dark:text-[#bfdbfe]',
      success: 'bg-[#10B981]/15 text-[#047857]',
      warning: 'bg-[#F59E0B]/15 text-[#B45309]',
      danger: 'bg-[#EF4444]/15 text-[#B91C1C]',
      info: 'bg-[#3B82F6]/15 text-[#1D4ED8]',
    },
    size: {
      sm: 'px-2.5 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, size, ...props }, ref) => {
  return <span ref={ref} className={cn(badgeVariants({ variant, size, className }))} {...props} />;
});
Badge.displayName = 'Badge';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ src, alt, fallback, size = 'md', className, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  return (
    <div ref={ref} className={cn('relative inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200', sizeClasses[size], className)} {...props}>
      {src ? <Image src={src} alt={alt ?? ''} fill sizes="(max-width: 768px) 40px, 48px" className="object-cover" /> : fallback}
    </div>
  );
});
Avatar.displayName = 'Avatar';

export type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

export const Modal = ({ open, onOpenChange, title, description, children, size = 'md', className, ...props }: ModalProps) => {
  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" role="presentation" onClick={() => onOpenChange(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={typeof title === 'string' ? 'modal-title' : undefined}
        className={cn('w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900', sizeClass, className)}
        onClick={(event) => event.stopPropagation()}
        {...props}
      >
        {title ? (
          <div className="mb-4">
            <h2 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
};

export interface DialogProps extends ModalProps {
  footer?: React.ReactNode;
}

export const Dialog = ({ footer, children, ...props }: DialogProps) => {
  return (
    <Modal {...props}>
      <div className="space-y-4">
        {children}
        {footer ? <div className="flex justify-end gap-3 pt-2">{footer}</div> : null}
      </div>
    </Modal>
  );
};

export type DrawerProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'left' | 'right' | 'top' | 'bottom';
  title?: React.ReactNode;
  children: React.ReactNode;
};

export const Drawer = ({ open, onOpenChange, side = 'right', title, children, className, ...props }: DrawerProps) => {
  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  const positionClass = {
    left: 'left-0 top-0 h-full w-full max-w-sm rounded-r-2xl',
    right: 'right-0 top-0 h-full w-full max-w-sm rounded-l-2xl',
    top: 'left-0 top-0 w-full max-h-96 rounded-b-2xl',
    bottom: 'bottom-0 left-0 w-full max-h-96 rounded-t-2xl',
  }[side];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70" role="presentation" onClick={() => onOpenChange(false)}>
      <div className={cn('fixed flex flex-col border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900', positionClass, className)} onClick={(event) => event.stopPropagation()} {...props}>
        <div className="mb-4 flex items-center justify-between">
          {title ? <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2> : <div />}
          <button type="button" onClick={() => onOpenChange(false)} className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Close drawer">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export interface DropdownItem {
  label: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'end';
}

export const Dropdown = ({ trigger, items, align = 'end', className, ...props }: DropdownProps) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn('relative inline-block', className)} {...props}>
      <button type="button" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu">
        {trigger}
      </button>
      {open ? (
        <div className={cn('absolute z-20 mt-2 min-w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900', align === 'end' ? 'right-0' : 'left-0')} role="menu">
          {items.map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              role="menuitem"
              className={cn('flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800', item.destructive && 'text-[#EF4444]', item.disabled && 'cursor-not-allowed opacity-50')}
              onClick={() => {
                if (!item.disabled) {
                  item.onSelect?.();
                  setOpen(false);
                }
              }}
              disabled={item.disabled}
            >
              <span>{item.label}</span>
              {item.destructive ? <CircleAlert className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export type TooltipProps = React.HTMLAttributes<HTMLSpanElement> & {
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactElement;
};

export const Tooltip = ({ content, side = 'top', children, className, ...props }: TooltipProps) => {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();

  const positionClasses = {
    top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  }[side];

  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} {...props}>
      {React.cloneElement(children, { 'aria-describedby': id } as React.HTMLAttributes<HTMLElement>)}
      {open ? (
        <span id={id} role="tooltip" className={cn('pointer-events-none absolute z-30 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg dark:bg-slate-100 dark:text-slate-900', positionClasses, className)}>
          {content}
        </span>
      ) : null}
    </span>
  );
};

export interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'line' | 'pill';
}

export const Tabs = ({ items, defaultValue, value, onValueChange, variant = 'line', className, ...props }: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue ?? items[0]?.value);
  const currentValue = value ?? activeTab;

  const handleChange = (nextValue: string) => {
    setActiveTab(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      <div className={cn('flex gap-2', variant === 'pill' ? 'rounded-full bg-slate-100 p-1 dark:bg-slate-800' : 'border-b border-slate-200 dark:border-slate-700')}>
        {items.map((item) => {
          const isActive = currentValue === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleChange(item.value)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition',
                isActive
                  ? variant === 'pill'
                    ? 'bg-[#003F87] text-white shadow-sm'
                    : 'border-b-2 border-[#003F87] text-[#003F87] dark:text-[#bfdbfe]'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        {items.find((item) => item.value === currentValue)?.content}
      </div>
    </div>
  );
};

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  items: AccordionItem[];
  variant?: 'default' | 'bordered';
}

export const Accordion = ({ items, variant = 'default', className, ...props }: AccordionProps) => {
  return (
    <div className={cn('w-full space-y-2', className)} {...props}>
      {items.map((item) => (
        <details key={item.id} className={cn('group rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800', variant === 'bordered' && 'border border-slate-200 dark:border-slate-700')}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-slate-800 dark:text-slate-100">
            <span>{item.title}</span>
            <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
          </summary>
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.content}</div>
        </details>
      ))}
    </div>
  );
};

export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  action?: React.ReactNode;
  onDismiss?: () => void;
};

export const Toast = ({ title, description, variant = 'default', action, onDismiss, className, ...props }: ToastProps) => {
  const iconMap = {
    default: <AlertCircle className="h-4 w-4" />,
    success: <CheckCircle2 className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    danger: <CircleAlert className="h-4 w-4" />,
  }[variant];

  return (
    <div className={cn('flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900', className)} {...props}>
      <div className="mt-0.5 text-[#003F87] dark:text-[#60a5fa]">{iconMap}</div>
      <div className="flex-1">
        {title ? <p className="font-medium text-slate-900 dark:text-slate-100">{title}</p> : null}
        {description ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        {action}
        {onDismiss ? (
          <button type="button" onClick={onDismiss} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Dismiss toast">
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: 'text' | 'rect' | 'circle';
}

export const Skeleton = ({ shape = 'text', className, ...props }: SkeletonProps) => {
  const shapeClass = {
    text: 'h-4 w-full rounded',
    rect: 'h-24 w-full rounded-xl',
    circle: 'h-10 w-10 rounded-full',
  }[shape];

  return <div className={cn('animate-pulse bg-slate-200 dark:bg-slate-700', shapeClass, className)} {...props} />;
};

export const LoadingSpinner = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <LoaderCircle className="h-6 w-6 animate-spin text-[#003F87] dark:text-[#60a5fa]" />
    </div>
  );
};

export type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
};

export const EmptyState = ({ title, description, action, icon, className, ...props }: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 py-12 text-center dark:border-slate-700 dark:bg-slate-900/60', className)} {...props}>
      {icon ? <div className="mb-4 text-[#003F87] dark:text-[#60a5fa]">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
};

export type ErrorStateProps = React.HTMLAttributes<HTMLDivElement> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

export const ErrorState = ({ title, description, action, className, ...props }: ErrorStateProps) => {
  return (
    <div className={cn('rounded-2xl border border-[#EF4444]/30 bg-[#FEF2F2] p-8 text-center dark:bg-[#2c1111]', className)} {...props}>
      <div className="mb-4 flex justify-center text-[#EF4444]">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof React.JSX.IntrinsicElements;
  container?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(({ as: Component = 'section', container = true, className, children, ...props }, ref) => {
  return React.createElement(
    Component,
    {
      ref,
      className: cn(container ? 'mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16' : 'w-full', className),
      ...props,
    },
    children,
  );
});
Section.displayName = 'Section';

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10', className)} {...props} />;
});
Container.displayName = 'Container';

const headingVariants = cva('tracking-tight text-slate-900 dark:text-slate-100', {
  variants: {
    level: {
      h1: 'text-4xl font-extrabold sm:text-5xl',
      h2: 'text-3xl font-bold sm:text-4xl',
      h3: 'text-2xl font-semibold',
      h4: 'text-xl font-semibold',
      h5: 'text-lg font-semibold',
      h6: 'text-base font-semibold',
    },
  },
  defaultVariants: {
    level: 'h2',
  },
});

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ as: Component = 'h2', level, className, ...props }, ref) => {
  return React.createElement(Component, { ref, className: cn(headingVariants({ level: level ?? Component as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', className })), ...props });
});
Heading.displayName = 'Heading';

const textVariants = cva('text-slate-700 dark:text-slate-300', {
  variants: {
    variant: {
      default: 'text-base leading-7',
      lead: 'text-lg leading-8 text-slate-800 dark:text-slate-200',
      muted: 'text-sm leading-6 text-slate-500 dark:text-slate-400',
      caption: 'text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400',
      label: 'text-sm font-medium text-slate-700 dark:text-slate-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface TextProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: keyof React.JSX.IntrinsicElements;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(({ as: Component = 'p', variant, className, ...props }, ref) => {
  return React.createElement(Component, { ref, className: cn(textVariants({ variant, className })), ...props });
});
Text.displayName = 'Text';

export const Lead = React.forwardRef<HTMLElement, TextProps>(({ className, ...props }, ref) => <Text ref={ref} variant="lead" className={className} {...props} />);
Lead.displayName = 'Lead';

export const Muted = React.forwardRef<HTMLElement, TextProps>(({ className, ...props }, ref) => <Text ref={ref} variant="muted" className={className} {...props} />);
Muted.displayName = 'Muted';

export const Caption = React.forwardRef<HTMLElement, TextProps>(({ className, ...props }, ref) => <Text ref={ref} variant="caption" className={className} {...props} />);
Caption.displayName = 'Caption';

export const Label = React.forwardRef<HTMLElement, TextProps>(({ className, ...props }, ref) => <Text ref={ref} variant="label" className={className} {...props} />);
Label.displayName = 'Label';
