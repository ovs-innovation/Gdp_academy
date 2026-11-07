import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  WEBSITE_NAV_GROUPS,
  type WebsiteNavId,
} from "@/lib/websiteControlNav";
import {
  LayoutGrid,
  Home,
  Info,
  Sparkles,
  BookOpen,
  Calendar,
  Image,
  FileText,
  HelpCircle,
  Star,
  CreditCard,
  Phone,
  Clock,
  Video,
  ShieldCheck,
  Lock,
  Settings,
  Search,
} from "lucide-react";

type Props = {
  activeId: WebsiteNavId;
  onSelect: (id: WebsiteNavId) => void;
};

const PAGE_ICONS: Record<string, typeof Home> = {
  overview: LayoutGrid,
  home: Home,
  about: Info,
  services: Sparkles,
  programs: BookOpen,
  workshops: Calendar,
  gallery: Image,
  blog: FileText,
  faq: HelpCircle,
  testimonials: Star,
  membership: CreditCard,
  contact: Phone,
  schedule: Clock,
  "live-zoom": Video,
  terms: ShieldCheck,
  privacy: Lock,
  global: Settings,
};

export function WebsitePageNav({ activeId, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return WEBSITE_NAV_GROUPS;

    return WEBSITE_NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          (item.path && item.path.toLowerCase().includes(q)),
      ),
    })).filter((group) => group.items.length > 0);
  }, [search]);

  return (
    <nav className="space-y-4">
      {/* Search Input for Quick Finding */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter pages..."
          className="h-8 pl-8 text-xs bg-muted/40"
        />
      </div>

      {filteredGroups.map((group) => (
        <div key={group.title} className="space-y-1">
          <p className="border-b border-border px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = activeId === item.id;
              const IconComp = PAGE_ICONS[item.id] || FileText;

              return (
                <button
                  key={item.id}
                  type="button"
                  title={item.path ? `${item.label} (${item.path})` : item.label}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    "flex h-9 w-full min-w-0 items-center gap-2.5 rounded-lg px-2.5 text-left text-xs transition font-medium",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                      : "text-foreground hover:bg-muted/70",
                  )}
                >
                  <IconComp
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      active ? "text-primary-foreground" : "text-muted-foreground",
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.path ? (
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[10px] opacity-75",
                        active ? "text-primary-foreground/90" : "text-muted-foreground",
                      )}
                    >
                      {item.path}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
