/**
 * Shared container geometry. The header and the page content must resolve to the same width and
 * gutters, or the compact bar's avatar stops lining up with the cards beneath it — so this lives in
 * one place rather than being repeated.
 *
 * Each side takes whichever is larger: the page gutter, or the device's safe-area inset. The page is
 * rendered with `viewport-fit=cover`, so in landscape on a notched device the insets are what keep
 * content clear of the cutout.
 */
export const CONTAINER = [
  "mx-auto w-full max-w-3xl",
  "pl-[max(var(--gutter),env(safe-area-inset-left))]",
  "pr-[max(var(--gutter),env(safe-area-inset-right))]",
].join(" ");
