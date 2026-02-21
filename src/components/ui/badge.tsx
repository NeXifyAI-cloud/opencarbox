import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Sharon UI Base Tokens Varianten
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-error text-error-foreground hover:bg-error/80",
        outline: "text-foreground",
        // Status Varianten mit Sharon UI Farben
        success: "border-transparent bg-success-50 text-success-700 hover:bg-success-100",
        warning: "border-transparent bg-warning-50 text-warning-700 hover:bg-warning-100",
        error: "border-transparent bg-error-50 text-error-700 hover:bg-error-100",
        info: "border-transparent bg-info-50 text-info-700 hover:bg-info-100",
        // OpenCarBox spezifische Varianten
        primary: "border-transparent bg-primary-100 text-primary-800 hover:bg-primary-200",
        "secondary-solid": "border-transparent bg-secondary-100 text-secondary-800 hover:bg-secondary-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
