// A deliberately simple 8-bit / pixel-art wordmark reading "terminus" in
// lowercase. Each glyph is a 3x5 bitmap; filled cells become <rect> pixels.
// Drawn with `fill="currentColor"` so it follows the surrounding text colour
// (and therefore the light/dark theme). This is a first pass — easy to refine
// later by editing the bitmaps below.

const GLYPHS: Record<string, string[]> = {
  t: [".X.", "XXX", ".X.", ".X.", ".XX"],
  e: ["XXX", "X.X", "XXX", "X..", "XXX"],
  r: ["XX.", "X.X", "X..", "X..", "X.."],
  m: ["...", "XXX", "XXX", "X.X", "X.X"],
  i: [".X.", "...", ".X.", ".X.", ".X."],
  n: ["...", "XX.", "X.X", "X.X", "X.X"],
  u: ["...", "X.X", "X.X", "X.X", "XXX"],
  s: ["XXX", "X..", "XXX", "..X", "XXX"],
};

const WORD = "terminus";
const CELL_W = 3;
const CELL_H = 5;
const GAP = 1;
const WIDTH = WORD.length * (CELL_W + GAP) - GAP;

export function TerminusLogoSVG({
  className,
  width,
  height,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  const rects: React.ReactElement[] = [];
  WORD.split("").forEach((ch, i) => {
    const rows = GLYPHS[ch];
    if (!rows) return;
    const xOffset = i * (CELL_W + GAP);
    rows.forEach((row, y) => {
      row.split("").forEach((cell, x) => {
        if (cell === "X") {
          rects.push(
            <rect
              key={`${i}-${x}-${y}`}
              x={xOffset + x}
              y={y}
              width={1}
              height={1}
            />,
          );
        }
      });
    });
  });

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${WIDTH} ${CELL_H}`}
      fill="currentColor"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Terminus"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Terminus</title>
      {rects}
    </svg>
  );
}
