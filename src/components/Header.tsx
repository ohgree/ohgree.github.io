import { m, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useState } from "react";

import { SOCIALS } from "@/components/socials";
import { cn } from "@/lib/cn";
import { CONTAINER } from "@/lib/layout";
import type { Profile } from "@/types";

type HeaderProps = {
  profile: Profile;
};

/**
 * Compact once the page has scrolled past this. One threshold, no hysteresis: the spacer never
 * resizes, so document height is constant and nothing can move scrollY on its own — the only thing
 * that crosses this line is the user. Small enough to feel immediate, big enough to swallow
 * sub-pixel scroll noise (comparing against zero fails on fractional offsets).
 */
const COMPACT_AT = 8;

const EXPANDED = { avatar: 56, name: "1.75rem", padTop: 56, padBottom: 32, gap: 16 };
const COMPACT = { avatar: 32, name: "0.875rem", padTop: 12, padBottom: 12, gap: 12 };

/**
 * Two states, expanded and compact, nothing scroll-linked in between.
 *
 * UI common to both states (avatar, name, social links) is a single instance whose size animates,
 * so it travels between the layouts instead of cross-fading. `fixed` plus a constant-height spacer
 * keeps the header out of flow and document height fixed, so resizing can never feed back into
 * scrollY — a sticky header oscillates here. Both heights are the CSS vars in styles.css.
 */
export const Header = ({ profile }: HeaderProps) => {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  // Initialised from the live offset, so a reload that restores scroll doesn't start expanded.
  const [compact, setCompact] = useState(() => window.scrollY > COMPACT_AT);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCompact(latest > COMPACT_AT);
  });

  const to = compact ? COMPACT : EXPANDED;
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] as const };

  return (
    <>
      {/* Reserves the header's place in flow and shrinks with it, on the same transition, so
          content slides up in sync with the bar instead of leaving a blank band. The scroll floor
          in App keeps maxScroll above the threshold, so the shrink can't clamp scrollY back across
          it. Margin, not padding: this is a border-box height. */}
      <div
        aria-hidden="true"
        className={cn(
          "mt-[env(safe-area-inset-top)] transition-[height] duration-300 ease-out",
          compact ? "h-[var(--header-compact)]" : "h-[var(--header-expanded)]",
        )}
      />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 overflow-hidden pt-[env(safe-area-inset-top)]",
          "transition-[height] duration-300 ease-out",
          compact ? "h-[var(--header-compact)]" : "h-[var(--header-expanded)]",
        )}
      >
        <m.div
          aria-hidden="true"
          className="border-base-content/10 bg-base-100/85 absolute inset-0 border-b backdrop-blur-md"
          initial={false}
          animate={{ opacity: compact ? 1 : 0 }}
          transition={transition}
        />

        <m.div
          className={cn(CONTAINER, "relative")}
          initial={false}
          animate={{ paddingTop: to.padTop, paddingBottom: to.padBottom }}
          transition={transition}
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
                    // Icon-only on narrow viewports: three labels alongside the avatar and name
                    // squeeze the expanded row. display:none wins over the animated width.
                    className="overflow-hidden whitespace-nowrap max-sm:hidden"
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
