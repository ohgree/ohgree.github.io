const MS_PER_DAY = 86_400_000;

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const compact = new Intl.NumberFormat("en", { notation: "compact" });
const absolute = new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" });

export const relativeTime = (iso: string, now = Date.now()) => {
  const days = Math.round((new Date(iso).getTime() - now) / MS_PER_DAY);
  if (Math.abs(days) < 30) return relative.format(days, "day");
  if (Math.abs(days) < 365) return relative.format(Math.round(days / 30), "month");
  return relative.format(Math.round(days / 365), "year");
};

export const absoluteDate = (iso: string) => absolute.format(new Date(iso));

export const compactNumber = (value: number) => compact.format(value);

// GitHub's language colors.
const LANGUAGE_COLORS: Record<string, string> = {
  AutoHotkey: "#6594b9",
  C: "#555555",
  "C#": "#178600",
  "C++": "#f34b7d",
  CSS: "#663399",
  Go: "#00add8",
  HTML: "#e34c26",
  Java: "#b07219",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  Ruby: "#701516",
  Rust: "#dea584",
  Shell: "#89e051",
  Svelte: "#ff3e00",
  TypeScript: "#3178c6",
  Vue: "#41b883",
};

export const languageColor = (language: string) => LANGUAGE_COLORS[language] ?? "#8b8b8b";
