import { Cutout } from "dom-cutout/react";
import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import type { ReactNode } from "react";

import { ArrowIcon, ChevronIcon, GitHubIcon, NpmIcon, StarIcon } from "@/components/Icons";
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

/** The npm version pill that punches through the card's top edge on `dom-cutout` itself. */
const VersionPill = ({ version }: { version: string }) => (
  <span className="bg-primary text-primary-content rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold whitespace-nowrap">
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
        <div className="flex w-full items-baseline gap-3">
          <h3 className="font-mono text-lg font-semibold tracking-tight">{project.name}</h3>
          {repo?.license ? (
            <span className="text-base-content/35 font-mono text-[11px]">{repo.license}</span>
          ) : null}
          <ChevronIcon
            className={`text-base-content/40 ml-auto size-4 shrink-0 self-center transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
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
              <p className="text-base-content/55 text-sm leading-relaxed">{project.blurb}</p>

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

export const ProjectCard = ({ project }: ProjectCardProps) => {
  // dom-cutout demonstrates itself: its own version pill is punched through its own card.
  if (project.slug === "dom-cutout" && project.npm) {
    return (
      <article className="relative">
        <Cutout
          gap={6}
          // Wrapper defaults to inline-grid, which shrink-wraps the card; style is spread last
          // by Cutout, so this overrides it.
          style={{ display: "grid" }}
          overlay={
            <span className="absolute -top-3 right-5">
              <VersionPill version={project.npm.version} />
            </span>
          }
        >
          {/*
            The surface has to be painted INSIDE Cutout's content layer, because that layer is
            what carries the mask. Putting SURFACE on Cutout itself paints the card on the
            unmasked parent, so the hole gets punched through an empty layer and no gap ever
            shows. w-full because that content layer is a flex container.
          */}
          <div className={`${SURFACE} w-full`}>
            <CardBody project={project} />
          </div>
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
