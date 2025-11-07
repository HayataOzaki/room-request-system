import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-11 w-full appearance-none rounded-xl border border-charcoal/15 bg-white px-4 text-sm text-charcoal shadow-sm transition focus-visible:border-charcoal focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export { Select };
