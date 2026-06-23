import { atomWithStorage } from 'jotai/utils';

/** Base document font size, in px. */
export const DEFAULT_FONT_SIZE = 16;
export const MIN_FONT_SIZE = 10;
export const MAX_FONT_SIZE = 20;

/**
 * User settings, persisted to localStorage. `getOnInit` so the stored value is
 * read synchronously on first render (no flash of defaults).
 */
export const viewToolsAtom = atomWithStorage('terminus-view-tools', true, undefined, { getOnInit: true });
export const fontSizeAtom = atomWithStorage('terminus-font-size', DEFAULT_FONT_SIZE, undefined, { getOnInit: true });

/**
 * Experimental: render the home topology as a 3D force-directed graph (reagraph)
 * instead of the default 2D react-flow diagram. Toggled from Settings → Appearance.
 */
export const topology3dAtom = atomWithStorage('terminus-topology-3d', false, undefined, { getOnInit: true });

/** Clamp a font size to the supported range (whole px). */
export function clampFontSize(size: number): number {
  return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, Math.round(size)));
}

/** Default chat-column fraction of the split view (chat ~40%, topology ~60%). */
export const DEFAULT_SPLIT_FRACTION = 0.4;
/** Neither column may be dragged below a quarter of the width. */
export const MIN_SPLIT_FRACTION = 0.25;
export const MAX_SPLIT_FRACTION = 0.75;

/** Clamp a chat-column fraction to the resizable range; repair garbage input. */
export function clampSplitFraction(fraction: number): number {
  if (!Number.isFinite(fraction)) return DEFAULT_SPLIT_FRACTION;
  return Math.min(MAX_SPLIT_FRACTION, Math.max(MIN_SPLIT_FRACTION, fraction));
}

/** Chat-column fraction of the desktop split view, persisted across reloads. */
export const splitFractionAtom = atomWithStorage('terminus-split-fraction', DEFAULT_SPLIT_FRACTION, undefined, {
  getOnInit: true,
});
