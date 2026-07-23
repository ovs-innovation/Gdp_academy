import { API_BASE_URL } from "../lib/apiConfig";
import { cachedFetch } from "../lib/apiCache";

// ================= TYPES =================
export interface CMSContent {
  _id: string;
  key: string;
  section: string;
  title?: string | { en: string; [key: string]: string };
  description?: string | { en: string; [key: string]: string };
  content?: any;
  images?: Array<{ url: string; alt: string; order: number }>;
  videos?: Array<{ url: string; title: string; order: number }>;
  metadata?: {
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
  };
  isActive: boolean;
  publishedAt?: string;
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface SaveCMSData {
  key: string;
  section: string;
  title?: string | object;
  description?: string | object;
  content?: any;
  images?: Array<{ url: string; alt: string; order: number }>;
  videos?: Array<{ url: string; title: string; order: number }>;
  metadata?: {
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
  };
  isActive?: boolean;
}

export interface PageContent {
  _id?: string;
  slug: string;
  title: string;
  content: {
    heroTitle?: string;
    heroSubtitle?: string;
    ctaText?: string;
    aboutShortTitle?: string;
    aboutShortText?: string;
    storyTitle?: string;
    storyText?: string;
    missionTitle?: string;
    missionText?: string;
    headerTitle?: string;
    headerSubtitle?: string;
    address?: string;
    phone?: string;
    email?: string;
    [key: string]: any;
  };
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  status: "published" | "draft" | "archived";
}

export interface SiteSettings {
  _id?: string;
  logoUrl: string;
  navLinks: Array<{ label: string; href: string }>;
  footerLinks?: Array<{ label: string; href: string }>;
  footerServiceLinks?: Array<{ label: string; href: string }>;
  footerText: string;
  footerTagline?: string;
  brandLine1?: string;
  brandLine2?: string;
  brandLine3?: string;
  headerCtaLabel?: string;
  headerCtaUrl?: string;
  socialLinks: Array<{ platform: string; url: string }>;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  whatsappNumber?: string;
  announcementBar?: {
    enabled: boolean;
    text: string;
    buttonLabel: string;
    buttonUrl: string;
    backgroundColor: string;
    textColor: string;
  };
}

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
  status: "published" | "draft" | "archived";
}

export interface GalleryItem {
  _id: string;
  type: "image" | "video";
  url: string;
  caption?: string;
  order: number;
  status: "published" | "draft" | "archived";
}

export interface MembershipPlan {
  _id: string;
  title: string;
  price: number;
  currency: string;
  duration: number;
  durationUnit: "month" | "year";
  features: string[];
  order: number;
  status: "published" | "draft" | "archived";
}

// ================= NEW PUBLIC API IMPLEMENTATIONS =================

export const getPageContentBySlug = async (slug: string): Promise<PageContent> => {
  return cachedFetch(`page:${slug}`, async () => {
    const response = await fetch(`${API_BASE_URL}/page-contents/slug/${slug}`);
    if (!response.ok) {
      throw new Error(`Page content for slug '${slug}' not found`);
    }
    const data = await response.json();
    return data.page;
  });
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  return cachedFetch("site-settings", async () => {
    const response = await fetch(`${API_BASE_URL}/site-settings`);
    if (!response.ok) {
      throw new Error("Failed to fetch site settings");
    }
    const data = await response.json();
    return data.settings;
  });
};

export const getFAQs = async (): Promise<FAQItem[]> => {
  return cachedFetch("faqs:published", async () => {
    const response = await fetch(`${API_BASE_URL}/faqs?status=published`);
    if (!response.ok) {
      throw new Error("Failed to fetch FAQs");
    }
    const data = await response.json();
    return data.faqs;
  });
};

export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/gallery-items?status=published`);
  if (!response.ok) {
    throw new Error("Failed to fetch gallery items");
  }
  const data = await response.json();
  return data.items;
};

export const getMembershipPlans = async (): Promise<MembershipPlan[]> => {
  const response = await fetch(`${API_BASE_URL}/membership-plans?status=published`);
  if (!response.ok) {
    throw new Error("Failed to fetch membership plans");
  }
  const data = await response.json();
  return data.plans || data.membershipPlans || data.faqs || []; // Let's check what key membershipPlanController returns
};

export const submitContactMessage = async (data: {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/contact-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to submit contact message");
  }
  return result;
};

// ================= GET CMS BY KEY =================
export const getCMSByKey = async (key: string): Promise<CMSContent> => {
  const response = await fetch(`${API_BASE_URL}/cms/key/${key}`);

  if (!response.ok) {
    throw new Error("CMS content not found");
  }

  return response.json();
};

// ================= GET CMS BY SECTION =================
export const getCMSBySection = async (
  section: string,
): Promise<CMSContent[]> => {
  return cachedFetch(`cms-section:${section}`, async () => {
    const response = await fetch(`${API_BASE_URL}/cms/section/${section}`);
    if (!response.ok) {
      throw new Error("Failed to fetch CMS content");
    }
    return response.json();
  });
};

// ================= GET ALL CMS (ADMIN) =================
export const getAllCMS = async (
  token: string,
  params?: {
    section?: string;
    page?: number;
    limit?: number;
  },
): Promise<{
  cms: CMSContent[];
  total: number;
  pages: number;
  currentPage: number;
}> => {
  const queryParams = new URLSearchParams();
  if (params?.section) queryParams.append("section", params.section);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/cms?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch CMS content");
  }

  return response.json();
};

// ================= SAVE CMS (ADMIN) =================
export const saveCMS = async (
  token: string,
  data: SaveCMSData,
): Promise<{ message: string; cms: CMSContent }> => {
  const response = await fetch(`${API_BASE_URL}/cms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to save CMS content");
  }

  return result;
};

// ================= DELETE CMS (ADMIN) =================
export const deleteCMS = async (
  token: string,
  id: string,
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/cms/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete CMS content");
  }

  return result;
};
