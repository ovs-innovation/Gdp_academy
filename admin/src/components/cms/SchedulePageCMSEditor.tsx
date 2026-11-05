import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CMSSection } from "@/components/cms/CMSSection";
import { Plus, Trash2 } from "lucide-react";

type Content = Record<string, any>;

type Props = {
  content: Content;
  onChange: (field: string, value: unknown) => void;
};

const EMPTY_ROW = {
  time: "",
  monday: "",
  tuesday: "",
  wednesday: "",
  thursday: "",
  friday: "",
};

export function SchedulePageCMSEditor({ content, onChange }: Props) {
  const rows = Array.isArray(content.scheduleRows) ? content.scheduleRows : [];

  return (
    <div className="space-y-4">
      <CMSSection
        title="Page header"
        description="Title and subtitle at the top of the schedule page."
        websiteLocation="/schedule → hero"
        defaultOpen
      >
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.heroTitle || ""}
            onChange={(e) => onChange("heroTitle", e.target.value)}
            className="bg-muted/50"
            placeholder="SESSION SCHEDULE"
          />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Textarea
            value={content.heroSubtitle || ""}
            onChange={(e) => onChange("heroSubtitle", e.target.value)}
            className="bg-muted/50 min-h-[80px]"
          />
        </div>
      </CMSSection>

      <CMSSection
        title="Weekly timetable"
        description="Each row is a time slot. Fill Monday–Friday class names."
        websiteLocation="/schedule → timetable"
        defaultOpen
      >
        {rows.map(
          (
            row: {
              time?: string;
              monday?: string;
              tuesday?: string;
              wednesday?: string;
              thursday?: string;
              friday?: string;
            },
            i: number,
          ) => (
            <div key={i} className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Row #{i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onChange("scheduleRows", rows.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <Input
                value={row.time || ""}
                onChange={(e) => {
                  const next = [...rows];
                  next[i] = { ...next[i], time: e.target.value };
                  onChange("scheduleRows", next);
                }}
                placeholder="08:00 AM"
                className="bg-muted/50"
              />
              <div className="grid gap-2 md:grid-cols-5">
                {(
                  [
                    ["monday", "Mon"],
                    ["tuesday", "Tue"],
                    ["wednesday", "Wed"],
                    ["thursday", "Thu"],
                    ["friday", "Fri"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-[11px]">{label}</Label>
                    <Input
                      value={row[key] || ""}
                      onChange={(e) => {
                        const next = [...rows];
                        next[i] = { ...next[i], [key]: e.target.value };
                        onChange("scheduleRows", next);
                      }}
                      className="bg-muted/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => onChange("scheduleRows", [...rows, { ...EMPTY_ROW }])}
        >
          <Plus className="h-4 w-4" /> Add time row
        </Button>
      </CMSSection>
    </div>
  );
}

export function LiveZoomPageCMSEditor({ content, onChange }: Props) {
  const steps = Array.isArray(content.joinSteps) ? content.joinSteps : [];

  return (
    <div className="space-y-4">
      <CMSSection
        title="Page header"
        description="Title and subtitle at the top of Live Zoom."
        websiteLocation="/live-zoom → hero"
        defaultOpen
      >
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.heroTitle || ""}
            onChange={(e) => onChange("heroTitle", e.target.value)}
            className="bg-muted/50"
            placeholder="LIVE ZOOM SESSIONS"
          />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Textarea
            value={content.heroSubtitle || ""}
            onChange={(e) => onChange("heroSubtitle", e.target.value)}
            className="bg-muted/50 min-h-[80px]"
          />
        </div>
      </CMSSection>

      <CMSSection
        title="How to join"
        description="The 3 steps shown on the page. Upcoming sessions load from Zoom automatically — they are not edited here."
        websiteLocation="/live-zoom → how to join"
        defaultOpen
      >
        {steps.map((step: { step?: string; title?: string; desc?: string }, i: number) => (
          <div key={i} className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Step #{i + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onChange("joinSteps", steps.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <Input
                value={step.step || ""}
                onChange={(e) => {
                  const next = [...steps];
                  next[i] = { ...next[i], step: e.target.value };
                  onChange("joinSteps", next);
                }}
                placeholder="01"
                className="bg-muted/50"
              />
              <Input
                value={step.title || ""}
                onChange={(e) => {
                  const next = [...steps];
                  next[i] = { ...next[i], title: e.target.value };
                  onChange("joinSteps", next);
                }}
                placeholder="REGISTER"
                className="bg-muted/50"
              />
            </div>
            <Textarea
              value={step.desc || ""}
              onChange={(e) => {
                const next = [...steps];
                next[i] = { ...next[i], desc: e.target.value };
                onChange("joinSteps", next);
              }}
              className="bg-muted/50 min-h-[70px]"
              placeholder="Step description"
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() =>
            onChange("joinSteps", [
              ...steps,
              { step: String(steps.length + 1).padStart(2, "0"), title: "", desc: "" },
            ])
          }
        >
          <Plus className="h-4 w-4" /> Add step
        </Button>
      </CMSSection>
    </div>
  );
}
