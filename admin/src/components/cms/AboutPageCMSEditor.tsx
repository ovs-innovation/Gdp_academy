import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CMSSection } from "@/components/cms/CMSSection";
import { MediaUrlField } from "@/components/cms/MediaUrlField";
import { Plus, Trash2, ChevronDown, ChevronUp, Zap } from "lucide-react";

type Content = Record<string, any>;

type Props = {
  content: Content;
  onChange: (field: string, value: unknown) => void;
};

const ABOUT_SECTIONS = [
  { id: "cms-about-hero", label: "Hero Intro", icon: "🎯" },
  { id: "cms-about-story", label: "Our Story", icon: "📖" },
  { id: "cms-about-mission", label: "Mission & Vision", icon: "✨" },
  { id: "cms-about-stats", label: "Stats Strip", icon: "📊" },
  { id: "cms-about-pillars", label: "Core Pillars", icon: "🏛️" },
  { id: "cms-about-ecosystem", label: "Studio Facilities", icon: "🏢" },
  { id: "cms-about-cta", label: "Bottom CTA", icon: "🚀" },
];

const DEFAULT_STATS = [
  { number: "5000+", label: "Students Trained" },
  { number: "icon-mentors", label: "Professional Mentors" },
  { number: "icon-stage", label: "Stage Performances" },
  { number: "icon-groups", label: "All Age Groups" },
];

const DEFAULT_PILLARS = [
  { num: "PILLAR 01", title: "Choreography & Style", text: "" },
  { num: "PILLAR 02", title: "Stage Presence", text: "" },
  { num: "PILLAR 03", title: "Dynamic Groove", text: "" },
];

const DEFAULT_ECOSYSTEM = [
  { title: "Shock-Absorbing Dance Floors", text: "" },
  { title: "Visual Production Suite", text: "" },
];

export function AboutPageCMSEditor({ content, onChange }: Props) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({ "cms-about-hero": true });

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
    ABOUT_SECTIONS.forEach((s) => (all[s.id] = true));
    setOpenMap(all);
  };

  const collapseAll = () => {
    setOpenMap({});
  };

  const stats = Array.isArray(content.stats) && content.stats.length ? content.stats : DEFAULT_STATS;
  const pillars =
    Array.isArray(content.pillars) && content.pillars.length ? content.pillars : DEFAULT_PILLARS;
  const ecosystem =
    Array.isArray(content.ecosystem) && content.ecosystem.length
      ? content.ecosystem
      : DEFAULT_ECOSYSTEM;
  const highlights = Array.isArray(content.heroHighlights) ? content.heroHighlights : [];

  return (
    <div className="space-y-4">
      {/* Quick Jump Toolbar */}
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
          {ABOUT_SECTIONS.map((s) => (
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
        id="cms-about-hero"
        title="Top Hero Intro & Video"
        description="Intro headline, highlight tags, and featured video at the top of the About Us page."
        websiteLocation="/about → hero"
        isOpen={openMap["cms-about-hero"] ?? false}
        onToggle={(open) => toggleSection("cms-about-hero", open)}
      >
        <div className="space-y-2">
          <Label>Hero Intro Text</Label>
          <Textarea
            value={content.heroText || ""}
            onChange={(e) => onChange("heroText", e.target.value)}
            className="bg-muted/50 min-h-[80px]"
          />
        </div>
        <div className="space-y-2">
          <Label>Highlight Tags / Chips (one per line)</Label>
          <Textarea
            value={highlights.map((h: { text?: string }) => h.text || "").join("\n")}
            onChange={(e) =>
              onChange(
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
        <MediaUrlField
          label="Hero video"
          websiteLocation="/about page → hero video"
          value={content.heroVideoUrl || ""}
          onChange={(url) => onChange("heroVideoUrl", url)}
          mediaType="video"
        />
      </CMSSection>

      <CMSSection
        id="cms-about-story"
        title="Our Story & Background"
        description="The story of Garima Dance Productions, how it started and evolved."
        websiteLocation="/about → story"
        isOpen={openMap["cms-about-story"] ?? false}
        onToggle={(open) => toggleSection("cms-about-story", open)}
      >
        <div className="space-y-2">
          <Label>Story Title</Label>
          <Input
            value={content.storyTitle || ""}
            onChange={(e) => onChange("storyTitle", e.target.value)}
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Story Content</Label>
          <Textarea
            value={content.storyText || ""}
            onChange={(e) => onChange("storyText", e.target.value)}
            className="bg-muted/50 min-h-[120px]"
          />
        </div>
      </CMSSection>

      <CMSSection
        id="cms-about-mission"
        title="Mission & Vision Statement"
        description="Our mission statement and artistic philosophy."
        websiteLocation="/about → mission"
        isOpen={openMap["cms-about-mission"] ?? false}
        onToggle={(open) => toggleSection("cms-about-mission", open)}
      >
        <div className="space-y-2">
          <Label>Mission Title</Label>
          <Input
            value={content.missionTitle || ""}
            onChange={(e) => onChange("missionTitle", e.target.value)}
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Mission Statement</Label>
          <Textarea
            value={content.missionText || ""}
            onChange={(e) => onChange("missionText", e.target.value)}
            className="bg-muted/50 min-h-[100px]"
          />
        </div>
      </CMSSection>

      <CMSSection
        id="cms-about-stats"
        title="Key Numbers & Achievements (Stats)"
        description="Key statistics shown on the About page. Enter numbers (e.g. 5000+) or keep defaults."
        websiteLocation="/about → stats row"
        isOpen={openMap["cms-about-stats"] ?? false}
        onToggle={(open) => toggleSection("cms-about-stats", open)}
      >
        {stats.map((stat: { number?: string; label?: string }, i: number) => (
          <div key={i} className="grid gap-2 md:grid-cols-2">
            <Input
              value={stat.number || ""}
              onChange={(e) => {
                const next = [...stats];
                next[i] = { ...next[i], number: e.target.value };
                onChange("stats", next);
              }}
              placeholder="5000+"
              className="bg-muted/50"
            />
            <Input
              value={stat.label || ""}
              onChange={(e) => {
                const next = [...stats];
                next[i] = { ...next[i], label: e.target.value };
                onChange("stats", next);
              }}
              placeholder="Students Trained"
              className="bg-muted/50"
            />
          </div>
        ))}
      </CMSSection>

      <CMSSection
        id="cms-about-pillars"
        title="Core Training Pillars"
        description="The foundational pillars of the dance academy curriculum."
        websiteLocation="/about → pillars"
        isOpen={openMap["cms-about-pillars"] ?? false}
        onToggle={(open) => toggleSection("cms-about-pillars", open)}
      >
        {pillars.map((pillar: { num?: string; title?: string; text?: string }, i: number) => (
          <div key={i} className="rounded-lg border border-border bg-muted/20 space-y-2 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Pillar #{i + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onChange("pillars", pillars.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <Input
              value={pillar.num || ""}
              onChange={(e) => {
                const next = [...pillars];
                next[i] = { ...next[i], num: e.target.value };
                onChange("pillars", next);
              }}
              placeholder="PILLAR 01"
              className="bg-muted/50"
            />
            <Input
              value={pillar.title || ""}
              onChange={(e) => {
                const next = [...pillars];
                next[i] = { ...next[i], title: e.target.value };
                onChange("pillars", next);
              }}
              placeholder="Title"
              className="bg-muted/50"
            />
            <Textarea
              value={pillar.text || ""}
              onChange={(e) => {
                const next = [...pillars];
                next[i] = { ...next[i], text: e.target.value };
                onChange("pillars", next);
              }}
              className="bg-muted/50 min-h-[80px]"
              placeholder="Description"
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() =>
            onChange("pillars", [...pillars, { num: `PILLAR ${String(pillars.length + 1).padStart(2, "0")}`, title: "", text: "" }])
          }
        >
          <Plus className="h-4 w-4" /> Add pillar
        </Button>
      </CMSSection>

      <CMSSection
        id="cms-about-ecosystem"
        title="Studio Facilities & Infrastructure"
        description="Highlight features like shock-absorbing floors, mirrors, audio equipment, and suites."
        websiteLocation="/about → ecosystem"
        isOpen={openMap["cms-about-ecosystem"] ?? false}
        onToggle={(open) => toggleSection("cms-about-ecosystem", open)}
      >
        {ecosystem.map((item: { title?: string; text?: string }, i: number) => (
          <div key={i} className="rounded-lg border border-border bg-muted/20 space-y-2 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Card #{i + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onChange("ecosystem", ecosystem.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <Input
              value={item.title || ""}
              onChange={(e) => {
                const next = [...ecosystem];
                next[i] = { ...next[i], title: e.target.value };
                onChange("ecosystem", next);
              }}
              placeholder="Title"
              className="bg-muted/50"
            />
            <Textarea
              value={item.text || ""}
              onChange={(e) => {
                const next = [...ecosystem];
                next[i] = { ...next[i], text: e.target.value };
                onChange("ecosystem", next);
              }}
              className="bg-muted/50 min-h-[70px]"
              placeholder="Description"
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => onChange("ecosystem", [...ecosystem, { title: "", text: "" }])}
        >
          <Plus className="h-4 w-4" /> Add card
        </Button>
      </CMSSection>

      <CMSSection
        id="cms-about-cta"
        title="Bottom Call-to-Action Banner"
        description="The encouragement banner and button shown at the bottom of the About page."
        websiteLocation="/about → bottom CTA"
        isOpen={openMap["cms-about-cta"] ?? false}
        onToggle={(open) => toggleSection("cms-about-cta", open)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>CTA title</Label>
            <Input
              value={content.ctaTitle || ""}
              onChange={(e) => onChange("ctaTitle", e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Button text</Label>
            <Input
              value={content.ctaButtonText || ""}
              onChange={(e) => onChange("ctaButtonText", e.target.value)}
              className="bg-muted/50"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>CTA text</Label>
          <Textarea
            value={content.ctaText || ""}
            onChange={(e) => onChange("ctaText", e.target.value)}
            className="bg-muted/50 min-h-[80px]"
          />
        </div>
      </CMSSection>
    </div>
  );
}
