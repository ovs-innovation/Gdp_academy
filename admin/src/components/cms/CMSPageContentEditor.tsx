import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUrlField } from "@/components/cms/MediaUrlField";
import { HomePageCMSEditor } from "@/components/cms/HomePageCMSEditor";
import { WorkshopsPageCMSEditor } from "@/components/cms/WorkshopsPageCMSEditor";
import { ServicesPageCMSEditor } from "@/components/cms/ServicesPageCMSEditor";
import { PageHeroEditor } from "@/components/cms/PageHeroEditor";
import type { ApiPageContent } from "@/lib/api";
import type { PageSlug } from "@/lib/websiteControlNav";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

const stringifyJsonField = (value: unknown, fallback: unknown) => {
  try {
    return JSON.stringify(value ?? fallback, null, 2);
  } catch {
    return JSON.stringify(fallback, null, 2);
  }
};

const parseJsonField = (raw: string, fallback: unknown) => {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

type Props = {
  selectedSlug: PageSlug;
  pageData: ApiPageContent;
  pageLabel: string;
  onContentChange: (field: string, value: unknown) => void;
};

export function CMSPageContentEditor({
  selectedSlug,
  pageData,
  pageLabel,
  onContentChange,
}: Props) {
  const c = pageData.content || {};

  const renderHero = () => {
    if (selectedSlug === "services") {
      return null;
    }
    if (selectedSlug === "programs") {
      return (
        <PageHeroEditor
          content={c}
          onChange={onContentChange}
          websiteLocation="/programs page → top hero"
          multiLineTitle
          showBadge
          showCta
        />
      );
    }
    if (selectedSlug === "faq" || selectedSlug === "testimonials" || selectedSlug === "membership") {
      const loc: Record<string, string> = {
        faq: "/faq page → top hero",
        testimonials: "/testimonials page → top hero",
        membership: "/membership page → top hero",
      };
      return (
        <PageHeroEditor
          content={c}
          onChange={onContentChange}
          websiteLocation={loc[selectedSlug]}
          splitTitle
        />
      );
    }
    if (selectedSlug === "blog") {
      return (
        <PageHeroEditor
          content={c}
          onChange={onContentChange}
          websiteLocation="/blog page → THE JOURNAL hero"
        />
      );
    }
    return null;
  };

  return (
    <Card className="space-y-4 border-border bg-card p-6">
      <div className="mb-2 flex items-center gap-2 border-b border-border pb-3">
        <h3 className="text-lg font-semibold capitalize text-foreground">{pageLabel} content</h3>
      </div>

      {selectedSlug === "home" && (
        <HomePageCMSEditor content={c} onChange={onContentChange} />
      )}

      {selectedSlug === "services" && (
        <ServicesPageCMSEditor content={c} onChange={onContentChange} />
      )}

      {selectedSlug === "workshops" && (
        <>
          <p className="mb-4 -mt-2 text-sm text-muted-foreground">
            Edit the /workshops landing in steps below. Workshop cards are managed in Workshops admin.
          </p>
          <WorkshopsPageCMSEditor content={c} onChange={onContentChange} />
        </>
      )}

      {renderHero()}

      {selectedSlug === "about" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Hero intro text</Label>
            <Textarea
              value={c.heroText || ""}
              onChange={(e) => onContentChange("heroText", e.target.value)}
              className="bg-muted/50 min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Hero highlight chips (one per line)</Label>
            <Textarea
              value={(c.heroHighlights || [])
                .map((h: { text?: string }) => h.text || "")
                .join("\n")}
              onChange={(e) =>
                onContentChange(
                  "heroHighlights",
                  e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((text) => ({ text })),
                )
              }
              className="bg-muted/50 min-h-[70px]"
              placeholder={"Classical · Contemporary · Fusion\nStudio · Workshops · Stage"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storyTitle">Story Title</Label>
            <Input
              id="storyTitle"
              value={c.storyTitle || ""}
              onChange={(e) => onContentChange("storyTitle", e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storyText">Story Content</Label>
            <Textarea
              id="storyText"
              value={c.storyText || ""}
              onChange={(e) => onContentChange("storyText", e.target.value)}
              className="bg-muted/50 min-h-[120px]"
            />
          </div>
          <div className="space-y-2 border-t border-border pt-4">
            <Label htmlFor="missionTitle">Mission Title</Label>
            <Input
              id="missionTitle"
              value={c.missionTitle || ""}
              onChange={(e) => onContentChange("missionTitle", e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="missionText">Mission Statement</Label>
            <Textarea
              id="missionText"
              value={c.missionText || ""}
              onChange={(e) => onContentChange("missionText", e.target.value)}
              className="bg-muted/50 min-h-[100px]"
            />
          </div>
          <MediaUrlField
            label="Hero / Hologram Video"
            websiteLocation="/about page → hero video"
            value={c.heroVideoUrl || ""}
            onChange={(url) => onContentChange("heroVideoUrl", url)}
            mediaType="video"
          />
          {(["stats", "pillars", "timeline", "ecosystem"] as const).map((field) => (
            <div key={field} className="space-y-2">
              <Label className="capitalize">{field} (JSON array)</Label>
              <Textarea
                value={stringifyJsonField(c[field], [])}
                onChange={(e) => onContentChange(field, parseJsonField(e.target.value, []))}
                className="bg-muted/50 min-h-[100px] font-mono text-xs"
              />
            </div>
          ))}
          <div className="grid gap-4 border-t border-border pt-4 md:grid-cols-2">
            <Input
              placeholder="CTA Title"
              value={c.ctaTitle || ""}
              onChange={(e) => onContentChange("ctaTitle", e.target.value)}
              className="bg-muted/50"
            />
            <Input
              placeholder="CTA Button"
              value={c.ctaButtonText || ""}
              onChange={(e) => onContentChange("ctaButtonText", e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label>CTA Text</Label>
            <Textarea
              value={c.ctaText || ""}
              onChange={(e) => onContentChange("ctaText", e.target.value)}
              className="bg-muted/50 min-h-[80px]"
            />
          </div>
        </div>
      )}

      {(selectedSlug === "schedule" ||
        selectedSlug === "live-zoom" ||
        selectedSlug === "gallery") && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Hero Title</Label>
            <Input
              value={c.heroTitle || ""}
              onChange={(e) => onContentChange("heroTitle", e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Hero Subtitle</Label>
            <Textarea
              value={c.heroSubtitle || ""}
              onChange={(e) => onContentChange("heroSubtitle", e.target.value)}
              className="bg-muted/50 min-h-[80px]"
            />
          </div>
          {selectedSlug === "schedule" && (
            <div className="space-y-2">
              <Label>Schedule Rows (JSON)</Label>
              <Textarea
                value={stringifyJsonField(c.scheduleRows, [])}
                onChange={(e) =>
                  onContentChange("scheduleRows", parseJsonField(e.target.value, []))
                }
                className="bg-muted/50 min-h-[160px] font-mono text-xs"
              />
            </div>
          )}
          {selectedSlug === "live-zoom" && (
            <>
              <div className="space-y-2">
                <Label>Sessions (JSON)</Label>
                <Textarea
                  value={stringifyJsonField(c.sessions, [])}
                  onChange={(e) =>
                    onContentChange("sessions", parseJsonField(e.target.value, []))
                  }
                  className="bg-muted/50 min-h-[120px] font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label>Join Steps (JSON)</Label>
                <Textarea
                  value={stringifyJsonField(c.joinSteps, [])}
                  onChange={(e) =>
                    onContentChange("joinSteps", parseJsonField(e.target.value, []))
                  }
                  className="bg-muted/50 min-h-[100px] font-mono text-xs"
                />
              </div>
            </>
          )}
        </div>
      )}

      {selectedSlug === "contact" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headerTitle">Header Title</Label>
            <Input
              id="headerTitle"
              value={c.headerTitle || ""}
              onChange={(e) => onContentChange("headerTitle", e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="headerSubtitle">Header Subtitle</Label>
            <Textarea
              id="headerSubtitle"
              value={c.headerSubtitle || ""}
              onChange={(e) => onContentChange("headerSubtitle", e.target.value)}
              className="bg-muted/50 min-h-[80px]"
            />
          </div>
          <div className="grid gap-4 border-t border-border pt-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={c.phone || ""}
                onChange={(e) => onContentChange("phone", e.target.value)}
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={c.email || ""}
                onChange={(e) => onContentChange("email", e.target.value)}
                className="bg-muted/50"
              />
            </div>
          </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Studio Address</Label>
                          <Input
                            id="address"
                            value={c.address || ""}
                            onChange={(e) => onContentChange("address", e.target.value)}
                            className="bg-muted/50"
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Weekday Hours</Label>
                            <Input
                              value={c.hoursWeekday || ""}
                              onChange={(e) => onContentChange("hoursWeekday", e.target.value)}
                              placeholder="Mon-Fri: 9AM - 10PM"
                              className="bg-muted/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Weekend Hours</Label>
                            <Input
                              value={c.hoursWeekend || ""}
                              onChange={(e) => onContentChange("hoursWeekend", e.target.value)}
                              placeholder="Sat-Sun: 10AM - 8PM"
                              className="bg-muted/50"
                            />
                          </div>
                        </div>
        </div>
      )}

      {(selectedSlug === "terms" || selectedSlug === "privacy") && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h4 className="font-semibold text-foreground">Document Sections</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const currentSections = c.sections || [];
                onContentChange("sections", [
                  ...currentSections,
                  { title: `Section ${currentSections.length + 1}`, text: "" },
                ]);
              }}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add Section
            </Button>
          </div>
          <div className="space-y-4">
            {(c.sections || []).map((sec: { title?: string; text?: string }, idx: number) => (
              <Card key={idx} className="space-y-3 border border-border/50 bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">Section #{idx + 1}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={idx === 0}
                      className="h-8 w-8"
                      onClick={() => {
                        if (idx === 0) return;
                        const sections = [...(c.sections || [])];
                        const temp = sections[idx];
                        sections[idx] = sections[idx - 1];
                        sections[idx - 1] = temp;
                        onContentChange("sections", sections);
                      }}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={idx === (c.sections || []).length - 1}
                      className="h-8 w-8"
                      onClick={() => {
                        const sections = [...(c.sections || [])];
                        if (idx === sections.length - 1) return;
                        const temp = sections[idx];
                        sections[idx] = sections[idx + 1];
                        sections[idx + 1] = temp;
                        onContentChange("sections", sections);
                      }}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        onContentChange(
                          "sections",
                          (c.sections || []).filter((_: unknown, i: number) => i !== idx),
                        );
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={sec.title || ""}
                    onChange={(e) => {
                      const sections = [...(c.sections || [])];
                      sections[idx] = { ...sections[idx], title: e.target.value };
                      onContentChange("sections", sections);
                    }}
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Text</Label>
                  <Textarea
                    value={sec.text || ""}
                    onChange={(e) => {
                      const sections = [...(c.sections || [])];
                      sections[idx] = { ...sections[idx], text: e.target.value };
                      onContentChange("sections", sections);
                    }}
                    className="bg-muted/50 min-h-[80px]"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
