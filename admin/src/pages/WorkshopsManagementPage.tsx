import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { PermissionGate } from '@/components/PermissionGate';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter } from 'lucide-react';
import { ProgramsAPI, type ApiProgram, DanceStylesAPI, type ApiDanceStyle, ZoomAPI } from '@/lib/api';
import { getLanguageValue, normalizeLanguageValue } from '@/lib/languageHelper';
import { useToast } from '@/hooks/use-toast';
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
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CloudinaryImageUploader } from '@/components/ui/cloudinary-image-uploader';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useRole } from '@/contexts/RoleContext';

// Helper function to generate slug preview from text
const generateSlugPreview = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Trim hyphens from start
    .replace(/-+$/, ''); // Trim hyphens from end
};

const WorkshopsManagementPage = () => {
  const [workshops, setWorkshops] = useState<ApiProgram[]>([]);
  const [categories, setCategories] = useState<ApiDanceStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editWorkshop, setEditWorkshop] = useState<ApiProgram | null>(null);
  const { currentRole } = useRole();
  const isAdmin = currentRole === 'admin' || currentRole === 'super_admin';
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    status: (isAdmin ? 'active' : 'pending') as 'active' | 'inactive' | 'pending',
    type: 'workshop' as const,
    workshopDate: '',
    workshopTime: '',
    workshopEndTime: '',
    price: '',
    zoomLink: '',
  });

  const formatDateInput = (value?: string) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };

  const loadWorkshops = async () => {
    setLoading(true);
    try {
      const data = await ProgramsAPI.list('workshop');
      setWorkshops(data.courses || []);
    } catch (err: any) {
      toast({ title: 'Failed to load Workshops', description: err?.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const data = await DanceStylesAPI.list('active');
      setCategories(data.categories || []);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    loadWorkshops();
    loadCategories();
  }, []);

  const handleOpenDialog = (workshop?: ApiProgram) => {
    if (workshop) {
      setEditWorkshop(workshop);
      setFormData({
        name: getLanguageValue(workshop.name),
        description: getLanguageValue(workshop.description),
        category: workshop.category || '',
        image: workshop.image || workshop.workshopBanner || '',
        status: workshop.status as any,
        type: 'workshop',
        workshopDate: formatDateInput(workshop.workshopDate),
        workshopTime: workshop.workshopTime || '',
        workshopEndTime: workshop.workshopEndTime || '',
        price: workshop.price != null ? String(workshop.price) : '',
        zoomLink: workshop.zoomLink || '',
      });
    } else {
      setEditWorkshop(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        image: '',
        status: 'active',
        type: 'workshop',
        workshopDate: '',
        workshopTime: '',
        workshopEndTime: '',
        price: '',
        zoomLink: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditWorkshop(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      image: '',
      status: 'active',
      type: 'workshop',
      workshopDate: '',
      workshopTime: '',
      workshopEndTime: '',
      price: '',
      zoomLink: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: normalizeLanguageValue(formData.name),
        description: normalizeLanguageValue(formData.description),
        category: formData.category,
        image: formData.image,
        workshopBanner: formData.image,
        status: formData.status,
        type: 'workshop' as const,
        workshopDate: formData.workshopDate || undefined,
        workshopTime: formData.workshopTime || undefined,
        workshopEndTime: formData.workshopEndTime || undefined,
        zoomLink: formData.zoomLink || undefined,
        price: formData.price ? Number(formData.price) : undefined,
      };
      if (editWorkshop) {
        await ProgramsAPI.update(editWorkshop._id, payload);
        toast({ title: 'Workshop updated successfully' });
      } else {
        await ProgramsAPI.create(payload);
        toast({ title: 'Workshop created successfully' });
      }
      handleCloseDialog();
      loadWorkshops();
    } catch (err: any) {
      toast({ title: 'Operation failed', description: err?.message, variant: 'destructive' });
    }
  };

  const handleEnsureZoom = async (workshop: ApiProgram) => {
    try {
      const result = await ZoomAPI.ensureWorkshopLink(workshop._id);
      toast({
        title: 'Zoom link ready',
        description: result.mode === 'demo' ? 'Demo link saved (add Zoom keys for live).' : result.zoomLink,
      });
      loadWorkshops();
    } catch (err: any) {
      toast({ title: 'Zoom link failed', description: err?.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete Workshop',
      description: 'Are you sure you want to delete this Workshop? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    });
    if (!confirmed) return;
    try {
      await ProgramsAPI.delete(id);
      toast({ title: 'Workshop deleted successfully' });
      loadWorkshops();
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err?.message, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Workshop Management</h1>
            <p className="mt-1 text-muted-foreground">
              Add workshop cards shown on the website. For page text, images & reviews, edit{' '}
              <Link to="/cms" className="text-primary underline">
                Website Content → Workshops Page
              </Link>
              .
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
            <PermissionGate permission="programs.create">
              <Button
                size="sm"
                className="gap-2 gradient-primary text-primary-foreground hover:opacity-90"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="h-4 w-4" />
                Add Workshop
              </Button>
            </PermissionGate>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Workshop</TableHead>
                <TableHead className="text-muted-foreground">Dance Style</TableHead>
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
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-16 w-16 rounded-lg" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {!loading && workshops.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No workshops found
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                workshops.map((workshop) => (
                  <TableRow key={workshop._id} className="border-border transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {workshop.image && (
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                            <img
                              src={workshop.image}
                              alt={getLanguageValue(workshop.name)}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{getLanguageValue(workshop.name)}</p>
                          {workshop.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">{getLanguageValue(workshop.description)}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {workshop.category ? (
                        <Badge variant="outline">{workshop.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'border capitalize',
                          workshop.status === 'active'
                            ? 'bg-success/20 text-success border-success/30'
                            : workshop.status === 'pending'
                            ? 'bg-warning/20 text-warning border-warning/30'
                            : 'bg-muted text-muted-foreground border-muted'
                        )}
                      >
                        {workshop.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {workshop.createdAt ? new Date(workshop.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <PermissionGate permission="programs.edit">
                            <DropdownMenuItem onClick={() => handleOpenDialog(workshop)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEnsureZoom(workshop)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Generate Zoom link
                            </DropdownMenuItem>
                          </PermissionGate>
                          <PermissionGate permission="programs.delete">
                            <DropdownMenuItem
                              onClick={() => handleDelete(workshop._id)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editWorkshop ? 'Edit Workshop' : 'Create Workshop'}</DialogTitle>
            <DialogDescription>
              {editWorkshop ? 'Update workshop details' : 'Add a new dance workshop'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workshop Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summer Intensive 2026"
              />
              {formData.name && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Slug preview:</span>{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    {generateSlugPreview(formData.name)}
                  </code>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Workshop details..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Dance Style</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={categoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Dance Style..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => {
                    const catName = getLanguageValue(cat.name);
                    return (
                      <SelectItem key={cat._id} value={catName}>
                        {catName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="workshopDate">Workshop Date</Label>
                <Input
                  id="workshopDate"
                  type="date"
                  value={formData.workshopDate}
                  onChange={(e) => setFormData({ ...formData, workshopDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (INR)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 1500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="workshopTime">Start Time</Label>
                <Input
                  id="workshopTime"
                  value={formData.workshopTime}
                  onChange={(e) => setFormData({ ...formData, workshopTime: e.target.value })}
                  placeholder="10:00 AM"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workshopEndTime">End Time</Label>
                <Input
                  id="workshopEndTime"
                  value={formData.workshopEndTime}
                  onChange={(e) => setFormData({ ...formData, workshopEndTime: e.target.value })}
                  placeholder="02:00 PM"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zoomLink">Zoom / Live Link</Label>
              <Input
                id="zoomLink"
                value={formData.zoomLink}
                onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
                placeholder="https://zoom.us/j/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Workshop Image</Label>
              <CloudinaryImageUploader
                imageUrl={formData.image}
                onImageChange={(url) => setFormData({ ...formData, image: url || "" })}
                folder="Workshops"
                maxSize={5 * 1024 * 1024}
              />
            </div>
            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
              {editWorkshop ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </AdminLayout>
  );
};

export default WorkshopsManagementPage;
