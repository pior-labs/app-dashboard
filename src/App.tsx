import { sections } from "@/config/links";
import { Section } from "@/components/Section";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-8 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">Home</h1>
            <p className="mt-1 text-sm text-muted-foreground">Apps and infrastructure</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="space-y-10">
          {sections.map((section) => (
            <Section key={section.title} section={section} />
          ))}
        </div>
      </div>
    </main>
  );
}
