const GLYPHS: Record<string, string[]> = {
  t: ['..XX..', '..XX..', 'XXXXXX', 'XXXXXX', '..XX..', '..XX..', '..XX..', '..XX..', '..XXXX', '..XXXX'],
  e: ['XXXXXX', 'XXXXXX', 'XX..XX', 'XX..XX', 'XXXXXX', 'XXXXXX', 'XX....', 'XX....', 'XXXXXX', 'XXXXXX'],
  r: ['XXXX..', 'XXXX..', 'XX..XX', 'XX..XX', 'XX....', 'XX....', 'XX....', 'XX....', 'XX....', 'XX....'],
  m: ['......', '......', 'XXXXXX', 'XXXXXX', 'XXXXXX', 'XXXXXX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX'],
  i: ['..XX..', '..XX..', '......', '......', '..XX..', '..XX..', '..XX..', '..XX..', '..XX..', '..XX..'],
  n: ['......', '......', 'XXXX..', 'XXXX..', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX'],
  u: ['......', '......', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XXXXXX', 'XXXXXX'],
  s: ['XXXXXX', 'XXXXXX', 'XX....', 'XX....', 'XXXXXX', 'XXXXXX', '....XX', '....XX', 'XXXXXX', 'XXXXXX'],
};

const WORD = 'terminus';
export const CELL_W = 6;
export const CELL_H = 10;
export const GAP = 2;
export const WIDTH = WORD.length * (CELL_W + GAP) - GAP;

export type Cell = { x: number; y: number; key: string };

function buildCells(): Cell[] {
  const cells: Cell[] = [];
  WORD.split('').forEach((ch, i) => {
    const rows = GLYPHS[ch];
    if (!rows) return;
    const xOffset = i * (CELL_W + GAP);
    rows.forEach((row, y) => {
      row.split('').forEach((cell, x) => {
        if (cell === 'X') cells.push({ x: xOffset + x, y, key: `${i}-${x}-${y}` });
      });
    });
  });
  return cells;
}

export const CELLS = buildCells();

// Cells grouped per letter — needed by variants that animate each letter as a unit.
export type LetterGroup = { cells: Cell[] };

export const LETTER_GROUPS: LetterGroup[] = WORD.split('').map((ch, i) => {
  const rows = GLYPHS[ch];
  const xOffset = i * (CELL_W + GAP);
  const cells: Cell[] = [];
  if (rows) {
    rows.forEach((row, y) => {
      row.split('').forEach((cell, x) => {
        if (cell === 'X') cells.push({ x: xOffset + x, y, key: `${i}-${x}-${y}` });
      });
    });
  }
  return { cells };
});
