// Raw lucide SVGs (same glyphs as the 2D nodes). reagraph rasterizes the icon
// to a billboarded sprite texture, so we bake the stroke color in (white reads
// well on the colored spheres) rather than relying on `currentColor`/tinting.
import boxes from 'lucide-static/icons/boxes.svg?raw';
import clapperboard from 'lucide-static/icons/clapperboard.svg?raw';
import cog from 'lucide-static/icons/cog.svg?raw';
import columns2 from 'lucide-static/icons/columns-2.svg?raw';
import cpu from 'lucide-static/icons/cpu.svg?raw';
import filter from 'lucide-static/icons/filter.svg?raw';
import gitBranch from 'lucide-static/icons/git-branch.svg?raw';
import gitFork from 'lucide-static/icons/git-fork.svg?raw';
import home from 'lucide-static/icons/home.svg?raw';
import list from 'lucide-static/icons/list.svg?raw';
import octagon from 'lucide-static/icons/octagon.svg?raw';
import repeatIcon from 'lucide-static/icons/repeat.svg?raw';
import workflow from 'lucide-static/icons/workflow.svg?raw';
import zap from 'lucide-static/icons/zap.svg?raw';

import type { NodeKind } from '@/lib/ha-graph/build';

// Concrete hex palette keyed by node kind. The 2D view uses CSS custom
// properties (var(--chart-*)) which three.js can't parse, so the 3D nodes use a
// parallel fixed palette in the same spirit (areas warm, entities blue, scenes
// violet, automations/triggers green, stops red).
export const KIND_FILL: Record<NodeKind, string> = {
  area: '#f59e0b',
  group: '#94a3b8',
  entity: '#3b82f6',
  scene: '#a855f7',
  automation: '#22c55e',
  trigger: '#22c55e',
  condition: '#a855f7',
  logic: '#94a3b8',
  action: '#3b82f6',
  choose: '#22c55e',
  if: '#22c55e',
  repeat: '#f59e0b',
  parallel: '#f59e0b',
  sequence: '#94a3b8',
  stop: '#ef4444',
};

export const KIND_LABEL: Record<NodeKind, string> = {
  area: 'Area',
  group: 'Group',
  entity: 'Entity',
  scene: 'Scene',
  automation: 'Automation',
  trigger: 'Trigger',
  condition: 'Condition',
  logic: 'Logic',
  action: 'Action',
  choose: 'Choose',
  if: 'If',
  repeat: 'Repeat',
  parallel: 'Parallel',
  sequence: 'Sequence',
  stop: 'Stop',
};

/** Stable order for the legend so it doesn't reshuffle between views. */
export const KIND_ORDER: NodeKind[] = [
  'area',
  'automation',
  'scene',
  'entity',
  'trigger',
  'condition',
  'logic',
  'action',
  'choose',
  'if',
  'repeat',
  'parallel',
  'sequence',
  'stop',
];

export function sizeForKind(kind: NodeKind): number {
  if (kind === 'area') return 12;
  if (kind === 'automation') return 9;
  if (kind === 'scene') return 8;
  return 7;
}

function toIconUri(svg: string): string {
  // reagraph's Icon rasterizes the SVG at its intrinsic pixel size, so the
  // default width/height="24" yields a fuzzy 24px texture once magnified. Bump
  // the render size (the viewBox is untouched, so geometry/stroke scale 1:1) and
  // bake the stroke white for contrast on the colored spheres.
  const sharp = svg
    .replace(/currentColor/g, '#ffffff')
    .replace(/width="\d+"/, 'width="256"')
    .replace(/height="\d+"/, 'height="256"');
  return `data:image/svg+xml,${encodeURIComponent(sharp)}`;
}

const RAW_SVG: Record<NodeKind, string> = {
  area: home,
  group: boxes,
  entity: cpu,
  scene: clapperboard,
  automation: workflow,
  trigger: zap,
  condition: filter,
  logic: gitBranch,
  action: cog,
  choose: gitFork,
  if: gitBranch,
  repeat: repeatIcon,
  parallel: columns2,
  sequence: list,
  stop: octagon,
};

/** Per-kind white-glyph data URIs, used for the 3D node sprites and the legend. */
export const KIND_ICON_URI: Record<NodeKind, string> = Object.fromEntries(
  (Object.keys(RAW_SVG) as NodeKind[]).map((k) => [k, toIconUri(RAW_SVG[k])]),
) as Record<NodeKind, string>;
