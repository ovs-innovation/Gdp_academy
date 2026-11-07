import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  PageContentAPI,
  SiteSettingsAPI,
  type ApiPageContent,
  type ApiSiteSettings,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  ExternalLink,
  Save,
  Globe,
  FileText,
  Search,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { WebsiteStructureMap } from "@/components/cms/WebsiteStructureMap";
import { WebsitePageNav } from "@/components/cms/WebsitePageNav";
import { CMSPageContentEditor } from "@/components/cms/CMSPageContentEditor";
import { CMSGlobalSettingsEditor } from "@/components/cms/CMSGlobalSettingsEditor";
import { normalizeHomeContentForSave, normalizeHomeContentFromApi } from "@/lib/homeCms";
import { normalizeWorkshopsPageContentForSave } from "@/lib/workshopsPageCms";
import {
  findWebsiteNavItem,
  type PageSlug,
  type WebsiteNavId,
} from "@/lib/websiteControlNav";

const CMSPage = () => {
  const [activeNavId, setActiveNavId] = useState<WebsiteNavId>("home");
  const selectedSlug: PageSlug | null =
    activeNavId !== "overview" && activeNavId !== "global" ? activeNavId : null;

  const [activeTab, setActiveTab] = useState<string>("content");
  const [pageData, setPageData] = useState<ApiPageContent | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageSaving, setPageSaving] = useState(false);

  const [siteSettings, setSiteSettings] = useState<ApiSiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const { toast } = useToast();
  const activeNavItem = useMemo(() => findWebsiteNavItem(activeNavId), [activeNavId]);

  // Reset tab to content when page changes
  useEffect(() => {
    setActiveTab("content");
  }, [activeNavId]);

  const loadPageContent = async (slug: PageSlug) => {
    setPageLoading(true);
    try {
      const data = await PageContentAPI.getBySlug(slug);
      let page = data.page;
      if (slug === "home" && page) {
        page = {
          ...page,
          content: normalizeHomeContentFromApi(page.content || {}),
        };
      }
      if (slug === "workshops" && page) {
        page = {
          ...page,
          content: normalizeWorkshopsPageContentForSave(page.content || {}),
        };
      }
      setPageData(page);
    } catch {
      setPageData({
        _id: "",
        slug,
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        content: {},
        status: "published",
      } as ApiPageContent);
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

  useEffect(() => {
    if (selectedSlug) loadPageContent(selectedSlug);
    else if (activeNavId === "global") loadSiteSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNavId, selectedSlug]);

  const syncContactFields = async (fields: {
    phone?: string;
    email?: string;
    address?: string;
  }) => {
    const patch: Record<string, string> = {};
    if (typeof fields.phone === "string" && fields.phone.trim()) {
      patch.phone = fields.phone.trim();
    }
    if (typeof fields.email === "string" && fields.email.trim()) {
      patch.email = fields.email.trim();
    }
    if (typeof fields.address === "string" && fields.address.trim()) {
      patch.address = fields.address.trim();
    }
    if (Object.keys(patch).length === 0) return;
    try {
      await SiteSettingsAPI.update(patch);
    } catch {
      // best-effort sync
    }
  };

  const syncContactPageFromSettings = async (settings: ApiSiteSettings) => {
    try {
      const current = await PageContentAPI.getBySlug("contact");
      const c = current?.page?.content || {};
      const nextContent = {
        ...c,
        phone: settings.phone ?? c.phone,
        email: settings.email ?? c.email,
        address: settings.address ?? c.address,
      };
      const idOrSlug = current?.page?._id || "contact";
      await PageContentAPI.update(idOrSlug, { content: nextContent });
    } catch {
      // best-effort sync
    }
  };

  const handlePageSave = async () => {
    if (!selectedSlug || !pageData) return;
    setPageSaving(true);
    try {
      let contentToSave = pageData.content;
      if (selectedSlug === "home") {
        contentToSave = normalizeHomeContentForSave(contentToSave);
      }
      if (selectedSlug === "workshops") {
        contentToSave = normalizeWorkshopsPageContentForSave(contentToSave);
      }

      const payload = {
        title: pageData.title,
        content: contentToSave,
        status: pageData.status,
        metaTitle: pageData.metaTitle,
        metaDescription: pageData.metaDescription,
        canonicalUrl: pageData.canonicalUrl,
      };

      const idOrSlug = pageData._id || selectedSlug;
      await PageContentAPI.update(idOrSlug, payload);

      if (selectedSlug === "contact") {
        const c = contentToSave as { phone?: string; email?: string; address?: string };
        await syncContactFields({
          phone: c.phone,
          email: c.email,
          address: c.address,
        });
      }

      toast({ title: "Page content saved successfully", description: "Changes are now live on the website." });
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
      await syncContactPageFromSettings(siteSettings);
      toast({ title: "Header & footer saved successfully" });
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

  const handleContentChange = (field: string, value: unknown) => {
    if (!pageData) return;
    setPageData({
      ...pageData,
      content: {
        ...pageData.content,
        [field]: value,
      },
    });
  };

  const displayTitle =
    typeof pageData?.title === "string"
      ? pageData.title
      : (pageData?.title as { en?: string })?.en || activeNavItem?.label || "Page";

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Top Breadcrumb & Page Banner */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Website Page Editor
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Select any page from the left to edit its headlines, text, banners, and media.
            </p>
          </div>
          {activeNavItem?.path ? (
            <a
              href={activeNavItem.path}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
            >
              <Globe className="h-3.5 w-3.5" /> View Live Website ({activeNavItem.path}) <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </div>

        {/* 2-Column Balanced Layout */}
        <div className="grid items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* Left Column: Easy Page Switcher */}
          <Card className="max-h-[50vh] overflow-y-auto border-border bg-card p-3 shadow-sm lg:sticky lg:top-4 lg:max-h-[calc(100dvh-7.5rem)]">
            <WebsitePageNav activeId={activeNavId} onSelect={setActiveNavId} />
          </Card>

          {/* Right Column: Full-Width Clean Workspace */}
          <div className="min-w-0 space-y-4">
            {activeNavId === "overview" ? (
              <WebsiteStructureMap
                onSelectSlug={(slug) => {
                  if (slug === "settings") setActiveNavId("global");
                  else setActiveNavId(slug as WebsiteNavId);
                }}
              />
            ) : activeNavId === "global" ? (
              settingsLoading || !siteSettings ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-border bg-card">
                  <p className="text-sm text-muted-foreground">Loading header & footer...</p>
                </div>
              ) : (
                <CMSGlobalSettingsEditor
                  siteSettings={siteSettings}
                  saving={settingsSaving}
                  onChange={setSiteSettings}
                  onSave={handleSettingsSave}
                />
              )
            ) : pageLoading || !pageData || !selectedSlug ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-border bg-card">
                <p className="text-sm text-muted-foreground">Loading page content...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Sticky Header Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur-md sticky top-3 z-10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-foreground">
                          {activeNavItem?.label || "Page Content"}
                        </h2>
                        {activeNavItem?.path && (
                          <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                            {activeNavItem.path}
                          </span>
                        )}
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          {pageData.status === "published" ? "Live on site" : pageData.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {activeNavItem?.hint || "Edit and customize content for this page."}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handlePageSave}
                    disabled={pageSaving}
                    className="gap-2 px-5 py-2 font-semibold shadow-md gradient-primary text-primary-foreground hover:opacity-90 transition"
                  >
                    <Save className="h-4 w-4" />
                    {pageSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>

                {/* Tabs: Content vs SEO vs Connected */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-1">
                    <TabsList className="bg-muted/70 p-1">
                      <TabsTrigger value="content" className="gap-2 text-xs font-semibold">
                        <FileText className="h-3.5 w-3.5" /> Page Content
                      </TabsTrigger>
                      <TabsTrigger value="seo" className="gap-2 text-xs font-semibold">
                        <Search className="h-3.5 w-3.5" /> Google SEO & Search
                      </TabsTrigger>
                      {activeNavItem?.related && activeNavItem.related.length > 0 && (
                        <TabsTrigger value="connected" className="gap-2 text-xs font-semibold">
                          <Layers className="h-3.5 w-3.5" /> Connected Content ({activeNavItem.related.length})
                        </TabsTrigger>
                      )}
                    </TabsList>
                  </div>

                  {/* Tab 1: Page Content (Full width!) */}
                  <TabsContent value="content" className="space-y-4 focus-visible:outline-none">
                    {/* Helpful non-intrusive tip if the page features connected cards */}
                    {activeNavItem?.related && activeNavItem.related.length > 0 && (
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs text-foreground/80">
                        <span>
                          💡 <strong>Dynamic Cards:</strong> Cards and items on this page are managed in their dedicated managers.
                        </span>
                        <div className="flex items-center gap-2">
                          {activeNavItem.related.slice(0, 2).map((rel) => (
                            <Link
                              key={rel.to}
                              to={rel.to}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-primary shadow-2xs hover:bg-muted"
                            >
                              {rel.label} →
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <CMSPageContentEditor
                      selectedSlug={selectedSlug}
                      pageData={pageData}
                      pageLabel={activeNavItem?.label || selectedSlug}
                      onContentChange={handleContentChange}
                    />

                    {/* Bottom Save Bar */}
                    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        After saving, refresh the live website to see your changes immediately.
                      </p>
                      <Button
                        onClick={handlePageSave}
                        disabled={pageSaving}
                        size="lg"
                        className="gap-2 px-6 font-semibold shadow-md gradient-primary text-primary-foreground"
                      >
                        <Save className="h-4 w-4" />
                        {pageSaving ? "Saving..." : "Save Page Content"}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Tab 2: SEO & Search Settings */}
                  <TabsContent value="seo" className="space-y-4 focus-visible:outline-none">
                    <Card className="border-border bg-card p-6 space-y-5">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Google Search Settings</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Configure how this page appears in Google search results and web browser tabs.
                        </p>
                      </div>

                      {/* Google Snippet Live Preview */}
                      <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-primary" /> Google Search Preview
                        </p>
                        <p className="text-xs text-emerald-500 font-mono truncate">
                          https://garimadance.com{activeNavItem?.path || ""}
                        </p>
                        <p className="text-base font-semibold text-blue-400 hover:underline cursor-pointer">
                          {pageData.metaTitle || displayTitle || "Garima Dance Productions"}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {pageData.metaDescription || "Experience the rhythm and grace of Kathak, Contemporary, and Bollywood dance classes tailored for students of all ages."}
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="pageTitle">Display Title (Browser Tab)</Label>
                          <Input
                            id="pageTitle"
                            value={displayTitle}
                            onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                            className="bg-muted/50"
                            placeholder="e.g. About Garima Dance Productions"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Page Status</Label>
                          <select
                            id="status"
                            value={pageData.status}
                            onChange={(e) =>
                              setPageData({
                                ...pageData,
                                status: e.target.value as ApiPageContent["status"],
                              })
                            }
                            className="w-full rounded-md border border-input bg-muted/50 p-2 text-sm text-foreground"
                          >
                            <option value="published">Published (Visible on live site)</option>
                            <option value="draft">Draft (Hidden from visitors)</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaTitle">SEO Meta Title (Title on Google)</Label>
                        <Input
                          id="metaTitle"
                          value={pageData.metaTitle || ""}
                          onChange={(e) =>
                            setPageData({ ...pageData, metaTitle: e.target.value })
                          }
                          placeholder="e.g. Garima Dance Productions | Kathak & Bollywood Academy"
                          className="bg-muted/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaDescription">SEO Meta Description (Summary on Google)</Label>
                        <Textarea
                          id="metaDescription"
                          value={pageData.metaDescription || ""}
                          onChange={(e) =>
                            setPageData({ ...pageData, metaDescription: e.target.value })
                          }
                          placeholder="Brief 1-2 sentence summary of what this page offers..."
                          className="min-h-[90px] bg-muted/50"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button
                          onClick={handlePageSave}
                          disabled={pageSaving}
                          size="lg"
                          className="gap-2 px-6 font-semibold gradient-primary text-primary-foreground shadow-md"
                        >
                          <Save className="h-4 w-4" />
                          {pageSaving ? "Saving..." : "Save SEO Settings"}
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Tab 3: Connected Content */}
                  {activeNavItem?.related && activeNavItem.related.length > 0 && (
                    <TabsContent value="connected" className="space-y-4 focus-visible:outline-none">
                      <Card className="border-border bg-card p-6">
                        <h3 className="text-base font-semibold text-foreground mb-1">
                          Connected Content for {activeNavItem.label}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4">
                          These lists and items appear on the {activeNavItem.label} page, but are managed in their dedicated screens. Click below to edit them:
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {activeNavItem.related.map((rel) => (
                            <Link
                              key={rel.to}
                              to={rel.to}
                              className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 hover:border-primary/40 transition group"
                            >
                              <div>
                                <p className="font-semibold text-sm text-foreground group-hover:text-primary transition">
                                  {rel.label}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">{rel.description}</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
                            </Link>
                          ))}
                        </div>
                      </Card>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CMSPage;
