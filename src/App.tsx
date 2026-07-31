import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { projectIndex } from "@/data";
import { cn } from "@/lib/cn";
import { CONTAINER } from "@/lib/layout";
import type { ProjectKind } from "@/types";

const KIND_LABELS: Record<ProjectKind, string> = {
  package: "Packages",
  app: "Apps",
  service: "Services",
  tool: "Tools",
};

const KIND_ORDER: ProjectKind[] = ["package", "app", "service", "tool"];

export const App = () => {
  const { profile, projects, generatedAt } = projectIndex;

  const groups = KIND_ORDER.map((kind) => ({
    kind,
    items: projects.filter((project) => project.kind === kind),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header profile={profile} />

      <div
        className={cn(
          CONTAINER,
          "flex flex-1 flex-col gap-16",
          // The compact resting position: scroll-margin-top clears the bar so content rests just
          // below it rather than under it.
          "snap-start scroll-mt-[calc(var(--header-compact)+var(--gutter)+env(safe-area-inset-top))]",
          "pt-[var(--gutter)] pb-[calc(var(--gutter)+env(safe-area-inset-bottom))]",
        )}
      >
        <main className="flex flex-col gap-12">
          {groups.map((group) => (
            <section key={group.kind} className="flex flex-col gap-5">
              <h2 className="text-base-content/40 font-mono text-xs tracking-[0.18em] uppercase">
                {KIND_LABELS[group.kind]}
              </h2>
              <div className="flex flex-col gap-5">
                {group.items.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </section>
          ))}
        </main>

        <div className="mt-auto">
          <Footer publicRepos={profile.publicRepos} generatedAt={generatedAt} />
        </div>
      </div>
    </div>
  );
};
