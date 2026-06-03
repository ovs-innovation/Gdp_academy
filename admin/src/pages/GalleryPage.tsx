import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GalleryItemAPI, type ApiGalleryItem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Save, X, ArrowUp, ArrowDown, Image as ImageIcon, Video } from "lucide-react";
import { MediaUrlField } from "@/components/cms/MediaUrlField";

const GalleryPage = () => {
  const [items, setItems] = useState<ApiGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [type, setType] = useState<"image" | "video">("image");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<"published" | "draft" | "archived">("published");
  const [isAdding, setIsAdding] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await GalleryItemAPI.list();
      setItems(data.items || []);
    } catch (err: any) {
      toast({
        title: "Failed to load gallery items",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      await GalleryItemAPI.create({
        type,
        url,
        caption,
        status,
        order: items.length + 1,
      });

      toast({ title: "Gallery item added successfully" });
      setIsAdding(false);
      resetForm();
      loadItems();
    } catch (err: any) {
      toast({
        title: "Failed to add gallery item",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!url) return;

    try {
      await GalleryItemAPI.update(id, {
        type,
        url,
        caption,
        status,
      });

      toast({ title: "Gallery item updated successfully" });
      setEditingId(null);
      resetForm();
      loadItems();
    } catch (err: any) {
      toast({
        title: "Failed to update gallery item",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this gallery item?")) return;
    try {
      await GalleryItemAPI.delete(id);
      toast({ title: "Gallery item deleted successfully" });
      loadItems();
    } catch (err: any) {
      toast({
        title: "Failed to delete gallery item",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const reorderPayload = newItems.map((item, i) => ({
      id: item._id,
      order: i + 1,
    }));

    setItems(newItems);

    try {
      await GalleryItemAPI.reorder(reorderPayload);
    } catch (err: any) {
      toast({
        title: "Reorder failed",
        description: err.message,
        variant: "destructive",
      });
      loadItems();
    }
  };

  const startEdit = (item: ApiGalleryItem) => {
    setEditingId(item._id);
    setType(item.type);
    setUrl(item.url);
    setCaption(typeof item.caption === "string" ? item.caption : item.caption?.en || "");
    setStatus(item.status);
    setIsAdding(false);
  };

  const resetForm = () => {
    setType("image");
    setUrl("");
    setCaption("");
    setStatus("published");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="font-display text-2xl tracking-tight text-foreground sm:text-3xl">Photos & Videos Gallery</h1>
            <p className="mt-1 text-muted-foreground">The photos and videos shown on the website /gallery page — add them here by pasting a link.</p>
          </div>
          {!isAdding && !editingId && (
            <Button onClick={() => { setIsAdding(true); resetForm(); }} className="gap-2 gradient-primary text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" /> Add Media Item
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <Card className="border-border bg-card p-6 animate-slide-up">
            <h3 className="font-semibold text-foreground mb-4">
              {editingId ? "Edit Gallery Item" : "Add Gallery Media Item"}
            </h3>
            <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Media Type</Label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full rounded-md border border-input bg-muted/50 p-2.5 text-foreground text-sm"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Publish Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full rounded-md border border-input bg-muted/50 p-2.5 text-foreground text-sm"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <MediaUrlField
                label="Photo or video link"
                hint="Direct URL — paste an image (.jpg, .png) or video (.mp4) link"
                value={url}
                onChange={setUrl}
              />

              <div className="space-y-2">
                <Label htmlFor="caption">Caption / Short Description</Label>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Kathak Classical Recital 2026"
                  className="bg-muted/50"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button type="submit" className="gradient-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" /> Save Media
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Media items grid list */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground">Loading media assets...</p>
          </div>
        ) : items.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border bg-card">
            <p className="text-muted-foreground">No media assets in the gallery. Start by adding one!</p>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-slide-up">
            {items.map((item, index) => (
              <Card key={item._id} className="border-border bg-card overflow-hidden flex flex-col justify-between group">
                <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={typeof item.caption === "string" ? item.caption : item.caption?.en}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-slate-950 p-2 text-center">
                      <Video className="h-8 w-8 text-primary mb-2" />
                      <span className="text-xs truncate max-w-full font-mono">{item.url}</span>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 flex gap-1 items-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/75 text-white">
                      {item.type}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary/95 text-white">
                      {item.status}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-black/70 hover:bg-black/90 text-white border-0"
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-black/70 hover:bg-black/90 text-white border-0"
                      onClick={() => handleMove(index, "down")}
                      disabled={index === items.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground line-clamp-2">
                      {typeof item.caption === "string" ? item.caption : item.caption?.en || "(No Caption)"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Order: {item.order}</p>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-border pt-3 mt-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(item)}>
                      <Edit2 className="h-4 w-4 text-sky-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item._id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GalleryPage;
