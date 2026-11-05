/** Local `npm run dev` → Vite proxy → backend :8096. Production builds use the live API. */
export const API_BASE_URL = (
  import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      "https://api.garimadanceproductions.com/api"
).replace(/\/$/, "");

export const apiUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
