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
        title="1. Hero — Right side text"
        description="The main headline, subtitle, button and stats shown in the right panel of the homepage top section."
        websiteLocation="Homepage top → right dark panel"
        defaultOpen
      >
        <div className="space-y-2">
          <Label>Small badge text (small label above the title)</Label>
          <Input value={content.heroBadgeText || content.heroBadge || ""} onChange={(e) => onChange("heroBadgeText", e.target.value)} className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Main headline (large title)</Label>
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
        title="1b. Stats bar (below hero)"
        description="Four big numbers shown between the hero and services section."
        websiteLocation="Homepage → stats strip above services"
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
        title="2. Hero — Left side media grid (9 photos/videos)"
        description="The 3×3 grid of rotating videos and images on the left side of the homepage. Set a type and link for each slot."
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
          <p className="text-xs text-muted-foreground">These videos also play in the other states of the hero animation.</p>
        </div>
      </CMSSection>

      <CMSSection
        title="3. Services section heading"
        description="The title and description shown before the service circles on the homepage. Each service's photo/text is managed in the Homepage Services menu."
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
        description="10 YouTube shorts on the homepage (2 rows × 5). Any empty slots are filled with defaults on the site."
        websiteLocation="Homepage → YouTube Shorts"
      >
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <Input value={content.youtubeChannel || ""} onChange={(e) => onChange("youtubeChannel", e.target.value)} placeholder="@channel handle" className="bg-muted/50" />
          <Input value={content.youtubeChannelUrl || ""} onChange={(e) => onChange("youtubeChannelUrl", e.target.value)} placeholder="https://www.youtube.com/@..." className="bg-muted/50" />
        </div>
        <div className="space-y-2 mb-4">
          <Label>YouTube Channel ID (for Subscribe button)</Label>
          <Input
            value={content.youtubeChannelId || ""}
            onChange={(e) => onChange("youtubeChannelId", e.target.value)}
            placeholder="UCdSmMd0SD9w4SPHfNf1-CAA"
            className="bg-muted/50 font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Required for in-page Subscribe. Find under YouTube → Settings → Advanced, or channel page source. Default works for @garimadanceproductions1146.
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
              hint="Upload an .mp4 video OR paste a YouTube link (watch / shorts / youtu.be). After uploading, make sure to click Save Page Content."
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
        description="The title above the workshop cards. The cards themselves come from the Programs/Workshops admin."
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
        description="10 Instagram reels on the homepage (2 rows × 5). Any empty slots are filled with defaults on the site."
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
              label="Reel video or YouTube link (required)"
              hint="Upload an .mp4 OR paste a link. Save the page after uploading."
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
        title="8. Reviews & testimonials"
        description="Google rating, section title and video review cards. Text review cards are managed in the Student Reviews menu."
        websiteLocation="Homepage → Reviews section"
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
            <MediaUrlField label="YouTube embed URL" value={item.vid || ""} onChange={(vid) => { const n = [...videoTests]; n[i] = { ...n[i], vid }; onChange("videoTestimonials", n); }} placeholder="https://www.youtube.com/embed/..." />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => onChange("videoTestimonials", [...videoTests, { img: "", vid: "" }])}>
          <Plus className="h-4 w-4" /> Add video testimonial
        </Button>
      </CMSSection>

      <CMSSection
        title="9. FAQ section heading"
        description="The FAQ questions themselves are edited from the FAQ Questions menu in the sidebar."
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
        description="The contact section at the bottom of the homepage — left-side title and right-side form heading."
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
