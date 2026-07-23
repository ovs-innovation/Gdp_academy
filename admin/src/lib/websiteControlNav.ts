import type { Permission } from "@/lib/rbac";

export type WebsiteNavId =
  | "overview"
  | "home"
  | "about"
  | "services"
  | "programs"
  | "workshops"
  | "gallery"
  | "blog"
  | "faq"
  | "testimonials"
  | "membership"
  | "contact"
  | "schedule"
  | "live-zoom"
  | "terms"
  | "privacy"
  | "global";

export type PageSlug = Exclude<WebsiteNavId, "overview" | "global">;

export type RelatedLink = {
  label: string;
  description: string;
  to: string;
};

export type WebsiteNavItem = {
  id: WebsiteNavId;
  label: string;
  path?: string;
  hint: string;
  related?: RelatedLink[];
};

export type WebsiteNavGroup = {
  title: string;
  items: WebsiteNavItem[];
};

/** Mirrors public site flow so admins edit in the same order visitors browse. */
export const WEBSITE_NAV_GROUPS: WebsiteNavGroup[] = [
  {
    title: "Start here",
    items: [
      {
        id: "overview",
        label: "Overview",
        hint: "Map of the whole site — where each section is edited",
      },
    ],
  },
  {
    title: "Main pages",
    items: [
      {
        id: "home",
        label: "Homepage",
        path: "/",
        hint: "Hero, media grid, shorts, Instagram, reviews heading",
        related: [
          {
            label: "Service circles",
            description: "Homepage service cards",
            to: "/services-cms",
          },
          {
            label: "Workshop cards",
            description: "Upcoming workshops on home",
            to: "/workshops",
          },
          {
            label: "FAQ answers",
            description: "Questions shown on homepage",
            to: "/faqs",
          },
          {
            label: "Student reviews",
            description: "Text testimonials on homepage",
            to: "/testimonials",
          },
        ],
      },
      {
        id: "about",
        label: "About",
        path: "/about",
        hint: "Story, mission, stats, video, CTA",
      },
      {
        id: "services",
        label: "Services",
        path: "/services",
        hint: "Services page hero text",
        related: [
          {
            label: "Service cards",
            description: "List of services shown on this page",
            to: "/services-cms",
          },
        ],
      },
      {
        id: "programs",
        label: "Programs",
        path: "/programs",
        hint: "Programs page hero",
        related: [
          {
            label: "Program cards",
            description: "Create and edit programs",
            to: "/programs",
          },
        ],
      },
      {
        id: "workshops",
        label: "Workshops",
        path: "/workshops",
        hint: "Landing page steps 1–6",
        related: [
          {
            label: "Workshop cards",
            description: "Dates, prices, images",
            to: "/workshops",
          },
        ],
      },
      {
        id: "gallery",
        label: "Gallery",
        path: "/gallery",
        hint: "Gallery page header",
        related: [
          {
            label: "Photos & videos",
            description: "Media grid items",
            to: "/gallery",
          },
        ],
      },
      {
        id: "blog",
        label: "Blog",
        path: "/blog",
        hint: "Blog page hero",
        related: [
          {
            label: "Blog posts",
            description: "Write and publish articles",
            to: "/blogs",
          },
        ],
      },
      {
        id: "faq",
        label: "FAQ",
        path: "/faq",
        hint: "FAQ page hero",
        related: [
          {
            label: "Questions & answers",
            description: "Manage FAQ list",
            to: "/faqs",
          },
        ],
      },
      {
        id: "testimonials",
        label: "Reviews",
        path: "/testimonials",
        hint: "Reviews page hero",
        related: [
          {
            label: "Review cards",
            description: "Student testimonials",
            to: "/testimonials",
          },
        ],
      },
      {
        id: "membership",
        label: "Membership",
        path: "/membership",
        hint: "Membership page hero",
        related: [
          {
            label: "Pricing plans",
            description: "Membership plan cards",
            to: "/membership-plans",
          },
        ],
      },
      {
        id: "contact",
        label: "Contact",
        path: "/contact",
        hint: "Header, phone, email, address",
      },
    ],
  },
  {
    title: "More pages",
    items: [
      {
        id: "schedule",
        label: "Schedule",
        path: "/schedule",
        hint: "Schedule header and rows",
      },
      {
        id: "live-zoom",
        label: "Live Zoom",
        path: "/live-zoom",
        hint: "Live sessions page content",
      },
    ],
  },
  {
    title: "Legal",
    items: [
      {
        id: "terms",
        label: "Terms",
        path: "/terms",
        hint: "Terms of use sections",
      },
      {
        id: "privacy",
        label: "Privacy",
        path: "/privacy",
        hint: "Privacy policy sections",
      },
    ],
  },
  {
    title: "Site-wide",
    items: [
      {
        id: "global",
        label: "Header & Footer",
        hint: "Logo, nav, WhatsApp, announcement, SEO defaults",
      },
    ],
  },
];

export const findWebsiteNavItem = (id: WebsiteNavId) =>
  WEBSITE_NAV_GROUPS.flatMap((g) => g.items).find((item) => item.id === id);

export const WEBSITE_SIDEBAR_PERMISSION: Permission = "cms.view";
