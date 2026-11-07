import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronRight, MapPin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveSectionUrl } from "@/lib/websiteLinks";

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
  const liveUrl = websiteLocation ? resolveSectionUrl(websiteLocation) : null;

  return (
    <Card
      className={cn(
        "border-border bg-card overflow-hidden transition-all duration-200",
        open && "border-primary/40 shadow-sm border-l-4 border-l-primary",
        className,
      )}
    >
      <div className="w-full p-4 sm:p-5 hover:bg-muted/30 transition">
        <div className="flex items-start gap-3.5">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-lg mt-0.5 shrink-0 transition-colors cursor-pointer select-none"
            aria-label={open ? "Collapse section" : "Expand section"}
          >
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                open ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {open ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
            </div>
          </button>

          <div className="flex-1 min-w-0">
            <div
              onClick={() => setOpen((v) => !v)}
              className="cursor-pointer select-none flex flex-wrap items-center justify-between gap-2"
            >
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

            <p
              onClick={() => setOpen((v) => !v)}
              className="text-xs text-muted-foreground mt-1 leading-relaxed cursor-pointer select-none"
            >
              {description}
            </p>

            {websiteLocation && liveUrl && (
              <div className="mt-2 flex items-center">
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary/20 hover:border-primary/50 shadow-2xs"
                  title={`Open ${websiteLocation} on live website in new tab`}
                >
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>
                    View on website: <span className="font-normal underline decoration-dotted">{websiteLocation}</span>
                  </span>
                  <ExternalLink className="h-3 w-3 shrink-0 ml-0.5 opacity-80" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="px-4 sm:px-6 pb-6 pt-2 space-y-4 border-t border-border/80 animate-in fade-in-50 duration-150">
          {children}
        </div>
      )}
    </Card>
  );
}
