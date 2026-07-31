import { m, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useState } from "react";

import { SOCIALS } from "@/components/socials";
import { cn } from "@/lib/cn";
import { CONTAINER } from "@/lib/layout";
import type { Profile } from "@/types";

type HeaderProps = {
  profile: Profile;
};

// Nonzero so fractional scroll offsets can't flap the state.
const COMPACT_AT = 8;

const EXPANDED = { avatar: 56, name: "1.75rem" };
const COMPACT = { avatar: 32, name: "0.875rem" };

// Sticky, with natural content height: the paddings and the expanded-only block animate, so the
// header's height animates with them — nothing is declared or measured. Resizing in flow is safe
// because the scroll floor in App keeps maxScroll above COMPACT_AT in every state, so no document
// shrink (this header compacting, a card collapsing) can clamp scrollY back across the threshold
// and re-expand the header on its own.
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
    <header className="sticky top-0 z-50">
      <m.div
        aria-hidden="true"
        className="border-base-content/10 bg-base-100/85 absolute inset-0 border-b backdrop-blur-md"
        initial={false}
        animate={{ opacity: compact ? 1 : 0 }}
        transition={transition}
      />

      {/* Paddings tighten below 30rem so the expanded header doesn't dominate a phone screen. */}
      <div
        className={cn(
          CONTAINER,
          "relative transition-[padding] duration-300 ease-out",
          compact ? "py-3" : "pt-14 pb-8 max-[30rem]:pt-6 max-[30rem]:pb-5",
        )}
      >
        <div
          className={cn(
            "flex items-center transition-[gap] duration-300 ease-out",
            compact ? "gap-3" : "gap-4 max-[30rem]:gap-3",
          )}
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

          <nav className="ml-auto flex shrink-0 items-center gap-4 font-mono text-sm max-[30rem]:gap-2.5">
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
                  // display:none under sm wins over the animated width.
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
        </div>

        <m.div
          className="overflow-hidden"
          initial={false}
          animate={{ height: compact ? 0 : "auto", opacity: compact ? 0 : 1 }}
          transition={transition}
          aria-hidden={compact}
        >
          <p className="text-base-content/80 max-w-2xl pt-6 text-base leading-relaxed sm:text-lg">
            The short list of what I build and maintain. Publicly, at least.
          </p>
        </m.div>
      </div>
    </header>
  );
};
