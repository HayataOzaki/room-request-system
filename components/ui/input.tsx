import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-charcoal/15 bg-white px-4 text-sm text-charcoal shadow-sm transition placeholder:text-charcoal/50 focus-visible:border-charcoal focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
