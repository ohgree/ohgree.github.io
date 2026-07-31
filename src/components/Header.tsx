import { m, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { SOCIALS } from "@/components/socials";
import type { Profile } from "@/types";

type HeaderProps = {
  profile: Profile;
};

/**
 * Asymmetric thresholds: once compacted the header stays compacted until well back up the page.
 * A single threshold can flicker when a scroll settles right on top of it.
 */
const COMPACT_AT = 120;
const EXPAND_AT = 72;

/** Compact bar height, matching `h-14`. */
const BAR_HEIGHT = 56;

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * Two states only — expanded or compact, with a short transition between them. No scroll-linked
 * intermediate sizing.
 *
 * The header is `fixed` with a static spacer reserving its expanded height, so its height can
 * change without altering document height. That matters: a shrinking in-flow header reflows the
 * page, which moves scrollY, which can re-cross the threshold and make the header flap.
 *
 * The two layouts cross-fade rather than morphing into each other. Motion's `layout` prop could
 * morph them, but it animates boxes with scale transforms, which distorts text mid-flight, and it
 * needs the larger `domMax` feature bundle. Cross-fading keeps text crisp at both ends.
 */
export const Header = ({ profile }: HeaderProps) => {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  const contentRef = useRef<HTMLDivElement>(null);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const [compact, setCompact] = useState(false);

  // The expanded height depends on how the text wraps, so measure it. Only this layout's opacity
  // ever changes, never its box, so the measurement stays stable while the header animates.
  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => setExpandedHeight(node.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCompact((wasCompact) => (wasCompact ? latest > EXPAND_AT : latest > COMPACT_AT));
  });

  const measured = expandedHeight > 0;
  const duration = reduceMotion ? 0 : 0.28;
  const fade = reduceMotion ? 0 : 0.16;

  return (
    <>
      {/* Holds the expanded height in flow so the fixed header's resizing never moves scrollY. */}
      {measured ? <div style={{ height: expandedHeight }} aria-hidden="true" /> : null}

      <m.header
        className="fixed inset-x-0 top-0 z-50 overflow-hidden"
        initial={false}
        animate={{ height: compact ? BAR_HEIGHT : measured ? expandedHeight : undefined }}
        transition={{ duration, ease: EASE }}
      >
        <m.div
          aria-hidden="true"
          className="border-base-content/10 bg-base-100/85 absolute inset-0 border-b backdrop-blur-md"
          initial={false}
          animate={{ opacity: compact ? 1 : 0 }}
          transition={{ duration: fade }}
        />

        {/* Expanded layout. Always laid out at its natural size, which is what gets measured. */}
        <m.div
          ref={contentRef}
          className="relative mx-auto max-w-3xl px-6 pt-14 pb-8 sm:px-8"
          initial={false}
          animate={{ opacity: compact ? 0 : 1 }}
          transition={{ duration: fade }}
          style={{ pointerEvents: compact ? "none" : "auto" }}
          aria-hidden={compact}
        >
          <div className="flex items-center gap-4">
            <img
              src={profile.avatarUrl}
              alt=""
              width={56}
              height={56}
              className="border-base-content/10 size-14 shrink-0 rounded-full border"
              loading="eager"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{profile.name}</h1>
              {profile.bio ? <p className="text-base-content/60 text-sm">{profile.bio}</p> : null}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <p className="text-base-content/80 max-w-2xl text-base leading-relaxed sm:text-lg">
              The short list of what I build and maintain. Publicly, at least.
            </p>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm">
              {profile.location ? (
                <span className="text-base-content/40">{profile.location}</span>
              ) : null}
              {SOCIALS.map(({ label, url, Icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={compact ? -1 : undefined}
                  className="text-base-content/70 hover:text-primary inline-flex items-center gap-2 transition-colors"
                >
                  <Icon />
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </m.div>

        {/* Compact layout. Absolutely positioned so it never affects the measurement, and
            everything in it is centred on the bar's vertical axis. */}
        <m.div
          className="absolute inset-x-0 top-0 flex items-center"
          style={{ height: BAR_HEIGHT, pointerEvents: compact ? "auto" : "none" }}
          initial={false}
          animate={{ opacity: compact ? 1 : 0 }}
          transition={{ duration: fade, delay: compact && !reduceMotion ? 0.08 : 0 }}
          aria-hidden={!compact}
        >
          <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-6 sm:px-8">
            <img
              src={profile.avatarUrl}
              alt=""
              width={32}
              height={32}
              className="border-base-content/10 size-8 shrink-0 rounded-full border"
            />
            <span className="truncate text-sm font-semibold tracking-tight">{profile.name}</span>

            <nav className="ml-auto flex shrink-0 items-center gap-4">
              {SOCIALS.map(({ label, url, Icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={compact ? undefined : -1}
                  className="text-base-content/70 hover:text-primary inline-flex items-center transition-colors"
                >
                  <Icon />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </nav>
          </div>
        </m.div>
      </m.header>
    </>
  );
};
