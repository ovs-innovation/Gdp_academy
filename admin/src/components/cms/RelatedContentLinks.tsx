import { ExternalLink, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import type { RelatedLink } from "@/lib/websiteControlNav";

type Props = {
  links?: RelatedLink[];
};

export function RelatedContentLinks({ links }: Props) {
  if (!links?.length) return null;

  return (
    <Card className="border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Link2 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Related content</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        This page’s hero/copy is edited here. Lists and cards are managed in these screens:
      </p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to + link.label}>
            <Link
              to={link.to}
              className="group flex items-start justify-between gap-3 rounded-md border border-border bg-muted/20 px-3 py-2.5 transition hover:border-primary/40 hover:bg-muted/40"
            >
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary">
                  {link.label}
                </p>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
