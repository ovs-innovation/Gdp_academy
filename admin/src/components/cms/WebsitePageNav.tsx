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
    <nav className="space-y-5">
      {WEBSITE_NAV_GROUPS.map((group) => (
        <div key={group.title} className="space-y-1.5">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = activeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    "flex w-full flex-col rounded-md px-2.5 py-2 text-left transition",
                    active
                      ? "bg-primary/15 text-foreground ring-1 ring-primary/30"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.path ? (
                    <span className="text-[11px] opacity-70">{item.path}</span>
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
