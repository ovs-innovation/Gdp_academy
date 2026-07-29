const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const TOKEN_KEY = "admin-auth-token";

/** Backend upload endpoints (first match wins). */
const UPLOAD_ENDPOINTS = ["/media/upload", "/gallery-items/upload"];

/** Cloudinary recommends chunking above ~100MB; 20MB chunks are reliable. */
const CHUNK_SIZE = 20 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 1024 * 1024 * 1024; // 1 GB

const getToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

export type MediaType = "image" | "video" | "auto";

export type UploadProgress = {
  percent: number;
  loaded: number;
  total: number;
};

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

type CloudinarySign = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  resourceType: "image" | "video";
};

async function fetchCloudinarySign(
  resourceType: "image" | "video",
  folder: string,
): Promise<CloudinarySign> {
  const token = getToken();
  if (!token) {
    throw new Error("Login required — please sign in to the admin panel again.");
  }

  const params = new URLSearchParams({ resourceType, folder });
  const response = await fetch(`${API_URL}/media/cloudinary-sign?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      (data.message as string) ||
        `Could not get Cloudinary upload signature (${response.status})`,
    );
  }

  return data as CloudinarySign;
}

function xhrPostFormData(
  url: string,
  formData: FormData,
  headers: Record<string, string>,
  onProgress?: (loaded: number, total: number) => void,
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(event.loaded, event.total);
      }
    };

    xhr.onload = () => {
      let data: Record<string, unknown> = {};
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        reject(new Error(xhr.responseText?.slice(0, 120) || `HTTP ${xhr.status}`));
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        const errMsg =
          (data.error as { message?: string } | undefined)?.message ||
          (data.message as string) ||
          `Cloudinary upload failed (${xhr.status})`;
        reject(new Error(errMsg));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during Cloudinary upload"));
    xhr.onabort = () => reject(new Error("Upload cancelled"));
    xhr.send(formData);
  });
}

/** Direct browser → Cloudinary upload (chunked for large videos). */
export async function uploadMediaToCloudinaryDirect(
  file: File,
  folder: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds the 1 GB upload limit");
  }

  const resourceType = isVideoFile(file) ? "video" : "image";
  const defaultFolder = resourceType === "video" ? "gdp-videos" : "gdp-media";
  const sign = await fetchCloudinarySign(resourceType, folder || defaultFolder);
  const endpoint = `https://api.cloudinary.com/v1_1/${sign.cloudName}/${sign.resourceType}/upload`;

  const appendAuth = (formData: FormData) => {
    formData.append("api_key", sign.apiKey);
    formData.append("timestamp", String(sign.timestamp));
    formData.append("signature", sign.signature);
    formData.append("folder", sign.folder);
  };

  const report = (loaded: number, total: number) => {
    onProgress?.({
      percent: total ? Math.min(100, Math.round((loaded / total) * 100)) : 0,
      loaded,
      total,
    });
  };

  // Small files: single request
  if (file.size <= CHUNK_SIZE) {
    const formData = new FormData();
    formData.append("file", file);
    appendAuth(formData);
    const data = await xhrPostFormData(endpoint, formData, {}, (loaded, total) =>
      report(loaded, total),
    );
    const url = (data.secure_url || data.url) as string | undefined;
    if (!url) throw new Error("Cloudinary did not return a file URL");
    report(file.size, file.size);
    return url;
  }

  // Large files: chunked upload (required by Cloudinary above ~100MB)
  const uniqueUploadId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  let start = 0;
  let lastData: Record<string, unknown> = {};

  while (start < file.size) {
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);
    const formData = new FormData();
    formData.append("file", chunk);
    appendAuth(formData);

    lastData = await xhrPostFormData(
      endpoint,
      formData,
      {
        "X-Unique-Upload-Id": uniqueUploadId,
        "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
      },
      (chunkLoaded) => report(start + chunkLoaded, file.size),
    );

    start = end;
    report(start, file.size);
  }

  const url = (lastData.secure_url || lastData.url) as string | undefined;
  if (!url) throw new Error("Cloudinary did not return a file URL after chunked upload");
  return url;
}

/** Legacy unsigned preset path (optional env). */
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

/** Upload via backend (proxy → Cloudinary). Fine for small files; often fails for ~1GB on VPS. */
export async function uploadMediaToServer(
  file: File,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> {
  const token = getToken();
  if (!token) {
    throw new Error("Login required — please sign in to the admin panel again.");
  }

  let lastError = "Upload failed";

  for (const endpoint of UPLOAD_ENDPOINTS) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await new Promise<Record<string, unknown>>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_URL}${endpoint}`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            onProgress({
              percent: Math.round((event.loaded / event.total) * 100),
              loaded: event.loaded,
              total: event.total,
            });
          }
        };
        xhr.onload = () => {
          void (async () => {
            const fakeResponse = new Response(xhr.responseText, { status: xhr.status });
            const result = await parseUploadResponse(fakeResponse);
            if (result.ok && result.url) {
              resolve({ url: result.url });
            } else {
              reject(Object.assign(new Error(result.message), { status: xhr.status }));
            }
          })();
        };
        xhr.onerror = () =>
          reject(
            new Error(
              "Cannot reach upload server. Check that the API is online, then try again.",
            ),
          );
        xhr.send(formData);
      });

      return data.url as string;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error during upload";
      lastError = msg;
      const status = (err as { status?: number })?.status;
      if (status !== 404) break;
    }
  }

  throw new Error(lastError);
}

/**
 * Prefer direct Cloudinary (supports ~1GB with chunking).
 * Falls back to API upload for smaller files / when sign endpoint unavailable.
 */
export async function uploadMediaFile(
  file: File,
  folder = "gdp-cms",
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds the 1 GB upload limit");
  }

  // Prefer signed direct upload (production-safe for large videos)
  try {
    return await uploadMediaToCloudinaryDirect(file, folder, onProgress);
  } catch (directErr: unknown) {
    const directMsg =
      directErr instanceof Error ? directErr.message : "Direct Cloudinary upload failed";

    // Unsigned preset fallback when configured
    const useUnsigned = import.meta.env.VITE_USE_CLOUDINARY_UPLOAD === "true";
    if (
      useUnsigned &&
      import.meta.env.VITE_APP_CLOUD_NAME &&
      import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET &&
      file.size <= CHUNK_SIZE
    ) {
      try {
        return await uploadMediaToCloudinary(file, folder);
      } catch {
        /* continue to server */
      }
    }

    // Server path: OK for smaller media; warn for huge files
    if (file.size > 100 * 1024 * 1024) {
      try {
        return await uploadMediaToServer(file, onProgress);
      } catch (serverErr: unknown) {
        const serverMsg =
          serverErr instanceof Error ? serverErr.message : "Server upload failed";
        throw new Error(
          `${directMsg}. Large-file fallback also failed: ${serverMsg}. ` +
            "Ensure Cloudinary credentials are set on the backend and your Cloudinary plan allows large video uploads.",
        );
      }
    }

    try {
      return await uploadMediaToServer(file, onProgress);
    } catch (serverErr: unknown) {
      const serverMsg =
        serverErr instanceof Error ? serverErr.message : "Server upload failed";
      throw new Error(`${serverMsg} (Cloudinary: ${directMsg})`);
    }
  }
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
  /\.(mp4|webm|mov)(\?|$)/i.test(url) ||
  url.includes("/video/upload/") ||
  /res\.cloudinary\.com\/[^/]+\/video\//i.test(url);
