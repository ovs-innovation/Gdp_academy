import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { FAQAPI, type ApiFAQ } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Save, X, ArrowUp, ArrowDown } from "lucide-react";

const FAQManagementPage = () => {
  const [faqs, setFaqs] = useState<ApiFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"published" | "draft" | "archived">("published");
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const data = await FAQAPI.list();
      setFaqs(data.faqs || []);
    } catch (err: any) {
      toast({
        title: "Error loading FAQs",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    try {
      await FAQAPI.create({
        question,
        answer,
        status,
        order: faqs.length + 1,
      });
      toast({ title: "FAQ created successfully" });
      setIsAdding(false);
      resetForm();
      loadFAQs();
    } catch (err: any) {
      toast({
        title: "Failed to create FAQ",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!question || !answer) return;

    try {
      await FAQAPI.update(id, { question, answer, status });
      toast({ title: "FAQ updated successfully" });
      setEditingId(null);
      resetForm();
      loadFAQs();
    } catch (err: any) {
      toast({
        title: "Failed to update FAQ",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await FAQAPI.delete(id);
      toast({ title: "FAQ deleted successfully" });
      loadFAQs();
    } catch (err: any) {
      toast({
        title: "Failed to delete FAQ",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const newFaqs = [...faqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIndex];
    newFaqs[targetIndex] = temp;

    // Map new orders
    const reorderPayload = newFaqs.map((faq, i) => ({
      id: faq._id,
      order: i + 1,
    }));

    setFaqs(newFaqs);

    try {
      await FAQAPI.reorder(reorderPayload);
    } catch (err: any) {
      toast({
        title: "Reorder failed",
        description: err.message,
        variant: "destructive",
      });
      loadFAQs();
    }
  };

  const startEdit = (faq: ApiFAQ) => {
    setEditingId(faq._id);
    setQuestion(typeof faq.question === "string" ? faq.question : faq.question?.en || "");
    setAnswer(typeof faq.answer === "string" ? faq.answer : faq.answer?.en || "");
    setStatus(faq.status);
    setIsAdding(false);
  };

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setStatus("published");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">FAQ Management</h1>
            <p className="mt-1 text-muted-foreground">Manage public FAQs displayed on the website.</p>
          </div>
          {!isAdding && !editingId && (
            <Button onClick={() => { setIsAdding(true); resetForm(); }} className="gap-2 gradient-primary text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" /> Add FAQ
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <Card className="border-border bg-card p-6 animate-slide-up">
            <h3 className="font-semibold text-foreground mb-4">
              {editingId ? "Edit FAQ" : "Add New FAQ"}
            </h3>
            <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter the question"
                  required
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the answer"
                  required
                  className="bg-muted/50 min-h-[120px]"
                />
              </div>
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
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button type="submit" className="gradient-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" /> Save FAQ
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* FAQs List */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground">Loading FAQs...</p>
          </div>
        ) : faqs.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border bg-card">
            <p className="text-muted-foreground">No FAQs available. Get started by adding one!</p>
          </Card>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {faqs.map((faq, index) => (
              <Card key={faq._id} className="border-border bg-card p-6 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase px-2 py-0.5 rounded-full font-semibold bg-primary/20 text-primary">
                      {faq.status}
                    </span>
                    <span className="text-xs text-muted-foreground">Order: {faq.order}</span>
                  </div>
                  <h4 className="font-semibold text-foreground text-lg">
                    {typeof faq.question === "string" ? faq.question : faq.question?.en}
                  </h4>
                  <p className="text-muted-foreground">
                    {typeof faq.answer === "string" ? faq.answer : faq.answer?.en}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Button variant="ghost" size="icon" onClick={() => handleMove(index, "up")} disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleMove(index, "down")} disabled={index === faqs.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(faq)}>
                    <Edit2 className="h-4 w-4 text-sky-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(faq._id)}>
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

export default FAQManagementPage;
