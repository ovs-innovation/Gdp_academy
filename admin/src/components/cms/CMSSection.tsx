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
    <Card
      className={cn(
        "border-border bg-card overflow-hidden transition-all duration-200",
        open && "border-primary/40 shadow-sm border-l-4 border-l-primary",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3.5 p-4 sm:p-5 text-left hover:bg-muted/40 transition cursor-pointer select-none"
      >
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg mt-0.5 shrink-0 transition-colors",
            open ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {open ? (
            <ChevronDown className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-foreground text-sm sm:text-base leading-snug">
              {title}
            </h3>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-medium transition",
                open ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              {open ? "Editing" : "Click to edit"}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
          {websiteLocation && (
            <p className="text-[11px] text-primary/90 mt-1.5 flex items-center gap-1.5 font-medium">
              <MapPin className="h-3 w-3 shrink-0" />
              Shows on website: <span className="underline decoration-dotted">{websiteLocation}</span>
            </p>
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 sm:px-6 pb-6 pt-2 space-y-4 border-t border-border/80 animate-in fade-in-50 duration-150">
          {children}
        </div>
      )}
    </Card>
  );
}
