import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HomePageCMSEditor } from "@/components/cms/HomePageCMSEditor";
import { WorkshopsPageCMSEditor } from "@/components/cms/WorkshopsPageCMSEditor";
import { ServicesPageCMSEditor } from "@/components/cms/ServicesPageCMSEditor";
import { AboutPageCMSEditor } from "@/components/cms/AboutPageCMSEditor";
import {
  SchedulePageCMSEditor,
  LiveZoomPageCMSEditor,
} from "@/components/cms/SchedulePageCMSEditor";
import { PageHeroEditor } from "@/components/cms/PageHeroEditor";
import type { ApiPageContent } from "@/lib/api";
import type { PageSlug } from "@/lib/websiteControlNav";
import {
  ArrowDown,
  ArrowUp,
  Plus,
  Trash2,
  ArrowRight,
  HelpCircle,
  Star,
  BookOpen,
  Image as ImageIcon,
  FileText,
  CreditCard,
  Sparkles,
  Calendar,
} from "lucide-react";

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
    <div className="space-y-4">
      {selectedSlug === "home" && (
        <HomePageCMSEditor content={c} onChange={onContentChange} />
      )}

      {selectedSlug === "services" && (
        <>
          <ServicesPageCMSEditor content={c} onChange={onContentChange} />
          <Card className="p-5 border-primary/30 bg-primary/5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h4 className="font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Services Cards & Offerings
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage individual service cards (Wedding Choreography, School Programs, Wellness, Corporate).
                </p>
              </div>
              <Link
                to="/services-cms"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition shrink-0"
              >
                Manage Services Cards <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        </>
      )}

      {selectedSlug === "workshops" && (
        <WorkshopsPageCMSEditor content={c} onChange={onContentChange} />
      )}

      {renderHero()}

      {selectedSlug === "programs" && (
        <Card className="p-5 border-primary/30 bg-primary/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" /> Dance Programs & Classes Catalog
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage the actual dance curriculum, courses, age groups, batch timings, and difficulty levels.
              </p>
            </div>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition shrink-0"
            >
              Manage Dance Programs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      )}

      {selectedSlug === "faq" && (
        <Card className="p-5 border-primary/30 bg-primary/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" /> FAQ Questions & Answers
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage the questions and answers shown in the accordion on the FAQ page and on the homepage.
              </p>
            </div>
            <Link
              to="/faqs"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition shrink-0"
            >
              Manage FAQ Questions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      )}

      {selectedSlug === "testimonials" && (
        <Card className="p-5 border-primary/30 bg-primary/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" /> Student Reviews & Testimonials
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add, approve, or edit student written reviews, star ratings, and Google ratings.
              </p>
            </div>
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition shrink-0"
            >
              Manage Student Reviews <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      )}

      {selectedSlug === "blog" && (
        <Card className="p-5 border-primary/30 bg-primary/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Blog Posts & Dance Articles
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Publish, edit, and organize dance tutorials, health & wellness articles, and studio news.
              </p>
            </div>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition shrink-0"
            >
              Manage Blog Posts <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      )}

      {selectedSlug === "membership" && (
        <Card className="p-5 border-primary/30 bg-primary/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Membership Plans & Pricing Passes
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage monthly, quarterly, and annual subscription packages, pricing, and perk bullet points.
              </p>
            </div>
            <Link
              to="/membership-plans"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition shrink-0"
            >
              Manage Membership Plans <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      )}

      {selectedSlug === "about" && (
        <AboutPageCMSEditor content={c} onChange={onContentChange} />
      )}

      {selectedSlug === "schedule" && (
        <SchedulePageCMSEditor content={c} onChange={onContentChange} />
      )}

      {selectedSlug === "live-zoom" && (
        <LiveZoomPageCMSEditor content={c} onChange={onContentChange} />
      )}

      {selectedSlug === "gallery" && (
        <>
          <Card className="p-6 border-border bg-card space-y-4">
            <h4 className="font-semibold text-foreground border-b border-border pb-3">Gallery Top Banner</h4>
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
          </Card>
          <Card className="p-5 border-primary/30 bg-primary/5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h4 className="font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" /> Photos & Videos Gallery
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload and manage stage performance videos, recital photos, and studio moments.
                </p>
              </div>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition shrink-0"
              >
                Manage Photos & Videos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        </>
      )}

      {selectedSlug === "contact" && (
        <Card className="p-6 border-border bg-card space-y-4">
          <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            Phone, email, and address also appear in the website footer. After saving here, refresh
            the live site to see updates.
          </p>
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
        </Card>
      )}

      {(selectedSlug === "terms" || selectedSlug === "privacy") && (
        <Card className="p-6 border-border bg-card space-y-6">
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
        </Card>
      )}
    </div>
  );
}
