import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUrlField } from "@/components/cms/MediaUrlField";
import type { ApiSiteSettings } from "@/lib/api";
import { Plus, Save, Trash2 } from "lucide-react";

type Props = {
  siteSettings: ApiSiteSettings;
  saving: boolean;
  onChange: (next: ApiSiteSettings) => void;
  onSave: () => void;
};

export function CMSGlobalSettingsEditor({ siteSettings, saving, onChange, onSave }: Props) {
  const updateNav = (index: number, field: "label" | "href", value: string) => {
    const navLinks = [...siteSettings.navLinks];
    navLinks[index] = { ...navLinks[index], [field]: value };
    onChange({ ...siteSettings, navLinks });
  };

  const updateSocial = (index: number, field: "platform" | "url", value: string) => {
    const socialLinks = [...siteSettings.socialLinks];
    socialLinks[index] = { ...socialLinks[index], [field]: value };
    onChange({ ...siteSettings, socialLinks });
  };

  const updateFooter = (index: number, field: "label" | "href", value: string) => {
    const footerLinks = [...(siteSettings.footerLinks || [])];
    footerLinks[index] = { ...footerLinks[index], [field]: value };
    onChange({ ...siteSettings, footerLinks });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card className="space-y-4 border-border bg-card p-6">
          <h3 className="border-b border-border pb-2 font-semibold text-foreground">
            Logo & Brand
          </h3>
          <MediaUrlField
            label="Studio Logo"
            hint="Leave empty to use the default GDP logo (/logo.png)."
            websiteLocation="Header + Footer → logo image"
            value={siteSettings.logoUrl || ""}
            onChange={(url) => onChange({ ...siteSettings, logoUrl: url })}
            placeholder="Empty = default logo, or /uploads/..."
            mediaType="image"
            uploadFolder="gdp-logo"
          />
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              value={siteSettings.brandLine1 || ""}
              onChange={(e) => onChange({ ...siteSettings, brandLine1: e.target.value })}
              placeholder="Garima"
              className="bg-muted/50"
            />
            <Input
              value={siteSettings.brandLine2 || ""}
              onChange={(e) => onChange({ ...siteSettings, brandLine2: e.target.value })}
              placeholder="Dance"
              className="bg-muted/50"
            />
            <Input
              value={siteSettings.brandLine3 || ""}
              onChange={(e) => onChange({ ...siteSettings, brandLine3: e.target.value })}
              placeholder="Productions"
              className="bg-muted/50"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={siteSettings.headerCtaLabel || ""}
              onChange={(e) => onChange({ ...siteSettings, headerCtaLabel: e.target.value })}
              placeholder="Join Studio"
              className="bg-muted/50"
            />
            <Input
              value={siteSettings.headerCtaUrl || ""}
              onChange={(e) => onChange({ ...siteSettings, headerCtaUrl: e.target.value })}
              placeholder="/login"
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              value={siteSettings.whatsappNumber || ""}
              onChange={(e) => onChange({ ...siteSettings, whatsappNumber: e.target.value })}
              placeholder="+919876543210"
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="footerTagline">Footer tagline</Label>
            <Textarea
              id="footerTagline"
              value={siteSettings.footerTagline || ""}
              onChange={(e) => onChange({ ...siteSettings, footerTagline: e.target.value })}
              className="min-h-[70px] bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="footerText">Copyright / Footer Text</Label>
            <Input
              id="footerText"
              value={siteSettings.footerText || ""}
              onChange={(e) => onChange({ ...siteSettings, footerText: e.target.value })}
              className="bg-muted/50"
            />
          </div>
        </Card>

        <Card className="space-y-4 border-border bg-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-semibold text-foreground">Footer Links</h3>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() =>
                onChange({
                  ...siteSettings,
                  footerLinks: [
                    ...(siteSettings.footerLinks || []),
                    { label: "New Link", href: "/" },
                  ],
                })
              }
            >
              <Plus className="h-3.5 w-3.5" /> Add Link
            </Button>
          </div>
          <div className="space-y-3">
            {(siteSettings.footerLinks || []).map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={link.label}
                  onChange={(e) => updateFooter(idx, "label", e.target.value)}
                  placeholder="Label"
                  className="flex-1 bg-muted/50"
                />
                <Input
                  value={link.href}
                  onChange={(e) => updateFooter(idx, "href", e.target.value)}
                  placeholder="/path"
                  className="flex-1 bg-muted/50"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    onChange({
                      ...siteSettings,
                      footerLinks: (siteSettings.footerLinks || []).filter((_, i) => i !== idx),
                    })
                  }
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 border-border bg-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-semibold text-foreground">Footer Service Links</h3>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() =>
                onChange({
                  ...siteSettings,
                  footerServiceLinks: [
                    ...(siteSettings.footerServiceLinks || []),
                    { label: "New Service", href: "/services" },
                  ],
                })
              }
            >
              <Plus className="h-3.5 w-3.5" /> Add Link
            </Button>
          </div>
          <div className="space-y-3">
            {(siteSettings.footerServiceLinks || []).map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={link.label}
                  onChange={(e) => {
                    const footerServiceLinks = [...(siteSettings.footerServiceLinks || [])];
                    footerServiceLinks[idx] = {
                      ...footerServiceLinks[idx],
                      label: e.target.value,
                    };
                    onChange({ ...siteSettings, footerServiceLinks });
                  }}
                  placeholder="Label"
                  className="flex-1 bg-muted/50"
                />
                <Input
                  value={link.href}
                  onChange={(e) => {
                    const footerServiceLinks = [...(siteSettings.footerServiceLinks || [])];
                    footerServiceLinks[idx] = {
                      ...footerServiceLinks[idx],
                      href: e.target.value,
                    };
                    onChange({ ...siteSettings, footerServiceLinks });
                  }}
                  placeholder="/services"
                  className="flex-1 bg-muted/50"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    onChange({
                      ...siteSettings,
                      footerServiceLinks: (siteSettings.footerServiceLinks || []).filter(
                        (_, i) => i !== idx,
                      ),
                    })
                  }
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 border-border bg-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-semibold text-foreground">Navigation Links</h3>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() =>
                onChange({
                  ...siteSettings,
                  navLinks: [...siteSettings.navLinks, { label: "New Link", href: "/" }],
                })
              }
            >
              <Plus className="h-3.5 w-3.5" /> Add Link
            </Button>
          </div>
          <div className="space-y-3">
            {siteSettings.navLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={link.label}
                  onChange={(e) => updateNav(idx, "label", e.target.value)}
                  placeholder="Link Label"
                  className="flex-1 bg-muted/50"
                />
                <Input
                  value={link.href}
                  onChange={(e) => updateNav(idx, "href", e.target.value)}
                  placeholder="/programs"
                  className="flex-1 bg-muted/50"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    onChange({
                      ...siteSettings,
                      navLinks: siteSettings.navLinks.filter((_, i) => i !== idx),
                    })
                  }
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 border-border bg-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-semibold text-foreground">Social Handles</h3>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() =>
                onChange({
                  ...siteSettings,
                  socialLinks: [
                    ...siteSettings.socialLinks,
                    { platform: "Instagram", url: "" },
                  ],
                })
              }
            >
              <Plus className="h-3.5 w-3.5" /> Add Handle
            </Button>
          </div>
          <div className="space-y-3">
            {siteSettings.socialLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={link.platform}
                  onChange={(e) => updateSocial(idx, "platform", e.target.value)}
                  placeholder="Platform"
                  className="flex-1 bg-muted/50"
                />
                <Input
                  value={link.url}
                  onChange={(e) => updateSocial(idx, "url", e.target.value)}
                  placeholder="Full URL"
                  className="flex-1 bg-muted/50"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    onChange({
                      ...siteSettings,
                      socialLinks: siteSettings.socialLinks.filter((_, i) => i !== idx),
                    })
                  }
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="space-y-4 border-border bg-card p-6">
          <h3 className="border-b border-border pb-2 font-semibold text-foreground">
            Announcement Bar
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="announcementEnabled"
              checked={siteSettings.announcementBar?.enabled || false}
              onChange={(e) =>
                onChange({
                  ...siteSettings,
                  announcementBar: {
                    ...siteSettings.announcementBar,
                    enabled: e.target.checked,
                    text: siteSettings.announcementBar?.text || "",
                  },
                })
              }
            />
            <Label htmlFor="announcementEnabled">Show on website</Label>
          </div>
          <div className="space-y-2">
            <Label>Announcement Text</Label>
            <Input
              value={siteSettings.announcementBar?.text || ""}
              onChange={(e) =>
                onChange({
                  ...siteSettings,
                  announcementBar: {
                    ...siteSettings.announcementBar,
                    enabled: siteSettings.announcementBar?.enabled || false,
                    text: e.target.value,
                  },
                })
              }
              className="bg-muted/50"
            />
          </div>
          <Input
            placeholder="Button label"
            value={siteSettings.announcementBar?.buttonLabel || ""}
            onChange={(e) =>
              onChange({
                ...siteSettings,
                announcementBar: {
                  ...siteSettings.announcementBar,
                  enabled: siteSettings.announcementBar?.enabled || false,
                  text: siteSettings.announcementBar?.text || "",
                  buttonLabel: e.target.value,
                },
              })
            }
            className="bg-muted/50"
          />
          <Input
            placeholder="Button URL"
            value={siteSettings.announcementBar?.buttonUrl || ""}
            onChange={(e) =>
              onChange({
                ...siteSettings,
                announcementBar: {
                  ...siteSettings.announcementBar,
                  enabled: siteSettings.announcementBar?.enabled || false,
                  text: siteSettings.announcementBar?.text || "",
                  buttonUrl: e.target.value,
                },
              })
            }
            className="bg-muted/50"
          />
        </Card>

        <Card className="space-y-4 border-border bg-card p-6">
          <h3 className="border-b border-border pb-2 font-semibold text-foreground">Default SEO</h3>
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              value={siteSettings.metaTitle || ""}
              onChange={(e) => onChange({ ...siteSettings, metaTitle: e.target.value })}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDescription">Meta Description</Label>
            <Textarea
              id="seoDescription"
              value={siteSettings.metaDescription || ""}
              onChange={(e) => onChange({ ...siteSettings, metaDescription: e.target.value })}
              className="min-h-[100px] bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="canonicalUrl">Canonical Domain</Label>
            <Input
              id="canonicalUrl"
              value={siteSettings.canonicalUrl || ""}
              onChange={(e) => onChange({ ...siteSettings, canonicalUrl: e.target.value })}
              placeholder="https://gdpstudio.com"
              className="bg-muted/50"
            />
          </div>
          <Button
            onClick={onSave}
            disabled={saving}
            className="w-full gap-2 py-3 font-semibold gradient-primary text-primary-foreground"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Header & Footer"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
