import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { PermissionGate } from '@/components/PermissionGate';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter } from 'lucide-react';
import { ProgramsAPI, type ApiProgram, type RecordedClassItem, DanceStylesAPI, type ApiDanceStyle } from '@/lib/api';
import { MediaUrlField } from '@/components/cms/MediaUrlField';
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

const ProgramManagementPage = () => {
  const [Programs, setPrograms] = useState<ApiProgram[]>([]);
  const [categories, setCategories] = useState<ApiDanceStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProgram, setEditProgram] = useState<ApiProgram | null>(null);
  const { currentRole } = useRole();
  const isAdmin = currentRole === 'admin' || currentRole === 'super_admin';
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    danceStyle: '',
    image: '',
    status: (isAdmin ? 'active' : 'pending') as 'active' | 'inactive' | 'pending',
    price: '',
    previewVideo: '',
  });
  const [recordedClasses, setRecordedClasses] = useState<RecordedClassItem[]>([]);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const data = await ProgramsAPI.list('program');
      setPrograms(data.courses || data.Programs || []);
    } catch (err: any) {
      toast({ title: 'Failed to load Programs', description: err?.message, variant: 'destructive' });
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
    loadPrograms();
    loadCategories();
  }, []);

  const handleOpenDialog = (Program?: ApiProgram) => {
    if (Program) {
      setEditProgram(Program);
      setFormData({
        name: getLanguageValue(Program.name),
        description: getLanguageValue(Program.description),
        danceStyle: Program.danceStyle || Program.DanceStyle || Program.category || '',
        image: Program.image || '',
        status: Program.status,
        price: Program.price != null ? String(Program.price) : '',
        previewVideo: Program.previewVideo || '',
      });
      setRecordedClasses(
        (Program.recordedClasses || []).map((lesson, index) => ({
          ...lesson,
          order: lesson.order ?? index,
        })),
      );
    } else {
      setEditProgram(null);
      setFormData({
        name: '',
        description: '',
        danceStyle: '',
        image: '',
        status: 'active',
        price: '',
        previewVideo: '',
      });
      setRecordedClasses([]);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditProgram(null);
    setFormData({
      name: '',
      description: '',
      danceStyle: '',
      image: '',
      status: 'active',
      price: '',
      previewVideo: '',
    });
    setRecordedClasses([]);
  };

  const addRecordedLesson = () => {
    setRecordedClasses((prev) => [
      ...prev,
      { title: `Lesson ${prev.length + 1}`, videoUrl: '', duration: 0, order: prev.length },
    ]);
  };

  const updateRecordedLesson = (index: number, patch: Partial<RecordedClassItem>) => {
    setRecordedClasses((prev) =>
      prev.map((lesson, i) => (i === index ? { ...lesson, ...patch } : lesson)),
    );
  };

  const removeRecordedLesson = (index: number) => {
    setRecordedClasses((prev) =>
      prev.filter((_, i) => i !== index).map((lesson, i) => ({ ...lesson, order: i })),
    );
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        danceStyle: formData.danceStyle,
        category: formData.danceStyle,
        image: formData.image,
        status: formData.status,
        previewVideo: formData.previewVideo || undefined,
        price: formData.price ? Number(formData.price) : undefined,
        recordedClasses: recordedClasses
          .filter((lesson) => lesson.videoUrl?.trim())
          .map((lesson, index) => ({
            title: lesson.title || `Lesson ${index + 1}`,
            videoUrl: lesson.videoUrl,
            duration: Number(lesson.duration) || 0,
            order: index,
          })),
        name: normalizeLanguageValue(formData.name),
        description: normalizeLanguageValue(formData.description),
        type: 'program' as const,
      };
      if (editProgram) {
        await ProgramsAPI.update(editProgram._id, payload);
        toast({ title: 'Program updated successfully' });
      } else {
        await ProgramsAPI.create(payload);
        toast({ title: 'Program created successfully' });
      }
      handleCloseDialog();
      loadPrograms();
    } catch (err: any) {
      toast({ title: 'Operation failed', description: err?.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete Program',
      description: 'Are you sure you want to delete this Program? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    });
    if (!confirmed) return;
    try {
      await ProgramsAPI.delete(id);
      toast({ title: 'Program deleted successfully' });
      loadPrograms();
    } catch (err: any) {
      const errorMessage = err?.message || 'Delete failed';
      if (errorMessage.includes('teacher mappings')) {
        const deactivateConfirmed = await confirm({
          title: 'Cannot Delete Program',
          description: 'This Program has dance coach mappings. Would you like to deactivate it instead?',
          confirmText: 'Deactivate',
          cancelText: 'Cancel',
          variant: 'default',
        });
        if (deactivateConfirmed) {
          try {
            const Program = Programs.find(c => c._id === id);
            if (Program) {
              await ProgramsAPI.update(id, {
                name: getLanguageValue(Program.name),
                description: getLanguageValue(Program.description),
                danceStyle: Program.danceStyle || Program.DanceStyle || Program.category,
                category: Program.danceStyle || Program.DanceStyle || Program.category,
                image: Program.image,
                status: 'inactive',
              });
              toast({ title: 'Program deactivated successfully' });
              loadPrograms();
            }
          } catch (updateErr: any) {
            toast({ title: 'Deactivation failed', description: updateErr?.message, variant: 'destructive' });
          }
        }
      } else {
        toast({ title: 'Delete failed', description: errorMessage, variant: 'destructive' });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Program Management</h1>
            <p className="mt-1 text-muted-foreground">
              Create and manage Programs. Dance Coaches can join these Programs to teach.
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
                Add Program
              </Button>
            </PermissionGate>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Program</TableHead>
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
              {!loading && Programs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No Programs found
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                Programs.map((Program) => (
                  <TableRow key={Program._id} className="border-border transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {Program.image && (
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                            <img
                              src={Program.image}
                              alt={getLanguageValue(Program.name)}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{getLanguageValue(Program.name)}</p>
                          {Program.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">{getLanguageValue(Program.description)}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {(Program.danceStyle || Program.DanceStyle || Program.category) ? (
                        <Badge variant="outline">{Program.danceStyle || Program.DanceStyle || Program.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'border capitalize',
                          Program.status === 'active'
                            ? 'bg-success/20 text-success border-success/30'
                            : Program.status === 'pending'
                            ? 'bg-warning/20 text-warning border-warning/30'
                            : 'bg-muted text-muted-foreground border-muted'
                        )}
                      >
                        {Program.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {Program.createdAt ? new Date(Program.createdAt).toLocaleDateString() : '-'}
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
                            <DropdownMenuItem onClick={() => handleOpenDialog(Program)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </PermissionGate>
                          <PermissionGate permission="programs.delete">
                            <DropdownMenuItem
                              onClick={() => handleDelete(Program._id)}
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProgram ? 'Edit Program' : 'Create Program'}</DialogTitle>
            <DialogDescription>
              {editProgram ? 'Update Program details' : 'Add a new Program that dance coaches can join'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Program Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Contemporary Masterclass"
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
                placeholder="Program description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="danceStyle">Dance Style</Label>
              <Select
                value={formData.danceStyle}
                onValueChange={(value) => setFormData({ ...formData, danceStyle: value })}
                disabled={categoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Dance Style..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((danceStyle) => {
                    const danceStyleName = getLanguageValue(danceStyle.name);
                    return (
                      <SelectItem key={danceStyle._id} value={danceStyleName}>
                        {danceStyleName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {formData.danceStyle && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{formData.danceStyle}</Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({ ...formData, danceStyle: '' })}
                    className="h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Select a Dance Style from the list. To add new styles, go to{' '}
                <a href="/dance-styles" className="text-primary hover:underline">
                  Dance Style Management
                </a>
                .
              </p>

            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Program Price (INR)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 2999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Program Image</Label>
              <CloudinaryImageUploader
                imageUrl={formData.image}
                onImageChange={(url) => setFormData({ ...formData, image: url || "" })}
                folder="Programs"
                maxSize={5 * 1024 * 1024}
              />
            </div>
            <MediaUrlField
              label="Preview Video (optional)"
              websiteLocation="Program preview on website"
              value={formData.previewVideo}
              onChange={(url) => setFormData({ ...formData, previewVideo: url })}
              mediaType="video"
              uploadFolder="programs"
            />
            <div className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Label>Recorded Lessons</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload lesson videos — students access these after enrollment (protected stream).
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addRecordedLesson}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add lesson
                </Button>
              </div>
              {recordedClasses.length === 0 && (
                <p className="text-sm text-muted-foreground">No recorded lessons yet.</p>
              )}
              {recordedClasses.map((lesson, index) => (
                <div key={index} className="space-y-2 rounded-md border border-border/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">Lesson {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => removeRecordedLesson(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={lesson.title || ''}
                    onChange={(e) => updateRecordedLesson(index, { title: e.target.value })}
                    placeholder="Lesson title"
                  />
                  <MediaUrlField
                    label="Lesson video"
                    websiteLocation={`Program lesson ${index + 1}`}
                    value={lesson.videoUrl || ''}
                    onChange={(url) => updateRecordedLesson(index, { videoUrl: url })}
                    mediaType="video"
                    uploadFolder="program-lessons"
                  />
                </div>
              ))}
            </div>
            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' | 'pending' })}
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
              {editProgram ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </AdminLayout>
  );
};

export default ProgramManagementPage;


