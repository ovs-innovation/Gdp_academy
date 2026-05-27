import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CMSAPI, type ApiCMSContent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Save, X, ArrowUp, ArrowDown } from "lucide-react";
import { MediaUrlField } from "@/components/cms/MediaUrlField";

const getText = (val: string | Record<string, string> | undefined): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val.en || Object.values(val)[0] || "";
};

const ServicesCMSPage = () => {
  const [services, setServices] = useState<ApiCMSContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [key, setKey] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const [features, setFeatures] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await CMSAPI.list({ section: "services", limit: 100 });
      setServices(data.cms || []);
    } catch (err: any) {
      toast({ title: "Error loading services", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setKey("");
    setTitle("");
    setDescription("");
    setTagline("");
    setFeatures("");
    setImageUrl("");
    setIsActive(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key || !title) return;
    try {
      await CMSAPI.save({
        key,
        section: "services",
        title,
        description,
        content: { tagline, features: features.split(",").map((f) => f.trim()).filter(Boolean) },
        images: imageUrl ? [{ url: imageUrl, alt: title, order: 0 }] : [],
        isActive,
      });
      toast({ title: "Service created successfully" });
      setIsAdding(false);
      resetForm();
      loadServices();
    } catch (err: any) {
      toast({ title: "Failed to create service", description: err.message, variant: "destructive" });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!key || !title) return;
    try {
      await CMSAPI.save({
        key,
        section: "services",
        title,
        description,
        content: { tagline, features: features.split(",").map((f) => f.trim()).filter(Boolean) },
        images: imageUrl ? [{ url: imageUrl, alt: title, order: 0 }] : [],
        isActive,
      });
      toast({ title: "Service updated successfully" });
      setEditingId(null);
      resetForm();
      loadServices();
    } catch (err: any) {
      toast({ title: "Failed to update service", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await CMSAPI.delete(id);
      toast({ title: "Service deleted" });
      loadServices();
    } catch (err: any) {
      toast({ title: "Failed to delete", description: err.message, variant: "destructive" });
    }
  };

  const startEdit = (svc: ApiCMSContent) => {
    setEditingId(svc._id);
    setKey(svc.key);
    setTitle(getText(svc.title));
    setDescription(getText(svc.description));
    setTagline(svc.content?.tagline || "");
    setFeatures(Array.isArray(svc.content?.features) ? svc.content.features.join(", ") : "");
    setImageUrl(svc.images?.[0]?.url || "");
    setIsActive(svc.isActive);
    setIsAdding(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Homepage Service Cards</h1>
            <p className="mt-1 text-muted-foreground">Website homepage par jo gol service circles dikhte hain — unka photo, title aur text yahan se edit karein.</p>
          </div>
          {!isAdding && !editingId && (
            <Button onClick={() => { setIsAdding(true); resetForm(); }} className="gap-2 gradient-primary text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" /> Add Service
            </Button>
          )}
        </div>

        {(isAdding || editingId) && (
          <Card className="border-border bg-card p-6 animate-slide-up">
            <h3 className="font-semibold text-foreground mb-4">{editingId ? "Edit Service" : "Add New Service"}</h3>
            <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="key">Unique Key</Label>
                  <Input id="key" value={key} onChange={(e) => setKey(e.target.value)} disabled={!!editingId} required className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-muted/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-muted/50 min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (comma separated)</Label>
                <Input id="features" value={features} onChange={(e) => setFeatures(e.target.value)} className="bg-muted/50" />
              </div>
              <div className="space-y-2">
              <MediaUrlField
                label="Service circle photo"
                hint="Homepage par is service ka gol image — link paste karein (e.g. /svc-stage.png ya Cloudinary URL)"
                value={imageUrl}
                onChange={setImageUrl}
              />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <select id="isActive" value={String(isActive)} onChange={(e) => setIsActive(e.target.value === "true")} className="w-full rounded-md border border-input bg-muted/50 p-2 text-foreground">
                  <option value="true">Active</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button type="submit" className="gradient-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" /> Save Service
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border bg-card">
            <p className="text-muted-foreground">No services yet. Add your first service block!</p>
          </Card>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {services.map((svc) => (
              <Card key={svc._id} className="border-border bg-card p-6 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div className="space-y-2 flex-1">
                  <span className="text-xs uppercase px-2 py-0.5 rounded-full font-semibold bg-primary/20 text-primary">{svc.isActive ? "Active" : "Hidden"}</span>
                  <h4 className="font-semibold text-foreground text-lg">{getText(svc.title)}</h4>
                  <p className="text-sm text-muted-foreground">{svc.key}</p>
                  <p className="text-muted-foreground line-clamp-2">{getText(svc.description)}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(svc)}><Edit2 className="h-4 w-4 text-sky-500" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(svc._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ServicesCMSPage;
