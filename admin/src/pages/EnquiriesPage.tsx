import {
  Trash2,
  MessageSquare,
  Search,
  RefreshCw,
  UserPlus,
  CheckCircle2,
  Clock3,
  Inbox,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { PermissionGate } from '@/components/PermissionGate';
import { useRole } from '@/contexts/RoleContext';
import {
  EnquiriesAPI,
  UsersAPI,
  type ApiEnquiry,
  type ApiEnquiryStats,
  type ApiUser,
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'closed', label: 'Closed' },
];

const SOURCE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All sources' },
  { value: 'general', label: 'General' },
  { value: 'program', label: 'Program' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'contact_form', label: 'Contact form' },
];

const getProgramLabel = (value: ApiEnquiry['programId']) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  const name = value.name;
  if (typeof name === 'string') return name;
  if (name && typeof name === 'object' && 'en' in name) return String(name.en || '');
  return null;
};

const getUserLabel = (
  value: ApiEnquiry['assignedTo'] | ApiEnquiry['assignedBy'] | ApiEnquiry['closedBy'],
) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value.name || value.email || null;
};

const getUserId = (
  value: ApiEnquiry['assignedTo'] | ApiEnquiry['assignedBy'] | ApiEnquiry['closedBy'],
) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value._id;
};

const statusBadgeClass = (status: ApiEnquiry['status']) => {
  if (status === 'new') return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30';
  if (status === 'in_progress') return 'bg-amber-500/15 text-amber-600 border-amber-500/30';
  return 'bg-muted text-muted-foreground border-border';
};

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    <div className="text-sm text-foreground break-words">{value || '-'}</div>
  </div>
);

const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Inbox;
}) => (
  <Card className="border-border bg-card p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      </div>
      <div className="rounded-md bg-muted/60 p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  </Card>
);

const EnquiriesPage = () => {
  const { can, currentRole } = useRole();
  const { toast } = useToast();

  const currentUserId =
    localStorage.getItem('user-id') || sessionStorage.getItem('user-id') || '';

  const canAssign = can('enquiries.assign') || currentRole === 'admin' || currentRole === 'super_admin';
  const canDelete = can('enquiries.delete') || currentRole === 'admin' || currentRole === 'super_admin';
  const canEdit = can('enquiries.edit') || currentRole === 'admin' || currentRole === 'super_admin';

  const [enquiries, setEnquiries] = useState<ApiEnquiry[]>([]);
  const [staff, setStaff] = useState<ApiUser[]>([]);
  const [stats, setStats] = useState<ApiEnquiryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ApiEnquiry | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const staffOptions = useMemo(
    () =>
      staff.filter(
        (user) =>
          user.status === 'active' &&
          user.role !== 'student' &&
          user.role !== 'Member',
      ),
    [staff],
  );

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params: Parameters<typeof EnquiriesAPI.list>[0] = {
        limit: 200,
      };

      if (statusFilter !== 'all') params.status = statusFilter;
      if (sourceFilter !== 'all') params.source = sourceFilter;
      if (search.trim()) params.search = search.trim();

      if (canAssign) {
        if (assigneeFilter === 'unassigned') params.unassigned = true;
        else if (assigneeFilter === 'mine') params.mine = true;
        else if (assigneeFilter !== 'all') params.assignedTo = assigneeFilter;
      }

      const [listData, statsData] = await Promise.all([
        EnquiriesAPI.list(params),
        EnquiriesAPI.stats().catch(() => null),
      ]);

      setEnquiries(listData.enquiries || []);
      if (statsData) setStats(statsData);

      setSelectedEnquiry((prev) => {
        if (!prev) return prev;
        const refreshed = (listData.enquiries || []).find((item) => item._id === prev._id);
        return refreshed || null;
      });
    } catch (err: any) {
      toast({
        title: 'Failed to load enquiries',
        description: err?.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [assigneeFilter, canAssign, search, sourceFilter, statusFilter, toast]);

  const loadStaff = useCallback(async () => {
    if (!canAssign) return;
    try {
      const data = await UsersAPI.list();
      setStaff(data.users || []);
    } catch {
      // Staff dropdown is optional if users.view is missing
    }
  }, [canAssign]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  useEffect(() => {
    setNotesDraft(selectedEnquiry?.notes || '');
  }, [selectedEnquiry?._id, selectedEnquiry?.notes]);

  const applySearch = () => setSearch(searchInput.trim());

  const persistUpdate = async (
    id: string,
    payload: { status?: ApiEnquiry['status']; notes?: string; assignedTo?: string | null },
    successMessage = 'Enquiry updated',
  ) => {
    setSaving(true);
    try {
      const res = await EnquiriesAPI.update(id, payload);
      const updated = res.enquiry;
      setEnquiries((items) => items.map((item) => (item._id === id ? updated : item)));
      setSelectedEnquiry((prev) => (prev?._id === id ? updated : prev));
      toast({ title: successMessage });
      EnquiriesAPI.stats()
        .then(setStats)
        .catch(() => undefined);
      return updated;
    } catch (err: any) {
      toast({
        title: 'Update failed',
        description: err?.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: ApiEnquiry['status']) => {
    if (!canEdit) return;
    await persistUpdate(id, { status }, status === 'closed' ? 'Marked as closed' : 'Status updated');
  };

  const handleAssign = async (id: string, assignedTo: string) => {
    if (!canAssign) return;
    const value = assignedTo === 'unassigned' ? null : assignedTo;
    await persistUpdate(
      id,
      { assignedTo: value },
      value ? 'Enquiry assigned' : 'Assignment cleared',
    );
  };

  const handleClaim = async (id: string) => {
    if (!canEdit || !currentUserId) return;
    await persistUpdate(id, { assignedTo: currentUserId }, 'Enquiry claimed');
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry || !canEdit) return;
    await persistUpdate(selectedEnquiry._id, { notes: notesDraft }, 'Notes saved');
  };

  const handleDelete = async (id: string) => {
    if (!canDelete) return;
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      await EnquiriesAPI.delete(id);
      setEnquiries((items) => items.filter((item) => item._id !== id));
      if (selectedEnquiry?._id === id) setSelectedEnquiry(null);
      toast({ title: 'Enquiry deleted successfully' });
      EnquiriesAPI.stats()
        .then(setStats)
        .catch(() => undefined);
    } catch (err: any) {
      toast({
        title: 'Failed to delete enquiry',
        description: err?.message,
        variant: 'destructive',
      });
    }
  };

  const selectedAssigneeId = getUserId(selectedEnquiry?.assignedTo) || 'unassigned';

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Enquiries</h1>
            <p className="text-muted-foreground">
              {canAssign
                ? 'Assign enquiries to team members, track ownership, and close with clear accountability.'
                : 'Your assigned enquiry queue — update status and notes for enquiries assigned to you.'}
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={loadEnquiries}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {stats ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Total" value={stats.total} icon={Inbox} />
            <StatCard label="New" value={stats.newEnquiries} icon={MessageSquare} />
            <StatCard label="In progress" value={stats.inProgress} icon={Clock3} />
            <StatCard label="Closed" value={stats.closed} icon={CheckCircle2} />
            <StatCard
              label={canAssign ? 'Unassigned' : 'Assigned to me'}
              value={canAssign ? stats.unassigned : stats.mine}
              icon={UserPlus}
            />
          </div>
        ) : null}

        <Card className="border-border bg-card p-4">
          <div className="grid gap-3 lg:grid-cols-4">
            <div className="space-y-1.5 lg:col-span-2">
              <Label htmlFor="enquiry-search">Search</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="enquiry-search"
                    className="pl-9"
                    placeholder="Name, email, phone, subject..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') applySearch();
                    }}
                  />
                </div>
                <Button type="button" variant="secondary" onClick={applySearch}>
                  Search
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Source</Label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {canAssign ? (
              <div className="space-y-1.5 lg:col-span-2">
                <Label>Assigned to</Label>
                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="mine">Assigned to me</SelectItem>
                    {staffOptions.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="border-border bg-card xl:col-span-2 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Visitor</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned to</TableHead>
                    <TableHead>Closed by</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                        Loading enquiries...
                      </TableCell>
                    </TableRow>
                  ) : enquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                        No enquiries match these filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    enquiries.map((enquiry) => {
                      const assigneeName = getUserLabel(enquiry.assignedTo);
                      const closedByName = getUserLabel(enquiry.closedBy);
                      const isSelected = selectedEnquiry?._id === enquiry._id;

                      return (
                        <TableRow
                          key={enquiry._id}
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className={`cursor-pointer border-border ${
                            isSelected ? 'bg-muted/50' : 'hover:bg-muted/30'
                          }`}
                        >
                          <TableCell>
                            <div className="min-w-[160px]">
                              <p className="font-medium text-foreground">{enquiry.name}</p>
                              <p className="text-xs text-muted-foreground">{enquiry.email}</p>
                              <p className="text-xs text-muted-foreground">{enquiry.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {enquiry.source.replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`capitalize ${statusBadgeClass(enquiry.status)}`}>
                              {enquiry.status.replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {assigneeName ? (
                              <span className="text-sm text-foreground">{assigneeName}</span>
                            ) : (
                              <span className="text-sm text-amber-600">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {enquiry.status === 'closed' ? closedByName || '-' : '-'}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {enquiry.createdAt
                              ? new Date(enquiry.createdAt).toLocaleDateString()
                              : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              {!getUserId(enquiry.assignedTo) && canEdit && !canAssign ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={saving}
                                  onClick={() => handleClaim(enquiry._id)}
                                >
                                  Claim
                                </Button>
                              ) : null}
                              <PermissionGate permission="enquiries.delete">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDelete(enquiry._id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </PermissionGate>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div>
            {selectedEnquiry ? (
              <Card className="sticky top-6 space-y-5 border-border bg-card p-6">
                <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedEnquiry.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedEnquiry.createdAt
                        ? new Date(selectedEnquiry.createdAt).toLocaleString()
                        : '-'}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {selectedEnquiry.source.replace(/_/g, ' ')}
                  </Badge>
                </div>

                <DetailRow label="Email" value={selectedEnquiry.email} />
                <DetailRow label="Phone" value={selectedEnquiry.phone} />
                <DetailRow label="Subject" value={selectedEnquiry.subject} />
                <DetailRow
                  label="WhatsApp Consent"
                  value={selectedEnquiry.whatsappConsent ? 'Yes' : 'No'}
                />
                <DetailRow label="Program" value={getProgramLabel(selectedEnquiry.programId)} />
                <DetailRow label="Workshop" value={getProgramLabel(selectedEnquiry.workshopId)} />

                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Message
                  </p>
                  <div className="min-h-[100px] rounded-md bg-muted/40 p-4 text-sm text-foreground whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </div>
                </div>

                <DetailRow
                  label="Assigned to"
                  value={
                    getUserLabel(selectedEnquiry.assignedTo) || (
                      <span className="text-amber-600">Unassigned</span>
                    )
                  }
                />
                {selectedEnquiry.assignedAt ? (
                  <DetailRow
                    label="Assigned at"
                    value={new Date(selectedEnquiry.assignedAt).toLocaleString()}
                  />
                ) : null}
                {getUserLabel(selectedEnquiry.assignedBy) ? (
                  <DetailRow label="Assigned by" value={getUserLabel(selectedEnquiry.assignedBy)} />
                ) : null}
                {selectedEnquiry.status === 'closed' ? (
                  <DetailRow
                    label="Completed by"
                    value={
                      getUserLabel(selectedEnquiry.closedBy) ||
                      getUserLabel(selectedEnquiry.assignedTo) ||
                      '-'
                    }
                  />
                ) : null}

                <PermissionGate permission="enquiries.assign">
                  <div className="space-y-2">
                    <Label>Assign to team member</Label>
                    <Select
                      value={selectedAssigneeId}
                      onValueChange={(value) => handleAssign(selectedEnquiry._id, value)}
                      disabled={saving}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {staffOptions.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </PermissionGate>

                {!canAssign && !getUserId(selectedEnquiry.assignedTo) && canEdit ? (
                  <Button
                    className="w-full"
                    variant="secondary"
                    disabled={saving}
                    onClick={() => handleClaim(selectedEnquiry._id)}
                  >
                    Claim this enquiry
                  </Button>
                ) : null}

                <PermissionGate permission="enquiries.edit">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={selectedEnquiry.status}
                      onValueChange={(value) =>
                        handleStatusChange(selectedEnquiry._id, value as ApiEnquiry['status'])
                      }
                      disabled={saving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enquiry-notes">Internal notes</Label>
                    <Textarea
                      id="enquiry-notes"
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      placeholder="Add follow-up notes..."
                      rows={4}
                    />
                    <Button
                      variant="secondary"
                      className="w-full"
                      disabled={saving || notesDraft === (selectedEnquiry.notes || '')}
                      onClick={handleSaveNotes}
                    >
                      Save notes
                    </Button>
                  </div>
                </PermissionGate>

                <PermissionGate permission="enquiries.delete">
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={() => handleDelete(selectedEnquiry._id)}
                  >
                    <Trash2 className="h-4 w-4" /> Delete Enquiry
                  </Button>
                </PermissionGate>
              </Card>
            ) : (
              <Card className="flex min-h-[250px] flex-col items-center justify-center border-border bg-card p-6 text-center text-muted-foreground">
                <MessageSquare className="mb-2 h-8 w-8" />
                <p>Select an enquiry from the table to view details and assign it.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EnquiriesPage;
