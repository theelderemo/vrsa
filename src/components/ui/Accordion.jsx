/**
 * Accordion Component
 * Based on Radix UI Accordion primitive with variants
 * Adapted for VRS/A dark theme
 */

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "border border-slate-700 rounded-xl overflow-hidden shadow-md",
      ghost: "",
      outline: "border border-slate-700 rounded-xl shadow-md",
    },
    size: {
      sm: "text-sm",
      default: "",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const accordionItemVariants = cva(
  "border-b border-slate-700 last:border-b-0",
  {
    variants: {
      variant: {
        default: "",
        ghost: "border-b border-slate-700 last:border-b-0 mb-2 last:mb-0",
        outline: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const accordionTriggerVariants = cva(
  "flex flex-1 items-center justify-between py-3 px-4 text-left font-medium transition-all hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
  {
    variants: {
      variant: {
        default: "",
        ghost: "px-0",
        outline: "",
      },
      size: {
        sm: "py-2 px-3 text-sm",
        default: "py-3 px-4",
        lg: "py-4 px-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const accordionContentVariants = cva(
  "px-4 pb-3 pt-0 text-slate-400",
  {
    variants: {
      variant: {
        default: "",
        ghost: "px-0",
        outline: "",
      },
      size: {
        sm: "px-3 pb-2 text-sm",
        default: "px-4 pb-3",
        lg: "px-5 pb-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Accordion = React.forwardRef(
  ({ className, variant, size, children, ...props }, ref) => (
    <AccordionPrimitive.Root
      ref={ref}
      className={cn(accordionVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Root>
  )
);
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef(
  ({ className, variant, children, ...props }, ref) => (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Item>
  )
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef(
  (
    { className, children, variant, size, ...props },
    ref
  ) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(accordionTriggerVariants({ variant, size }), className)}
        {...props}
      >
        <span className="text-left text-slate-200">
          {children}
        </span>
        <span className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 [&[data-state=open]]:rotate-180">
          ▼
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef(
  ({ className, children, variant, size, ...props }, ref) => (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn(accordionContentVariants({ variant, size }), className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
