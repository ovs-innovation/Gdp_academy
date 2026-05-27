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
  const { toast } = useToast();
  const preview = value.trim();

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setUploading(true);
      try {
        const url = await uploadMediaFile(file, uploadFolder);
        onChange(url);
        toast({ title: "Upload successful", description: file.name });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed";
        toast({ title: "Upload failed", description: message, variant: "destructive" });
      } finally {
        setUploading(false);
      }
    },
    [onChange, toast, uploadFolder],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: mediaAcceptFor(mediaType),
    multiple: false,
    maxSize: 100 * 1024 * 1024,
    disabled: uploading,
  });

  const showVideo = preview && isVideoUrl(preview);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {websiteLocation && (
        <p className="text-xs text-primary/80 font-medium">📍 Website pe: {websiteLocation}</p>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/20",
          uploading && "opacity-60 cursor-wait",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          {uploading
            ? "Upload ho raha hai..."
            : isDragActive
              ? "Yahan chhod dein"
              : "Drag & drop image/video, ya click karein"}
        </p>
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
