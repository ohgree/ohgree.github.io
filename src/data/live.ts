import { useEffect, useState } from "react";

import { projectIndex } from "@/data";
import type { NpmMeta, Profile, ProjectIndex, RepoMeta } from "@/types";

// Field mappings mirror scripts/fetch-projects.mjs — keep the two in sync.

type GitHubRepo = {
  full_name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  license: { spdx_id: string | null } | null;
  topics?: string[];
  pushed_at: string;
  created_at: string;
};

type GitHubUser = {
  login: string;
  name: string;
  bio: string | null;
  location: string | null;
  avatar_url: string;
  public_repos: number;
};

const getJson = async <T>(url: string, signal: AbortSignal): Promise<T | null> => {
  try {
    const res = await fetch(url, { signal, headers: { accept: "application/json" } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
};

// Every fetcher returns `prior` (by reference) when its request fails, so
// identity comparison downstream detects "nothing was actually refreshed".

const fetchRepo = async (prior: RepoMeta, signal: AbortSignal): Promise<RepoMeta> => {
  const data = await getJson<GitHubRepo>(
    `https://api.github.com/repos/${prior.nameWithOwner}`,
    signal,
  );
  if (!data) return prior;
  return {
    nameWithOwner: data.full_name,
    url: data.html_url,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language ?? null,
    license: data.license?.spdx_id ?? null,
    topics: data.topics ?? [],
    pushedAt: data.pushed_at,
    createdAt: data.created_at,
  };
};

const fetchNpm = async (prior: NpmMeta, signal: AbortSignal): Promise<NpmMeta> => {
  const [packument, downloads] = await Promise.all([
    getJson<{ version: string }>(`https://registry.npmjs.org/${prior.name}/latest`, signal),
    getJson<{ downloads: number }>(
      `https://api.npmjs.org/downloads/point/last-week/${prior.name}`,
      signal,
    ),
  ]);
  if (!packument) return prior;
  return {
    name: prior.name,
    version: packument.version,
    url: prior.url,
    weeklyDownloads: downloads?.downloads ?? prior.weeklyDownloads,
  };
};

const fetchProfile = async (prior: Profile, signal: AbortSignal): Promise<Profile> => {
  const data = await getJson<GitHubUser>(`https://api.github.com/users/${prior.login}`, signal);
  if (!data) return prior;
  return {
    login: data.login,
    name: data.name,
    bio: data.bio,
    location: data.location,
    avatarUrl: `${data.avatar_url}&s=160`,
    publicRepos: data.public_repos,
  };
};

const fetchLive = async (
  baked: ProjectIndex,
  signal: AbortSignal,
): Promise<ProjectIndex | null> => {
  const [profile, projects] = await Promise.all([
    fetchProfile(baked.profile, signal),
    Promise.all(
      baked.projects.map(async (project) => {
        const [repo, npm] = await Promise.all([
          project.repo ? fetchRepo(project.repo, signal) : null,
          project.npm ? fetchNpm(project.npm, signal) : null,
        ]);
        if (repo === project.repo && npm === project.npm) return project;
        return { ...project, repo, npm };
      }),
    ),
  ]);

  const untouched =
    profile === baked.profile && projects.every((project, i) => project === baked.projects[i]);
  if (untouched) return null;

  return { generatedAt: new Date().toISOString(), profile, projects };
};

/** The baked index for first paint, refreshed in place from the live APIs after mount. */
export const useProjectIndex = (): ProjectIndex => {
  const [index, setIndex] = useState(projectIndex);

  useEffect(() => {
    const controller = new AbortController();
    void fetchLive(projectIndex, controller.signal).then((live) => {
      if (live && !controller.signal.aborted) setIndex(live);
    });
    return () => controller.abort();
  }, []);

  return index;
};
