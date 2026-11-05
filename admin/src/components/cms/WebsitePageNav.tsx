import { cn } from "@/lib/utils";
import {
  WEBSITE_NAV_GROUPS,
  type WebsiteNavId,
} from "@/lib/websiteControlNav";

type Props = {
  activeId: WebsiteNavId;
  onSelect: (id: WebsiteNavId) => void;
};

export function WebsitePageNav({ activeId, onSelect }: Props) {
  return (
    <nav className="space-y-4">
      {WEBSITE_NAV_GROUPS.map((group) => (
        <div key={group.title} className="space-y-1">
          <p className="border-b border-border px-2 pb-1.5 text-xs font-semibold uppercase tracking-wide text-foreground">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = activeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  title={item.path ? `${item.label} ${item.path}` : item.label}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    "flex h-10 w-full min-w-0 items-center gap-2 rounded-md px-2.5 text-left transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.label}</span>
                  {item.path ? (
                    <span className={cn("shrink-0 text-[11px] leading-none", active ? "text-primary-foreground/80" : "text-foreground/55")}>
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
