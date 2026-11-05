import { useEffect, useState } from 'react';
import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { PermissionGate } from '@/components/PermissionGate';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Shield, Palette } from 'lucide-react';
import { ColorPicker } from '@/components/ColorPicker';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SettingsAPI, type ApiSettings } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useThemeColor, ThemeColor } from '@/contexts/ThemeColorContext';

const ColorPickerWrapper = ({ onColorChange }: { onColorChange: (color: ThemeColor) => void }) => {
  const { themeColor } = useThemeColor();
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    onColorChange(themeColor);
  }, [themeColor]);

  return <ColorPicker />;
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<ApiSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { themeColor, setThemeColor } = useThemeColor();

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings?.themeColor && !loading) {
      const colorMap: Record<string, ThemeColor> = {
        sky: 'sky',
        violet: 'violet',
        emerald: 'emerald',
        rose: 'rose',
        amber: 'amber',
        orange: 'orange',
        teal: 'teal',
        pink: 'pink',
        indigo: 'indigo',
        cyan: 'cyan',
        lime: 'lime',
        red: 'red',
      };
      const mappedColor = colorMap[settings.themeColor] || 'sky';
      if (mappedColor !== themeColor) {
        setThemeColor(mappedColor);
      }
    }
  }, [settings?.themeColor, loading]);

  const loadSettings = async () => {
    try {
      const data = await SettingsAPI.get();
      setSettings(data.settings);
      if (data.settings.themeColor) {
        const colorMap: Record<string, ThemeColor> = {
          sky: 'sky',
          violet: 'violet',
          emerald: 'emerald',
          rose: 'rose',
          amber: 'amber',
          orange: 'orange',
          teal: 'teal',
          pink: 'pink',
          indigo: 'indigo',
          cyan: 'cyan',
          lime: 'lime',
          red: 'red',
        };
        const mappedColor = colorMap[data.settings.themeColor] || 'sky';
        setThemeColor(mappedColor);
      }
    } catch (err: any) {
      toast({ title: 'Failed to load settings', description: err?.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const settingsToSave = {
        ...settings,
        themeColor: themeColor,
      };
      const data = await SettingsAPI.update(settingsToSave);
      setSettings(data.settings);
      toast({ title: 'Settings saved successfully' });
    } catch (err: any) {
      toast({ title: 'Failed to save settings', description: err?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleThemeColorChange = (color: ThemeColor) => {
    setThemeColor(color);
    if (settings) {
      setSettings({ ...settings, themeColor: color });
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
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your platform preferences and configurations.
            </p>
          </div>
          <PermissionGate permission="settings.edit">
            <Button
              onClick={handleSave}
              disabled={saving || !settings}
              className="gap-2 gradient-primary text-primary-foreground hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </PermissionGate>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card p-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Appearance</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Theme Mode</Label>
                  <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
                </div>
                <ThemeToggle />
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-foreground">Theme Color</Label>
                  <p className="text-xs text-muted-foreground">Choose your preferred accent and button color</p>
                </div>
                <PermissionGate
                  permission="settings.edit"
                  fallback={<ColorPicker />}
                >
                  <ColorPickerWrapper onColorChange={handleThemeColorChange} />
                </PermissionGate>
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Security</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactor" className="text-foreground">Two-Factor Auth</Label>
                <p className="text-xs text-muted-foreground">Require 2FA for all users</p>
              </div>
              <PermissionGate
                permission="settings.edit"
                fallback={<Switch disabled checked={settings.twoFactorAuth} />}
              >
                <Switch
                  id="twoFactor"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
                />
              </PermissionGate>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
