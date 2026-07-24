import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="bg-muted flex size-12 items-center justify-center rounded-full">
          <Icon className="text-muted-foreground size-6" aria-hidden />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
