import { GitHubIcon, LinkedInIcon, NpmIcon } from "@/components/Icons";
import type { Profile } from "@/types";

type HeroProps = {
  profile: Profile;
};

const SOCIALS = [
  { label: "GitHub", url: "https://github.com/ohgree", Icon: GitHubIcon },
  { label: "npm", url: "https://www.npmjs.com/~ohgree", Icon: NpmIcon },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/mj-shin", Icon: LinkedInIcon },
];

export const Hero = ({ profile }: HeroProps) => (
  <header className="flex flex-col gap-6">
    <div className="flex items-center gap-4">
      <img
        src={profile.avatarUrl}
        alt=""
        width={56}
        height={56}
        className="border-base-300 size-14 rounded-full border"
        loading="eager"
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{profile.name}</h1>
        {profile.bio ? <p className="text-base-content/60 text-sm">{profile.bio}</p> : null}
      </div>
    </div>

    <p className="text-base-content/80 max-w-2xl text-base leading-relaxed sm:text-lg">
      The short list of what I build and maintain.
    </p>

    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm">
      {profile.location ? <span className="text-base-content/40">{profile.location}</span> : null}
      {SOCIALS.map(({ label, url, Icon }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-base-content/70 hover:text-primary inline-flex items-center gap-2 transition-colors"
        >
          <Icon />
          {label}
        </a>
      ))}
    </nav>
  </header>
);
