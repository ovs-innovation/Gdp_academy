import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell,
  Plus,
  Send,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BlogPost {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'Program' | 'maintenance' | 'promotion';
  targetAudience: 'all' | 'Members' | 'teachers' | 'specific_Program';
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  views: number;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

const mockPosts: BlogPost[] = [
  {
    id: 'ANN-001',
    title: 'New Program Launch: Advanced Machine Learning',
    message: 'We are excited to announce the launch of our new Advanced Machine Learning Program. Enroll now to get early bird discounts!',
    type: 'promotion',
    targetAudience: 'all',
    status: 'sent',
    sentAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-14T15:30:00Z',
    views: 1250,
    pushEnabled: true,
    emailEnabled: true,
  },
  {
    id: 'ANN-002',
    title: 'Scheduled Maintenance - January 20th',
    message: 'The platform will be undergoing maintenance on January 20th from 2:00 AM to 6:00 AM UTC. Some features may be temporarily unavailable.',
    type: 'maintenance',
    targetAudience: 'all',
    status: 'scheduled',
    scheduledAt: '2024-01-19T08:00:00Z',
    createdAt: '2024-01-15T11:00:00Z',
    views: 0,
    pushEnabled: true,
    emailEnabled: false,
  },
  {
    id: 'ANN-003',
    title: 'Web Development Program - Assignment Deadline Extended',
    message: 'The deadline for Assignment 3 has been extended to January 25th. Please submit your work before the new deadline.',
    type: 'Program',
    targetAudience: 'specific_Program',
    status: 'sent',
    sentAt: '2024-01-14T09:00:00Z',
    createdAt: '2024-01-14T08:45:00Z',
    views: 450,
    pushEnabled: true,
    emailEnabled: true,
  },
  {
    id: 'ANN-004',
    title: 'Teacher Workshop - Effective Online Teaching',
    message: 'Join us for a workshop on effective online teaching strategies. Date: January 22nd at 3:00 PM UTC.',
    type: 'general',
    targetAudience: 'teachers',
    status: 'draft',
    createdAt: '2024-01-15T14:00:00Z',
    views: 0,
    pushEnabled: false,
    emailEnabled: true,
  },
];

const typeConfig = {
  general: { label: 'General', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30', icon: Bell },
  Program: { label: 'Program', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30', icon: BookOpen },
  maintenance: { label: 'Maintenance', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30', icon: Clock },
  promotion: { label: 'Blog', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30', icon: GraduationCap },
};

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-muted text-muted-foreground border-border' },
  scheduled: { label: 'Scheduled', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  sent: { label: 'Sent', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
};

const audienceConfig = {
  all: { label: 'All Users', icon: Users },
  Members: { label: 'Members Only', icon: GraduationCap },
  teachers: { label: 'Teachers Only', icon: BookOpen },
  specific_Program: { label: 'Program Members', icon: BookOpen },
};

const BlogsPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPosts = posts.filter(
    post => statusFilter === 'all' || post.status === statusFilter
  );

  const counts = {
    all: posts.length,
    draft: posts.filter(a => a.status === 'draft').length,
    scheduled: posts.filter(a => a.status === 'scheduled').length,
    sent: posts.filter(a => a.status === 'sent').length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Blogs & News</h1>
            <p className="mt-1 text-muted-foreground">
              Manage blog posts, news updates, and announcements for members
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Post</DialogTitle>
                <DialogDescription>
                  Share a blog post, news update, or announcement with members.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Post title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Write your post content..." rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="Program">Program</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Target Audience</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="Members">Members Only</SelectItem>
                        <SelectItem value="teachers">Teachers Only</SelectItem>
                        <SelectItem value="specific_Program">Specific Program</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 rounded-lg border border-border p-4">
                  <Label className="text-base">Notification Channels</Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push">Push Notification</Label>
                      <p className="text-sm text-muted-foreground">Send as in-app push notification</p>
                    </div>
                    <Switch id="push" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email">Email Notification</Label>
                      <p className="text-sm text-muted-foreground">Send via email to users</p>
                    </div>
                    <Switch id="email" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule">Schedule (Optional)</Label>
                  <Input id="schedule" type="datetime-local" />
                  <p className="text-xs text-muted-foreground">Leave empty to send immediately</p>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>
                  <Send className="mr-2 h-4 w-4" />
                  Send Now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total', count: counts.all, icon: Bell, color: 'text-primary' },
            { label: 'Drafts', count: counts.draft, icon: Edit, color: 'text-muted-foreground' },
            { label: 'Scheduled', count: counts.scheduled, icon: Calendar, color: 'text-amber-500' },
            { label: 'Sent', count: counts.sent, icon: CheckCircle2, color: 'text-emerald-500' },
          ].map((stat, index) => (
            <Card
              key={stat.label}
              className="border-border bg-card p-4 animate-slide-up cursor-pointer hover:shadow-md transition-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setStatusFilter(stat.label.toLowerCase())}
            >
              <div className="flex items-center justify-between">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-2xl font-bold text-foreground">{stat.count}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label} Posts</p>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'draft', 'scheduled', 'sent'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post, index) => {
            const TypeIcon = typeConfig[post.type].icon;
            const AudienceIcon = audienceConfig[post.targetAudience].icon;
            
            return (
              <Card
                key={post.id}
                className="border-border bg-card p-6 animate-slide-up hover:shadow-md transition-shadow"
                style={{ animationDelay: `${(index + 4) * 50}ms` }}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge variant="outline" className={typeConfig[post.type].color}>
                        <TypeIcon className="mr-1 h-3 w-3" />
                        {typeConfig[post.type].label}
                      </Badge>
                      <Badge variant="outline" className={statusConfig[post.status].color}>
                        {statusConfig[post.status].label}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <AudienceIcon className="h-3 w-3" />
                        {audienceConfig[post.targetAudience].label}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground">{post.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.message}</p>
                    
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      {post.status === 'sent' && (
                        <>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views.toLocaleString()} views</span>
                          </div>
                          <span>•</span>
                          <span>Sent {formatDate(post.sentAt!)}</span>
                        </>
                      )}
                      {post.status === 'scheduled' && (
                        <>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Scheduled for {formatDate(post.scheduledAt!)}</span>
                          </div>
                        </>
                      )}
                      {post.status === 'draft' && (
                        <span>Created {formatDate(post.createdAt)}</span>
                      )}
                    </div>
                    
                    <div className="mt-3 flex items-center gap-3">
                      {post.pushEnabled && (
                        <Badge variant="secondary" className="text-xs">
                          <Bell className="mr-1 h-3 w-3" />
                          Push
                        </Badge>
                      )}
                      {post.emailEnabled && (
                        <Badge variant="secondary" className="text-xs">
                          <Send className="mr-1 h-3 w-3" />
                          Email
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {post.status === 'draft' && (
                      <Button size="sm">
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <Card className="border-border bg-card p-12">
            <div className="text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-medium text-foreground">No posts found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first post to share with members
              </p>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogsPage;
