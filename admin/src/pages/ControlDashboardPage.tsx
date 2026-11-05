import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter,
  Eye,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

const API_URL = (
  import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_API_URL || "https://api.garimadanceproductions.com/api"
).replace(/\/$/, "");

const getToken = () => localStorage.getItem('admin-auth-token') || sessionStorage.getItem('admin-auth-token');

const chartConfig = {
  Registrations: { label: 'Registrations', color: 'hsl(var(--primary))' },
  revenue: { label: 'Revenue', color: 'hsl(var(--chart-2))' },
  visitors: { label: 'Visitors', color: 'hsl(var(--primary))' },
  pageViews: { label: 'Page Views', color: 'hsl(var(--chart-2))' },
  Members: { label: 'Members', color: 'hsl(var(--primary))' },
};

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
];

const ControlDashboardPage = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedDanceCoach, setSelectedDanceCoach] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Real data states
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalRevenue: 0,
    totalPrograms: 0,
    totalRegistrations: 0,
    RegistrationChange: 0,
    revenueChange: 0,
  });
  const [RegistrationData, setRegistrationData] = useState<any[]>([]);
  const [ProgramPerformanceData, setProgramPerformanceData] = useState<any[]>([]);
  const [userDistribution, setUserDistribution] = useState<any[]>([]);
  
  // Dropdown options
  const [Programs, setPrograms] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, selectedProgram, selectedDanceCoach]);

  const fetchDropdownData = async () => {
    try {
      const token = getToken();
      
      // Fetch Programs
      const ProgramsRes = await fetch(`${API_URL}/admin/courses`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (ProgramsRes.ok) {
        const ProgramsData = await ProgramsRes.json();
        setPrograms(ProgramsData.courses || ProgramsData.programs || ProgramsData.Programs || []);
      }

      // Fetch teachers
      const teachersRes = await fetch(`${API_URL}/teacher-profiles`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (teachersRes.ok) {
        const teachersData = await teachersRes.json();
        setTeachers(teachersData.profiles || []);
      }
    } catch (err) {
      console.error('Failed to load dropdown data:', err);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const params = new URLSearchParams({
        dateRange,
        ProgramId: selectedProgram,
        teacherId: selectedDanceCoach,
      });

      const response = await fetch(`${API_URL}/admin/dashboard/stats?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load dashboard data');

      const data = await response.json();
      
      const rawStats = data.stats || {};
      setStats({
        activeUsers: rawStats.activeUsers ?? 0,
        totalRevenue: rawStats.totalRevenue ?? 0,
        totalPrograms: rawStats.totalPrograms ?? rawStats.totalCourses ?? 0,
        totalRegistrations: rawStats.totalRegistrations ?? rawStats.totalEnrollments ?? 0,
        RegistrationChange: rawStats.RegistrationChange ?? rawStats.enrollmentChange ?? 0,
        revenueChange: rawStats.revenueChange ?? 0,
      });

      const rawRegistrationData = data.RegistrationData || data.enrollmentData || [];
      const mappedRegistrationData = rawRegistrationData.map((item: any) => ({
        month: item.month,
        Registrations: item.Registrations ?? item.enrollments ?? 0,
        revenue: item.revenue ?? 0,
      }));
      setRegistrationData(mappedRegistrationData);

      const rawProgramPerformance = data.ProgramPerformance || data.coursePerformance || [];
      const mappedProgramPerformance = rawProgramPerformance.map((item: any) => ({
        name: item.name,
        Members: item.Members ?? item.students ?? 0,
        completion: item.completion ?? 0,
        rating: item.rating ?? 0,
      }));
      setProgramPerformanceData(mappedProgramPerformance);
      
      // Add colors to user distribution
      const distributionWithColors = (data.userDistribution || []).map((item: any, index: number) => ({
        ...item,
        color: COLORS[index % COLORS.length]
      }));
      setUserDistribution(distributionWithColors);
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getLanguageValue = (value: any) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value.en || value[Object.keys(value)[0]] || '';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between animate-fade-in">
          <div>
            <h1 className="font-display text-2xl tracking-tight text-foreground sm:text-3xl">Control Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Students, payments, and registrations
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px] bg-card border-border">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <BookOpen className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {Programs.map((Program) => (
                  <SelectItem key={Program._id} value={Program._id}>
                    {getLanguageValue(Program.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDanceCoach} onValueChange={setSelectedDanceCoach}>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <Users className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Dance Coach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dance Coaches</SelectItem>
                {teachers.map((teacher) => {
                  const uid = teacher?.userId?._id || teacher?.userId;
                  const name = teacher?.userId?.name || teacher?.name || 'Unknown';
                  if (!uid) return null;
                  return (
                    <SelectItem key={uid} value={uid}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-border bg-card p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-10 w-10 bg-muted rounded-lg"></div>
                  <div className="h-8 bg-muted rounded w-24"></div>
                  <div className="h-4 bg-muted rounded w-32"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card p-6 animate-slide-up hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <Badge 
                  variant="outline" 
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              </div>
              <p className="mt-4 text-2xl font-bold text-foreground">{(stats?.activeUsers ?? 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="mt-1 text-xs text-muted-foreground/70">Currently active</p>
            </Card>

            <Card className="border-border bg-card p-6 animate-slide-up hover:shadow-lg transition-shadow" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <Badge 
                  variant="outline" 
                  className={(stats?.revenueChange ?? 0) >= 0 
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' 
                    : 'border-red-500/30 bg-red-500/10 text-red-500'
                  }
                >
                  {(stats?.revenueChange ?? 0) >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                  {(stats?.revenueChange ?? 0) >= 0 ? '+' : ''}{stats?.revenueChange ?? 0}%
                </Badge>
              </div>
              <p className="mt-4 text-2xl font-bold text-foreground">${(stats?.totalRevenue ?? 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="mt-1 text-xs text-muted-foreground/70">Last 30 days</p>
            </Card>

            <Card className="border-border bg-card p-6 animate-slide-up hover:shadow-lg transition-shadow" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <Badge 
                  variant="outline" 
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              </div>
              <p className="mt-4 text-2xl font-bold text-foreground">{(stats?.totalPrograms ?? 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Programs</p>
              <p className="mt-1 text-xs text-muted-foreground/70">Published Programs</p>
            </Card>

            <Card className="border-border bg-card p-6 animate-slide-up hover:shadow-lg transition-shadow" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <Badge 
                  variant="outline" 
                  className={(stats?.RegistrationChange ?? 0) >= 0 
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' 
                    : 'border-red-500/30 bg-red-500/10 text-red-500'
                  }
                >
                  {(stats?.RegistrationChange ?? 0) >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                  {(stats?.RegistrationChange ?? 0) >= 0 ? '+' : ''}{stats?.RegistrationChange ?? 0}%
                </Badge>
              </div>
              <p className="mt-4 text-2xl font-bold text-foreground">{(stats?.totalRegistrations ?? 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Registrations</p>
              <p className="mt-1 text-xs text-muted-foreground/70">All time</p>
            </Card>
          </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid gap-6">
          {/* Registration Trends */}
          <Card className="border-border bg-card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Registration Trends</h3>
              <p className="text-sm text-muted-foreground">Monthly Registration & revenue</p>
            </div>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart data={RegistrationData}>
                <defs>
                  <linearGradient id="RegistrationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="Registrations" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#RegistrationGradient)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Program Performance */}
          <Card className="border-border bg-card p-6 lg:col-span-2 animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Program Performance</h3>
              <p className="text-sm text-muted-foreground">Top performing Programs by Registration</p>
            </div>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={ProgramPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-muted-foreground" />
                <YAxis dataKey="name" type="category" width={100} className="text-muted-foreground" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="Members" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </Card>

          {/* User Distribution */}
          <Card className="border-border bg-card p-6 animate-slide-up" style={{ animationDelay: '700ms' }}>
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">User Distribution</h3>
              <p className="text-sm text-muted-foreground">By role type</p>
            </div>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {userDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-medium text-foreground">{(item?.value ?? 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ControlDashboardPage;
