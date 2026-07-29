import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  mediaAcceptFor,
  isVideoUrl,
  uploadMediaFile,
  type MediaType,
} from "@/lib/mediaUpload";

interface MediaUrlFieldProps {
  label?: string;
  hint?: string;
  websiteLocation?: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  mediaType?: MediaType;
  uploadFolder?: string;
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function MediaUrlField({
  label,
  hint,
  websiteLocation,
  value = "",
  onChange,
  placeholder = "/hero.mp4 or https://...",
  className,
  mediaType = "auto",
  uploadFolder = "gdp-cms",
}: MediaUrlFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const { toast } = useToast();
  const preview = value.trim();

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setUploading(true);
      setProgress(0);
      setProgressLabel(`Starting ${formatBytes(file.size)}…`);
      try {
        const url = await uploadMediaFile(file, uploadFolder, (p) => {
          setProgress(p.percent);
          setProgressLabel(`${p.percent}% · ${formatBytes(p.loaded)} / ${formatBytes(p.total)}`);
        });
        onChange(url);
        toast({
          title: "Upload successful",
          description: `${file.name} — save the page so it appears on the website.`,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed";
        toast({ title: "Upload failed", description: message, variant: "destructive" });
      } finally {
        setUploading(false);
        setProgress(0);
        setProgressLabel("");
      }
    },
    [onChange, toast, uploadFolder],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: mediaAcceptFor(mediaType),
    multiple: false,
    maxSize: 1024 * 1024 * 1024,
    disabled: uploading,
  });

  const showVideo = preview && isVideoUrl(preview);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {websiteLocation && (
        <p className="text-xs text-primary/80 font-medium">On website: {websiteLocation}</p>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/20",
          uploading && "opacity-90 cursor-wait",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          {uploading
            ? progressLabel || "Uploading…"
            : isDragActive
              ? "Drop the file here"
              : "Drag & drop image/video (up to 1 GB), or click to browse"}
        </p>
        {uploading && (
          <div className="mt-3 mx-auto max-w-xs h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-[width] duration-200"
              style={{ width: `${Math.max(progress, 2)}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-muted/50 text-sm"
        />
        {preview && (
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {preview && (
        <div className="rounded-md border border-border overflow-hidden max-w-xs">
          {showVideo ? (
            <video src={preview} className="h-28 w-full object-cover" muted playsInline controls />
          ) : (
            <img
              src={preview}
              alt=""
              className="h-28 w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
