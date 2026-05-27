import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CMSSection } from "@/components/cms/CMSSection";
import { MediaUrlField } from "@/components/cms/MediaUrlField";
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

  const heroVideosRaw = Array.isArray(content.heroVideos)
    ? content.heroVideos.map((v: unknown) => (typeof v === "string" ? v : (v as { url?: string }).url || "")).join(", ")
    : "";

  return (
    <div className="space-y-4">
      <CMSSection
        title="1. Hero — Right side text (bagal wala text)"
        description="Main headline, subtitle, button aur stats jo homepage ke top section ke right panel me dikhte hain."
        websiteLocation="Homepage top → right dark panel"
        defaultOpen
      >
        <div className="space-y-2">
          <Label>Small badge text (upar wala chota label)</Label>
          <Input value={content.heroBadgeText || content.heroBadge || ""} onChange={(e) => onChange("heroBadgeText", e.target.value)} className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Main headline (bada title)</Label>
          <Input value={content.heroTitle || ""} onChange={(e) => onChange("heroTitle", e.target.value)} className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Subtitle (description)</Label>
          <Textarea value={content.heroSubtitle || ""} onChange={(e) => onChange("heroSubtitle", e.target.value)} className="bg-muted/50 min-h-[80px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Button text</Label>
            <Input value={content.ctaText || ""} onChange={(e) => onChange("ctaText", e.target.value)} className="bg-muted/50" placeholder="GET STARTED" />
          </div>
          <div className="space-y-2">
            <Label>Button link</Label>
            <Input value={content.ctaUrl || "/programs"} onChange={(e) => onChange("ctaUrl", e.target.value)} className="bg-muted/50" placeholder="/programs" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Stats line (comma separated)</Label>
          <Input
            value={content.statistics || content.heroStatistics || ""}
            onChange={(e) => onChange("statistics", e.target.value)}
            className="bg-muted/50"
            placeholder="230+ Students, 10+ Masterclasses, 5+ Styles"
          />
        </div>
      </CMSSection>

      <CMSSection
        title="2. Hero — Left side media grid (9 photos/videos)"
        description="Homepage ke left side par 3×3 grid me jo videos aur images rotate hoti hain. Har slot ke liye type aur link daalein."
        websiteLocation="Homepage top → left video/image collage"
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
        <div className="space-y-2 pt-2 border-t border-border">
          <Label>Extra slideshow videos (comma separated)</Label>
          <Textarea
            value={heroVideosRaw}
            onChange={(e) => {
              const urls = e.target.value.split(",").map((u) => u.trim()).filter(Boolean);
              onChange("heroVideos", urls);
            }}
            className="bg-muted/50 min-h-[60px]"
            placeholder="/hero.mp4, /services.mp4"
          />
          <p className="text-xs text-muted-foreground">Ye videos hero animation ke dusre states me bhi chalti hain.</p>
        </div>
      </CMSSection>

      <CMSSection
        title="3. Services section heading"
        description="Homepage par service circles se pehle jo title aur description dikhta hai. Har service ka photo/text → sidebar Homepage Services."
        websiteLocation="Homepage → Services section header"
      >
        <div className="space-y-2">
          <Label>Section title</Label>
          <Input value={content.servicesTitle || ""} onChange={(e) => onChange("servicesTitle", e.target.value)} className="bg-muted/50" placeholder="Services" />
        </div>
        <div className="space-y-2">
          <Label>Section description</Label>
          <Textarea value={content.servicesSubtitle || ""} onChange={(e) => onChange("servicesSubtitle", e.target.value)} className="bg-muted/50 min-h-[60px]" placeholder="Experience the ultimate dance training ecosystem." />
        </div>
      </CMSSection>

      <CMSSection
        title="4. YouTube Shorts row"
        description="Homepage par horizontal YouTube shorts / reels section."
        websiteLocation="Homepage → YouTube Shorts"
      >
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <Input value={content.youtubeChannel || ""} onChange={(e) => onChange("youtubeChannel", e.target.value)} placeholder="@channel handle" className="bg-muted/50" />
          <Input value={content.youtubeChannelUrl || ""} onChange={(e) => onChange("youtubeChannelUrl", e.target.value)} placeholder="https://youtube.com/@..." className="bg-muted/50" />
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
              hint="Upload .mp4 video OR paste YouTube link (watch / shorts / youtu.be). Upload ke baad Save Page Content zaroor dabayein."
              websiteLocation={`Homepage → YouTube Shorts → card #${i + 1} background video`}
              value={item.vid || ""}
              mediaType="video"
              uploadFolder="gdp-shorts"
              onChange={(vid) => {
                const n = [...shorts];
                n[i] = { ...n[i], vid };
                onChange("youtubeShorts", n);
              }}
            />
            {!item.vid?.trim() && (
              <p className="text-xs text-amber-500">⚠️ Video URL khali hai — website par yeh short nahi dikhega.</p>
            )}
            <Input placeholder="Title" value={item.title || ""} onChange={(e) => { const n = [...shorts]; n[i] = { ...n[i], title: e.target.value }; onChange("youtubeShorts", n); }} className="bg-muted/50" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Views" value={item.views || ""} onChange={(e) => { const n = [...shorts]; n[i] = { ...n[i], views: e.target.value }; onChange("youtubeShorts", n); }} className="bg-muted/50" />
              <Input placeholder="Likes" value={item.likes || ""} onChange={(e) => { const n = [...shorts]; n[i] = { ...n[i], likes: e.target.value }; onChange("youtubeShorts", n); }} className="bg-muted/50" />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => onChange("youtubeShorts", [...shorts, { vid: "", title: "", views: "", likes: "" }])}>
          <Plus className="h-4 w-4" /> Add short
        </Button>
      </CMSSection>

      <CMSSection
        title="5. About preview section"
        description="Video + text block (About section on homepage)."
        websiteLocation="Homepage → About section"
      >
        <div className="space-y-2">
          <Label>Section title</Label>
          <Input value={content.aboutShortTitle || ""} onChange={(e) => onChange("aboutShortTitle", e.target.value)} className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={content.aboutShortText || ""} onChange={(e) => onChange("aboutShortText", e.target.value)} className="bg-muted/50 min-h-[100px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>About YouTube video ID</Label>
            <Input value={content.aboutYoutubeId || ""} onChange={(e) => onChange("aboutYoutubeId", e.target.value)} className="bg-muted/50" placeholder="J-yM5y4Kd04" />
          </div>
          <div className="space-y-2">
            <Label>Hero YouTube video ID</Label>
            <Input value={content.heroYoutubeId || ""} onChange={(e) => onChange("heroYoutubeId", e.target.value)} className="bg-muted/50" placeholder="1phsCpxcBZU" />
          </div>
        </div>
      </CMSSection>

      <CMSSection
        title="6. Workshops section heading"
        description="Workshop cards ke upar title. Cards khud Programs/Workshops admin se aate hain."
        websiteLocation="Homepage → Upcoming Workshops"
      >
        <div className="space-y-2">
          <Label>Section title</Label>
          <Input value={content.workshopsTitle || content.upcomingWorkshopsTitle || ""} onChange={(e) => onChange("workshopsTitle", e.target.value)} className="bg-muted/50" placeholder="UPCOMING WORKSHOPS" />
        </div>
        <div className="space-y-2">
          <Label>Section description</Label>
          <Textarea value={content.workshopsSubtitle || content.upcomingWorkshopsSubtitle || ""} onChange={(e) => onChange("workshopsSubtitle", e.target.value)} className="bg-muted/50 min-h-[60px]" />
        </div>
      </CMSSection>

      <CMSSection
        title="7. Instagram reels"
        description="Instagram style video cards on homepage."
        websiteLocation="Homepage → Instagram section"
      >
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div className="space-y-2">
            <Label>Title line 1</Label>
            <Input value={content.instagramSectionTitle || "Join us"} onChange={(e) => onChange("instagramSectionTitle", e.target.value)} className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label>Title line 2 (gradient)</Label>
            <Input value={content.instagramSectionHighlight || "on Instagram"} onChange={(e) => onChange("instagramSectionHighlight", e.target.value)} className="bg-muted/50" />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <Label>Instagram handle</Label>
          <Input value={content.instagramHandle || ""} onChange={(e) => onChange("instagramHandle", e.target.value)} className="bg-muted/50" placeholder="@GarimadanceProductions" />
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
              label="Reel video or YouTube link (required)"
              hint="Upload .mp4 OR paste link. Save page after upload."
              websiteLocation={`Homepage → Instagram row → reel #${i + 1}`}
              value={item.vid || ""}
              mediaType="video"
              uploadFolder="gdp-instagram"
              onChange={(vid) => { const n = [...instagram]; n[i] = { ...n[i], vid }; onChange("instagramPosts", n); }}
            />
            {!item.vid?.trim() && (
              <p className="text-xs text-amber-500">⚠️ Video URL khali hai — reel nahi dikhegi.</p>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Likes" value={item.likes || ""} onChange={(e) => { const n = [...instagram]; n[i] = { ...n[i], likes: e.target.value }; onChange("instagramPosts", n); }} className="bg-muted/50" />
              <Input placeholder="Comments" value={item.comments || ""} onChange={(e) => { const n = [...instagram]; n[i] = { ...n[i], comments: e.target.value }; onChange("instagramPosts", n); }} className="bg-muted/50" />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => onChange("instagramPosts", [...instagram, { vid: "", likes: "", comments: "" }])}>
          <Plus className="h-4 w-4" /> Add reel
        </Button>
      </CMSSection>

      <CMSSection
        title="8. Reviews & testimonials"
        description="Google rating, section title, video review cards. Text review cards → Student Reviews menu."
        websiteLocation="Homepage → Reviews section"
      >
        <div className="space-y-2 mb-4">
          <Label>Section title (❤️ ke baad wala text)</Label>
          <Input value={content.reviewsSectionTitle || "from Clients"} onChange={(e) => onChange("reviewsSectionTitle", e.target.value)} className="bg-muted/50" />
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
            <MediaUrlField label="YouTube embed URL" value={item.vid || ""} onChange={(vid) => { const n = [...videoTests]; n[i] = { ...n[i], vid }; onChange("videoTestimonials", n); }} placeholder="https://www.youtube.com/embed/..." />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => onChange("videoTestimonials", [...videoTests, { img: "", vid: "" }])}>
          <Plus className="h-4 w-4" /> Add video testimonial
        </Button>
      </CMSSection>

      <CMSSection
        title="9. FAQ section heading"
        description="FAQ ke questions sidebar FAQ Questions se edit hote hain."
        websiteLocation="Homepage → FAQ"
      >
        <div className="space-y-2">
          <Label>FAQ title</Label>
          <Input value={content.faqTitle || ""} onChange={(e) => onChange("faqTitle", e.target.value)} className="bg-muted/50" placeholder="FAQ" />
        </div>
        <div className="space-y-2">
          <Label>FAQ subtitle</Label>
          <Textarea value={content.faqSubtitle || ""} onChange={(e) => onChange("faqSubtitle", e.target.value)} className="bg-muted/50 min-h-[60px]" />
        </div>
      </CMSSection>

      <CMSSection
        title="10. Let's Catch up / Contact"
        description="Homepage ke bottom contact section — left title aur right form heading."
        websiteLocation="Homepage → bottom contact form"
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
