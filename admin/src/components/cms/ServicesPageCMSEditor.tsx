import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CMSSection } from "@/components/cms/CMSSection";
import { MediaUrlField } from "@/components/cms/MediaUrlField";
import { PageHeroEditor } from "@/components/cms/PageHeroEditor";
import { Plus, Trash2 } from "lucide-react";

type Content = Record<string, any>;

type Props = {
  content: Content;
  onChange: (field: string, value: unknown) => void;
};

const DEFAULT_STATS = [
  { value: "5000+", label: "Students" },
  { value: "100+", label: "Performances" },
  { value: "20+", label: "Trainers" },
  { value: "ALL", label: "Age Groups" },
];

const DEFAULT_EXPLORE = [
  {
    key: "wedding-choreography",
    title: "Wedding Choreography",
    subtitle: "Virtual & In-Person Services Worldwide",
    href: "/contact",
  },
  {
    key: "online-dance",
    title: "Online Dance Classes",
    subtitle: "Live Zoom sessions for every level",
    href: "/live-zoom",
  },
  {
    key: "online-combo",
    title: "Online Combo Fitness",
    subtitle: "Dance + fitness programs from home",
    href: "/services#fitness-classes",
  },
];

const DEFAULT_GROUPS = [
  {
    label: "Disease and Disorder Management",
    sectionId: "disorder-management",
    title: "Heal your body.",
    highlight: "Learn to dance.",
    items: [
      {
        title: "PCOD / PCOS Wellness",
        subtitle: "Department of Gynaecology",
        tagline: "Balance hormones the fun way — movement-led wellness for women.",
        image: "",
        href: "/contact",
      },
    ],
  },
];

export function ServicesPageCMSEditor({ content, onChange }: Props) {
  const stats = content.stats?.length ? content.stats : DEFAULT_STATS;
  const explore = content.explorePrograms?.length ? content.explorePrograms : DEFAULT_EXPLORE;
  const groups = content.wellnessGroups?.length ? content.wellnessGroups : DEFAULT_GROUPS;

  return (
    <div className="space-y-4">
      <PageHeroEditor
        content={content}
        onChange={onChange}
        websiteLocation="/services page → top hero"
        multiLineTitle
      />

      <CMSSection title="Hero CTA button" websiteLocation="/services → BOOK A TRIAL button">
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            value={content.heroCtaText || "BOOK A TRIAL"}
            onChange={(e) => onChange("heroCtaText", e.target.value)}
            placeholder="BOOK A TRIAL"
            className="bg-muted/50"
          />
          <Input
            value={content.heroCtaUrl || "/contact"}
            onChange={(e) => onChange("heroCtaUrl", e.target.value)}
            placeholder="/contact"
            className="bg-muted/50"
          />
        </div>
      </CMSSection>

      <CMSSection title="Stats strip" websiteLocation="/services → numbers under hero">
        {stats.map((stat: { value?: string; label?: string }, idx: number) => (
          <div key={idx} className="grid gap-2 md:grid-cols-2">
            <Input
              value={stat.value || ""}
              onChange={(e) => {
                const next = [...stats];
                next[idx] = { ...next[idx], value: e.target.value };
                onChange("stats", next);
              }}
              className="bg-muted/50"
              placeholder="5000+"
            />
            <Input
              value={stat.label || ""}
              onChange={(e) => {
                const next = [...stats];
                next[idx] = { ...next[idx], label: e.target.value };
                onChange("stats", next);
              }}
              className="bg-muted/50"
              placeholder="Students"
            />
          </div>
        ))}
      </CMSSection>

      <CMSSection title="Explore list" websiteLocation="/services → What would you like to Explore">
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            value={content.exploreBadge || "Discover GDP"}
            onChange={(e) => onChange("exploreBadge", e.target.value)}
            placeholder="Badge"
            className="bg-muted/50"
          />
          <Input
            value={content.exploreTitle || "What would you like to"}
            onChange={(e) => onChange("exploreTitle", e.target.value)}
            placeholder="Title"
            className="bg-muted/50"
          />
          <Input
            value={content.exploreHighlight || "Explore"}
            onChange={(e) => onChange("exploreHighlight", e.target.value)}
            placeholder="Highlight word"
            className="bg-muted/50"
          />
        </div>
        {explore.map((item: any, idx: number) => (
          <div key={idx} className="space-y-2 rounded-md border border-border p-3">
            <div className="flex justify-between">
              <span className="text-xs font-semibold text-primary">Item #{idx + 1}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  onChange(
                    "explorePrograms",
                    explore.filter((_: unknown, i: number) => i !== idx),
                  )
                }
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <Input
              value={item.title || ""}
              onChange={(e) => {
                const next = [...explore];
                next[idx] = { ...next[idx], title: e.target.value };
                onChange("explorePrograms", next);
              }}
              placeholder="Title"
              className="bg-muted/50"
            />
            <Input
              value={item.subtitle || ""}
              onChange={(e) => {
                const next = [...explore];
                next[idx] = { ...next[idx], subtitle: e.target.value };
                onChange("explorePrograms", next);
              }}
              placeholder="Subtitle"
              className="bg-muted/50"
            />
            <Input
              value={item.href || ""}
              onChange={(e) => {
                const next = [...explore];
                next[idx] = { ...next[idx], href: e.target.value };
                onChange("explorePrograms", next);
              }}
              placeholder="/contact"
              className="bg-muted/50"
            />
          </div>
        ))}
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() =>
            onChange("explorePrograms", [
              ...explore,
              { key: `item-${explore.length + 1}`, title: "", subtitle: "", href: "/contact" },
            ])
          }
        >
          <Plus className="h-3.5 w-3.5" /> Add explore item
        </Button>
      </CMSSection>

      <CMSSection title="Wellness / Fitness groups" websiteLocation="/services → card grids">
        {groups.map((group: any, gIdx: number) => (
          <div key={gIdx} className="space-y-3 rounded-md border border-border p-3">
            <div className="grid gap-2 md:grid-cols-2">
              <Input
                value={group.label || ""}
                onChange={(e) => {
                  const next = [...groups];
                  next[gIdx] = { ...next[gIdx], label: e.target.value };
                  onChange("wellnessGroups", next);
                }}
                placeholder="Group label"
                className="bg-muted/50"
              />
              <Input
                value={group.sectionId || ""}
                onChange={(e) => {
                  const next = [...groups];
                  next[gIdx] = { ...next[gIdx], sectionId: e.target.value };
                  onChange("wellnessGroups", next);
                }}
                placeholder="section-id"
                className="bg-muted/50"
              />
              <Input
                value={group.title || ""}
                onChange={(e) => {
                  const next = [...groups];
                  next[gIdx] = { ...next[gIdx], title: e.target.value };
                  onChange("wellnessGroups", next);
                }}
                placeholder="Section title"
                className="bg-muted/50"
              />
              <Input
                value={group.highlight || ""}
                onChange={(e) => {
                  const next = [...groups];
                  next[gIdx] = { ...next[gIdx], highlight: e.target.value };
                  onChange("wellnessGroups", next);
                }}
                placeholder="Highlight text"
                className="bg-muted/50"
              />
            </div>
            {(group.items || []).map((item: any, iIdx: number) => (
              <div key={iIdx} className="space-y-2 rounded border border-border/60 bg-muted/20 p-2">
                <Input
                  value={item.title || ""}
                  onChange={(e) => {
                    const next = [...groups];
                    const items = [...(next[gIdx].items || [])];
                    items[iIdx] = { ...items[iIdx], title: e.target.value };
                    next[gIdx] = { ...next[gIdx], items };
                    onChange("wellnessGroups", next);
                  }}
                  placeholder="Card title"
                  className="bg-muted/50"
                />
                <Input
                  value={item.subtitle || ""}
                  onChange={(e) => {
                    const next = [...groups];
                    const items = [...(next[gIdx].items || [])];
                    items[iIdx] = { ...items[iIdx], subtitle: e.target.value };
                    next[gIdx] = { ...next[gIdx], items };
                    onChange("wellnessGroups", next);
                  }}
                  placeholder="Subtitle"
                  className="bg-muted/50"
                />
                <Textarea
                  value={item.tagline || ""}
                  onChange={(e) => {
                    const next = [...groups];
                    const items = [...(next[gIdx].items || [])];
                    items[iIdx] = { ...items[iIdx], tagline: e.target.value };
                    next[gIdx] = { ...next[gIdx], items };
                    onChange("wellnessGroups", next);
                  }}
                  placeholder="Tagline"
                  className="bg-muted/50 min-h-[60px]"
                />
                <MediaUrlField
                  label="Card image"
                  value={item.image || ""}
                  onChange={(url) => {
                    const next = [...groups];
                    const items = [...(next[gIdx].items || [])];
                    items[iIdx] = { ...items[iIdx], image: url };
                    next[gIdx] = { ...next[gIdx], items };
                    onChange("wellnessGroups", next);
                  }}
                  mediaType="image"
                />
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const next = [...groups];
                next[gIdx] = {
                  ...next[gIdx],
                  items: [
                    ...(next[gIdx].items || []),
                    { title: "", subtitle: "", tagline: "", image: "", href: "/contact" },
                  ],
                };
                onChange("wellnessGroups", next);
              }}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add card
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            onChange("wellnessGroups", [
              ...groups,
              {
                label: "New group",
                sectionId: `group-${groups.length + 1}`,
                title: "",
                highlight: "",
                items: [],
              },
            ])
          }
        >
          <Plus className="mr-1 h-3.5 w-3.5" /> Add group
        </Button>
      </CMSSection>

      <CMSSection title="Final CTA" websiteLocation="/services → bottom START YOUR JOURNEY">
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            value={content.finalCtaTitle || "START YOUR JOURNEY"}
            onChange={(e) => onChange("finalCtaTitle", e.target.value)}
            className="bg-muted/50"
          />
          <Input
            value={content.finalCtaButtonText || "CONTACT US"}
            onChange={(e) => onChange("finalCtaButtonText", e.target.value)}
            className="bg-muted/50"
          />
          <Input
            value={content.finalCtaUrl || "/contact"}
            onChange={(e) => onChange("finalCtaUrl", e.target.value)}
            className="bg-muted/50"
          />
        </div>
      </CMSSection>
    </div>
  );
}
