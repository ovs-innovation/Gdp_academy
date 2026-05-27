import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BlogAPI, type ApiBlog } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

const getText = (val: string | Record<string, string> | undefined): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val.en || Object.values(val)[0] || "";
};

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<ApiBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [category, setCategory] = useState("General");
  const [status, setStatus] = useState<"published" | "draft" | "archived">("draft");
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await BlogAPI.list({ status: "", limit: 100 });
      setBlogs(data.blogs || []);
    } catch (err: any) {
      toast({ title: "Error loading blogs", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setFeaturedImageUrl("");
    setCategory("General");
    setStatus("draft");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      await BlogAPI.create({
        title,
        excerpt,
        content,
        featuredImage: featuredImageUrl ? { url: featuredImageUrl, alt: title } : undefined,
        category,
        status,
      });
      toast({ title: "Blog post created successfully" });
      setIsAdding(false);
      resetForm();
      loadBlogs();
    } catch (err: any) {
      toast({ title: "Failed to create blog", description: err.message, variant: "destructive" });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!title || !content) return;
    try {
      await BlogAPI.update(id, {
        title,
        excerpt,
        content,
        featuredImage: featuredImageUrl ? { url: featuredImageUrl, alt: title } : undefined,
        category,
        status,
      });
      toast({ title: "Blog post updated successfully" });
      setEditingId(null);
      resetForm();
      loadBlogs();
    } catch (err: any) {
      toast({ title: "Failed to update blog", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await BlogAPI.delete(id);
      toast({ title: "Blog post deleted" });
      loadBlogs();
    } catch (err: any) {
      toast({ title: "Failed to delete blog", description: err.message, variant: "destructive" });
    }
  };

  const startEdit = (blog: ApiBlog) => {
    setEditingId(blog._id);
    setTitle(getText(blog.title));
    setExcerpt(getText(blog.excerpt));
    setContent(getText(blog.content));
    setFeaturedImageUrl(blog.featuredImage?.url || "");
    setCategory(blog.category || "General");
    setStatus(blog.status);
    setIsAdding(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Blog Management</h1>
            <p className="mt-1 text-muted-foreground">Create and publish blog posts for the website.</p>
          </div>
          {!isAdding && !editingId && (
            <Button onClick={() => { setIsAdding(true); resetForm(); }} className="gap-2 gradient-primary text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" /> Add Blog Post
            </Button>
          )}
        </div>

        {(isAdding || editingId) && (
          <Card className="border-border bg-card p-6 animate-slide-up">
            <h3 className="font-semibold text-foreground mb-4">{editingId ? "Edit Blog Post" : "New Blog Post"}</h3>
            <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="bg-muted/50 min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required className="bg-muted/50 min-h-[200px]" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
                  <Input id="featuredImageUrl" value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-muted/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" value={status} onChange={(e: any) => setStatus(e.target.value)} className="w-full rounded-md border border-input bg-muted/50 p-2 text-foreground">
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
                  <Save className="h-4 w-4 mr-2" /> Save Blog Post
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        ) : blogs.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border bg-card">
            <p className="text-muted-foreground">No blog posts yet. Create your first post!</p>
          </Card>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {blogs.map((blog) => (
              <Card key={blog._id} className="border-border bg-card p-6 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div className="space-y-2 flex-1">
                  <span className="text-xs uppercase px-2 py-0.5 rounded-full font-semibold bg-primary/20 text-primary">{blog.status}</span>
                  <h4 className="font-semibold text-foreground text-lg">{getText(blog.title)}</h4>
                  <p className="text-muted-foreground line-clamp-2">{getText(blog.excerpt) || getText(blog.content)}</p>
                  {blog.category && <span className="text-xs text-muted-foreground">{blog.category}</span>}
                </div>
                <div className="flex gap-2 items-center">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(blog)}><Edit2 className="h-4 w-4 text-sky-500" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(blog._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogsPage;
