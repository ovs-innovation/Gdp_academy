import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { uploadMediaFile } from "@/lib/mediaUpload";

interface CloudinaryImageUploaderProps {
  imageUrl?: string;
  onImageChange: (url: string | null) => void;
  folder?: string;
  maxSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
}

export function CloudinaryImageUploader({
  imageUrl,
  onImageChange,
  folder = "uploads",
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
  disabled = false,
}: CloudinaryImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const { toast } = useToast();

  useEffect(() => {
    setPreview(imageUrl || null);
  }, [imageUrl]);

  const uploadToCloudinary = async (file: File): Promise<string> => uploadMediaFile(file, folder);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file size
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        setPreview(url);
        onImageChange(url);
        toast({
          title: "Image uploaded successfully",
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to upload file";
        toast({
          title: "Upload failed",
          description: message,
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
    [maxSize, folder, onImageChange, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
    multiple: false,
    maxSize,
    disabled: disabled || uploading,
  });

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
  };

  return (
    <div className={cn("w-full", className)}>
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-md border border-border"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-border",
            disabled && "opacity-50 cursor-not-allowed",
            uploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-foreground">
            {uploading
              ? "Uploading..."
              : isDragActive
                ? "Drop the image here"
                : "Drag & drop an image, or click to select"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG, WEBP, GIF up to {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      )}
    </div>
  );
}

