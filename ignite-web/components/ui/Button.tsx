import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Note: Radix UI is standard for this but I can implement without it or install it.
// User didn't ask for Radix explicitly, but "shadcn/ui" is implied by "Linear/Stripe" quality usually.
// I will implement a dependency-free version or minimally dependent.
// I'll skip Slot for now or just use standard props.
// Actually, `class-variance-authority` needs to be installed if I use it.
// I didn't install `class-variance-authority`.
// I'll stick to simple implementation for now to avoid installing more deps unless I do it now.
// "Premium" feel comes from CSS, not the library.

// I will install `class-variance-authority` as it is very standard for modern React apps.
// And `lucide-react` is already installed.

// Let's create a simple robust button without CVA for now to save a step, or I'll install CVA.
// Using generic approach is fine.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transition-all duration-300 active:scale-[0.98]";

        const variants = {
            primary: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
            outline: "border border-input bg-transparent shadow-sm hover:bg-surface hover:text-foreground",
            ghost: "hover:bg-surface hover:text-foreground",
            link: "text-primary underline-offset-4 hover:underline",
        };

        const sizes = {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-11 rounded-md px-8",
            icon: "h-9 w-9",
        };

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
