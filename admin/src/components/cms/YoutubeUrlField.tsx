import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveSectionUrl } from "@/lib/websiteLinks";
import {
  extractYoutubeVideoId,
  youtubeThumbnailUrl,
} from "@/lib/youtube";

type Props = {
  label: string;
  hint?: string;
  websiteLocation?: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
};

export function YoutubeUrlField({
  label,
  hint,
  websiteLocation,
  value = "",
  onChange,
  placeholder = "https://www.youtube.com/watch?v=...",
  className,
}: Props) {
  const id = extractYoutubeVideoId(value);
  const thumb = youtubeThumbnailUrl(value);

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {websiteLocation && (
        <p className="text-xs font-medium">
          <a
            href={resolveSectionUrl(websiteLocation)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <MapPin className="h-3 w-3" />
            <span>On website: {websiteLocation}</span>
            <ExternalLink className="h-2.5 w-2.5 opacity-70" />
          </a>
        </p>
      )}
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-muted/50 text-sm"
        />
        {value && (
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {value.trim() && !id && (
        <p className="text-xs text-amber-500">
          Paste a full YouTube link (watch, Shorts, or youtu.be). A raw 11-character ID also works.
        </p>
      )}
      {id && (
        <p className="text-xs text-muted-foreground">
          Ready — this video will play on the website.
        </p>
      )}
      {thumb && (
        <div className="max-w-xs overflow-hidden rounded-md border border-border">
          <img src={thumb} alt="" className="h-28 w-full object-cover" />
        </div>
      )}
    </div>
  );
}
