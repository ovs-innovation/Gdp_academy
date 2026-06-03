const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const TOKEN_KEY = "admin-auth-token";

/** Backend upload endpoints (first match wins). */
const UPLOAD_ENDPOINTS = ["/media/upload", "/gallery-items/upload"];

const getToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

export type MediaType = "image" | "video" | "auto";

const isVideoFile = (file: File) =>
  file.type.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(file.name);

async function parseUploadResponse(response: Response): Promise<{ ok: boolean; url?: string; message: string }> {
  const text = await response.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (text.includes("Cannot POST") || response.status === 404) {
      return {
        ok: false,
        message:
          "Upload API not found. Restart the backend: cd backend && npm run dev",
      };
    }
    return { ok: false, message: text.slice(0, 120) || `HTTP ${response.status}` };
  }

  if (!response.ok) {
    return {
      ok: false,
      message: (data.message as string) || (data.error as string) || `Upload failed (${response.status})`,
    };
  }

  const rawUrl = data.url as string;
  if (!rawUrl) {
    return { ok: false, message: "Server did not return a file URL" };
  }

  if (rawUrl.startsWith("/uploads/")) {
    return { ok: true, url: rawUrl, message: "ok" };
  }

  if (rawUrl.startsWith("http")) {
    try {
      const parsed = new URL(rawUrl);
      if (parsed.pathname.startsWith("/uploads/")) {
        return { ok: true, url: parsed.pathname, message: "ok" };
      }
      return { ok: true, url: rawUrl, message: "ok" };
    } catch {
      return { ok: true, url: rawUrl, message: "ok" };
    }
  }

  return { ok: true, url: rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`, message: "ok" };
}

/** Upload via backend (saved to /uploads, permanent on server). */
export async function uploadMediaToServer(file: File): Promise<string> {
  const token = getToken();
  if (!token) {
    throw new Error("Login required — please sign in to the admin panel again.");
  }

  const formData = new FormData();
  formData.append("file", file);

  let lastError = "Upload failed";

  for (const endpoint of UPLOAD_ENDPOINTS) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await parseUploadResponse(response);
      if (result.ok && result.url) {
        return result.url;
      }
      lastError = result.message;
      // Try next endpoint only on 404
      if (response.status !== 404) {
        break;
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : "Network error during upload";
    }
  }

  throw new Error(lastError);
}

/** Upload to Cloudinary when fully configured in admin .env */
export async function uploadMediaToCloudinary(
  file: File,
  folder = "gdp-cms",
): Promise<string> {
  const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary not configured");
  }

  const resourceType = isVideoFile(file) ? "video" : "image";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (folder) formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body: formData },
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }
  return data.secure_url as string;
}

/** Prefer server upload (always works when backend is running). Cloudinary only if explicitly enabled. */
export async function uploadMediaFile(
  file: File,
  folder = "gdp-cms",
): Promise<string> {
  const useCloudinary = import.meta.env.VITE_USE_CLOUDINARY_UPLOAD === "true";
  const hasCloudinary =
    useCloudinary &&
    import.meta.env.VITE_APP_CLOUD_NAME &&
    import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET;

  if (hasCloudinary) {
    try {
      return await uploadMediaToCloudinary(file, folder);
    } catch (cloudErr: unknown) {
      const cloudMsg = cloudErr instanceof Error ? cloudErr.message : "Cloudinary failed";
      try {
        return await uploadMediaToServer(file);
      } catch (serverErr: unknown) {
        const serverMsg = serverErr instanceof Error ? serverErr.message : "Server upload failed";
        throw new Error(`${serverMsg} (Cloudinary: ${cloudMsg})`);
      }
    }
  }

  return uploadMediaToServer(file);
}

export const mediaAcceptFor = (type: MediaType) => {
  if (type === "image") return { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] };
  if (type === "video") return { "video/*": [".mp4", ".webm", ".mov"] };
  return {
    "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    "video/*": [".mp4", ".webm", ".mov"],
  };
};

export const isVideoUrl = (url: string) =>
  /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/video/upload/");
