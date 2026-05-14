import { useEffect, useState } from 'react';
import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { PermissionGate } from '@/components/PermissionGate';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, FileText, Layout, Phone } from 'lucide-react';
import { SettingsAPI, type ApiSettings } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const CMSPage = () => {
  const [settings, setSettings] = useState<ApiSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await SettingsAPI.get();
      setSettings(data.settings);
    } catch (err: any) {
      toast({ title: 'Failed to load content settings', description: err?.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const data = await SettingsAPI.update(settings);
      setSettings(data.settings);
      toast({ title: 'Content updated successfully' });
    } catch (err: any) {
      toast({ title: 'Failed to update content', description: err?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof ApiSettings>(key: K, value: ApiSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading || !settings) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading content settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Content Management (CMS)</h1>
            <p className="mt-1 text-muted-foreground">
              Edit hero section, about us, and other site content.
            </p>
          </div>
          <PermissionGate permission="settings.edit">
            <Button
              onClick={handleSave}
              disabled={saving || !settings}
              className="gap-2 gradient-primary text-primary-foreground hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </PermissionGate>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Hero Section */}
          <Card className="border-border bg-card p-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Hero Section</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Headline (Krona One)</Label>
                <Input
                  id="heroTitle"
                  value={settings.heroTitle || ''}
                  onChange={(e) => updateSetting('heroTitle', e.target.value)}
                  className="bg-muted/50"
                  placeholder="ELEVATE YOUR ARTISTRY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle (Montserrat)</Label>
                <Textarea
                  id="heroSubtitle"
                  value={settings.heroSubtitle || ''}
                  onChange={(e) => updateSetting('heroSubtitle', e.target.value)}
                  className="bg-muted/50 min-h-[100px]"
                  placeholder="Step into the world's most prestigious dance sanctuary..."
                />
              </div>
            </div>
          </Card>

          {/* About Section */}
          <Card className="border-border bg-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">About Us Section</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aboutText">About Us Description</Label>
                <Textarea
                  id="aboutText"
                  value={settings.aboutText || ''}
                  onChange={(e) => updateSetting('aboutText', e.target.value)}
                  className="bg-muted/50 min-h-[150px]"
                  placeholder="Garima Dance Production is a sanctuary for artists..."
                />
              </div>
            </div>
          </Card>

          {/* Final CTA Section */}
          <Card className="border-border bg-card p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Layout className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Final CTA Section</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="finalCtaTitle">CTA Headline</Label>
                <Input
                  id="finalCtaTitle"
                  value={settings.finalCtaTitle || ''}
                  onChange={(e) => updateSetting('finalCtaTitle', e.target.value)}
                  className="bg-muted/50"
                  placeholder="READY TO BEGIN YOUR TRANSFORMATION?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="finalCtaSubtitle">CTA Subtitle</Label>
                <Textarea
                  id="finalCtaSubtitle"
                  value={settings.finalCtaSubtitle || ''}
                  onChange={(e) => updateSetting('finalCtaSubtitle', e.target.value)}
                  className="bg-muted/50 min-h-[80px]"
                  placeholder="Join Garima Dance Production today and unlock your true artistic potential."
                />
              </div>
            </div>
          </Card>

          {/* Services Section */}
          <Card className="border-border bg-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Layout className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Services Section</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="servicesTitle">Services Headline</Label>
                <Input
                  id="servicesTitle"
                  value={settings.servicesTitle || ''}
                  onChange={(e) => updateSetting('servicesTitle', e.target.value)}
                  className="bg-muted/50"
                  placeholder="OUR SERVICES"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servicesSubtitle">Services Subtitle</Label>
                <Textarea
                  id="servicesSubtitle"
                  value={settings.servicesSubtitle || ''}
                  onChange={(e) => updateSetting('servicesSubtitle', e.target.value)}
                  className="bg-muted/50 min-h-[60px]"
                  placeholder="Experience the ultimate dance training ecosystem."
                />
              </div>
            </div>
          </Card>

          {/* Public Announcements Section */}
          <Card className="border-border bg-card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Public Announcements</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="announcementText">Banner Text</Label>
                <Textarea
                  id="announcementText"
                  value={settings.announcementText || ''}
                  onChange={(e) => updateSetting('announcementText', e.target.value)}
                  className="bg-muted/50 min-h-[80px]"
                  placeholder="📢 NEW WORKSHOP: CONTEMPORARY MASTERCLASS WITH ELENA VOLKOVA - ENROLLMENT OPEN NOW!"
                />
              </div>
            </div>
          </Card>

          {/* Contact & Support Section */}
          <Card className="border-border bg-card p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Engagement & Support</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number (Chatbot)</Label>
                <Input
                  id="whatsappNumber"
                  value={settings.whatsappNumber || ''}
                  onChange={(e) => updateSetting('whatsappNumber', e.target.value)}
                  className="bg-muted/50"
                  placeholder="1234567890"
                />
                <p className="text-xs text-muted-foreground">Enter number without + or spaces (e.g. 919876543210)</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CMSPage;
