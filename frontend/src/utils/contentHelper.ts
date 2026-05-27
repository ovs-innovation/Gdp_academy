export const getLocalizedValue = (
  val: string | { en: string; [key: string]: string } | undefined | null,
  fallback: string = "",
): string => {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  return val.en || Object.values(val)[0] || fallback;
};
