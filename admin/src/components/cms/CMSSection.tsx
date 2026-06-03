import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CMSSectionProps {
  title: string;
  description: string;
  websiteLocation?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CMSSection({
  title,
  description,
  websiteLocation,
  defaultOpen = false,
  children,
  className,
}: CMSSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className={cn("border-border bg-card overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 p-5 text-left hover:bg-muted/30 transition"
      >
        {open ? (
          <ChevronDown className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        ) : (
          <ChevronRight className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          {websiteLocation && (
            <p className="text-xs text-primary/80 mt-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              Shows on website: <span className="font-medium">{websiteLocation}</span>
            </p>
          )}
        </div>
      </button>
      {open && <div className="px-5 pb-5 pt-0 space-y-4 border-t border-border">{children}</div>}
    </Card>
  );
}
