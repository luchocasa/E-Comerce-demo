import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] leading-none text-accent-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
