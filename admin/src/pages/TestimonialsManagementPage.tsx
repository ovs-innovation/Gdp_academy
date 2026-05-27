import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { TestimonialAPI, type ApiTestimonial } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Save, X, ArrowUp, ArrowDown } from "lucide-react";

const getText = (val: string | Record<string, string> | undefined): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val.en || Object.values(val)[0] || "";
};

const TestimonialsManagementPage = () => {
  const [testimonials, setTestimonials] = useState<ApiTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await TestimonialAPI.list({ isActive: "all", limit: 100 });
      setTestimonials(data.testimonials || []);
    } catch (err: any) {
      toast({ title: "Error loading testimonials", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPosition("");
    setMessage("");
    setImage("");
    setRating(5);
    setIsActive(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    try {
      await TestimonialAPI.create({ name, position, message, image, rating, isActive, order: testimonials.length + 1 });
      toast({ title: "Testimonial created successfully" });
      setIsAdding(false);
      resetForm();
      loadTestimonials();
    } catch (err: any) {
      toast({ title: "Failed to create testimonial", description: err.message, variant: "destructive" });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!name || !message) return;
    try {
      await TestimonialAPI.update(id, { name, position, message, image, rating, isActive });
      toast({ title: "Testimonial updated successfully" });
      setEditingId(null);
      resetForm();
      loadTestimonials();
    } catch (err: any) {
      toast({ title: "Failed to update testimonial", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await TestimonialAPI.delete(id);
      toast({ title: "Testimonial deleted successfully" });
      loadTestimonials();
    } catch (err: any) {
      toast({ title: "Failed to delete testimonial", description: err.message, variant: "destructive" });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;
    const reordered = [...testimonials];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setTestimonials(reordered);
    try {
      await TestimonialAPI.reorder(reordered.map((t, i) => ({ id: t._id, order: i + 1 })));
    } catch (err: any) {
      toast({ title: "Reorder failed", description: err.message, variant: "destructive" });
      loadTestimonials();
    }
  };

  const startEdit = (t: ApiTestimonial) => {
    setEditingId(t._id);
    setName(t.name);
    setPosition(t.position || "");
    setMessage(getText(t.message));
    setImage(t.image || "");
    setRating(t.rating || 5);
    setIsActive(t.isActive);
    setIsAdding(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Testimonials</h1>
            <p className="mt-1 text-muted-foreground">Manage client reviews shown on the homepage and testimonials page.</p>
          </div>
          {!isAdding && !editingId && (
            <Button onClick={() => { setIsAdding(true); resetForm(); }} className="gap-2 gradient-primary text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" /> Add Testimonial
            </Button>
          )}
        </div>

        {(isAdding || editingId) && (
          <Card className="border-border bg-card p-6 animate-slide-up">
            <h3 className="font-semibold text-foreground mb-4">{editingId ? "Edit Testimonial" : "Add New Testimonial"}</h3>
            <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position / Subtitle</Label>
                <Input id="position" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Local Guide · 4 reviews" className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Review Message</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required className="bg-muted/50 min-h-[120px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL</Label>
                <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="bg-muted/50" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input id="rating" type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Visible on website</Label>
                  <select id="isActive" value={String(isActive)} onChange={(e) => setIsActive(e.target.value === "true")} className="w-full rounded-md border border-input bg-muted/50 p-2 text-foreground">
                    <option value="true">Active</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button type="submit" className="gradient-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" /> Save Testimonial
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border bg-card">
            <p className="text-muted-foreground">No testimonials yet. Add your first client review!</p>
          </Card>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {testimonials.map((t, index) => (
              <Card key={t._id} className="border-border bg-card p-6 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs uppercase px-2 py-0.5 rounded-full font-semibold bg-primary/20 text-primary">{t.isActive ? "Active" : "Hidden"}</span>
                    <span className="text-xs text-yellow-500">{"★".repeat(t.rating || 5)}</span>
                    <span className="text-xs text-muted-foreground">Order: {t.order}</span>
                  </div>
                  <h4 className="font-semibold text-foreground text-lg">{t.name}</h4>
                  {t.position && <p className="text-sm text-muted-foreground">{t.position}</p>}
                  <p className="text-muted-foreground">{getText(t.message)}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Button variant="ghost" size="icon" onClick={() => handleMove(index, "up")} disabled={index === 0}><ArrowUp className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleMove(index, "down")} disabled={index === testimonials.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(t)}><Edit2 className="h-4 w-4 text-sky-500" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(t._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TestimonialsManagementPage;
