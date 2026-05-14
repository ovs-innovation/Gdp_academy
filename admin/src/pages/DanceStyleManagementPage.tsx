import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { PermissionGate } from '@/components/PermissionGate';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DanceStylesAPI, type ApiDanceStyle } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { getLanguageValue, normalizeLanguageValue } from '@/lib/languageHelper';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CloudinaryImageUploader } from '@/components/ui/cloudinary-image-uploader';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';

const generateSlugPreview = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const DanceStyleManagementPage = () => {
  const [categories, setCategories] = useState<ApiDanceStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDanceStyle, setEditDanceStyle] = useState<ApiDanceStyle | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'active' as 'active' | 'inactive',
  });
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await DanceStylesAPI.list();
      setCategories(data.categories || []);
    } catch (err: any) {
      toast({ title: 'Failed to load categories', description: err?.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenDialog = (DanceStyle?: ApiDanceStyle) => {
    if (DanceStyle) {
      setEditDanceStyle(DanceStyle);
      setFormData({
        name: getLanguageValue(DanceStyle.name),
        description: getLanguageValue(DanceStyle.description),
        image: DanceStyle.image || '',
        status: DanceStyle.status,
      });
    } else {
      setEditDanceStyle(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        status: 'active',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditDanceStyle(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      status: 'active',
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Validation Error', description: 'DanceStyle name is required', variant: 'destructive' });
      return;
    }

    try {
      const payload = {
        ...formData,
        name: normalizeLanguageValue(formData.name),
        description: normalizeLanguageValue(formData.description),
      };
      if (editDanceStyle) {
        await DanceStylesAPI.update(editDanceStyle._id, payload);
        toast({ title: 'DanceStyle updated successfully' });
      } else {
        await DanceStylesAPI.create(payload);
        toast({ title: 'DanceStyle created successfully' });
      }
      handleCloseDialog();
      loadCategories();
    } catch (err: any) {
      toast({ title: 'Operation failed', description: err?.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete DanceStyle',
      description: 'Are you sure you want to delete this DanceStyle? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    });
    if (!confirmed) return;
    try {
      await DanceStylesAPI.delete(id);
      toast({ title: 'DanceStyle deleted successfully' });
      loadCategories();
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err?.message, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">DanceStyle Management</h1>
            <p className="mt-1 text-muted-foreground">
              Create and manage Program categories with images.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <PermissionGate permission="reports.export">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </PermissionGate>
            <PermissionGate permission="categories.create">
              <Button
                size="sm"
                className="gap-2 gradient-primary text-primary-foreground hover:opacity-90"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="h-4 w-4" />
                Add DanceStyle
              </Button>
            </PermissionGate>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">DanceStyle</TableHead>
                <TableHead className="text-muted-foreground">Image</TableHead>
                <TableHead className="text-muted-foreground">Description</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Created</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {!loading && categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No categories found
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                categories.map((DanceStyle) => (
                  <TableRow key={DanceStyle._id} className="border-border transition-colors hover:bg-muted/30">
                    <TableCell>
                      <span className="font-medium text-foreground">{getLanguageValue(DanceStyle.name)}</span>
                    </TableCell>
                    <TableCell>
                      {DanceStyle.image ? (
                        <div className="w-10 h-10 rounded overflow-hidden border border-border">
                          <img
                            src={DanceStyle.image}
                            alt={getLanguageValue(DanceStyle.name)}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {getLanguageValue(DanceStyle.description) || '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'border capitalize',
                          DanceStyle.status === 'active'
                            ? 'bg-success/20 text-success border-success/30'
                            : 'bg-muted text-muted-foreground border-muted'
                        )}
                      >
                        {DanceStyle.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {DanceStyle.createdAt ? new Date(DanceStyle.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <PermissionGate permission="categories.edit">
                            <DropdownMenuItem onClick={() => handleOpenDialog(DanceStyle)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </PermissionGate>
                          <PermissionGate permission="categories.delete">
                            <DropdownMenuItem
                              onClick={() => handleDelete(DanceStyle._id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </PermissionGate>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editDanceStyle ? 'Edit DanceStyle' : 'Create DanceStyle'}</DialogTitle>
            <DialogDescription>
              {editDanceStyle ? 'Update DanceStyle details' : 'Add a new DanceStyle for Programs'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">DanceStyle Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Fitness, Education"
              />
              {formData.name && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Slug preview:</span>{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    {generateSlugPreview(formData.name)}
                  </code>
                  <span className="ml-2 text-xs">(auto-generated on save)</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="DanceStyle description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">DanceStyle Image</Label>
              <CloudinaryImageUploader
                imageUrl={formData.image}
                onImageChange={(url) => setFormData({ ...formData, image: url || "" })}
                folder="categories"
                maxSize={5 * 1024 * 1024}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
              {editDanceStyle ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </AdminLayout>
  );
};

export default DanceStyleManagementPage;

