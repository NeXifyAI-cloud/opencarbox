import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Sharon UI Base Tokens Varianten
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-error text-error-foreground hover:bg-error/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // OpenCarBox spezifische Varianten
        primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm",
        "secondary-solid": "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 shadow-sm",
        "gradient-primary": "bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:opacity-90 active:opacity-80 shadow-lg shadow-primary-500/20",
        "gradient-secondary": "bg-gradient-to-r from-secondary-500 to-secondary-700 text-white hover:opacity-90 active:opacity-80 shadow-lg shadow-secondary-500/20",
        // Status Varianten
        success: "bg-success text-success-foreground hover:bg-success/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        info: "bg-info text-info-foreground hover:bg-info/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        md: "h-10 rounded-md px-4",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-lg font-bold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
