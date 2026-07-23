import { useEffect, useMemo, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Save } from "lucide-react";
import { WebsiteStructureMap } from "@/components/cms/WebsiteStructureMap";
import { WebsitePageNav } from "@/components/cms/WebsitePageNav";
import { RelatedContentLinks } from "@/components/cms/RelatedContentLinks";
import { CMSPageContentEditor } from "@/components/cms/CMSPageContentEditor";
import { CMSGlobalSettingsEditor } from "@/components/cms/CMSGlobalSettingsEditor";
import { normalizeHomeContentForSave } from "@/lib/homeCms";
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

  const [pageData, setPageData] = useState<ApiPageContent | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageSaving, setPageSaving] = useState(false);

  const [siteSettings, setSiteSettings] = useState<ApiSiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const { toast } = useToast();
  const activeNavItem = useMemo(() => findWebsiteNavItem(activeNavId), [activeNavId]);

  const loadPageContent = async (slug: PageSlug) => {
    setPageLoading(true);
    try {
      const data = await PageContentAPI.getBySlug(slug);
      let page = data.page;
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

  const handlePageSave = async () => {
    if (!pageData || !selectedSlug) return;
    setPageSaving(true);
    try {
      const payload = {
        title: pageData.title,
        content:
          selectedSlug === "home"
            ? normalizeHomeContentForSave(pageData.content || {})
            : selectedSlug === "workshops"
              ? normalizeWorkshopsPageContentForSave(pageData.content || {})
              : pageData.content,
        metaTitle: pageData.metaTitle,
        metaDescription: pageData.metaDescription,
        canonicalUrl: pageData.canonicalUrl,
        status: pageData.status,
      };
      if (pageData._id) await PageContentAPI.update(pageData._id, payload);
      else await PageContentAPI.create({ slug: pageData.slug, ...payload });
      toast({ title: "Page content saved successfully" });
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
      toast({ title: "Header & footer saved" });
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

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl tracking-tight text-foreground sm:text-3xl">
              Website Control
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Edit the public site in the same order visitors browse. Choose a page on the left,
              update its sections, then save.
            </p>
          </div>
          {activeNavItem?.path ? (
            <a
              href={activeNavItem.path}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Open live page <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
          <Card className="h-fit border-border bg-card p-3 xl:sticky xl:top-6">
            <WebsitePageNav activeId={activeNavId} onSelect={setActiveNavId} />
          </Card>

          <div className="min-w-0 space-y-5">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">
                {activeNavItem?.label || "Website"}
              </h2>
              {activeNavItem?.hint ? (
                <p className="text-sm text-muted-foreground">{activeNavItem.hint}</p>
              ) : null}
            </div>

            {activeNavId === "overview" ? (
              <WebsiteStructureMap
                onSelectSlug={(slug) => {
                  if (slug === "settings") setActiveNavId("global");
                  else setActiveNavId(slug as WebsiteNavId);
                }}
              />
            ) : activeNavId === "global" ? (
              settingsLoading || !siteSettings ? (
                <div className="flex min-h-[240px] items-center justify-center">
                  <p className="text-muted-foreground">Loading header & footer...</p>
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
              <div className="flex min-h-[240px] items-center justify-center">
                <p className="text-muted-foreground">Loading page content...</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <CMSPageContentEditor
                    selectedSlug={selectedSlug}
                    pageData={pageData}
                    pageLabel={activeNavItem?.label || selectedSlug}
                    onContentChange={handleContentChange}
                  />
                </div>

                <div className="space-y-6">
                  <RelatedContentLinks links={activeNavItem?.related} />
                  <Card className="space-y-4 border-border bg-card p-6">
                    <h3 className="border-b border-border pb-2 font-semibold text-foreground">
                      SEO & Publish
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="pageTitle">Display Title</Label>
                      <Input
                        id="pageTitle"
                        value={
                          typeof pageData.title === "string"
                            ? pageData.title
                            : (pageData.title as { en?: string })?.en || ""
                        }
                        onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        value={pageData.metaTitle || ""}
                        onChange={(e) =>
                          setPageData({ ...pageData, metaTitle: e.target.value })
                        }
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={pageData.metaDescription || ""}
                        onChange={(e) =>
                          setPageData({ ...pageData, metaDescription: e.target.value })
                        }
                        className="min-h-[80px] bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={pageData.status}
                        onChange={(e) =>
                          setPageData({
                            ...pageData,
                            status: e.target.value as ApiPageContent["status"],
                          })
                        }
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
                      className="w-full gap-2 py-3 font-semibold gradient-primary text-primary-foreground"
                    >
                      <Save className="h-4 w-4" />
                      {pageSaving ? "Saving..." : "Save Page Content"}
                    </Button>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CMSPage;
