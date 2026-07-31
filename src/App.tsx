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
    // Scroll floor: the page always overflows the viewport by at least 1rem, so even after a
    // document shrink (header compacting, a card collapsing) maxScroll stays above the compact
    // threshold and the browser clamp can never re-expand the header on its own.
    <div className="flex min-h-[calc(100dvh+1rem)] flex-col">
      <Header profile={profile} />

      {/* Top padding carries an extra COMPACT_AT so the band that sits tucked under the compact
          bar is always padding, never content. */}
      <div
        className={cn(
          CONTAINER,
          "flex flex-1 flex-col gap-16",
          "pt-[calc(var(--gutter)+8px)] pb-(--gutter)",
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
