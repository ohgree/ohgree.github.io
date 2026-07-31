import { Cutout } from "dom-cutout/react";
import type { ReactNode } from "react";

import { ArrowIcon, GitHubIcon, NpmIcon, StarIcon } from "@/components/Icons";
import { compactNumber, languageColor, relativeTime } from "@/lib/format";
import type { Project } from "@/types";

type ProjectCardProps = {
  project: Project;
};

const MetaItem = ({ children }: { children: ReactNode }) => (
  <span className="text-base-content/50 inline-flex items-center gap-1.5">{children}</span>
);

/** The npm version pill that punches through the card's top edge on `dom-cutout` itself. */
const VersionPill = ({ version }: { version: string }) => (
  <span className="bg-primary text-primary-content rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold whitespace-nowrap">
    v{version}
  </span>
);

const CardBody = ({ project }: ProjectCardProps) => {
  const { repo, npm } = project;

  return (
    <div className="flex h-full flex-col gap-3 p-6">
      <div className="flex items-baseline gap-3">
        <h3 className="font-mono text-lg font-semibold tracking-tight">
          <a
            href={repo?.url ?? project.links[0]?.url}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            {project.name}
          </a>
        </h3>
        {repo?.license ? (
          <span className="text-base-content/35 font-mono text-[11px]">{repo.license}</span>
        ) : null}
      </div>

      <p className="text-base-content/90 text-[15px] leading-snug font-medium">{project.tagline}</p>
      <p className="text-base-content/55 text-sm leading-relaxed">{project.blurb}</p>

      <div className="mt-auto flex flex-col gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs">
          {repo?.language ? (
            <MetaItem>
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full"
                style={{ backgroundColor: languageColor(repo.language) }}
              />
              {repo.language}
            </MetaItem>
          ) : null}
          {repo && repo.stars > 0 ? (
            <MetaItem>
              <StarIcon className="size-3" />
              {compactNumber(repo.stars)}
            </MetaItem>
          ) : null}
          {npm?.weeklyDownloads ? (
            <MetaItem>{compactNumber(npm.weeklyDownloads)}/wk</MetaItem>
          ) : null}
          {repo ? <MetaItem>updated {relativeTime(repo.pushedAt)}</MetaItem> : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
          {repo ? (
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="text-base-content/70 hover:text-primary inline-flex items-center gap-1.5 transition-colors"
            >
              <GitHubIcon className="size-3.5" />
              source
            </a>
          ) : null}
          {npm ? (
            <a
              href={npm.url}
              target="_blank"
              rel="noreferrer"
              className="text-base-content/70 hover:text-primary inline-flex items-center gap-1.5 transition-colors"
            >
              <NpmIcon className="size-3.5" />
              npm
            </a>
          ) : null}
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-base-content/70 hover:text-primary inline-flex items-center gap-1.5 transition-colors"
            >
              {link.label}
              <ArrowIcon className="size-3.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const SURFACE =
  "border-base-content/10 bg-base-100 hover:border-primary/50 rounded-2xl border shadow-sm transition-colors";

export const ProjectCard = ({ project }: ProjectCardProps) => {
  // dom-cutout demonstrates itself: its own version pill is punched through its own card.
  if (project.slug === "dom-cutout" && project.npm) {
    return (
      <article className="relative">
        <Cutout
          gap={6}
          className={SURFACE}
          overlay={
            <span className="absolute -top-3 right-5">
              <VersionPill version={project.npm.version} />
            </span>
          }
        >
          <CardBody project={project} />
        </Cutout>
      </article>
    );
  }

  return (
    <article className={SURFACE}>
      <CardBody project={project} />
    </article>
  );
};
