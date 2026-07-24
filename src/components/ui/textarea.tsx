import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30 aria-invalid:ring-2",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
