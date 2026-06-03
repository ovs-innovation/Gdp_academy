import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnquiriesAPI, ContactMessagesAPI, type ApiEnquiry, type ApiContactMessage } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type FeedItem =
  | { kind: 'enquiry'; id: string; title: string; detail: string; status: string; at: string }
  | { kind: 'contact'; id: string; title: string; detail: string; status: string; at: string };

const NotificationsPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [enquiriesRes, messagesRes] = await Promise.all([
          EnquiriesAPI.list({ limit: 20 }),
          ContactMessagesAPI.list(),
        ]);

        const enquiryItems: FeedItem[] = (enquiriesRes.enquiries || []).map((e: ApiEnquiry) => ({
          kind: 'enquiry',
          id: e._id,
          title: e.name || 'New enquiry',
          detail: e.message || e.subject || 'Website enquiry',
          status: e.status || 'new',
          at: e.createdAt || '',
        }));

        const contactItems: FeedItem[] = (messagesRes.messages || []).map((m: ApiContactMessage) => ({
          kind: 'contact',
          id: m._id,
          title: m.name || 'Contact message',
          detail: m.message || m.subject || 'Contact form',
          status: m.status || 'new',
          at: m.createdAt || '',
        }));

        const merged = [...enquiryItems, ...contactItems].sort(
          (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
        );
        setItems(merged);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load notifications';
        toast({ title: 'Could not load feed', description: message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            Recent enquiries and contact messages — your operational inbox.
          </p>
        </div>

        <Card className="border-border bg-card divide-y divide-border">
          {loading && <p className="p-6 text-muted-foreground">Loading…</p>}
          {!loading && items.length === 0 && (
            <p className="p-6 text-muted-foreground">No new notifications yet.</p>
          )}
          {!loading &&
            items.map((item) => (
              <div key={`${item.kind}-${item.id}`} className="flex items-start justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.detail}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {item.kind === 'enquiry' ? 'Enquiry' : 'Contact'} ·{' '}
                    {item.at ? new Date(item.at).toLocaleString() : '—'}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize shrink-0">
                  {item.status}
                </Badge>
              </div>
            ))}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default NotificationsPage;
