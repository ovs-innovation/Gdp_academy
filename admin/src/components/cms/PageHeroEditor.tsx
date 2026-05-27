import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CMSSection } from "@/components/cms/CMSSection";
import { MediaUrlField } from "@/components/cms/MediaUrlField";

type Content = Record<string, unknown>;

interface PageHeroEditorProps {
  content: Content;
  onChange: (field: string, value: unknown) => void;
  websiteLocation: string;
  /** Use 3-line hero (Programs/Services style) */
  multiLineTitle?: boolean;
  /** Use split title with gradient highlight (Workshops/FAQ style) */
  splitTitle?: boolean;
  showBadge?: boolean;
  showCta?: boolean;
  showBackground?: boolean;
}

export function PageHeroEditor({
  content,
  onChange,
  websiteLocation,
  multiLineTitle = false,
  splitTitle = false,
  showBadge = false,
  showCta = false,
  showBackground = false,
}: PageHeroEditorProps) {
  return (
    <CMSSection
      title="Page Hero / Top Section"
      description="Website ke top par jo bada title aur subtitle dikhta hai — wahi yahan se edit hoga."
      websiteLocation={websiteLocation}
      defaultOpen
    >
      {showBadge && (
        <div className="space-y-2">
          <Label>Small label (upar wala chota text)</Label>
          <Input
            value={(content.heroBadge as string) || (content.heroLabel as string) || ""}
            onChange={(e) => onChange("heroBadge", e.target.value)}
            className="bg-muted/50"
            placeholder="GDP ACADEMY PROGRAMS"
          />
        </div>
      )}

      {multiLineTitle ? (
        <div className="grid gap-3 md:grid-cols-3">
          {(["heroTitleLine1", "heroTitleLine2", "heroTitleLine3"] as const).map((key, i) => (
            <div key={key} className="space-y-2">
              <Label>Title line {i + 1}</Label>
              <Input
                value={(content[key] as string) || ""}
                onChange={(e) => onChange(key, e.target.value)}
                className="bg-muted/50"
                placeholder={["LEARN.", "PERFORM.", "EVOLVE."][i]}
              />
            </div>
          ))}
        </div>
      ) : splitTitle ? (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title (pehla part)</Label>
            <Input
              value={(content.heroTitleBefore as string) || ""}
              onChange={(e) => onChange("heroTitleBefore", e.target.value)}
              className="bg-muted/50"
              placeholder="MASTER"
            />
          </div>
          <div className="space-y-2">
            <Label>Title highlight (gradient color wala part)</Label>
            <Input
              value={(content.heroTitleHighlight as string) || ""}
              onChange={(e) => onChange("heroTitleHighlight", e.target.value)}
              className="bg-muted/50"
              placeholder="WORKSHOPS"
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title (pehla part)</Label>
            <Input
              value={(content.heroTitleBefore as string) || ""}
              onChange={(e) => onChange("heroTitleBefore", e.target.value)}
              className="bg-muted/50"
              placeholder="THE"
            />
          </div>
          <div className="space-y-2">
            <Label>Title highlight</Label>
            <Input
              value={(content.heroTitleHighlight as string) || ""}
              onChange={(e) => onChange("heroTitleHighlight", e.target.value)}
              className="bg-muted/50"
              placeholder="JOURNAL"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Subtitle / description</Label>
        <Textarea
          value={(content.heroSubtitle as string) || ""}
          onChange={(e) => onChange("heroSubtitle", e.target.value)}
          className="bg-muted/50 min-h-[80px]"
        />
      </div>

      {showBackground && (
        <MediaUrlField
          label="Hero background image/video (optional)"
          websiteLocation={`${websiteLocation} → background`}
          value={(content.heroBackground as string) || ""}
          onChange={(url) => onChange("heroBackground", url)}
          mediaType="auto"
        />
      )}

      {showCta && (
        <div className="grid gap-3 md:grid-cols-2 pt-2 border-t border-border">
          <div className="space-y-2">
            <Label>Primary button text</Label>
            <Input
              value={(content.ctaText as string) || ""}
              onChange={(e) => onChange("ctaText", e.target.value)}
              className="bg-muted/50"
              placeholder="Explore Programs"
            />
          </div>
          <div className="space-y-2">
            <Label>Primary button link</Label>
            <Input
              value={(content.ctaUrl as string) || ""}
              onChange={(e) => onChange("ctaUrl", e.target.value)}
              className="bg-muted/50"
              placeholder="#program-list"
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary button text</Label>
            <Input
              value={(content.ctaSecondaryText as string) || ""}
              onChange={(e) => onChange("ctaSecondaryText", e.target.value)}
              className="bg-muted/50"
              placeholder="Get Guidance"
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary button link</Label>
            <Input
              value={(content.ctaSecondaryUrl as string) || ""}
              onChange={(e) => onChange("ctaSecondaryUrl", e.target.value)}
              className="bg-muted/50"
              placeholder="/contact"
            />
          </div>
        </div>
      )}
    </CMSSection>
  );
}
