import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { CMSSection } from "@/components/cms/CMSSection";
import { MediaUrlField } from "@/components/cms/MediaUrlField";
import {
  DEFAULT_WORKSHOPS_PAGE,
  mergeWorkshopsPageContent,
  type WorkshopStat,
  type WorkshopTestimonial,
  type WorkshopValueBlock,
  type WorkshopsPageContent,
} from "@/lib/workshopsPageCms";

type Content = Record<string, unknown>;

interface Props {
  content: Content;
  onChange: (field: string, value: unknown) => void;
}

const lines = (v: unknown, fallback: string[]) => {
  if (Array.isArray(v)) return (v as string[]).join("\n");
  if (typeof v === "string") return v;
  return fallback.join("\n");
};

export function WorkshopsPageCMSEditor({ content, onChange }: Props) {
  const c = mergeWorkshopsPageContent(content) as WorkshopsPageContent;
  const d = DEFAULT_WORKSHOPS_PAGE;

  const patchValueBlock = (index: number, patch: Partial<WorkshopValueBlock>) => {
    const next = [...c.valueBlocks];
    next[index] = { ...next[index], ...patch };
    onChange("valueBlocks", next);
  };

  const addValueBlock = () => {
    onChange("valueBlocks", [...c.valueBlocks, { eyebrow: "New benefit", title: "Headline here" }]);
  };

  const removeValueBlock = (index: number) => {
    onChange(
      "valueBlocks",
      c.valueBlocks.filter((_, i) => i !== index),
    );
  };

  const patchTestimonial = (index: number, patch: Partial<WorkshopTestimonial>) => {
    const next = [...c.testimonials];
    next[index] = { ...next[index], ...patch };
    onChange("testimonials", next);
  };

  const addTestimonial = () => {
    onChange("testimonials", [
      ...c.testimonials,
      { name: "Student name", role: "GDP Student", quote: "Write their review here." },
    ]);
  };

  const removeTestimonial = (index: number) => {
    onChange(
      "testimonials",
      c.testimonials.filter((_, i) => i !== index),
    );
  };

  const patchStat = (index: number, patch: Partial<WorkshopStat>) => {
    const next = [...c.aboutStats];
    next[index] = { ...next[index], ...patch };
    onChange("aboutStats", next);
  };

  const addStat = () => {
    onChange("aboutStats", [...c.aboutStats, { value: "100+", label: "Label" }]);
  };

  const removeStat = (index: number) => {
    onChange(
      "aboutStats",
      c.aboutStats.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm space-y-2">
        <p className="font-semibold text-foreground">How to manage the Workshops page</p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
          <li>
            <strong className="text-foreground">Steps 1–5 below</strong> — landing page text, images, prices & reviews
            (this screen).
          </li>
          <li>
            <strong className="text-foreground">Step 6</strong> — heading above the workshop cards list.
          </li>
          <li>
            <strong className="text-foreground">Workshop cards</strong> — add/edit live workshops in{" "}
            <Link to="/workshops" className="text-primary underline inline-flex items-center gap-1">
              Workshops admin <ExternalLink className="h-3 w-3" />
            </Link>
            (date, time, price, banner, Zoom link).
          </li>
        </ol>
        <p className="text-xs text-muted-foreground">Save this page after editing. Changes appear on /workshops within a few seconds.</p>
      </div>

      <CMSSection
        title="1. Offer banner"
        description="Sticky strip at the top of the workshops page. Leave text empty to hide the banner."
        websiteLocation="/workshops → top gradient bar"
        defaultOpen
      >
        <div className="space-y-2">
          <Label>Banner text</Label>
          <Input
            value={c.offerBannerText}
            onChange={(e) => onChange("offerBannerText", e.target.value)}
            className="bg-muted/50"
            placeholder={d.offerBannerText}
          />
        </div>
        <div className="flex items-center justify-between gap-4 pt-2">
          <div>
            <Label htmlFor="showCountdown">Show countdown timer in banner</Label>
            <p className="text-xs text-muted-foreground mt-1">
              If end date is empty, a 3-day rolling timer is used.
            </p>
          </div>
          <Switch
            id="showCountdown"
            checked={c.showCountdown}
            onCheckedChange={(v) => onChange("showCountdown", v)}
          />
        </div>
        <div className="space-y-2">
          <Label>Countdown end (optional)</Label>
          <Input
            value={c.countdownEnd}
            onChange={(e) => onChange("countdownEnd", e.target.value)}
            className="bg-muted/50 font-mono text-xs"
            placeholder="2026-12-31T18:30:00"
          />
        </div>
      </CMSSection>

      <CMSSection
        title="2. Featured workshop"
        description="Main spotlight card — image, title, perks, price and book button."
        websiteLocation="/workshops → large featured card"
        defaultOpen
      >
        <div className="space-y-2">
          <Label>Small label above title</Label>
          <Input
            value={c.featuredLabel}
            onChange={(e) => onChange("featuredLabel", e.target.value)}
            className="bg-muted/50"
            placeholder={d.featuredLabel}
          />
        </div>
        <div className="space-y-2">
          <Label>Workshop title</Label>
          <Input
            value={c.featuredTitle}
            onChange={(e) => onChange("featuredTitle", e.target.value)}
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Badges (one per line)</Label>
          <Textarea
            value={lines(c.featuredBadges, d.featuredBadges)}
            onChange={(e) =>
              onChange(
                "featuredBadges",
                e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
              )
            }
            className="bg-muted/50 min-h-[80px]"
            placeholder={"Lifetime Access\nCourse Certificate\nLive Sessions"}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={c.featuredDescription}
            onChange={(e) => onChange("featuredDescription", e.target.value)}
            className="bg-muted/50 min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label>What&apos;s included (one perk per line)</Label>
          <Textarea
            value={lines(c.featuredPerks, d.featuredPerks)}
            onChange={(e) =>
              onChange(
                "featuredPerks",
                e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
              )
            }
            className="bg-muted/50 min-h-[120px]"
          />
        </div>
        <MediaUrlField
          label="Featured image"
          websiteLocation="/workshops → featured card image"
          value={c.featuredImage}
          onChange={(url) => onChange("featuredImage", url)}
          mediaType="image"
        />
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Sale price</Label>
            <Input
              value={c.featuredPrice}
              onChange={(e) => onChange("featuredPrice", e.target.value)}
              className="bg-muted/50"
              placeholder="₹999"
            />
          </div>
          <div className="space-y-2">
            <Label>Original price (strikethrough)</Label>
            <Input
              value={c.featuredOriginalPrice}
              onChange={(e) => onChange("featuredOriginalPrice", e.target.value)}
              className="bg-muted/50"
              placeholder="₹1,999"
            />
          </div>
          <div className="space-y-2">
            <Label>Discount badge</Label>
            <Input
              value={c.featuredDiscount}
              onChange={(e) => onChange("featuredDiscount", e.target.value)}
              className="bg-muted/50"
              placeholder="50%"
            />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Button text</Label>
            <Input
              value={c.ctaText}
              onChange={(e) => onChange("ctaText", e.target.value)}
              className="bg-muted/50"
              placeholder="BUY NOW"
            />
          </div>
          <div className="space-y-2">
            <Label>Button link</Label>
            <Input
              value={c.ctaLink}
              onChange={(e) => onChange("ctaLink", e.target.value)}
              className="bg-muted/50"
              placeholder="/contact?source=workshop-featured"
            />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3 pt-2 border-t border-border">
          <div className="space-y-2">
            <Label>Star rating (e.g. 5.0)</Label>
            <Input
              value={c.socialProofStars}
              onChange={(e) => onChange("socialProofStars", e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Reviews line</Label>
            <Input
              value={c.socialProofReviews}
              onChange={(e) => onChange("socialProofReviews", e.target.value)}
              className="bg-muted/50"
              placeholder="500+ Verified Reviews"
            />
          </div>
          <div className="space-y-2">
            <Label>Trusted by line</Label>
            <Input
              value={c.trustedByText}
              onChange={(e) => onChange("trustedByText", e.target.value)}
              className="bg-muted/50"
            />
          </div>
        </div>
      </CMSSection>

      <CMSSection
        title="3. Why join section"
        description="Section heading plus benefit cards shown in a grid."
        websiteLocation="/workshops → why join grid"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Section title</Label>
            <Input
              value={c.valuesSectionTitle}
              onChange={(e) => onChange("valuesSectionTitle", e.target.value)}
              className="bg-muted/50"
              placeholder="Why join"
            />
          </div>
          <div className="space-y-2">
            <Label>Highlighted words (gradient)</Label>
            <Input
              value={c.valuesSectionHighlight}
              onChange={(e) => onChange("valuesSectionHighlight", e.target.value)}
              className="bg-muted/50"
              placeholder="GDP workshops"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label>Benefit cards</Label>
            <Button type="button" variant="outline" size="sm" onClick={addValueBlock} className="gap-1">
              <Plus className="h-4 w-4" /> Add card
            </Button>
          </div>
          {c.valueBlocks.map((block, i) => (
            <div key={`vb-${i}`} className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">Card {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeValueBlock(i)}
                  disabled={c.valueBlocks.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={block.eyebrow}
                onChange={(e) => patchValueBlock(i, { eyebrow: e.target.value })}
                className="bg-muted/50"
                placeholder="Small line on top"
              />
              <Input
                value={block.title}
                onChange={(e) => patchValueBlock(i, { title: e.target.value })}
                className="bg-muted/50"
                placeholder="Big headline"
              />
            </div>
          ))}
        </div>
      </CMSSection>

      <CMSSection
        title="4. Student reviews"
        description="Review section heading and individual quote cards."
        websiteLocation="/workshops → reviews grid"
      >
        <div className="space-y-2">
          <Label>Small label</Label>
          <Input
            value={c.testimonialsSubheading}
            onChange={(e) => onChange("testimonialsSubheading", e.target.value)}
            className="bg-muted/50"
            placeholder="REVIEWS"
          />
        </div>
        <div className="space-y-2">
          <Label>Main heading</Label>
          <Input
            value={c.testimonialsHeading}
            onChange={(e) => onChange("testimonialsHeading", e.target.value)}
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Subtitle under heading</Label>
          <Input
            value={c.trustTitle}
            onChange={(e) => onChange("trustTitle", e.target.value)}
            className="bg-muted/50"
            placeholder="Why trust us?"
          />
        </div>

        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <Label>Review cards</Label>
            <Button type="button" variant="outline" size="sm" onClick={addTestimonial} className="gap-1">
              <Plus className="h-4 w-4" /> Add review
            </Button>
          </div>
          {c.testimonials.map((t, i) => (
            <div key={`t-${i}-${t.name}`} className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">Review {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeTestimonial(i)}
                  disabled={c.testimonials.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={t.quote}
                onChange={(e) => patchTestimonial(i, { quote: e.target.value })}
                className="bg-muted/50 min-h-[70px]"
                placeholder="Quote"
              />
              <div className="grid gap-2 md:grid-cols-2">
                <Input
                  value={t.name}
                  onChange={(e) => patchTestimonial(i, { name: e.target.value })}
                  className="bg-muted/50"
                  placeholder="Name"
                />
                <Input
                  value={t.role}
                  onChange={(e) => patchTestimonial(i, { role: e.target.value })}
                  className="bg-muted/50"
                  placeholder="Role (e.g. Wedding Client)"
                />
              </div>
            </div>
          ))}
        </div>
      </CMSSection>

      <CMSSection
        title="5. About studio"
        description="Studio info block and stat numbers at the bottom of the landing."
        websiteLocation="/workshops → about section"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Small label</Label>
            <Input
              value={c.aboutLabel}
              onChange={(e) => onChange("aboutLabel", e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Section title</Label>
            <Input
              value={c.aboutTitle}
              onChange={(e) => onChange("aboutTitle", e.target.value)}
              className="bg-muted/50"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Institute name (shown in tags area)</Label>
          <Input
            value={c.instituteName}
            onChange={(e) => onChange("instituteName", e.target.value)}
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Tags (one per line)</Label>
          <Textarea
            value={lines(c.instituteTags, d.instituteTags)}
            onChange={(e) =>
              onChange(
                "instituteTags",
                e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
              )
            }
            className="bg-muted/50 min-h-[80px]"
          />
        </div>
        <div className="space-y-2">
          <Label>About paragraph</Label>
          <Textarea
            value={c.aboutText}
            onChange={(e) => onChange("aboutText", e.target.value)}
            className="bg-muted/50 min-h-[100px]"
          />
        </div>

        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <Label>Stats (number + label)</Label>
            <Button type="button" variant="outline" size="sm" onClick={addStat} className="gap-1">
              <Plus className="h-4 w-4" /> Add stat
            </Button>
          </div>
          {c.aboutStats.map((stat, i) => (
            <div key={`stat-${i}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto] items-end">
              <div className="space-y-1">
                <Label className="text-xs">Number</Label>
                <Input
                  value={stat.value}
                  onChange={(e) => patchStat(i, { value: e.target.value })}
                  className="bg-muted/50"
                  placeholder="15+"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Label</Label>
                <Input
                  value={stat.label}
                  onChange={(e) => patchStat(i, { label: e.target.value })}
                  className="bg-muted/50"
                  placeholder="Years"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive mb-0.5"
                onClick={() => removeStat(i)}
                disabled={c.aboutStats.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CMSSection>

      <CMSSection
        title="6. Upcoming workshops list"
        description="Heading above the dynamic workshop cards (cards are managed in Workshops admin)."
        websiteLocation="/workshops → bottom grid"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>List title</Label>
            <Input
              value={c.listSectionTitle}
              onChange={(e) => onChange("listSectionTitle", e.target.value)}
              className="bg-muted/50"
              placeholder="Upcoming"
            />
          </div>
          <div className="space-y-2">
            <Label>Highlighted word</Label>
            <Input
              value={c.listSectionHighlight}
              onChange={(e) => onChange("listSectionHighlight", e.target.value)}
              className="bg-muted/50"
              placeholder="Workshops"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input
            value={c.listSectionSubtitle}
            onChange={(e) => onChange("listSectionSubtitle", e.target.value)}
            className="bg-muted/50"
          />
        </div>
        <Button asChild variant="secondary" className="mt-2 gap-2">
          <Link to="/workshops">
            Manage workshop cards <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </CMSSection>
    </div>
  );
}
