import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';

const NotificationsPage = () => (
  <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
        <p className="text-muted-foreground">System notifications and student messaging controls.</p>
      </div>
      <Card className="p-6 text-muted-foreground">
        Notification infrastructure is preserved from the backend; targeted campaigns can be added here next.
      </Card>
    </div>
  </AdminLayout>
);

export default NotificationsPage;
