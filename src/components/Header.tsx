import { m, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { SOCIALS } from "@/components/socials";
import type { Profile } from "@/types";

type HeaderProps = {
  profile: Profile;
};

/**
 * Compacts as soon as the page scrolls at all, and only expands again back at the very top. The
 * small deadzone keeps sub-pixel scroll noise from toggling it.
 */
const COMPACT_AT = 8;
const EXPAND_AT = 0;

const EXPANDED = { avatar: 56, name: "1.75rem", padTop: 56, padBottom: 32, gap: 16 };
const COMPACT = { avatar: 32, name: "0.875rem", padTop: 12, padBottom: 12, gap: 12 };

/**
 * Animates between two states — expanded and compact — with no scroll-linked in-between values.
 *
 * Every piece of UI common to both states (avatar, name, social links) is a single instance whose
 * own size and position animate, so it visibly travels between the two layouts. Rendering an
 * expanded copy and a compact copy and cross-fading them would leave that shared UI without any
 * transition at all: it would disappear in one place and reappear in another.
 *
 * The header is `fixed` with a spacer reserving its expanded height, so its height can change
 * without altering document height — a shrinking in-flow header reflows the page, which moves
 * scrollY, which can re-cross the threshold and make the header flap. Its height is left to its
 * content, which animates, so the header resizes smoothly without animating height directly.
 */
export const Header = ({ profile }: HeaderProps) => {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  const contentRef = useRef<HTMLDivElement>(null);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const [compact, setCompact] = useState(false);

  // The spacer needs the *expanded* height, so only sample it while expanded and settled —
  // mid-transition the content is between sizes, and a spacer tracking that would change
  // document height on every frame.
  const compactRef = useRef(compact);
  compactRef.current = compact;
  const settledRef = useRef(true);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => {
      if (compactRef.current || !settledRef.current) return;
      setExpandedHeight(node.offsetHeight);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCompact((wasCompact) => (wasCompact ? latest > EXPAND_AT : latest > COMPACT_AT));
  });

  const to = compact ? COMPACT : EXPANDED;
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.34, ease: [0.22, 0.61, 0.36, 1] as const };

  return (
    <>
      {/* Holds the expanded height in flow so the fixed header's resizing never moves scrollY. */}
      {expandedHeight > 0 ? <div style={{ height: expandedHeight }} aria-hidden="true" /> : null}

      <header className="fixed inset-x-0 top-0 z-50 overflow-hidden">
        <m.div
          aria-hidden="true"
          className="border-base-content/10 bg-base-100/85 absolute inset-0 border-b backdrop-blur-md"
          initial={false}
          animate={{ opacity: compact ? 1 : 0 }}
          transition={transition}
        />

        <m.div
          ref={contentRef}
          className="relative mx-auto max-w-3xl px-6 sm:px-8"
          initial={false}
          animate={{ paddingTop: to.padTop, paddingBottom: to.padBottom }}
          transition={transition}
          onAnimationStart={() => {
            settledRef.current = false;
          }}
          onAnimationComplete={() => {
            settledRef.current = true;
            if (!compactRef.current && contentRef.current) {
              setExpandedHeight(contentRef.current.offsetHeight);
            }
          }}
        >
          <m.div
            className="flex items-center"
            initial={false}
            animate={{ gap: to.gap }}
            transition={transition}
          >
            <m.img
              src={profile.avatarUrl}
              alt=""
              className="border-base-content/10 shrink-0 rounded-full border"
              loading="eager"
              initial={false}
              animate={{ width: to.avatar, height: to.avatar }}
              transition={transition}
            />

            <div className="flex min-w-0 flex-col">
              <m.h1
                className="truncate font-semibold tracking-tight"
                initial={false}
                animate={{ fontSize: to.name }}
                transition={transition}
              >
                {profile.name}
              </m.h1>

              {profile.bio ? (
                <m.p
                  className="text-base-content/60 overflow-hidden text-sm"
                  initial={false}
                  animate={{ height: compact ? 0 : "auto", opacity: compact ? 0 : 1 }}
                  transition={transition}
                >
                  {profile.bio}
                </m.p>
              ) : null}
            </div>

            {/* One set of links for both states: the labels collapse away, the icons stay put. */}
            <nav className="ml-auto flex shrink-0 items-center gap-4 font-mono text-sm">
              {SOCIALS.map(({ label, url, Icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base-content/70 hover:text-primary inline-flex items-center transition-colors"
                >
                  <Icon />
                  <m.span
                    className="overflow-hidden whitespace-nowrap"
                    initial={false}
                    animate={{
                      width: compact ? 0 : "auto",
                      opacity: compact ? 0 : 1,
                      marginLeft: compact ? 0 : 8,
                    }}
                    transition={transition}
                  >
                    {label}
                  </m.span>
                </a>
              ))}
            </nav>
          </m.div>

          {/* Only in the expanded state, so this collapses rather than travelling. */}
          <m.div
            className="overflow-hidden"
            initial={false}
            animate={{ height: compact ? 0 : "auto", opacity: compact ? 0 : 1 }}
            transition={transition}
            aria-hidden={compact}
          >
            <div className="flex flex-col gap-3 pt-6">
              <p className="text-base-content/80 max-w-2xl text-base leading-relaxed sm:text-lg">
                The short list of what I build and maintain. Publicly, at least.
              </p>
              {profile.location ? (
                <p className="text-base-content/40 font-mono text-sm">{profile.location}</p>
              ) : null}
            </div>
          </m.div>
        </m.div>
      </header>
    </>
  );
};
