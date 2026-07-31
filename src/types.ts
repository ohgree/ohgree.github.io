export type ProjectKind = "package" | "app" | "service" | "tool";

export type ProjectLink = {
  label: string;
  url: string;
};

export type RepoMeta = {
  nameWithOwner: string;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  license: string | null;
  topics: string[];
  pushedAt: string;
  createdAt: string;
};

export type NpmMeta = {
  name: string;
  version: string;
  url: string;
  weeklyDownloads: number | null;
};

export type Project = {
  slug: string;
  name: string;
  kind: ProjectKind;
  tagline: string;
  blurb: string;
  links: ProjectLink[];
  repo: RepoMeta | null;
  npm: NpmMeta | null;
};

export type Profile = {
  login: string;
  name: string;
  bio: string | null;
  location: string | null;
  avatarUrl: string;
  publicRepos: number;
};

export type ProjectIndex = {
  generatedAt: string;
  profile: Profile;
  projects: Project[];
};
