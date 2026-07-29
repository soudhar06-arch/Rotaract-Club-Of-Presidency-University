import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-rotary-gold)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--color-brand-accent-blue)] text-white hover:bg-[color:var(--color-brand-accent-blue)]/90 shadow-small",
        secondary:
          "bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-border)]",
        outline:
          "border border-[color:var(--color-brand-accent-blue)] text-[color:var(--color-brand-accent-blue)] hover:bg-[color:var(--color-brand-accent-blue)]/10 dark:border-[color:var(--color-brand-rotary-gold)] dark:text-[color:var(--color-brand-rotary-gold)]",
        ghost:
          "text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-bg-secondary)]",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-small",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 px-3.5 text-xs rounded-lg",
        lg: "h-12 px-7 text-base rounded-2xl",
        icon: "h-10 w-10 p-0 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
