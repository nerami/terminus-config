import React from "react";
import type { Cell } from "../glyphs";
import { BaseLayer } from "./base-layer";

// Knuth multiplicative hash — deterministic, no Math.random(), stable across
// renders. Two separate input shifts (idx vs idx+997) give independent streams
// for duration and phase so they don't correlate.
const hash = (n: number) => ((n * 2654435761) >>> 0) / 0x100000000;

// Each cell runs the same keyframe but at a unique duration (0.6s–2.4s) with
// steps(1) timing — abrupt jumps, no interpolation. Because 120+ cells never
// share a period, they're always at different positions in the cycle, producing
// a visually unpredictable flicker with occasional white hot flashes.
export function GlitchVariant({ cells }: { cells: Cell[] }) {
  return (
    <>
      <style>{`
        @keyframes terminus-glitch {
          0%   { opacity: 1;    fill: currentColor; }
          14%  { opacity: 0.15; fill: currentColor; }
          28%  { opacity: 0.8;  fill: currentColor; }
          40%  { opacity: 1;    fill: white;        }
          43%  { opacity: 0.2;  fill: currentColor; }
          64%  { opacity: 0.7;  fill: currentColor; }
          78%  { opacity: 0.1;  fill: currentColor; }
          100% { opacity: 1;    fill: currentColor; }
        }
        .terminus-glitch-cell {
          animation: terminus-glitch var(--glitch-dur) steps(1) var(--glitch-delay) infinite;
        }
        .terminus-anim-hover .terminus-glitch-cell { animation: none; }
        .terminus-anim-hover:hover .terminus-glitch-cell {
          animation: terminus-glitch var(--glitch-dur) steps(1) var(--glitch-delay) infinite;
        }
      `}</style>
      <BaseLayer cells={cells} />
      <g>
        {cells.map(({ x, y, key }, idx) => {
          const dur = 0.6 + hash(idx) * 1.8;
          const delay = -(hash(idx + 997) * dur);
          return (
            <rect
              key={key}
              x={x}
              y={y}
              width={1}
              height={1}
              className="terminus-glitch-cell"
              style={{
                '--glitch-dur': `${dur.toFixed(2)}s`,
                '--glitch-delay': `${delay.toFixed(2)}s`,
              } as React.CSSProperties}
            />
          );
        })}
      </g>
    </>
  );
}
