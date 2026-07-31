import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import type { ReactNode } from "react";

import { ArrowIcon, ChevronIcon, GitHubIcon, NpmIcon, StarIcon } from "@/components/Icons";
import { cn } from "@/lib/cn";
import { compactNumber, languageColor, relativeTime } from "@/lib/format";
import type { Project } from "@/types";

type ProjectCardProps = {
  project: Project;
};

const MetaItem = ({ children }: { children: ReactNode }) => (
  <span className="text-base-content/50 inline-flex items-center gap-1.5">{children}</span>
);

const ExternalLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="text-base-content/70 hover:text-primary inline-flex items-center gap-1.5 transition-colors"
  >
    {children}
  </a>
);

type VersionPillProps = {
  version: string;
  className?: string;
};

const VersionPill = ({ version, className }: VersionPillProps) => (
  <span
    className={cn(
      "bg-primary text-primary-content rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold whitespace-nowrap",
      className,
    )}
  >
    v{version}
  </span>
);

const CardBody = ({ project }: ProjectCardProps) => {
  const [open, setOpen] = useState(false);
  const { repo, npm } = project;
  const detailsId = `${project.slug}-details`;

  return (
    <div className="flex flex-col">
      {/* The whole summary is the toggle, so the title can't also be a link — the repo link
          lives in the details row below instead. */}
      <button
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-expanded={open}
        aria-controls={detailsId}
        className="flex cursor-pointer flex-col gap-3 p-6 text-left"
      >
        <div className="flex w-full items-center gap-3">
          <h3 className="font-mono text-lg font-semibold tracking-tight">{project.name}</h3>
          {repo?.license ? (
            <span className="text-base-content/35 font-mono text-[11px]">{repo.license}</span>
          ) : null}
          {npm ? <VersionPill version={npm.version} /> : null}
          <ChevronIcon
            className={cn(
              "text-base-content/40 ml-auto size-4 shrink-0 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </div>

        <p className="text-base-content/90 text-[15px] leading-snug font-medium">
          {project.tagline}
        </p>

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
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <m.div
            id={detailsId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-6 pb-6">
              {/* The body collapses on click too. A real button rather than a click handler on the
                  paragraph, so it is keyboard-operable and announces the state it controls; the
                  links stay outside it and keep navigating. */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-expanded={open}
                aria-controls={detailsId}
                className="cursor-pointer text-left"
              >
                <span className="text-base-content/55 block text-sm leading-relaxed">
                  {project.blurb}
                </span>
              </button>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
                {repo ? (
                  <ExternalLink href={repo.url}>
                    <GitHubIcon className="size-3.5" />
                    source
                  </ExternalLink>
                ) : null}
                {npm ? (
                  <ExternalLink href={npm.url}>
                    <NpmIcon className="size-3.5" />
                    npm
                  </ExternalLink>
                ) : null}
                {project.links.map((link) => (
                  <ExternalLink key={link.url} href={link.url}>
                    {link.label}
                    <ArrowIcon className="size-3.5" />
                  </ExternalLink>
                ))}
              </div>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const SURFACE =
  "border-base-content/10 bg-base-100 hover:border-primary/50 rounded-2xl border shadow-md transition-colors";

export const ProjectCard = ({ project }: ProjectCardProps) => (
  <article className={SURFACE}>
    <CardBody project={project} />
  </article>
);
