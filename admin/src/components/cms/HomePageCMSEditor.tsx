import { memo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { CMSSection } from "@/components/cms/CMSSection";
import { MediaUrlField } from "@/components/cms/MediaUrlField";
import { YoutubeUrlField } from "@/components/cms/YoutubeUrlField";
import {
  DEFAULT_HERO_GRID,
  HERO_GRID_SLOTS,
  type HeroGridItem,
  type InstagramPostItem,
  type VideoTestimonialItem,
  type YoutubeShortItem,
} from "@/lib/homeCms";

type Content = Record<string, any>;

interface Props {
  content: Content;
  onChange: (field: string, value: unknown) => void;
}

const HOME_SECTIONS = [
  { id: "cms-home-hero", label: "Hero Banner", icon: "🎯" },
  { id: "cms-home-stats", label: "Stats Bar", icon: "📊" },
  { id: "cms-home-grid", label: "9-Media Grid", icon: "🎬" },
  { id: "cms-home-services", label: "Services Intro", icon: "✨" },
  { id: "cms-home-shorts", label: "YouTube Shorts", icon: "📱" },
  { id: "cms-home-about", label: "About GDP", icon: "ℹ️" },
  { id: "cms-home-instagram", label: "Instagram Reels", icon: "📸" },
  { id: "cms-home-testimonials", label: "Student Reviews", icon: "⭐" },
  { id: "cms-home-faq", label: "FAQ Intro", icon: "❓" },
  { id: "cms-home-cta", label: "Bottom CTA", icon: "🚀" },
];

const SelectType = ({
  value,
  onChange,
}: {
  value: "video" | "image";
  onChange: (v: "video" | "image") => void;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as "video" | "image")}
    className="h-9 rounded-md border border-border bg-muted/50 px-2 text-sm"
  >
    <option value="video">Video</option>
    <option value="image">Image</option>
  </select>
);

function HomePageCMSEditorComponent({ content, onChange }: Props) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({ "cms-home-hero": true });

  const toggleSection = (id: string, open: boolean) => {
    setOpenMap((prev) => ({ ...prev, [id]: open }));
  };

  const jumpToSection = (id: string) => {
    setOpenMap((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    HOME_SECTIONS.forEach((s) => (all[s.id] = true));
    setOpenMap(all);
  };

  const collapseAll = () => {
    setOpenMap({});
  };

  const grid: HeroGridItem[] =
    Array.isArray(content.heroGridItems) && content.heroGridItems.length > 0
      ? content.heroGridItems
      : DEFAULT_HERO_GRID;

  const shorts: YoutubeShortItem[] = content.youtubeShorts || content.highlightVideos || [];
  const instagram: InstagramPostItem[] = content.instagramPosts || [];
  const videoTests: VideoTestimonialItem[] = content.videoTestimonials || [];

  const patchGrid = (index: number, patch: Partial<HeroGridItem>) => {
    const next = [...grid];
    next[index] = { ...next[index], ...patch };
    onChange("heroGridItems", next);
  };

  const extraVideos: string[] = Array.isArray(content.heroVideos)
    ? content.heroVideos
        .map((v: unknown) => (typeof v === "string" ? v : (v as { url?: string }).url || ""))
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-4">
      {/* Quick Jump & Structure Toolbar */}
      <div className="rounded-xl border border-border bg-card p-3 shadow-xs space-y-2 sticky top-20 z-10 backdrop-blur-md bg-card/95">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>Jump directly to section:</span>
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={expandAll}
              className="h-7 px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="h-3.5 w-3.5 mr-1" /> Expand All
            </Button>
            <span className="text-border">|</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={collapseAll}
              className="h-7 px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              <ChevronUp className="h-3.5 w-3.5 mr-1" /> Collapse All
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {HOME_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpToSection(s.id)}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary cursor-pointer select-none"
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <CMSSection
        id="cms-home-hero"
        title="Top Hero Banner (Headline & Tagline)"
        description="The main headlines, gradient highlight, subtitle, and badge shown at the top of the homepage."
        websiteLocation="Homepage top → Centered Hero intro"
        isOpen={openMap["cms-home-hero"] ?? false}
        onToggle={(open) => toggleSection("cms-home-hero", open)}
      >
        <div className="space-y-2">
          <Label>Top Tagline / Badge (small label above the headline)</Label>
          <Input value={content.heroBadgeText || content.heroBadge || ""} onChange={(e) => onChange("heroBadgeText", e.target.value)} className="bg-muted/50" placeholder="Welcome to GDP" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Headline Line 1</Label>
            <Input value={content.heroTitleLine1 || ""} onChange={(e) => onChange("heroTitleLine1", e.target.value)} className="bg-muted/50" placeholder="Welcome to" />
          </div>
          <div className="space-y-2">
            <Label>Headline Line 2 (Highlighted Text)</Label>
            <Input value={content.heroTitleLine2 || content.heroTitleHighlight || ""} onChange={(e) => onChange("heroTitleLine2", e.target.value)} className="bg-muted/50" placeholder="Garima Dance" />
          </div>
          <div className="space-y-2">
            <Label>Headline Line 3</Label>
            <Input value={content.heroTitleLine3 || ""} onChange={(e) => onChange("heroTitleLine3", e.target.value)} className="bg-muted/50" placeholder="Productions" />
          </div>
        </div>
        <div className="space-y-2 mt-2">
          <Label>Subtitle / Description</Label>
          <Textarea value={content.heroSubtitle || ""} onChange={(e) => onChange("heroSubtitle", e.target.value)} className="bg-muted/50 min-h-[80px]" />
        </div>
      </CMSSection>

      <CMSSection
        id="cms-home-stats"
        title="Key Highlights & Numbers (Stats Bar)"
        description="The four highlight boxes shown below the hero banner. Keep labels short (2–3 words) so they fit nicely on mobile."
        websiteLocation="Homepage → Hero bottom stats grid"
        isOpen={openMap["cms-home-stats"] ?? false}
        onToggle={(open) => toggleSection("cms-home-stats", open)}
      >
        {(content.homeStats?.length
          ? content.homeStats
          : [
              { value: "250K+", label: "Social Community" },
              { value: "15+", label: "Years of Experience" },
              { value: "700+", label: "Weddings Choreographed" },
              { value: "50K+", label: "Students Trained" },
            ]
        ).map((stat: { value?: string; label?: string }, idx: number) => (
          <div key={idx} className="grid gap-2 md:grid-cols-2">
            <Input
              value={stat.value || ""}
              onChange={(e) => {
                const next = [...(content.homeStats || [
                  { value: "250K+", label: "Social Community" },
                  { value: "15+", label: "Years of Experience" },
                  { value: "700+", label: "Weddings Choreographed" },
                  { value: "50K+", label: "Students Trained" },
                ])];
                next[idx] = { ...next[idx], value: e.target.value };
                onChange("homeStats", next);
              }}
              placeholder="250K+"
              className="bg-muted/50"
            />
            <Input
              value={stat.label || ""}
              onChange={(e) => {
                const next = [...(content.homeStats || [
                  { value: "250K+", label: "Social Community" },
                  { value: "15+", label: "Years of Experience" },
                  { value: "700+", label: "Weddings Choreographed" },
                  { value: "50K+", label: "Students Trained" },
                ])];
                next[idx] = { ...next[idx], label: e.target.value };
                onChange("homeStats", next);
              }}
              placeholder="Social Community"
              className="bg-muted/50"
            />
          </div>
        ))}
      </CMSSection>

      <CMSSection
        id="cms-home-grid"
        title="Visual Media Grid (9 Slots Collage)"
        description="The 3×3 grid of rotating videos and images on the left side of the homepage. Set a type and link for each slot."
        websiteLocation="Homepage top → left video/image collage"
        isOpen={openMap["cms-home-grid"] ?? false}
        onToggle={(open) => toggleSection("cms-home-grid", open)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {HERO_GRID_SLOTS.map((slotLabel, i) => (
            <div key={slotLabel} className="rounded-lg border border-border p-3 space-y-2 bg-muted/20">
              <p className="text-xs font-semibold text-primary">Slot {slotLabel}</p>
              <SelectType value={grid[i]?.type || "video"} onChange={(type) => patchGrid(i, { type })} />
              <MediaUrlField
                value={grid[i]?.url || ""}
                onChange={(url) => patchGrid(i, { url })}
                placeholder={grid[i]?.type === "image" ? "/svc-stage.png" : "/hero.mp4"}
              />
            </div>
          ))}
        </div>
        <div className="space-y-3 pt-2 border-t border-border">
          <Label>Extra slideshow videos</Label>
          <p className="text-xs text-muted-foreground">
            These videos also play in the other states of the hero animation.
          </p>
          {extraVideos.map((url, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <MediaUrlField
                  value={url}
                  onChange={(nextUrl) => {
                    const next = [...extraVideos];
                    next[i] = nextUrl;
                    onChange("heroVideos", next);
                  }}
                  placeholder="/hero.mp4"
                  mediaType="video"
                  uploadFolder="gdp-hero"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-6"
                onClick={() => onChange("heroVideos", extraVideos.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => onChange("heroVideos", [...extraVideos, ""])}
          >
            <Plus className="h-4 w-4" /> Add extra video
          </Button>
        </div>
      </CMSSection>

      <CMSSection
        id="cms-home-services"
        title="Services Section Intro & Heading"
        description="The headline and intro text shown above the service circles on the homepage. Individual service cards are managed in the Services Cards menu."
        websiteLocation="Homepage → Services section header"
        isOpen={openMap["cms-home-services"] ?? false}
        onToggle={(open) => toggleSection("cms-home-services", open)}
      >
        <div className="space-y-2">
          <Label>Section Title</Label>
          <Input value={content.servicesTitle || ""} onChange={(e) => onChange("servicesTitle", e.target.value)} className="bg-muted/50" placeholder="Services" />
        </div>
        <div className="space-y-2">
          <Label>Section Subtitle / Description</Label>
          <Textarea value={content.servicesSubtitle || ""} onChange={(e) => onChange("servicesSubtitle", e.target.value)} className="bg-muted/50 min-h-[60px]" placeholder="Experience the ultimate dance training ecosystem." />
        </div>
      </CMSSection>

      <CMSSection
        id="cms-home-shorts"
        title="YouTube Shorts & Channel Videos"
        description="YouTube shorts carousel on the homepage. Any empty slots are filled with defaults on the live site."
        websiteLocation="Homepage → YouTube Shorts"
        isOpen={openMap["cms-home-shorts"] ?? false}
        onToggle={(open) => toggleSection("cms-home-shorts", open)}
      >
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div className="space-y-2">
            <Label>Channel handle</Label>
            <Input value={content.youtubeChannel || ""} onChange={(e) => onChange("youtubeChannel", e.target.value)} placeholder="@garimadanceproductions1146" className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label>Channel URL</Label>
            <Input value={content.youtubeChannelUrl || ""} onChange={(e) => onChange("youtubeChannelUrl", e.target.value)} placeholder="https://www.youtube.com/@..." className="bg-muted/50" />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <Label>Channel ID (Subscribe button only)</Label>
          <Input
            value={content.youtubeChannelId || ""}
            onChange={(e) => onChange("youtubeChannelId", e.target.value)}
            placeholder="UCdSmMd0SD9w4SPHfNf1-CAA"
            className="bg-muted/50 font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Only needed for the in-page Subscribe button. YouTube → Settings → Advanced. Leave blank to keep the default channel.
          </p>
        </div>
        {shorts.map((item, i) => (
          <div key={i} className="rounded-lg border border-border p-3 space-y-2 mb-3 bg-muted/20">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">Short #{i + 1}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => onChange("youtubeShorts", shorts.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <MediaUrlField
              label="Video file or YouTube link (required)"
              hint="Upload an .mp4 OR paste a full YouTube link (watch / Shorts / youtu.be). Then click Save Page Content."
              websiteLocation={`Homepage → YouTube Shorts → card #${i + 1} background video`}
              value={item.vid || ""}
              mediaType="video"
              uploadFolder="gdp-shorts"
              placeholder="https://www.youtube.com/watch?v=... or /uploads/..."
              onChange={(vid) => {
                const n = [...shorts];
                n[i] = { ...n[i], vid };
                onChange("youtubeShorts", n);
              }}
            />
            {!item.vid?.trim() && (
              <p className="text-xs text-amber-500">Video URL is empty — this short will not appear on the website.</p>
            )}
            <Input placeholder="Title" value={item.title || ""} onChange={(e) => { const n = [...shorts]; n[i] = { ...n[i], title: e.target.value }; onChange("youtubeShorts", n); }} className="bg-muted/50" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Views" value={item.views || ""} onChange={(e) => { const n = [...shorts]; n[i] = { ...n[i], views: e.target.value }; onChange("youtubeShorts", n); }} className="bg-muted/50" />
              <Input placeholder="Likes" value={item.likes || ""} onChange={(e) => { const n = [...shorts]; n[i] = { ...n[i], likes: e.target.value }; onChange("youtubeShorts", n); }} className="bg-muted/50" />
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => onChange("youtubeShorts", [...shorts, { vid: "", title: "", views: "", likes: "" }])}>
            <Plus className="h-4 w-4" /> Add short
          </Button>
          {shorts.length < 10 && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                const extra = Array.from({ length: 10 - shorts.length }, () => ({ vid: "", title: "", views: "", likes: "" }));
                onChange("youtubeShorts", [...shorts, ...extra]);
              }}
            >
              Fill to 10 slots
            </Button>
          )}
        </div>
      </CMSSection>

      <CMSSection
        id="cms-home-about"
        title="About Us (Homepage Preview & Video)"
        description="Video + intro text block about Garima Dance Productions shown on the homepage."
        websiteLocation="Homepage → About section"
        isOpen={openMap["cms-home-about"] ?? false}
        onToggle={(open) => toggleSection("cms-home-about", open)}
      >
        <div className="space-y-2">
          <Label>Section Title</Label>
          <Input value={content.aboutShortTitle || ""} onChange={(e) => onChange("aboutShortTitle", e.target.value)} className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={content.aboutShortText || ""} onChange={(e) => onChange("aboutShortText", e.target.value)} className="bg-muted/50 min-h-[100px]" />
        </div>
        <YoutubeUrlField
          label="About section YouTube video"
          hint="Paste the full YouTube link. This plays in the homepage About block (video + text)."
          websiteLocation="Homepage → About section video"
          value={content.aboutYoutubeId || ""}
          onChange={(url) => onChange("aboutYoutubeId", url)}
        />
      </CMSSection>

      <CMSSection
        id="cms-home-instagram"
        title="Instagram Reels & Social Showcase"
        description="Instagram reels showcase on the homepage. Only reels configured here appear on the site."
        websiteLocation="Homepage → Instagram section"
        isOpen={openMap["cms-home-instagram"] ?? false}
        onToggle={(open) => toggleSection("cms-home-instagram", open)}
      >
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div className="space-y-2">
            <Label>Title line 1</Label>
            <Input value={content.instagramSectionTitle || "Join us"} onChange={(e) => onChange("instagramSectionTitle", e.target.value)} className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label>Title line 2 (gradient highlight)</Label>
            <Input value={content.instagramSectionHighlight || "on Instagram"} onChange={(e) => onChange("instagramSectionHighlight", e.target.value)} className="bg-muted/50" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div className="space-y-2">
            <Label>Instagram handle</Label>
            <Input value={content.instagramHandle || ""} onChange={(e) => onChange("instagramHandle", e.target.value)} className="bg-muted/50" placeholder="@GarimadanceProductions" />
          </div>
          <div className="space-y-2">
            <Label>Instagram profile URL</Label>
            <Input value={content.instagramChannelUrl || ""} onChange={(e) => onChange("instagramChannelUrl", e.target.value)} className="bg-muted/50" placeholder="https://www.instagram.com/..." />
          </div>
        </div>
        {instagram.map((item, i) => (
          <div key={i} className="rounded-lg border border-border p-3 space-y-2 mb-3 bg-muted/20">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">Reel #{i + 1}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => onChange("instagramPosts", instagram.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <MediaUrlField
              label="Reel video or Instagram / YouTube link (required)"
              hint="Upload an .mp4 OR paste a reel/YouTube link. Save the page after uploading."
              websiteLocation={`Homepage → Instagram row → reel #${i + 1}`}
              value={item.vid || ""}
              mediaType="video"
              uploadFolder="gdp-instagram"
              onChange={(vid) => { const n = [...instagram]; n[i] = { ...n[i], vid }; onChange("instagramPosts", n); }}
            />
            {!item.vid?.trim() && (
              <p className="text-xs text-amber-500">Video URL is empty — this reel will not appear.</p>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Likes" value={item.likes || ""} onChange={(e) => { const n = [...instagram]; n[i] = { ...n[i], likes: e.target.value }; onChange("instagramPosts", n); }} className="bg-muted/50" />
              <Input placeholder="Comments" value={item.comments || ""} onChange={(e) => { const n = [...instagram]; n[i] = { ...n[i], comments: e.target.value }; onChange("instagramPosts", n); }} className="bg-muted/50" />
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => onChange("instagramPosts", [...instagram, { vid: "", likes: "", comments: "" }])}>
            <Plus className="h-4 w-4" /> Add reel
          </Button>
          {instagram.length < 10 && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                const extra = Array.from({ length: 10 - instagram.length }, () => ({ vid: "", likes: "", comments: "" }));
                onChange("instagramPosts", [...instagram, ...extra]);
              }}
            >
              Fill to 10 slots
            </Button>
          )}
        </div>
      </CMSSection>

      <CMSSection
        id="cms-home-testimonials"
        title="Student Reviews & Video Testimonials"
        description="Google rating, section headline, and video review cards. Written reviews are managed in the Student Reviews menu."
        websiteLocation="Homepage → Reviews section"
        isOpen={openMap["cms-home-testimonials"] ?? false}
        onToggle={(open) => toggleSection("cms-home-testimonials", open)}
      >
        <div className="space-y-2 mb-4">
          <Label>Section title (text after the heart icon)</Label>
          <Input value={content.reviewsSectionTitle || "Clients"} onChange={(e) => onChange("reviewsSectionTitle", e.target.value)} className="bg-muted/50" />
          <Label>Title prefix</Label>
          <Input value={content.reviewsTitlePrefix || "From Our"} onChange={(e) => onChange("reviewsTitlePrefix", e.target.value)} className="bg-muted/50" />
          <Label>Badge text</Label>
          <Input value={content.reviewsBadge || "Our Community"} onChange={(e) => onChange("reviewsBadge", e.target.value)} className="bg-muted/50" />
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          <Input placeholder="Rating e.g. 5.0" value={content.googleRating || "5.0"} onChange={(e) => onChange("googleRating", e.target.value)} className="bg-muted/50" />
          <Input placeholder="Review count e.g. 236" value={content.googleReviewCount || ""} onChange={(e) => onChange("googleReviewCount", e.target.value)} className="bg-muted/50" />
          <Input placeholder="Section subtitle" value={content.testimonialsSubtitle || ""} onChange={(e) => onChange("testimonialsSubtitle", e.target.value)} className="bg-muted/50" />
        </div>
        {videoTests.map((item, i) => (
          <div key={i} className="rounded-lg border border-border p-3 space-y-2 mb-3 bg-muted/20">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">Video #{i + 1}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => onChange("videoTestimonials", videoTests.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <MediaUrlField label="Thumbnail image" value={item.img || ""} onChange={(img) => { const n = [...videoTests]; n[i] = { ...n[i], img }; onChange("videoTestimonials", n); }} />
            <YoutubeUrlField
              label="YouTube video"
              hint="Paste a full YouTube link — watch, Shorts, or youtu.be."
              value={item.vid || ""}
              onChange={(vid) => { const n = [...videoTests]; n[i] = { ...n[i], vid }; onChange("videoTestimonials", n); }}
            />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => onChange("videoTestimonials", [...videoTests, { img: "", vid: "" }])}>
          <Plus className="h-4 w-4" /> Add video testimonial
        </Button>
      </CMSSection>

      <CMSSection
        id="cms-home-faq"
        title="FAQ Section Heading"
        description="The header and intro text for FAQ. Individual FAQ questions are managed in the FAQ Questions menu in the sidebar."
        websiteLocation="Homepage → FAQ"
        isOpen={openMap["cms-home-faq"] ?? false}
        onToggle={(open) => toggleSection("cms-home-faq", open)}
      >
        <div className="space-y-2">
          <Label>FAQ Section Title</Label>
          <Input value={content.faqTitle || ""} onChange={(e) => onChange("faqTitle", e.target.value)} className="bg-muted/50" placeholder="FAQ" />
        </div>
        <div className="space-y-2">
          <Label>FAQ Section Subtitle</Label>
          <Textarea value={content.faqSubtitle || ""} onChange={(e) => onChange("faqSubtitle", e.target.value)} className="bg-muted/50 min-h-[60px]" />
        </div>
      </CMSSection>

      <CMSSection
        id="cms-home-cta"
        title="Bottom Contact & Enquiry Section"
        description="The contact section at the bottom of the homepage — left-side heading and right-side form prompt."
        websiteLocation="Homepage → bottom contact form"
        isOpen={openMap["cms-home-cta"] ?? false}
        onToggle={(open) => toggleSection("cms-home-cta", open)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title line 1</Label>
            <Input value={content.contactSectionTitle || "Let's"} onChange={(e) => onChange("contactSectionTitle", e.target.value)} className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label>Title line 2 (gradient text)</Label>
            <Input value={content.contactSectionHighlight || "Catch up?"} onChange={(e) => onChange("contactSectionHighlight", e.target.value)} className="bg-muted/50" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={content.contactSectionText || ""} onChange={(e) => onChange("contactSectionText", e.target.value)} className="bg-muted/50 min-h-[60px]" />
        </div>
        <div className="space-y-2">
          <Label>Form heading (right side)</Label>
          <Input value={content.contactFormTitle || "Or let us reach you!"} onChange={(e) => onChange("contactFormTitle", e.target.value)} className="bg-muted/50" />
        </div>
      </CMSSection>
    </div>
  );
}

export const HomePageCMSEditor = memo(HomePageCMSEditorComponent);
