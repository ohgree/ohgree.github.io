import { ArrowIcon } from "@/components/Icons";
import { absoluteDate } from "@/lib/format";

type FooterProps = {
  publicRepos: number;
  generatedAt: string;
};

export const Footer = ({ publicRepos, generatedAt }: FooterProps) => (
  <footer className="border-base-300 flex flex-col gap-3 border-t pt-6 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
    <a
      href="https://github.com/ohgree?tab=repositories"
      target="_blank"
      rel="noreferrer"
      className="text-base-content/70 hover:text-primary inline-flex items-center gap-1.5 transition-colors"
    >
      all {publicRepos} public repos on GitHub
      <ArrowIcon className="size-3.5" />
    </a>
    <p className="text-base-content/40">metadata refreshed {absoluteDate(generatedAt)}</p>
  </footer>
);
