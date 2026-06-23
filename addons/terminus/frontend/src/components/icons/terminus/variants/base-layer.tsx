import type { Cell } from '../glyphs';

// Static blueprint floor shared by all animated variants. Renders every cell
// at 0.5 opacity with a hairline border so no pixel ever exposes the background
// even when the animated layer above it fades to zero.
export function BaseLayer({ cells }: { cells: Cell[] }) {
  return (
    <g opacity={0.5} fill="currentColor" stroke="currentColor" strokeWidth={0.1}>
      {cells.map(({ key, x, y }) => (
        <rect key={key} x={x} y={y} width={1} height={1} />
      ))}
    </g>
  );
}
