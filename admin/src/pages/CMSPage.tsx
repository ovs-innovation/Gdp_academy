import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageContentAPI, SiteSettingsAPI, type ApiPageContent, type ApiSiteSettings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText, Settings, Layout, Plus, Trash2, ArrowUp, ArrowDown, Info, MapPin } from "lucide-react";
import { HomePageCMSEditor } from "@/components/cms/HomePageCMSEditor";
import { PageHeroEditor } from "@/components/cms/PageHeroEditor";
import { WebsiteStructureMap } from "@/components/cms/WebsiteStructureMap";
import { MediaUrlField } from "@/components/cms/MediaUrlField";
import { normalizeHomeContentForSave } from "@/lib/homeCms";

type ActiveTab = "pages" | "settings" | "map";
type PageSlug =
  | "home"
  | "about"
  | "contact"
  | "terms"
  | "privacy"
  | "schedule"
  | "live-zoom"
  | "gallery"
  | "services"
  | "programs"
  | "workshops"
  | "blog"
  | "faq"
  | "testimonials"
  | "membership";

const PAGE_OPTIONS: { slug: PageSlug; label: string; path: string; group: string }[] = [
  { slug: "home", label: "Homepage", path: "/", group: "Main" },
  { slug: "about", label: "About", path: "/about", group: "Main" },
  { slug: "services", label: "Services Page", path: "/services", group: "Main" },
  { slug: "programs", label: "Programs Page", path: "/programs", group: "Main" },
  { slug: "workshops", label: "Workshops Page", path: "/workshops", group: "Main" },
  { slug: "gallery", label: "Gallery Header", path: "/gallery", group: "Main" },
  { slug: "blog", label: "Blog Page", path: "/blog", group: "Main" },
  { slug: "faq", label: "FAQ Page", path: "/faq", group: "Main" },
  { slug: "testimonials", label: "Testimonials Page", path: "/testimonials", group: "Main" },
  { slug: "membership", label: "Membership Page", path: "/membership", group: "Main" },
  { slug: "contact", label: "Contact", path: "/contact", group: "Main" },
  { slug: "schedule", label: "Schedule", path: "/schedule", group: "Other" },
  { slug: "live-zoom", label: "Live Zoom", path: "/live-zoom", group: "Other" },
  { slug: "terms", label: "Terms", path: "/terms", group: "Legal" },
  { slug: "privacy", label: "Privacy", path: "/privacy", group: "Legal" },
];

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

const CMSPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("pages");
  const [selectedSlug, setSelectedSlug] = useState<PageSlug>("home");
  
  // Page content state
  const [pageData, setPageData] = useState<ApiPageContent | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageSaving, setPageSaving] = useState(false);

  // Site settings state
  const [siteSettings, setSiteSettings] = useState<ApiSiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === "pages") {
      loadPageContent(selectedSlug);
    } else if (activeTab === "settings") {
      loadSiteSettings();
    }
  }, [activeTab, selectedSlug]);

  const loadPageContent = async (slug: PageSlug) => {
    setPageLoading(true);
    try {
      const data = await PageContentAPI.getBySlug(slug);
      setPageData(data.page);
    } catch (err: any) {
      setPageData({
        _id: "",
        slug,
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        content: {},
        status: "published",
      } as any);
      if (!["schedule", "live-zoom", "gallery", "services", "programs", "workshops", "blog", "faq", "testimonials", "membership"].includes(slug)) {
        toast({
          title: `No saved content for ${slug} yet`,
          description: "Fill in the fields and save to create this page.",
        });
      }
    } finally {
      setPageLoading(false);
    }
  };

  const loadSiteSettings = async () => {
    setSettingsLoading(true);
    try {
      const data = await SiteSettingsAPI.get();
      setSiteSettings(data.settings);
    } catch (err: any) {
      toast({
        title: "Failed to load site settings",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSettingsLoading(false);
    }
  };

  const handlePageSave = async () => {
    if (!pageData) return;
    setPageSaving(true);
    try {
      const payload = {
        title: pageData.title,
        content:
          selectedSlug === "home"
            ? normalizeHomeContentForSave(pageData.content || {})
            : pageData.content,
        metaTitle: pageData.metaTitle,
        metaDescription: pageData.metaDescription,
        canonicalUrl: pageData.canonicalUrl,
        status: pageData.status,
      };
      if (pageData._id) {
        await PageContentAPI.update(pageData._id, payload);
      } else {
        await PageContentAPI.create({ slug: pageData.slug, ...payload });
      }
      if (selectedSlug === "home") {
        const shorts = (payload.content as { youtubeShorts?: { vid?: string }[] })?.youtubeShorts;
        const emptyShorts = Array.isArray(shorts)
          ? shorts.filter((s) => !s.vid?.trim()).length
          : 0;
        if (emptyShorts > 0) {
          toast({
            title: "Saved — but some shorts have no video",
            description: `${emptyShorts} YouTube short(s) have empty Video URL. Upload or paste a link, then save again.`,
            variant: "destructive",
          });
        } else {
          toast({ title: "Page content saved successfully" });
        }
      } else {
        toast({ title: "Page content saved successfully" });
      }
      loadPageContent(selectedSlug);
    } catch (err: any) {
      toast({
        title: "Failed to save page content",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setPageSaving(false);
    }
  };

  const handleSettingsSave = async () => {
    if (!siteSettings) return;
    setSettingsSaving(true);
    try {
      await SiteSettingsAPI.update(siteSettings);
      toast({ title: "Site settings updated successfully" });
      loadSiteSettings();
    } catch (err: any) {
      toast({
        title: "Failed to save site settings",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleContentChange = (field: string, value: any) => {
    if (!pageData) return;
    setPageData({
      ...pageData,
      content: {
        ...pageData.content,
        [field]: value,
      },
    });
  };

  const handleNavLinksChange = (index: number, field: "label" | "href", value: string) => {
    if (!siteSettings) return;
    const newLinks = [...siteSettings.navLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSiteSettings({ ...siteSettings, navLinks: newLinks });
  };

  const handleSocialLinksChange = (index: number, field: "platform" | "url", value: string) => {
    if (!siteSettings) return;
    const newLinks = [...siteSettings.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSiteSettings({ ...siteSettings, socialLinks: newLinks });
  };

  const handleFooterLinksChange = (index: number, field: "label" | "href", value: string) => {
    if (!siteSettings) return;
    const links = [...(siteSettings.footerLinks || [])];
    links[index] = { ...links[index], [field]: value };
    setSiteSettings({ ...siteSettings, footerLinks: links });
  };

  const PAGE_GROUPS = [...new Set(PAGE_OPTIONS.map((p) => p.group))];

  const renderPageHeroEditors = () => {
    const c = pageData?.content || {};
    const onChange = handleContentChange;

    if (selectedSlug === "programs") {
      return (
        <PageHeroEditor
          content={c}
          onChange={onChange}
          websiteLocation="/programs page → top hero"
          multiLineTitle
          showBadge
          showCta
        />
      );
    }
    if (selectedSlug === "services") {
      return (
        <PageHeroEditor
          content={c}
          onChange={onChange}
          websiteLocation="/services page → top hero (TRAIN. PERFORM. EVOLVE.)"
          multiLineTitle
        />
      );
    }
    if (selectedSlug === "workshops" || selectedSlug === "faq" || selectedSlug === "testimonials" || selectedSlug === "membership") {
      const loc: Record<string, string> = {
        workshops: "/workshops page → top hero",
        faq: "/faq page → top hero",
        testimonials: "/testimonials page → top hero",
        membership: "/membership page → top hero",
      };
      return (
        <PageHeroEditor content={c} onChange={onChange} websiteLocation={loc[selectedSlug]} splitTitle />
      );
    }
    if (selectedSlug === "blog") {
      return (
        <PageHeroEditor content={c} onChange={onChange} websiteLocation="/blog page → THE JOURNAL hero" />
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Website Content Control</h1>
            <p className="mt-1 text-muted-foreground">
              Poori website ka control — section-wise edit, photo/video upload, slug se save. Structure map dekhein taaki samajh aaye kya kahan dikhega.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={activeTab === "map" ? "default" : "outline"}
              onClick={() => setActiveTab("map")}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" /> Website Map
            </Button>
            <Button
              variant={activeTab === "pages" ? "default" : "outline"}
              onClick={() => setActiveTab("pages")}
              className="gap-2"
            >
              <Layout className="h-4 w-4" /> Pages
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "outline"}
              onClick={() => setActiveTab("settings")}
              className="gap-2"
            >
              <Settings className="h-4 w-4" /> Site Settings
            </Button>
          </div>
        </div>

        {activeTab === "map" ? (
          <div className="animate-slide-up">
            <WebsiteStructureMap
              onSelectSlug={(slug) => {
                if (slug !== "settings") {
                  setSelectedSlug(slug as PageSlug);
                  setActiveTab("pages");
                } else {
                  setActiveTab("settings");
                }
              }}
            />
          </div>
        ) : activeTab === "pages" ? (
          <div className="space-y-6 animate-slide-up">
            {/* Page selection sub-bar */}
            <div className="space-y-3">
              {PAGE_GROUPS.map((group) => (
                <div key={group}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 px-1">{group}</p>
                  <div className="flex gap-2 bg-muted/30 p-1.5 rounded-lg overflow-x-auto flex-wrap">
                    {PAGE_OPTIONS.filter((p) => p.group === group).map(({ slug, label, path }) => (
                      <button
                        key={slug}
                        type="button"
                        onClick={() => setSelectedSlug(slug)}
                        title={path}
                        className={`min-w-[90px] text-center py-2 px-3 text-sm font-semibold rounded-md transition ${
                          selectedSlug === slug
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Card className="border-primary/20 bg-primary/5 p-4 flex gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong className="text-foreground">Homepage service circles</strong> → sidebar <strong>Services CMS</strong></p>
                <p><strong className="text-foreground">Gallery photos/videos</strong> → sidebar <strong>Gallery</strong></p>
                <p><strong className="text-foreground">Student reviews</strong> → sidebar <strong>Testimonials</strong></p>
                <p><strong className="text-foreground">FAQ section</strong> → sidebar <strong>FAQs</strong></p>
                <p><strong className="text-foreground">Top announcement bar</strong> → Site Settings tab</p>
              </div>
            </Card>

            {pageLoading || !pageData ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <p className="text-muted-foreground">Loading page content...</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Core Page Content Fields */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-border bg-card p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2 border-b border-border pb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground text-lg capitalize">
                        {selectedSlug} Page Text Content
                      </h3>
                    </div>

                    {selectedSlug === "home" && (
                      <HomePageCMSEditor content={pageData.content || {}} onChange={handleContentChange} />
                    )}

                    {renderPageHeroEditors()}

                    {selectedSlug === "about" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="storyTitle">Story Title</Label>
                          <Input
                            id="storyTitle"
                            value={pageData.content.storyTitle || ""}
                            onChange={(e) => handleContentChange("storyTitle", e.target.value)}
                            className="bg-muted/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="storyText">Story Content Text</Label>
                          <Textarea
                            id="storyText"
                            value={pageData.content.storyText || ""}
                            onChange={(e) => handleContentChange("storyText", e.target.value)}
                            className="bg-muted/50 min-h-[120px]"
                          />
                        </div>
                        <div className="space-y-2 pt-4 border-t border-border">
                          <Label htmlFor="missionTitle">Mission Title</Label>
                          <Input
                            id="missionTitle"
                            value={pageData.content.missionTitle || ""}
                            onChange={(e) => handleContentChange("missionTitle", e.target.value)}
                            className="bg-muted/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="missionText">Mission Statement</Label>
                          <Textarea
                            id="missionText"
                            value={pageData.content.missionText || ""}
                            onChange={(e) => handleContentChange("missionText", e.target.value)}
                            className="bg-muted/50 min-h-[100px]"
                          />
                        </div>
                        <MediaUrlField
                          label="Hero / Hologram Video"
                          websiteLocation="/about page → hero video"
                          value={pageData.content.heroVideoUrl || ""}
                          onChange={(url) => handleContentChange("heroVideoUrl", url)}
                          mediaType="video"
                        />
                        <div className="space-y-2">
                          <Label>Stats (JSON array)</Label>
                          <Textarea value={stringifyJsonField(pageData.content.stats, [])} onChange={(e) => handleContentChange("stats", parseJsonField(e.target.value, []))} className="bg-muted/50 min-h-[100px] font-mono text-xs" />
                        </div>
                        <div className="space-y-2">
                          <Label>Pillars (JSON array)</Label>
                          <Textarea value={stringifyJsonField(pageData.content.pillars, [])} onChange={(e) => handleContentChange("pillars", parseJsonField(e.target.value, []))} className="bg-muted/50 min-h-[100px] font-mono text-xs" />
                        </div>
                        <div className="space-y-2">
                          <Label>Timeline (JSON array)</Label>
                          <Textarea value={stringifyJsonField(pageData.content.timeline, [])} onChange={(e) => handleContentChange("timeline", parseJsonField(e.target.value, []))} className="bg-muted/50 min-h-[100px] font-mono text-xs" />
                        </div>
                        <div className="space-y-2">
                          <Label>Ecosystem (JSON array)</Label>
                          <Textarea value={stringifyJsonField(pageData.content.ecosystem, [])} onChange={(e) => handleContentChange("ecosystem", parseJsonField(e.target.value, []))} className="bg-muted/50 min-h-[100px] font-mono text-xs" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-3 pt-4 border-t border-border">
                          <Input placeholder="CTA Title" value={pageData.content.ctaTitle || ""} onChange={(e) => handleContentChange("ctaTitle", e.target.value)} className="bg-muted/50" />
                          <Input placeholder="CTA Button" value={pageData.content.ctaButtonText || ""} onChange={(e) => handleContentChange("ctaButtonText", e.target.value)} className="bg-muted/50" />
                        </div>
                        <div className="space-y-2">
                          <Label>CTA Text</Label>
                          <Textarea value={pageData.content.ctaText || ""} onChange={(e) => handleContentChange("ctaText", e.target.value)} className="bg-muted/50 min-h-[80px]" />
                        </div>
                      </div>
                    )}

                    {(selectedSlug === "schedule" || selectedSlug === "live-zoom" || selectedSlug === "gallery") && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Hero Title</Label>
                          <Input value={pageData.content.heroTitle || ""} onChange={(e) => handleContentChange("heroTitle", e.target.value)} className="bg-muted/50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Hero Subtitle</Label>
                          <Textarea value={pageData.content.heroSubtitle || ""} onChange={(e) => handleContentChange("heroSubtitle", e.target.value)} className="bg-muted/50 min-h-[80px]" />
                        </div>
                        {selectedSlug === "schedule" && (
                          <div className="space-y-2">
                            <Label>Schedule Rows (JSON)</Label>
                            <Textarea value={stringifyJsonField(pageData.content.scheduleRows, [])} onChange={(e) => handleContentChange("scheduleRows", parseJsonField(e.target.value, []))} className="bg-muted/50 min-h-[160px] font-mono text-xs" />
                          </div>
                        )}
                        {selectedSlug === "live-zoom" && (
                          <>
                            <div className="space-y-2">
                              <Label>Sessions (JSON)</Label>
                              <Textarea value={stringifyJsonField(pageData.content.sessions, [])} onChange={(e) => handleContentChange("sessions", parseJsonField(e.target.value, []))} className="bg-muted/50 min-h-[120px] font-mono text-xs" />
                            </div>
                            <div className="space-y-2">
                              <Label>Join Steps (JSON)</Label>
                              <Textarea value={stringifyJsonField(pageData.content.joinSteps, [])} onChange={(e) => handleContentChange("joinSteps", parseJsonField(e.target.value, []))} className="bg-muted/50 min-h-[100px] font-mono text-xs" />
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
                            value={pageData.content.headerTitle || ""}
                            onChange={(e) => handleContentChange("headerTitle", e.target.value)}
                            className="bg-muted/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="headerSubtitle">Header Subtitle Description</Label>
                          <Textarea
                            id="headerSubtitle"
                            value={pageData.content.headerSubtitle || ""}
                            onChange={(e) => handleContentChange("headerSubtitle", e.target.value)}
                            className="bg-muted/50 min-h-[80px]"
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-border">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Contact Phone Number</Label>
                            <Input
                              id="phone"
                              value={pageData.content.phone || ""}
                              onChange={(e) => handleContentChange("phone", e.target.value)}
                              className="bg-muted/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Contact Email Address</Label>
                            <Input
                              id="email"
                              value={pageData.content.email || ""}
                              onChange={(e) => handleContentChange("email", e.target.value)}
                              className="bg-muted/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Studio Address</Label>
                          <Input
                            id="address"
                            value={pageData.content.address || ""}
                            onChange={(e) => handleContentChange("address", e.target.value)}
                            className="bg-muted/50"
                          />
                        </div>
                      </div>
                    )}

                    {(selectedSlug === "terms" || selectedSlug === "privacy") && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-border pb-2">
                          <h4 className="font-semibold text-foreground text-md">Document Sections</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const currentSections = pageData.content.sections || [];
                              handleContentChange("sections", [
                                ...currentSections,
                                { title: `Section ${currentSections.length + 1}`, text: "" }
                              ]);
                            }}
                            className="gap-1.5"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Section
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {(pageData.content.sections || []).map((sec: any, idx: number) => (
                            <Card key={idx} className="p-4 bg-muted/30 border border-border/50 space-y-3 relative animate-fade-in">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-primary">Section #{idx + 1}</span>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (idx === 0) return;
                                      const currentSections = [...(pageData.content.sections || [])];
                                      const temp = currentSections[idx];
                                      currentSections[idx] = currentSections[idx - 1];
                                      currentSections[idx - 1] = temp;
                                      handleContentChange("sections", currentSections);
                                    }}
                                    disabled={idx === 0}
                                    className="h-8 w-8 text-foreground"
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const currentSections = [...(pageData.content.sections || [])];
                                      if (idx === currentSections.length - 1) return;
                                      const temp = currentSections[idx];
                                      currentSections[idx] = currentSections[idx + 1];
                                      currentSections[idx + 1] = temp;
                                      handleContentChange("sections", currentSections);
                                    }}
                                    disabled={idx === (pageData.content.sections || []).length - 1}
                                    className="h-8 w-8 text-foreground"
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const currentSections = (pageData.content.sections || []).filter((_: any, i: number) => i !== idx);
                                      handleContentChange("sections", currentSections);
                                    }}
                                    className="h-8 w-8 text-foreground"
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
                                    const currentSections = [...(pageData.content.sections || [])];
                                    currentSections[idx] = { ...currentSections[idx], title: e.target.value };
                                    handleContentChange("sections", currentSections);
                                  }}
                                  className="bg-muted/50 text-foreground"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Section Text Content</Label>
                                <Textarea
                                  value={sec.text || ""}
                                  onChange={(e) => {
                                    const currentSections = [...(pageData.content.sections || [])];
                                    currentSections[idx] = { ...currentSections[idx], text: e.target.value };
                                    handleContentChange("sections", currentSections);
                                  }}
                                  className="bg-muted/50 min-h-[80px] text-foreground"
                                />
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Page SEO & Publish Controls */}
                <div className="lg:col-span-1 space-y-6">
                  <Card className="border-border bg-card p-6 space-y-4">
                    <h3 className="font-semibold text-foreground text-md border-b border-border pb-2">
                      SEO & Meta Settings
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="pageTitle">Display Page Title</Label>
                      <Input
                        id="pageTitle"
                        value={typeof pageData.title === "string" ? pageData.title : pageData.title?.en || ""}
                        onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">SEO Meta Title</Label>
                      <Input
                        id="metaTitle"
                        value={pageData.metaTitle || ""}
                        onChange={(e) => setPageData({ ...pageData, metaTitle: e.target.value })}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">SEO Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={pageData.metaDescription || ""}
                        onChange={(e) => setPageData({ ...pageData, metaDescription: e.target.value })}
                        className="bg-muted/50 min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Publish Status</Label>
                      <select
                        id="status"
                        value={pageData.status}
                        onChange={(e: any) => setPageData({ ...pageData, status: e.target.value })}
                        className="w-full rounded-md border border-input bg-muted/50 p-2 text-foreground"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <Button
                      onClick={handlePageSave}
                      disabled={pageSaving}
                      className="w-full gradient-primary text-primary-foreground font-semibold py-3 gap-2"
                    >
                      <Save className="h-4 w-4" /> {pageSaving ? "Saving..." : "Save Page Content"}
                    </Button>
                  </Card>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            {settingsLoading || !siteSettings ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <p className="text-muted-foreground">Loading site settings...</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  {/* General settings */}
                  <Card className="border-border bg-card p-6 space-y-4">
                    <h3 className="font-semibold text-foreground text-md border-b border-border pb-2">
                      Header & Footer Design
                    </h3>
                    <div className="space-y-2">
                      <MediaUrlField
                        label="Studio Logo"
                        websiteLocation="Header + Footer → logo image"
                        value={siteSettings.logoUrl || ""}
                        onChange={(url) => setSiteSettings({ ...siteSettings, logoUrl: url })}
                        mediaType="image"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsappNumber">WhatsApp Number (sab pages par button)</Label>
                      <Input
                        id="whatsappNumber"
                        value={siteSettings.whatsappNumber || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                        placeholder="+919876543210"
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="footerText">Copyright / Footer Text</Label>
                      <Input
                        id="footerText"
                        value={siteSettings.footerText || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, footerText: e.target.value })}
                        className="bg-muted/50"
                      />
                    </div>
                  </Card>

                  <Card className="border-border bg-card p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <h3 className="font-semibold text-foreground text-md">Footer Links</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const links = [...(siteSettings.footerLinks || []), { label: "New Link", href: "/" }];
                          setSiteSettings({ ...siteSettings, footerLinks: links });
                        }}
                        className="gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Link
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {(siteSettings.footerLinks || []).map((link, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input value={link.label} onChange={(e) => handleFooterLinksChange(idx, "label", e.target.value)} placeholder="Label" className="bg-muted/50 flex-1" />
                          <Input value={link.href} onChange={(e) => handleFooterLinksChange(idx, "href", e.target.value)} placeholder="/path" className="bg-muted/50 flex-1" />
                          <Button variant="ghost" size="icon" onClick={() => setSiteSettings({ ...siteSettings, footerLinks: (siteSettings.footerLinks || []).filter((_, i) => i !== idx) })}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Navigation Links list */}
                  <Card className="border-border bg-card p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <h3 className="font-semibold text-foreground text-md">Navigation Bar Links</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const links = [...siteSettings.navLinks, { label: "New Link", href: "/" }];
                          setSiteSettings({ ...siteSettings, navLinks: links });
                        }}
                        className="gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Link
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {siteSettings.navLinks.map((link, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            value={link.label}
                            onChange={(e) => handleNavLinksChange(idx, "label", e.target.value)}
                            placeholder="Link Label"
                            className="bg-muted/50 flex-1"
                          />
                          <Input
                            value={link.href}
                            onChange={(e) => handleNavLinksChange(idx, "href", e.target.value)}
                            placeholder="href e.g. /programs"
                            className="bg-muted/50 flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const links = siteSettings.navLinks.filter((_, i) => i !== idx);
                              setSiteSettings({ ...siteSettings, navLinks: links });
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Social Media links */}
                  <Card className="border-border bg-card p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <h3 className="font-semibold text-foreground text-md">Social Media Handles</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const links = [...siteSettings.socialLinks, { platform: "Instagram", url: "" }];
                          setSiteSettings({ ...siteSettings, socialLinks: links });
                        }}
                        className="gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Handle
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {siteSettings.socialLinks.map((link, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            value={link.platform}
                            onChange={(e) => handleSocialLinksChange(idx, "platform", e.target.value)}
                            placeholder="Platform e.g. Instagram"
                            className="bg-muted/50 flex-1"
                          />
                          <Input
                            value={link.url}
                            onChange={(e) => handleSocialLinksChange(idx, "url", e.target.value)}
                            placeholder="Full URL"
                            className="bg-muted/50 flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const links = siteSettings.socialLinks.filter((_, i) => i !== idx);
                              setSiteSettings({ ...siteSettings, socialLinks: links });
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Settings Site-Wide SEO */}
                <div className="lg:col-span-1 space-y-6">
                  <Card className="border-border bg-card p-6 space-y-4">
                    <h3 className="font-semibold text-foreground text-md border-b border-border pb-2">
                      Announcement Bar
                    </h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="announcementEnabled"
                        checked={siteSettings.announcementBar?.enabled || false}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          announcementBar: { ...siteSettings.announcementBar, enabled: e.target.checked, text: siteSettings.announcementBar?.text || "" },
                        })}
                      />
                      <Label htmlFor="announcementEnabled">Show announcement bar on website</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Announcement Text</Label>
                      <Input value={siteSettings.announcementBar?.text || ""} onChange={(e) => setSiteSettings({ ...siteSettings, announcementBar: { ...siteSettings.announcementBar, enabled: siteSettings.announcementBar?.enabled || false, text: e.target.value } })} className="bg-muted/50" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input placeholder="Button label" value={siteSettings.announcementBar?.buttonLabel || ""} onChange={(e) => setSiteSettings({ ...siteSettings, announcementBar: { ...siteSettings.announcementBar, enabled: siteSettings.announcementBar?.enabled || false, text: siteSettings.announcementBar?.text || "", buttonLabel: e.target.value } })} className="bg-muted/50" />
                      <Input placeholder="Button URL" value={siteSettings.announcementBar?.buttonUrl || ""} onChange={(e) => setSiteSettings({ ...siteSettings, announcementBar: { ...siteSettings.announcementBar, enabled: siteSettings.announcementBar?.enabled || false, text: siteSettings.announcementBar?.text || "", buttonUrl: e.target.value } })} className="bg-muted/50" />
                    </div>
                  </Card>

                  <Card className="border-border bg-card p-6 space-y-4">
                    <h3 className="font-semibold text-foreground text-md border-b border-border pb-2">
                      Site-Wide Default SEO
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="seoTitle">SEO Title Title</Label>
                      <Input
                        id="seoTitle"
                        value={siteSettings.metaTitle || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, metaTitle: e.target.value })}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoDescription">SEO Meta Description</Label>
                      <Textarea
                        id="seoDescription"
                        value={siteSettings.metaDescription || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, metaDescription: e.target.value })}
                        className="bg-muted/50 min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="canonicalUrl">Canonical Domain URL</Label>
                      <Input
                        id="canonicalUrl"
                        value={siteSettings.canonicalUrl || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, canonicalUrl: e.target.value })}
                        placeholder="https://gdpstudio.com"
                        className="bg-muted/50"
                      />
                    </div>

                    <Button
                      onClick={handleSettingsSave}
                      disabled={settingsSaving}
                      className="w-full gradient-primary text-primary-foreground font-semibold py-3 gap-2"
                    >
                      <Save className="h-4 w-4" /> {settingsSaving ? "Saving..." : "Save Site Settings"}
                    </Button>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CMSPage;
