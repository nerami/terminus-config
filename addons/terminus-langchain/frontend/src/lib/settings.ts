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
