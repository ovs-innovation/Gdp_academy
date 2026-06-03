const DEFAULT_SITE_LOGO = "/logo.png";

function isLocalDevHost(hostname) {
  return /^(localhost|127\.0\.0\.1)$/i.test(hostname);
}

/** Normalize logo for API clients — empty means use bundled default on frontend. */
function sanitizeLogoUrl(logoUrl) {
  const trimmed = String(logoUrl || "").trim();
  if (!trimmed) return "";

  if (trimmed === DEFAULT_SITE_LOGO || /\/logo\.png$/i.test(trimmed)) {
    return "";
  }

  if (/GDP_logo\.png/i.test(trimmed)) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.pathname.startsWith("/uploads/")) {
        return `${parsed.pathname}${parsed.search}`;
      }
      if (!isLocalDevHost(parsed.hostname)) {
        return trimmed;
      }
      return "";
    } catch {
      return "";
    }
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

module.exports = {
  DEFAULT_SITE_LOGO,
  sanitizeLogoUrl,
};
