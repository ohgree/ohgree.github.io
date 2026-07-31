/**
 * Compacts as soon as the page scrolls at all, and only expands again back at the very top. The
 * small deadzone keeps sub-pixel scroll noise from toggling it.
 */
export const COMPACT_AT = 8;
export const EXPAND_AT = 0;

/** Height the header collapses to. The compact paddings in Header must sum to this. */
export const BAR_HEIGHT = 56;

/** Clearance the spacer keeps below the bar once compacted, matching `--gutter`. */
export const SNAP_GAP = 24;
