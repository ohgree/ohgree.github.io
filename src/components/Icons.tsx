type IconProps = {
  className?: string;
};

const base = "size-4 shrink-0";

export const GitHubIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.07-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A7.995 7.995 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

export const NpmIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M0 3.5h16v9H8v-1.5H6.5v1.5H0v-9Zm1.5 1.5v6h2.5V6.5h1.5v4.5h1V5H1.5Zm7 0v6H10V6.5h1.5v4.5H13V6.5h1.5v4.5H15V5H8.5Z" />
  </svg>
);

export const LinkedInIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M2.7 3.5a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6ZM1.5 15h2.4V5.3H1.5V15Zm4.2 0h2.4V9.9c0-1.35.9-1.75 1.5-1.75.58 0 1.4.44 1.4 1.75V15h2.4V9.6c0-2.8-1.6-3.9-3.1-3.9-1.2 0-1.9.5-2.2 1.05V5.3H5.7V15Z" />
  </svg>
);

export const StarIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 .8l2.2 4.46 4.92.72-3.56 3.47.84 4.9L8 12.03l-4.4 2.32.84-4.9L.88 5.98l4.92-.72L8 .8Z" />
  </svg>
);

export const ArrowIcon = ({ className = base }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
);
