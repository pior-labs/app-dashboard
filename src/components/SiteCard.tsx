import type { LinkItem } from "@/config/links";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type SiteCardProps = {
  link: LinkItem;
};

export function SiteCard({ link }: SiteCardProps) {
  const Icon = link.icon;

  return (
    <a
      href={link.href}
      target={link.newTab ? "_blank" : undefined}
      rel={link.newTab ? "noreferrer" : undefined}
      className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="h-full transition-colors hover:border-primary/60 hover:bg-accent">
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background text-foreground">
              {Icon ? <Icon className="size-5" aria-hidden="true" /> : null}
            </div>
            {link.badge ? <Badge variant="secondary">{link.badge}</Badge> : null}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-medium leading-none tracking-normal">{link.name}</h3>
            {link.description ? (
              <p className="text-sm leading-6 text-muted-foreground">{link.description}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
