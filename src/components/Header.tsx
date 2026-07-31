import { m, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { SOCIALS } from "@/components/socials";
import type { Profile } from "@/types";

type HeaderProps = {
  profile: Profile;
};

/** Scroll offsets in px over which the header compacts. */
const FOLD_START = 32;
const FOLD_END = 208;
const FOLD_MID = (FOLD_START + FOLD_END) / 2;

const BAR_HEIGHT = 56;
const AVATAR = 56;
const COMPACT_SCALE = 0.6;
/** Matches the content wrapper's `pt-14`. */
const CONTENT_TOP = 56;

/** Where the scaled-down identity row must land to sit centred in the compact bar. */
const COMPACT_TOP = (BAR_HEIGHT - AVATAR * COMPACT_SCALE) / 2;

/**
 * One header that compacts, rather than a tall header cross-fading into a separate bar.
 *
 * It is `fixed` with a static spacer reserving its expanded height, so its own height can shrink
 * freely while the document height never changes. That matters: a shrinking in-flow header
 * reflows the page, which moves scrollY, which can re-cross the fold threshold — and the fold
 * then stutters mid-scroll. Everything here is driven by MotionValues, so the morph updates per
 * frame without re-rendering React.
 */
export const Header = ({ profile }: HeaderProps) => {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  const animated = !reduceMotion;

  const contentRef = useRef<HTMLDivElement>(null);
  const [expandedHeight, setExpandedHeight] = useState(0);

  // The expanded height depends on how the text wraps, so it is measured rather than assumed.
  // ResizeObserver is an external system, which is what effects are for.
  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => setExpandedHeight(node.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  // Only flips at the midpoint. Needed as state because focusability and aria can't be
  // expressed as MotionValues.
  const [folded, setFolded] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => setFolded(latest > FOLD_MID));

  const fold = [FOLD_START, FOLD_END];
  const height = useTransform(scrollY, fold, [expandedHeight || BAR_HEIGHT, BAR_HEIGHT]);

  // The identity row scales down in place and rises to centre itself in the compact bar.
  const identityY = useTransform(scrollY, fold, [0, COMPACT_TOP - CONTENT_TOP]);
  const identityScale = useTransform(scrollY, fold, [1, COMPACT_SCALE]);

  // Everything only the expanded header shows fades out over the first half of the range.
  const extrasOpacity = useTransform(scrollY, [FOLD_START, FOLD_MID], [1, 0]);
  const chromeOpacity = useTransform(scrollY, fold, [0, 1]);
  const railOpacity = useTransform(scrollY, [FOLD_MID, FOLD_END], [0, 1]);

  const measured = animated && expandedHeight > 0;

  return (
    <>
      {/* Holds the expanded height in flow so the fixed header's shrinking never moves scrollY. */}
      {measured ? <div style={{ height: expandedHeight }} aria-hidden="true" /> : null}

      <m.header
        className={
          animated ? "fixed inset-x-0 top-0 z-50 overflow-hidden" : "relative overflow-hidden"
        }
        style={measured ? { height } : undefined}
      >
        <m.div
          aria-hidden="true"
          className="border-base-content/10 bg-base-100/85 absolute inset-0 border-b backdrop-blur-md"
          style={animated ? { opacity: chromeOpacity } : { opacity: 0 }}
        />

        <div ref={contentRef} className="relative mx-auto max-w-3xl px-6 pt-14 pb-8 sm:px-8">
          <m.div
            className="flex items-center gap-4"
            style={
              animated
                ? { y: identityY, scale: identityScale, transformOrigin: "left top" }
                : undefined
            }
          >
            <img
              src={profile.avatarUrl}
              alt=""
              width={AVATAR}
              height={AVATAR}
              className="border-base-content/10 size-14 shrink-0 rounded-full border"
              loading="eager"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{profile.name}</h1>
              {profile.bio ? (
                <m.p
                  className="text-base-content/60 text-sm"
                  style={animated ? { opacity: extrasOpacity } : undefined}
                >
                  {profile.bio}
                </m.p>
              ) : null}
            </div>
          </m.div>

          <m.div
            className="mt-6 flex flex-col gap-6"
            style={animated ? { opacity: extrasOpacity } : undefined}
            aria-hidden={folded}
          >
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
                  tabIndex={folded ? -1 : undefined}
                  className="text-base-content/70 hover:text-primary inline-flex items-center gap-2 transition-colors"
                >
                  <Icon />
                  {label}
                </a>
              ))}
            </nav>
          </m.div>
        </div>

        {/* Icon-only rail that takes over once the labelled links have faded. */}
        <m.div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{ height: BAR_HEIGHT, ...(animated ? { opacity: railOpacity } : { opacity: 0 }) }}
          aria-hidden={!folded}
        >
          <nav className="mx-auto flex h-full max-w-3xl items-center justify-end gap-4 px-6 sm:px-8">
            {SOCIALS.map(({ label, url, Icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                tabIndex={folded ? undefined : -1}
                className={`text-base-content/70 hover:text-primary inline-flex items-center transition-colors ${
                  folded ? "pointer-events-auto" : ""
                }`}
              >
                <Icon />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </nav>
        </m.div>
      </m.header>
    </>
  );
};
