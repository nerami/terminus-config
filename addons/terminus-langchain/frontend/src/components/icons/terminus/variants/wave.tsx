import { memo, useMemo } from 'react';

import { CELL_W, GAP, WIDTH } from '../glyphs';

import type { Cell, LetterGroup } from '../glyphs';

// Defaults, overridable via props. The Wave story exposes these as temporary
// numeric controls for tuning. DUR = squeeze cycle length; the particle's per-column
// dwell is STEP = dur / stepDivisor, so stepDivisor/8 is how many columns the dash
// slides per squeeze frame (a multiple of 8 keeps it on the squeeze beat, since the
// squeeze has 8 step-end frames).
const DEFAULT_DUR = 1;
const DEFAULT_STEP_DIVISOR = 30.5; // maxX/2 → full sweep spans 2 squeeze cycles
const DEFAULT_DASH_W = 4; // particle size: how many columns (bits) glow at once
// Four particles run as two pairs. Two independent gaps (seconds):
const DEFAULT_INTRA_PAIR_GAP = 1.3; // between the two particles within a pair
const DEFAULT_PAIR_GAP = 3; // between the two pairs

// Right-most lit column, used to normalise the per-column slide delay.
const maxX = WIDTH - 1;

// Runner track: one particle per column, placed one row above THAT column's topmost
// pixel — so the band follows the letter's top contour and never floats above empty
// space (letters like t r i n u whose top doesn't span the full width). Columns with
// no pixel at all (e.g. i's sides) get no particle. A dashWidth-wide lit window slides
// left→right across the track, one column per frame, like a 2-bit dash marching
// across the top of each letter and on to the next.
//
// The cells live INSIDE each letter's squeeze <g>, so they inherit its scaleY and
// ride up/down with the letter. Where a column's top pixel is at row 0 (e.g. T's
// stem), its particle sits at row −1, above the viewBox, so the SVG viewport clips it
// at full height and it emerges as that column squeezes.
function buildRunnerCells(letterGroups: LetterGroup[]): Cell[][] {
  return letterGroups.map((group, i) => {
    if (group.cells.length === 0) return [];
    const xOffset = i * (CELL_W + GAP);
    // Topmost lit row per local column (a heightmap of the letter's top edge).
    const colTop = new Map<number, number>();
    for (const { x, y } of group.cells) {
      const c = x - xOffset;
      const cur = colTop.get(c);
      if (cur === undefined || y < cur) colTop.set(c, y);
    }
    return [...colTop.entries()].map(([c, top]) => ({
      x: xOffset + c,
      y: top - 1,
      key: `run-${i}-${c}`,
    }));
  });
}

// Each letter compresses vertically toward the baseline (y=10) and springs back,
// the dip travelling left-to-right across the word like a height-based wave.
//
// scaleY steps one pixel row at a time (0.1 of the 10-unit grid) down and back up —
// 1 → 0.9 → 0.8 → 0.7 → 0.6 → 0.7 → 0.8 → 0.9 → 1 — anchored at the bottom of the
// coordinate space (NOT clipped — the glyph squeezes, pixels stay). Stepping bit-by-bit
// (never skipping a row) reads smoother than a multi-row jump. The 0.6 floor squeezes
// two rows past the natural span of 'm' (pixels only on rows 2–9, i.e. 0.8).
//
// step-end inside each keyframe makes the transitions instantaneous (no tween) —
// the 8-bit look — while the element-level `linear` just advances the clock. The 8
// equal segments each hold for a flat DUR / 8.
//
// Stagger: the dip is a traveling wave f(t + D_i); it reaches letter i at wall-time
// t = const − D_i. For the dip to hit later letters *later* (left-to-right), D_i must
// shrink as i grows — hence the reversed index ((N-1-i)/N), not the naive (i/N) which
// would sweep right-to-left.
export const WaveVariant = memo(function WaveVariant({
  dashWidth = DEFAULT_DASH_W,
  dur = DEFAULT_DUR,
  intraPairGap = DEFAULT_INTRA_PAIR_GAP,
  letterGroups,
  pairGap = DEFAULT_PAIR_GAP,
  stepDivisor = DEFAULT_STEP_DIVISOR,
}: {
  letterGroups: LetterGroup[];
  dur?: number;
  stepDivisor?: number;
  intraPairGap?: number; // seconds between the two particles within a pair
  pairGap?: number; // seconds between the two pairs
  dashWidth?: number; // particle size: how many columns (bits) glow at once
}) {
  const n = letterGroups.length;
  const runnerByLetter = useMemo(() => buildRunnerCells(letterGroups), [letterGroups]);
  const step = dur / stepDivisor; // particle per-column dwell
  const slideDur = maxX * step; // one full left→right pass
  // Fraction of the cycle a cell stays lit → how many columns glow at once.
  const onPct = (dashWidth / maxX) * 100;
  // Opacity gradient along the dash: leading bit at 100%, fading by 1/dashWidth per
  // column down to 1/dashWidth at the tail (e.g. dashWidth 4 → 100/75/50/25%). A cell
  // travels leading→trailing as the window passes, so its opacity ramps DOWN over its
  // on-window — one step-end stop per column.
  const runnerStops = useMemo(() => {
    const colPct = (1 / maxX) * 100; // one column's phase width
    return Array.from({ length: dashWidth }, (_, i) => {
      const pct = (i * colPct).toFixed(3);
      const op = ((dashWidth - i) / dashWidth).toFixed(3);
      return `${pct}% { opacity: ${op}; animation-timing-function: step-end; }`;
    }).join('\n          ');
  }, [dashWidth]);
  // Extra delay per particle: four dashes in two pairs. Within a pair the two are
  // intraPairGap apart; the second pair trails the first by pairGap.
  const particleOffsets = [0, intraPairGap, pairGap, pairGap + intraPairGap];
  return (
    <>
      <style>{`
        @keyframes terminus-wave {
          0%    { transform: scaleY(1);   animation-timing-function: step-end; }
          12.5% { transform: scaleY(0.9); animation-timing-function: step-end; }
          25%   { transform: scaleY(0.8); animation-timing-function: step-end; }
          37.5% { transform: scaleY(0.7); animation-timing-function: step-end; }
          50%   { transform: scaleY(0.6); animation-timing-function: step-end; }
          62.5% { transform: scaleY(0.7); animation-timing-function: step-end; }
          75%   { transform: scaleY(0.8); animation-timing-function: step-end; }
          87.5% { transform: scaleY(0.9); animation-timing-function: step-end; }
          100%  { transform: scaleY(1);   animation-timing-function: step-end; }
        }
        .terminus-wave {
          transform-box: view-box;
          transform-origin: 50% 100%;
          animation: terminus-wave ${dur}s linear infinite;
        }
        .terminus-anim-hover .terminus-wave { animation: none; }
        .terminus-anim-hover:hover .terminus-wave {
          animation: terminus-wave ${dur}s linear infinite;
        }

        /* Slide: each cell is lit only while the moving window is over its column;
           step-end keeps the on/off instantaneous (8-bit), the per-column delay
           (set inline ∝ x) makes the lit window march left→right. */
        @keyframes terminus-runner {
          ${runnerStops}
          ${onPct.toFixed(3)}% { opacity: 0; animation-timing-function: step-end; }
          100% { opacity: 0; animation-timing-function: step-end; }
        }
        .terminus-runner {
          opacity: 0;
          animation: terminus-runner ${slideDur}s linear infinite;
        }
        .terminus-anim-hover .terminus-runner { animation: none; opacity: 0; }
        .terminus-anim-hover:hover .terminus-runner {
          animation: terminus-runner ${slideDur}s linear infinite;
        }
      `}</style>
      {letterGroups.map((group, i) => {
        const delay = -(((n - 1 - i) / n) * dur);
        return (
          <g key={i} className="terminus-wave" style={{ animationDelay: `${delay.toFixed(2)}s` }}>
            {group.cells.map(({ key, x, y }) => (
              <rect key={key} x={x} y={y} width={1} height={1} />
            ))}
            {runnerByLetter[i].flatMap(({ key, x, y }) =>
              particleOffsets.map((offset, p) => (
                <rect
                  key={`${key}-${p}`}
                  x={x}
                  y={y}
                  width={1}
                  height={1}
                  className="terminus-runner"
                  style={{
                    animationDelay: `${(-(maxX - x) * step - offset).toFixed(3)}s`,
                  }}
                />
              )),
            )}
          </g>
        );
      })}
    </>
  );
});
