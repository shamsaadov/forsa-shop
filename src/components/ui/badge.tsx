import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        secondary:
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-gray-800 border-gray-200",
        success:
          "border-transparent bg-green-100 text-green-700 border-green-200",
        warning:
          "border-transparent bg-yellow-100 text-yellow-700 border-yellow-200",
        pending:
          "border-transparent bg-yellow-50 text-yellow-600 border-yellow-200",
        processing:
          "border-transparent bg-blue-50 text-blue-600 border-blue-200",
        completed:
          "border-transparent bg-green-50 text-green-600 border-green-200",
        cancelled: "border-transparent bg-red-50 text-red-600 border-red-200",
      },
      size: {
        default: "h-6 text-xs",
        sm: "h-5 text-xs",
        lg: "h-7 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
