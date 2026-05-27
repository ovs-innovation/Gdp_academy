/** Shared API base — use /api in dev (Vite proxy → backend:8096) or full URL in production */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "/api"
).replace(/\/$/, "");

export const apiUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
