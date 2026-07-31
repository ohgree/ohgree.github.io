/**
 * Enriches the curated project list in `data/projects.source.json` with live metadata
 * from the GitHub and npm registry APIs, then writes `src/data/projects.json`.
 *
 * Runs at build time (see .github/workflows/deploy.yml), so visitors never hit an API.
 * The output is committed as a fallback: if a request fails, the previous value for that
 * field is reused and the build still succeeds. Set GITHUB_TOKEN to lift the 60 req/hr
 * unauthenticated rate limit.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const SOURCE = new URL("data/projects.source.json", root);
const OUTPUT = new URL("src/data/projects.json", root);

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

/** Fetch JSON, returning null instead of throwing so one dead endpoint can't fail the build. */
const getJson = async (url, headers = {}) => {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "ohgree.github.io-build", accept: "application/json", ...headers },
    });
    if (!res.ok) {
      console.warn(`  ! ${res.status} ${res.statusText} — ${url}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.warn(`  ! ${error.message} — ${url}`);
    return null;
  }
};

const github = (path) =>
  getJson(`https://api.github.com${path}`, {
    accept: "application/vnd.github+json",
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  });

const readPrevious = async () => {
  try {
    return JSON.parse(await readFile(OUTPUT, "utf8"));
  } catch {
    return null;
  }
};

const fetchRepo = async (owner, name, previous) => {
  const data = await github(`/repos/${owner}/${name}`);
  if (!data) return previous ?? null;
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

const fetchNpm = async (name, previous) => {
  const [packument, downloads] = await Promise.all([
    getJson(`https://registry.npmjs.org/${name}/latest`),
    getJson(`https://api.npmjs.org/downloads/point/last-week/${name}`),
  ]);
  if (!packument) return previous ?? null;
  return {
    name,
    version: packument.version,
    url: `https://www.npmjs.com/package/${name}`,
    weeklyDownloads: downloads?.downloads ?? previous?.weeklyDownloads ?? null,
  };
};

const fetchProfile = async (owner, previous) => {
  const data = await github(`/users/${owner}`);
  if (!data) return previous ?? null;
  return {
    login: data.login,
    name: data.name,
    bio: data.bio,
    location: data.location,
    // Ask GitHub for a 2x-of-56px avatar rather than the ~280 KB full-size original.
    avatarUrl: `${data.avatar_url}&s=160`,
    publicRepos: data.public_repos,
  };
};

const main = async () => {
  const source = JSON.parse(await readFile(SOURCE, "utf8"));
  const previous = await readPrevious();
  const previousBySlug = new Map((previous?.projects ?? []).map((p) => [p.slug, p]));

  console.log(`Fetching metadata for ${source.projects.length} project(s)…`);

  const profile = await fetchProfile(source.owner, previous?.profile);

  const projects = await Promise.all(
    source.projects.map(async (entry) => {
      console.log(`- ${entry.slug}`);
      const prior = previousBySlug.get(entry.slug);
      const [repo, npm] = await Promise.all([
        entry.repo ? fetchRepo(source.owner, entry.repo, prior?.repo) : null,
        entry.npm ? fetchNpm(entry.npm, prior?.npm) : null,
      ]);
      return {
        slug: entry.slug,
        name: entry.name,
        kind: entry.kind,
        tagline: entry.tagline,
        blurb: entry.blurb,
        links: entry.links ?? [],
        repo,
        npm,
      };
    }),
  );

  if (!profile) {
    throw new Error("No profile data available (API failed and no committed fallback exists)");
  }

  const index = { generatedAt: new Date().toISOString(), profile, projects };
  await writeFile(OUTPUT, `${JSON.stringify(index, null, 2)}\n`);
  console.log(`Wrote ${fileURLToPath(OUTPUT)}`);
};

await main();
