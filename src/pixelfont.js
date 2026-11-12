// Tiny pixel font for the footer's giant name. Every glyph is 9 columns x 13 rows with
// 3-cell strokes; pixelText() returns ONE svg path made of the lit cells.
const COLS = 9, ROWS = 13;
const R = (c0, r0, c1, r1) => ({ c0, r0, c1, r1 });
const GL = {
  P: [R(0, 0, 2, 12), R(0, 0, 7, 2), R(0, 5, 7, 7), R(6, 1, 8, 6)],
  O: [R(1, 0, 7, 2), R(1, 10, 7, 12), R(0, 1, 2, 11), R(6, 1, 8, 11)],
  R: [R(0, 0, 2, 12), R(0, 0, 7, 2), R(0, 5, 7, 7), R(6, 1, 8, 6), R(6, 8, 8, 12)],
  T: [R(0, 0, 8, 2), R(3, 0, 5, 12)],
  F: [R(0, 0, 2, 12), R(0, 0, 8, 2), R(0, 5, 6, 7)],
  L: [R(0, 0, 2, 12), R(0, 10, 8, 12)],
  I: [R(1, 0, 7, 2), R(3, 0, 5, 12), R(1, 10, 7, 12)],
  S: [R(1, 0, 8, 2), R(0, 1, 2, 5), R(1, 5, 7, 7), R(6, 6, 8, 11), R(0, 10, 7, 12)],
  H: [R(0, 0, 2, 12), R(6, 0, 8, 12), R(0, 5, 8, 7)],
  U: [R(0, 0, 2, 10), R(6, 0, 8, 10), R(1, 10, 7, 12)],
  V: Array.from({ length: ROWS }, (_, r) => { const l = Math.round((r * 3) / 12); return [R(l, r, l + 2, r), R(6 - l, r, 8 - l, r)]; }).flat(),
  A: [R(1, 0, 7, 2), R(0, 1, 2, 12), R(6, 1, 8, 12), R(0, 5, 8, 7)],
  C: [R(1, 0, 8, 2), R(0, 1, 2, 11), R(1, 10, 8, 12)],
  M: [R(0, 0, 2, 12), R(6, 0, 8, 12), R(2, 0, 3, 5), R(5, 0, 6, 5), R(3, 3, 5, 6)],
  "/": Array.from({ length: ROWS }, (_, r) => { const x = Math.round(6 - (r * 6) / 12); return R(x, r, x + 2, r); }),
};
export function pixelText(text) {
  const cols = text.length * COLS + (text.length - 1);
  let d = "";
  [...text].forEach((ch, k) => {
    const g = GL[ch] || [];
    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    g.forEach(({ c0, r0, c1, r1 }) => { for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) if (r < ROWS && c < COLS) grid[r][c] = 1; });
    const ox = k * (COLS + 1);
    grid.forEach((row, r) => {
      let run = -1;
      for (let c = 0; c <= COLS; c++) {
        if (c < COLS && row[c] && run < 0) run = c;
        if ((c === COLS || !row[c]) && run >= 0) { d += `M${ox + run} ${r}h${c - run}v1h${-(c - run)}z`; run = -1; }
      }
    });
  });
  return { cols, rows: ROWS, d };
}