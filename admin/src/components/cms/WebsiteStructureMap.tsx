import { Card } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const WEBSITE_MAP = [
  {
    page: "Homepage (/)",
    slug: "home",
    sections: [
      { name: "Hero text + 9 media grid", edit: "Website Content → Homepage", path: "/cms" },
      { name: "Service circles", edit: "Homepage Services", path: "/services-cms" },
      { name: "YouTube Shorts, Instagram, Reviews", edit: "Website Content → Homepage", path: "/cms" },
      { name: "Workshop cards", edit: "Programs & Workshops admin", path: "/programs" },
      { name: "FAQ questions", edit: "FAQ Questions", path: "/faqs" },
      { name: "Student text reviews", edit: "Student Reviews", path: "/testimonials" },
    ],
  },
  {
    page: "About (/about)",
    slug: "about",
    sections: [{ name: "Story, mission, stats, video", edit: "Website Content → About", path: "/cms" }],
  },
  {
    page: "Services (/services)",
    slug: "services",
    sections: [
      { name: "Page hero text", edit: "Website Content → Services Page", path: "/cms" },
      { name: "Service cards list", edit: "Homepage Services", path: "/services-cms" },
    ],
  },
  {
    page: "Programs (/programs)",
    slug: "programs",
    sections: [
      { name: "Page hero", edit: "Website Content → Programs", path: "/cms" },
      { name: "Program cards", edit: "Programs admin", path: "/programs" },
    ],
  },
  {
    page: "Workshops (/workshops)",
    slug: "workshops",
    sections: [
      { name: "Page hero", edit: "Website Content → Workshops", path: "/cms" },
      { name: "Workshop cards", edit: "Workshops admin", path: "/workshops" },
    ],
  },
  {
    page: "Gallery (/gallery)",
    slug: "gallery",
    sections: [
      { name: "Page header", edit: "Website Content → Gallery", path: "/cms" },
      { name: "Photos & videos grid", edit: "Photos & Videos", path: "/gallery" },
    ],
  },
  {
    page: "Blog (/blog)",
    slug: "blog",
    sections: [
      { name: "Page hero", edit: "Website Content → Blog", path: "/cms" },
      { name: "Blog posts", edit: "Blog admin", path: "/blogs" },
    ],
  },
  {
    page: "FAQ (/faq)",
    slug: "faq",
    sections: [
      { name: "Page hero", edit: "Website Content → FAQ Page", path: "/cms" },
      { name: "Questions & answers", edit: "FAQ Questions", path: "/faqs" },
    ],
  },
  {
    page: "Testimonials (/testimonials)",
    slug: "testimonials",
    sections: [
      { name: "Page hero", edit: "Website Content → Testimonials", path: "/cms" },
      { name: "Review cards", edit: "Student Reviews", path: "/testimonials" },
    ],
  },
  {
    page: "Membership (/membership)",
    slug: "membership",
    sections: [
      { name: "Page hero", edit: "Website Content → Membership", path: "/cms" },
      { name: "Pricing plans", edit: "Membership Plans", path: "/membership-plans" },
    ],
  },
  {
    page: "Contact (/contact)",
    slug: "contact",
    sections: [{ name: "Header, phone, email, address", edit: "Website Content → Contact", path: "/cms" }],
  },
  {
    page: "Header & Footer (sab pages)",
    slug: "settings",
    sections: [
      { name: "Logo, nav links, WhatsApp, announcement", edit: "Site Settings tab", path: "/cms" },
    ],
  },
];

interface Props {
  onSelectSlug?: (slug: string) => void;
}

export function WebsiteStructureMap({ onSelectSlug }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Neeche poori website ka map hai — har section ke saamne likha hai admin mein kahan edit karna hai.
      </p>
      {WEBSITE_MAP.map((page) => (
        <Card key={page.slug} className="p-4 border-border bg-card">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="font-semibold text-foreground">{page.page}</h4>
            {onSelectSlug && page.slug !== "settings" && (
              <button
                type="button"
                onClick={() => onSelectSlug(page.slug)}
                className="text-xs text-primary hover:underline"
              >
                Edit page →
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {page.sections.map((sec) => (
              <li key={sec.name} className="flex flex-wrap items-start gap-2 text-sm">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground">{sec.name}</span>
                <span className="text-muted-foreground">→</span>
                {sec.path.startsWith("/cms") && onSelectSlug && page.slug !== "settings" ? (
                  <button
                    type="button"
                    onClick={() => onSelectSlug(page.slug)}
                    className="text-primary text-xs font-medium hover:underline"
                  >
                    {sec.edit}
                  </button>
                ) : (
                  <Link to={sec.path} className="text-primary text-xs font-medium hover:underline inline-flex items-center gap-1">
                    {sec.edit} <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

export { WEBSITE_MAP };
