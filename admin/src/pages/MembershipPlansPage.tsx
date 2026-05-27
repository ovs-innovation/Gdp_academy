import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { MembershipPlansAPI, type ApiMembershipPlan } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Save, X, ArrowUp, ArrowDown, Check } from "lucide-react";

const MembershipPlansPage = () => {
  const [plans, setPlans] = useState<ApiMembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(1);
  const [durationUnit, setDurationUnit] = useState<"month" | "year">("month");
  const [featuresText, setFeaturesText] = useState("");
  const [status, setStatus] = useState<"published" | "draft" | "archived">("published");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await MembershipPlansAPI.list();
      setPlans(data.plans || []);
    } catch (err: any) {
      toast({
        title: "Error loading plans",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || price < 0) return;

    try {
      const features = featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      await MembershipPlansAPI.create({
        title,
        price,
        duration,
        durationUnit,
        features,
        status,
        metaTitle,
        metaDescription,
        order: plans.length + 1,
      });

      toast({ title: "Membership plan created successfully" });
      setIsAdding(false);
      resetForm();
      loadPlans();
    } catch (err: any) {
      toast({
        title: "Failed to create plan",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!title || price < 0) return;

    try {
      const features = featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      await MembershipPlansAPI.update(id, {
        title,
        price,
        duration,
        durationUnit,
        features,
        status,
        metaTitle,
        metaDescription,
      });

      toast({ title: "Membership plan updated successfully" });
      setEditingId(null);
      resetForm();
      loadPlans();
    } catch (err: any) {
      toast({
        title: "Failed to update plan",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this membership plan?")) return;
    try {
      await MembershipPlansAPI.delete(id);
      toast({ title: "Membership plan deleted successfully" });
      loadPlans();
    } catch (err: any) {
      toast({
        title: "Failed to delete plan",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= plans.length) return;

    const newPlans = [...plans];
    const temp = newPlans[index];
    newPlans[index] = newPlans[targetIndex];
    newPlans[targetIndex] = temp;

    const reorderPayload = newPlans.map((plan, i) => ({
      id: plan._id,
      order: i + 1,
    }));

    setPlans(newPlans);

    try {
      await MembershipPlansAPI.reorder(reorderPayload);
    } catch (err: any) {
      toast({
        title: "Reorder failed",
        description: err.message,
        variant: "destructive",
      });
      loadPlans();
    }
  };

  const startEdit = (plan: ApiMembershipPlan) => {
    setEditingId(plan._id);
    setTitle(typeof plan.title === "string" ? plan.title : plan.title?.en || "");
    setPrice(plan.price);
    setDuration(plan.duration);
    setDurationUnit(plan.durationUnit);
    setFeaturesText((plan.features || []).join("\n"));
    setStatus(plan.status);
    setMetaTitle(plan.metaTitle || "");
    setMetaDescription(plan.metaDescription || "");
    setIsAdding(false);
  };

  const resetForm = () => {
    setTitle("");
    setPrice(0);
    setDuration(1);
    setDurationUnit("month");
    setFeaturesText("");
    setStatus("published");
    setMetaTitle("");
    setMetaDescription("");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Membership Plans</h1>
            <p className="mt-1 text-muted-foreground">Configure membership plans and features for students.</p>
          </div>
          {!isAdding && !editingId && (
            <Button onClick={() => { setIsAdding(true); resetForm(); }} className="gap-2 gradient-primary text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" /> Add Plan
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <Card className="border-border bg-card p-6 animate-slide-up">
            <h3 className="font-semibold text-foreground mb-4">
              {editingId ? "Edit Membership Plan" : "Add New Membership Plan"}
            </h3>
            <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Plan Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Pro Dancer Plan"
                    required
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Monthly Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="e.g. 59"
                    required
                    className="bg-muted/50"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    required
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durationUnit">Duration Unit</Label>
                  <select
                    id="durationUnit"
                    value={durationUnit}
                    onChange={(e: any) => setDurationUnit(e.target.value)}
                    className="w-full rounded-md border border-input bg-muted/50 p-2 text-foreground"
                  >
                    <option value="month">Month(s)</option>
                    <option value="year">Year(s)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (One per line)</Label>
                <textarea
                  id="features"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Access to 8 Live Zoom classes per month&#10;Full video library access"
                  className="w-full rounded-md border border-input bg-muted/50 p-2 text-foreground min-h-[120px]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full rounded-md border border-input bg-muted/50 p-2 text-foreground"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">SEO Title</Label>
                  <Input
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Plan SEO Title"
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">SEO Description</Label>
                  <Input
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Plan SEO Description"
                    className="bg-muted/50"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button type="submit" className="gradient-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" /> Save Plan
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Plans Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground">Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border bg-card">
            <p className="text-muted-foreground">No plans available. Add your first plan!</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
            {plans.map((plan, index) => (
              <Card key={plan._id} className="border-border bg-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs uppercase px-2 py-0.5 rounded-full font-semibold bg-primary/20 text-primary">
                      {plan.status}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMove(index, "up")} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMove(index, "down")} disabled={index === plans.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground">
                    {typeof plan.title === "string" ? plan.title : plan.title?.en}
                  </h3>
                  <div className="mt-2 flex items-baseline text-foreground">
                    <span className="text-4xl font-extrabold tracking-tight">${plan.price}</span>
                    <span className="ml-1 text-xl font-semibold text-muted-foreground">/{plan.duration} {plan.durationUnit}(s)</span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {(plan.features || []).map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex gap-2 justify-end border-t border-border pt-4">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(plan)}>
                    <Edit2 className="h-4 w-4 text-sky-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(plan._id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MembershipPlansPage;
