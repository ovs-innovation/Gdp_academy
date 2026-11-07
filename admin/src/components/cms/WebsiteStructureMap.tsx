import { Card } from "@/components/ui/card";
import { Globe, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface WebsiteMapItem {
  page: string;
  slug: string;
  path: string;
  description: string;
  sections: { name: string; edit: string; path: string; isDirectCMS?: boolean }[];
}

const WEBSITE_MAP: WebsiteMapItem[] = [
  {
    page: "Homepage",
    slug: "home",
    path: "/",
    description: "Main landing page with video banner, highlights, shorts, and testimonials.",
    sections: [
      { name: "Top Hero & Video Media Grid", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
      { name: "Service Highlight Circles", edit: "Services Cards", path: "/services-cms" },
      { name: "YouTube Shorts & Instagram Reels", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
      { name: "Upcoming Workshop Cards", edit: "Programs & Workshops", path: "/programs" },
      { name: "FAQ Questions & Answers", edit: "FAQ Questions", path: "/faqs" },
      { name: "Student Reviews (Google & text)", edit: "Student Reviews", path: "/testimonials" },
    ],
  },
  {
    page: "About Us",
    slug: "about",
    path: "/about",
    description: "Our story, journey, mission, training pillars, and studio facilities.",
    sections: [
      { name: "Story, Mission, Stats & Video", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
      { name: "Core Pillars & Studio Amenities", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
    ],
  },
  {
    page: "Services",
    slug: "services",
    path: "/services",
    description: "Wedding choreography, offline classes, corporate events, and wellness programs.",
    sections: [
      { name: "Page Hero & CTA Button", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
      { name: "Services Cards & Offerings", edit: "Services Cards", path: "/services-cms" },
    ],
  },
  {
    page: "Programs & Classes",
    slug: "programs",
    path: "/programs",
    description: "Curriculum, routine courses, and batch options.",
    sections: [
      { name: "Page Hero Banner", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
      { name: "Dance Programs & Categories", edit: "Programs & Classes", path: "/programs" },
    ],
  },
  {
    page: "Workshops",
    slug: "workshops",
    path: "/workshops",
    description: "Special seasonal masterclasses, guest workshops, and bookings.",
    sections: [
      { name: "Offer Banner, Spotlight & Perks", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
      { name: "Live Workshop Cards (Date & Zoom)", edit: "Upcoming Workshops", path: "/workshops" },
    ],
  },
  {
    page: "Photo & Video Gallery",
    slug: "gallery",
    path: "/gallery",
    description: "Visual portfolio of recitals, student showcases, and performances.",
    sections: [
      { name: "Gallery Hero Banner", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
      { name: "Photos & Videos Uploads", edit: "Photos & Videos", path: "/gallery" },
    ],
  },
  {
    page: "Blog / Journal",
    slug: "blog",
    path: "/blog",
    description: "Dance tutorials, health tips, stories, and dance announcements.",
    sections: [
      { name: "Blog Hero Headline", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
      { name: "Blog Posts & Articles", edit: "Blog Posts", path: "/blogs" },
    ],
  },
  {
    page: "FAQ",
    slug: "faq",
    path: "/faq",
    description: "Answers to common client and student questions.",
    sections: [
      { name: "FAQ Hero & Subtitle", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
      { name: "FAQ Question List", edit: "FAQ Questions", path: "/faqs" },
    ],
  },
  {
    page: "Student Reviews",
    slug: "testimonials",
    path: "/testimonials",
    description: "Parent, student, and couple testimonials.",
    sections: [
      { name: "Testimonials Hero Headline", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
      { name: "Student Reviews Cards", edit: "Student Reviews", path: "/testimonials" },
    ],
  },
  {
    page: "Membership & Pricing",
    slug: "membership",
    path: "/membership",
    description: "Monthly passes, private class packages, and studio memberships.",
    sections: [
      { name: "Membership Hero Headline", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
      { name: "Pricing Plans & Tier Cards", edit: "Membership Plans", path: "/membership-plans" },
    ],
  },
  {
    page: "Contact Us",
    slug: "contact",
    path: "/contact",
    description: "Studio contact info, phone, email, address, and Google maps.",
    sections: [
      { name: "Contact Phone, Email & Address", edit: "Edit in CMS", path: "/cms", isDirectCMS: true },
      { name: "Customer Enquiries (Form Leads)", edit: "Enquiries (Form)", path: "/enquiries" },
    ],
  },
  {
    page: "Header & Footer (Global)",
    slug: "settings",
    path: "Global",
    description: "Logo, navigation menu links, contact numbers, and social links on all pages.",
    sections: [
      { name: "Logo, Phone, WhatsApp & Footer Links", edit: "Global Header & Footer", path: "/cms", isDirectCMS: true },
    ],
  },
];

interface Props {
  onSelectSlug?: (slug: string) => void;
}

export function WebsiteStructureMap({ onSelectSlug }: Props) {
  return (
    <div className="space-y-6">
      {/* Friendly Guide Header */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Website Content Map
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Every section of your website is controlled from here. Click <strong>Edit in CMS</strong> to update
              text, headlines, and videos, or click the card manager to manage dynamic lists (like workshops or review cards).
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/20"
          >
            <Globe className="h-3.5 w-3.5" /> Open Website in New Tab <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Grid of Pages */}
      <div className="grid gap-4 md:grid-cols-2">
        {WEBSITE_MAP.map((item) => (
          <Card key={item.slug} className="border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-3 mb-3">
              <div>
                <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  {item.page}
                  <span className="font-mono text-[11px] font-normal text-muted-foreground">
                    {item.path}
                  </span>
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
              </div>
              {onSelectSlug && (
                <button
                  type="button"
                  onClick={() => onSelectSlug(item.slug)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
                >
                  Edit <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {item.sections.map((sec) => (
                <div
                  key={sec.name}
                  className="flex items-center justify-between gap-2 rounded-lg bg-muted/30 px-2.5 py-1.5 text-xs"
                >
                  <span className="text-foreground/90 font-medium truncate">{sec.name}</span>
                  {sec.isDirectCMS && onSelectSlug ? (
                    <button
                      type="button"
                      onClick={() => onSelectSlug(item.slug)}
                      className="text-primary hover:underline text-[11px] font-semibold shrink-0"
                    >
                      {sec.edit} →
                    </button>
                  ) : (
                    <Link
                      to={sec.path}
                      className="text-primary hover:underline text-[11px] font-semibold shrink-0 inline-flex items-center gap-1"
                    >
                      {sec.edit} <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
