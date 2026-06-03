import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8096/api';

const getToken = () =>
  localStorage.getItem('admin-auth-token') || sessionStorage.getItem('admin-auth-token');

interface DashboardStats {
  totalUsers?: number;
  activeUsers?: number;
  totalCourses?: number;
  totalEnrollments?: number;
  totalRevenue?: number;
  enrollmentData?: { month: string; enrollments: number; revenue: number }[];
}

const AnalyticsPage = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const res = await fetch(`${API_URL}/admin/dashboard/stats?dateRange=30d`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to load analytics');
        const data = await res.json();
        setStats({
          ...(data.stats || {}),
          enrollmentData: data.enrollmentData || [],
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Could not load analytics';
        toast({ title: 'Analytics unavailable', description: message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const cards = [
    {
      label: 'Total Users',
      value: loading ? '—' : String(stats?.totalUsers ?? 0),
      icon: Users,
    },
    {
      label: 'Active Users',
      value: loading ? '—' : String(stats?.activeUsers ?? 0),
      icon: TrendingUp,
    },
    {
      label: 'Active Programs',
      value: loading ? '—' : String(stats?.totalCourses ?? 0),
      icon: BookOpen,
    },
    {
      label: 'Enrollments (30d)',
      value: loading ? '—' : String(stats?.totalEnrollments ?? 0),
      icon: BarChart3,
    },
  ];

  const trend = stats?.enrollmentData || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Live platform metrics from bookings, users, and programs.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((stat, index) => (
            <Card
              key={stat.label}
              className="border-border bg-card p-6 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        <Card className="border-border bg-card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h3 className="mb-4 font-semibold text-foreground">Enrollment trend</h3>
          {trend.length === 0 ? (
            <p className="text-sm text-muted-foreground">No enrollment data for the selected period yet.</p>
          ) : (
            <div className="space-y-2">
              {trend.map((row) => (
                <div
                  key={row.month}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                >
                  <span className="text-foreground">{row.month}</span>
                  <span className="text-muted-foreground">
                    {row.enrollments} enrollments · ₹{row.revenue ?? 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
