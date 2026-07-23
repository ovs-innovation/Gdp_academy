import { Card } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const WEBSITE_MAP = [
  {
    page: "Homepage (/)",
    slug: "home",
    sections: [
      { name: "Hero text + 9 media grid", edit: "Website Control → Homepage", path: "/cms" },
      { name: "Service circles", edit: "Website → Service Cards", path: "/services-cms" },
      { name: "YouTube Shorts, Instagram, Reviews", edit: "Website Control → Homepage", path: "/cms" },
      { name: "Workshop cards", edit: "Programs & Workshops admin", path: "/programs" },
      { name: "FAQ questions", edit: "Website → FAQ Questions", path: "/faqs" },
      { name: "Student text reviews", edit: "Website → Student Reviews", path: "/testimonials" },
    ],
  },
  {
    page: "About (/about)",
    slug: "about",
    sections: [{ name: "Story, mission, stats, video", edit: "Website Control → About", path: "/cms" }],
  },
  {
    page: "Services (/services)",
    slug: "services",
    sections: [
      { name: "Page hero text", edit: "Website Control → Services", path: "/cms" },
      { name: "Service cards list", edit: "Website → Service Cards", path: "/services-cms" },
    ],
  },
  {
    page: "Programs (/programs)",
    slug: "programs",
    sections: [
      { name: "Page hero", edit: "Website Control → Programs", path: "/cms" },
      { name: "Program cards", edit: "Programs admin", path: "/programs" },
    ],
  },
  {
    page: "Workshops (/workshops)",
    slug: "workshops",
    sections: [
      { name: "Step 1–5: Offer, featured, benefits, reviews, about", edit: "Website Control → Workshops", path: "/cms" },
      { name: "Step 6: Upcoming list heading", edit: "Website Control → Workshops", path: "/cms" },
      { name: "Workshop cards (date, price, image)", edit: "Workshops admin", path: "/workshops" },
    ],
  },
  {
    page: "Gallery (/gallery)",
    slug: "gallery",
    sections: [
      { name: "Page header", edit: "Website Control → Gallery", path: "/cms" },
      { name: "Photos & videos grid", edit: "Website → Photos & Videos", path: "/gallery" },
    ],
  },
  {
    page: "Blog (/blog)",
    slug: "blog",
    sections: [
      { name: "Page hero", edit: "Website Control → Blog", path: "/cms" },
      { name: "Blog posts", edit: "Website → Blog Posts", path: "/blogs" },
    ],
  },
  {
    page: "FAQ (/faq)",
    slug: "faq",
    sections: [
      { name: "Page hero", edit: "Website Control → FAQ", path: "/cms" },
      { name: "Questions & answers", edit: "Website → FAQ Questions", path: "/faqs" },
    ],
  },
  {
    page: "Testimonials (/testimonials)",
    slug: "testimonials",
    sections: [
      { name: "Page hero", edit: "Website Control → Reviews", path: "/cms" },
      { name: "Review cards", edit: "Website → Student Reviews", path: "/testimonials" },
    ],
  },
  {
    page: "Membership (/membership)",
    slug: "membership",
    sections: [
      { name: "Page hero", edit: "Website Control → Membership", path: "/cms" },
      { name: "Pricing plans", edit: "Website → Membership Plans", path: "/membership-plans" },
    ],
  },
  {
    page: "Contact (/contact)",
    slug: "contact",
    sections: [{ name: "Header, phone, email, address", edit: "Website Control → Contact", path: "/cms" }],
  },
  {
    page: "Header & Footer (all pages)",
    slug: "settings",
    sections: [
      { name: "Logo, nav links, WhatsApp, announcement", edit: "Website Control → Header & Footer", path: "/cms" },
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
        Below is a map of the entire website — each section shows where to edit it in the admin panel.
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
