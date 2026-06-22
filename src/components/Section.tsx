import type { Section as SectionConfig } from "@/config/links";
import { SiteCard } from "@/components/SiteCard";
import { Separator } from "@/components/ui/separator";

type SectionProps = {
  section: SectionConfig;
};

export function Section({ section }: SectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-3">
        <h2 className="text-lg font-medium tracking-normal">{section.title}</h2>
        <Separator />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {section.links.map((link) => (
          <SiteCard key={link.name} link={link} />
        ))}
      </div>
    </section>
  );
}
