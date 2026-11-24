// v2 look (2026-11-23): the event site's frame — flat pink with fine grain, white type, a flat graphic press in an opaque box.
// Everything is laid out in the reference frame's pixels (2000 x 759) and scaled to the real screen.
export const REF_W = 2000, REF_H = 759;
export const C = {
  green: '#21ba6d', orange: '#fc750e', blue: '#4984e9', blueTop: '#3b71c8', lilac: '#eface9', white: '#ffffff', ink: '#000000',
};
// coin colours: the press's own colours + the lilac of the reference coin
export const DEFAULT_COIN_COLORS = [C.green, C.orange, C.blue, C.lilac];
// coin colours can be chosen on the screen (office: press C) — kept in this browser, or ?colors=hex,hex,...
export const COIN_COLORS = (() => { let l = null;
  try { const q = new URLSearchParams(location.search).get('colors'); if (q) l = q.split(',').map(h => '#' + h.replace('#', ''));
    else l = JSON.parse(localStorage.getItem('wix20-coin-colors') || 'null'); } catch (e) {}
  return (Array.isArray(l) && l.length && l.every(h => /^#[0-9a-f]{6}$/i.test(h))) ? l : DEFAULT_COIN_COLORS.slice(); })();
export function setCoinColors(l) { COIN_COLORS.splice(0, COIN_COLORS.length, ...l); try { localStorage.setItem('wix20-coin-colors', JSON.stringify(l)); } catch (e) {} }
// the art on each coin colour (white reads on all but the lilac)
export const ART_COLORS = { [C.green]: '#ffffff', [C.orange]: '#ffffff', [C.blue]: '#ffffff', [C.lilac]: '#c46fc4' };
export const colorFor = year => COIN_COLORS[(((+year || 2026) - 2006) % COIN_COLORS.length + COIN_COLORS.length) % COIN_COLORS.length];

// backdrop: vertical gradient measured off the reference (flat top, lighter toward the bottom)
export function drawBackdrop(x, W, H, ox = 0, oy = 0, FH = H) {
  const g = x.createLinearGradient(0, -oy, 0, FH - oy);
  g.addColorStop(0, '#f0b9eb'); g.addColorStop(0.4, '#f0b9eb'); g.addColorStop(0.59, '#f0c2ec');
  g.addColorStop(0.79, '#f1cced'); g.addColorStop(0.95, '#f1d1ee'); g.addColorStop(1, '#f1d1ee');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
}

// the press box: on the right since the 2026-11-24 frame (it was at x 47; everything inside moves with it)
export const BOX = { x: 1612, y: 167, w: 327, h: 510 }, OX = BOX.x - 47;
// layout of the screen (in screen px for a W x H screen)
export function layout(W, H) {
  const s = W / REF_W;
  const box = { x: BOX.x * s, y: BOX.y * s, w: BOX.w * s, h: BOX.h * s, line: 3 * s };   // the press frame (outer edge of the white line)
  // the struck coin sits on the lower punch: its top face centre, and the coin radius (= punch radius)
  const die = { x: (208 + OX) * s, y: 452 * s, r: 48 * s, coinR: 48 * s * PRESS.coinK };
  return { s, box, die };
}

// the press, in reference px (widths re-measured 2026-11-24: an equal gap to the frame on both sides) (absolute frame coords). cx/r: centre + half width; white: x where the lit white side starts;
// yT/ryT: top edge + top-face ellipse (0 = hidden); yB/ryB: bottom edge + its curve. UP = the ram (moves by dy), back to front.
const P0 = {   // re-measured off the final frame (2026-11-24): green spans the whole box; each part's white stripe ends short of its right edge (we = white end)
  UP: [
    {cx:210,   r:50,    white:240, we:251, yT:300, yB:420, ryB:7,  col:C.blue},
    {cx:209.5, r:141.5, white:312, we:333, yT:280, yB:326, ryB:10, col:C.orange},
    {cx:209.5, r:161.5, white:328, we:351, yT:-400,yB:284, ryB:6,  col:C.green},
  ],
  LOW: [
    {cx:209.5, r:161.5, white:328, we:351, yT:552, ryT:9, top:C.green, yB:1000, col:C.green},
    {cx:209.5, r:141.5, white:312, we:333, yT:520, ryT:12, top:C.green, yB:552, ryB:16, col:C.orange},
    {cx:210,   r:50,    white:240, we:251, yT:452, ryT:8,  top:C.blueTop, yB:517, ryB:8, col:C.blue},   // bottom curves like its top: it stands in the plate
  ],
  OPEN: +(new URLSearchParams(location.search).get('open') ?? 0), HIT: 33,   // ram offset at rest (0 = as in the frame) / at the blow
  coinK: 0.78,             // struck coin radius / punch radius
};
const mv = p => ({ ...p, cx: p.cx + OX, white: p.white + OX, we: p.we + OX });
export const PRESS = { ...P0, UP: P0.UP.map(mv), LOW: P0.LOW.map(mv) };
