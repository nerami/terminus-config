import { BaseLayer } from './base-layer';

import type { Cell } from '../glyphs';

const DUR = 4;

// Each cell is offset by a fixed phase step (0.13 × index mod DUR).
// The golden-ratio-ish step distributes 120+ cells evenly across the cycle
// so the wordmark shimmers like decaying phosphor dots on a CRT screen.
export function PhosphorVariant({ cells }: { cells: Cell[] }) {
  return (
    <>
      <style>{`
        @keyframes terminus-phosphor {
          0%   { opacity: 1;    }
          25%  { opacity: 0.2;  }
          50%  { opacity: 0.8;  }
          75%  { opacity: 0;    }
          100% { opacity: 1;    }
        }
        .terminus-phosphor {
          animation: terminus-phosphor ${DUR}s ease-in-out infinite;
        }
        .terminus-anim-hover .terminus-phosphor { animation: none; }
        .terminus-anim-hover:hover .terminus-phosphor {
          animation: terminus-phosphor ${DUR}s ease-in-out infinite;
        }
      `}</style>
      <BaseLayer cells={cells} />
      <g>
        {cells.map(({ key, x, y }, idx) => (
          <rect
            key={key}
            x={x}
            y={y}
            width={1}
            height={1}
            className="terminus-phosphor"
            style={{ animationDelay: `-${((idx * 0.13) % DUR).toFixed(2)}s` }}
          />
        ))}
      </g>
    </>
  );
}
