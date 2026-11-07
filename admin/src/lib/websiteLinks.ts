/**
 * Resolves live website URLs for both local development and production.
 */
export function getLiveWebsiteUrl(path = ""): string {
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "/";

  // Check explicit environment variable if provided
  const envUrl = (import.meta as any).env?.VITE_WEBSITE_URL;
  if (envUrl) {
    return `${envUrl.replace(/\/$/, "")}${cleanPath}`;
  }

  // Local development
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      // Local dev frontend runs on port 3000
      return `http://${host}:3000${cleanPath}`;
    }

    // Production domain mapping
    if (window.location.host.includes("garimadanceproductions.com")) {
      return `https://garimadanceproductions.com${cleanPath}`;
    }

    // Relative on current origin if root served
    return cleanPath;
  }

  return cleanPath;
}

/**
 * Maps CMS section locations to their exact page and anchor hash.
 */
export function resolveSectionUrl(websiteLocation?: string, defaultPath?: string): string {
  if (!websiteLocation) {
    return getLiveWebsiteUrl(defaultPath || "/");
  }

  const loc = websiteLocation.toLowerCase();

  // Homepage sections
  if (loc.includes("homepage") || loc.includes("home")) {
    if (loc.includes("hero") && (loc.includes("stats") || loc.includes("numbers"))) return getLiveWebsiteUrl("/#stats");
    if (loc.includes("hero") || loc.includes("intro") || loc.includes("collage") || loc.includes("video")) return getLiveWebsiteUrl("/#hero");
    if (loc.includes("service")) return getLiveWebsiteUrl("/#services");
    if (loc.includes("short") || loc.includes("youtube")) return getLiveWebsiteUrl("/#shorts");
    if (loc.includes("about")) return getLiveWebsiteUrl("/#about");
    if (loc.includes("instagram") || loc.includes("reel")) return getLiveWebsiteUrl("/#instagram");
    if (loc.includes("review") || loc.includes("testimonial")) return getLiveWebsiteUrl("/#reviews");
    if (loc.includes("faq")) return getLiveWebsiteUrl("/#faq");
    if (loc.includes("contact") || loc.includes("reach") || loc.includes("catch")) return getLiveWebsiteUrl("/#contact");
    return getLiveWebsiteUrl("/");
  }

  // About page sections
  if (loc.includes("about")) {
    if (loc.includes("story")) return getLiveWebsiteUrl("/about#story");
    if (loc.includes("mission")) return getLiveWebsiteUrl("/about#mission");
    if (loc.includes("stat")) return getLiveWebsiteUrl("/about#stats");
    if (loc.includes("pillar")) return getLiveWebsiteUrl("/about#pillars");
    if (loc.includes("ecosystem")) return getLiveWebsiteUrl("/about#ecosystem");
    if (loc.includes("cta") || loc.includes("bottom")) return getLiveWebsiteUrl("/about#cta");
    if (loc.includes("hero")) return getLiveWebsiteUrl("/about#hero");
    return getLiveWebsiteUrl("/about");
  }

  // Workshops page sections
  if (loc.includes("workshop")) {
    if (loc.includes("offer") || loc.includes("banner")) return getLiveWebsiteUrl("/workshops#offer");
    if (loc.includes("featured") || loc.includes("spotlight")) return getLiveWebsiteUrl("/workshops#featured");
    if (loc.includes("why join") || loc.includes("benefit")) return getLiveWebsiteUrl("/workshops#why-join");
    if (loc.includes("review") || loc.includes("rating")) return getLiveWebsiteUrl("/workshops#reviews");
    if (loc.includes("about") || loc.includes("studio")) return getLiveWebsiteUrl("/workshops#about-studio");
    if (loc.includes("list") || loc.includes("upcoming") || loc.includes("grid")) return getLiveWebsiteUrl("/workshops#workshop-list");
    return getLiveWebsiteUrl("/workshops");
  }

  // Services page
  if (loc.includes("service")) {
    if (loc.includes("hero") || loc.includes("top")) return getLiveWebsiteUrl("/services#hero");
    if (loc.includes("stat") || loc.includes("number")) return getLiveWebsiteUrl("/services#stats");
    if (loc.includes("button") || loc.includes("trial")) return getLiveWebsiteUrl("/services#explore-programs");
    if (loc.includes("explore")) return getLiveWebsiteUrl("/services#explore-programs");
    return getLiveWebsiteUrl("/services");
  }

  // Programs page
  if (loc.includes("program")) {
    return getLiveWebsiteUrl("/programs#program-list");
  }

  // Gallery
  if (loc.includes("gallery")) {
    return getLiveWebsiteUrl("/gallery");
  }

  // Contact
  if (loc.includes("contact")) {
    return getLiveWebsiteUrl("/contact");
  }

  // Direct path fallback if starts with '/'
  const firstToken = websiteLocation.split(" ")[0];
  if (firstToken.startsWith("/")) {
    return getLiveWebsiteUrl(firstToken);
  }

  return getLiveWebsiteUrl(defaultPath || "/");
}
