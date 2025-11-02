import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal shadow-sm transition placeholder:text-charcoal/50 focus-visible:border-charcoal focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
