import { Trash2, MessageSquare } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { EnquiriesAPI, type ApiEnquiry } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const getProgramLabel = (value: ApiEnquiry['programId']) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  const name = value.name;
  if (typeof name === 'string') return name;
  if (name && typeof name === 'object' && 'en' in name) return String(name.en || '');
  return null;
};

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="text-sm text-foreground break-words">{value || '-'}</p>
  </div>
);

const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState<ApiEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ApiEnquiry | null>(null);
  const { toast } = useToast();

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await EnquiriesAPI.list();
      setEnquiries(data.enquiries || []);
    } catch (err: any) {
      toast({ title: 'Failed to load enquiries', description: err?.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const updateStatus = async (id: string, status: ApiEnquiry['status']) => {
    try {
      await EnquiriesAPI.update(id, { status });
      setEnquiries((items) => items.map((item) => (item._id === id ? { ...item, status } : item)));
      if (selectedEnquiry?._id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
      toast({ title: 'Enquiry updated' });
    } catch (err: any) {
      toast({ title: 'Update failed', description: err?.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      await EnquiriesAPI.delete(id);
      setEnquiries((items) => items.filter((item) => item._id !== id));
      if (selectedEnquiry?._id === id) {
        setSelectedEnquiry(null);
      }
      toast({ title: 'Enquiry deleted successfully' });
    } catch (err: any) {
      toast({ title: 'Failed to delete enquiry', description: err?.message, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Enquiries</h1>
            <p className="text-muted-foreground">All homepage, program, and workshop enquiries with full visitor details.</p>
          </div>
          <Button variant="outline" onClick={loadEnquiries}>Refresh</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <Card className="border-border bg-card p-8 text-center text-muted-foreground">Loading enquiries...</Card>
            ) : enquiries.length === 0 ? (
              <Card className="border-border bg-card p-12 text-center text-muted-foreground">No enquiries yet</Card>
            ) : (
              enquiries.map((enquiry) => (
                <Card
                  key={enquiry._id}
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className={`border-border p-4 cursor-pointer hover:bg-muted/30 transition flex justify-between items-start gap-4 ${
                    selectedEnquiry?._id === enquiry._id ? 'bg-muted/40 border-primary' : 'bg-card'
                  }`}
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{enquiry.source.replace(/_/g, ' ')}</Badge>
                      <Badge variant={enquiry.status === 'new' ? 'default' : 'secondary'}>{enquiry.status.replace('_', ' ')}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString() : ''}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground">{enquiry.name}</h4>
                    <p className="text-sm text-muted-foreground">{enquiry.email} · {enquiry.phone}</p>
                    {enquiry.subject ? (
                      <p className="text-sm font-medium text-foreground truncate">{enquiry.subject}</p>
                    ) : null}
                    <p className="text-sm text-muted-foreground truncate">{enquiry.message}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(enquiry._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </Card>
              ))
            )}
          </div>

          <div className="lg:col-span-1">
            {selectedEnquiry ? (
              <Card className="border-border bg-card p-6 space-y-5 sticky top-6">
                <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedEnquiry.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedEnquiry.createdAt ? new Date(selectedEnquiry.createdAt).toLocaleString() : '-'}
                    </p>
                  </div>
                  <Badge variant="outline">{selectedEnquiry.source.replace(/_/g, ' ')}</Badge>
                </div>

                <DetailRow label="Email" value={selectedEnquiry.email} />
                <DetailRow label="Phone" value={selectedEnquiry.phone} />
                <DetailRow label="Subject" value={selectedEnquiry.subject} />
                <DetailRow label="WhatsApp Consent" value={selectedEnquiry.whatsappConsent ? 'Yes' : 'No'} />
                <DetailRow label="Program" value={getProgramLabel(selectedEnquiry.programId)} />
                <DetailRow label="Workshop" value={getProgramLabel(selectedEnquiry.workshopId)} />

                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</p>
                  <div className="rounded-md bg-muted/40 p-4 text-sm text-foreground whitespace-pre-wrap min-h-[120px]">
                    {selectedEnquiry.message}
                  </div>
                </div>

                {selectedEnquiry.notes ? (
                  <DetailRow label="Admin Notes" value={selectedEnquiry.notes} />
                ) : null}

                <DetailRow
                  label="Last Updated"
                  value={selectedEnquiry.updatedAt ? new Date(selectedEnquiry.updatedAt).toLocaleString() : '-'}
                />

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                  <Select
                    value={selectedEnquiry.status}
                    onValueChange={(value) => updateStatus(selectedEnquiry._id, value as ApiEnquiry['status'])}
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

                <Button variant="destructive" className="w-full gap-2" onClick={() => handleDelete(selectedEnquiry._id)}>
                  <Trash2 className="h-4 w-4" /> Delete Enquiry
                </Button>
              </Card>
            ) : (
              <Card className="border-border bg-card p-6 text-center text-muted-foreground min-h-[250px] flex flex-col justify-center items-center">
                <MessageSquare className="h-8 w-8 mb-2" />
                <p>Select an enquiry to view all submitted details.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EnquiriesPage;
