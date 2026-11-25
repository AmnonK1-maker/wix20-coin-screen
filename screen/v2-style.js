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

// the frame's grunge overlay (office.html, mint.html) lightens what is under it; under(hex) = the colour to paint so it shows as hex
export function under(h) { if (!/^#[0-9a-f]{6}$/i.test(h)) return h;
  return '#' + [1, 3, 5].map(i => { const t = parseInt(h.slice(i, i + 2), 16) / 255, b = t > 0.611 ? (t - 0.222) / 0.778 : t / 1.222;
    return Math.round(Math.max(0, Math.min(1, b)) * 255).toString(16).padStart(2, '0'); }).join(''); }
// background + grid colour as seen on screen (office: press C). Defaults = the Figma 9680:636 frame; kept in this browser.
export const BG_DEFAULT = { top: '#e8b0e3', grid: '#f1b2eb' };
export const BG = (() => { let v = null; try { v = JSON.parse(localStorage.getItem('wix20-bg') || 'null'); } catch (e) {}
  const ok = h => typeof h === 'string' && /^#[0-9a-f]{6}$/i.test(h);
  return { top: ok(v?.top) ? v.top : BG_DEFAULT.top, grid: ok(v?.grid) ? v.grid : BG_DEFAULT.grid }; })();
export function setBg(o) { Object.assign(BG, o); try { localStorage.setItem('wix20-bg', JSON.stringify(BG)); } catch (e) {} }
const mixHex = (a, b, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');
// backdrop: flat at the top, lighter toward the bottom (Figma 9680:636: base 225,153,219 easing about a quarter of the way to #f0f0f0)
export function drawBackdrop(x, W, H, ox = 0, oy = 0, FH = H) {
  const g = x.createLinearGradient(0, -oy, 0, FH - oy), b = under(BG.top);
  for (const [at, t] of [[0, 0], [0.45, 0.023], [0.59, 0.092], [0.69, 0.15], [0.79, 0.23], [0.93, 0.276], [1, 0.276]]) g.addColorStop(at, mixHex(b, '#f0f0f0', t));
  x.fillStyle = g; x.fillRect(0, 0, W, H);
}

// the press box: on the right since the 2026-11-24 frame (it was at x 47; everything inside moves with it)
// 2026-11-25 Figma: a thicker white frame (9.7 ref px), grown outward; the press inside stays put (OX fixed)
export const BOX = { x: 1610.7, y: 166.4, w: 328.3, h: 511.5 }, BOX_LINE = 3.3, OX = 1565;   // 2026-11-25 Figma 9680:636: thin frame again
// layout of the screen (in screen px for a W x H screen)
export function layout(W, H) {
  const s = W / REF_W;
  const box = { x: BOX.x * s, y: BOX.y * s, w: BOX.w * s, h: BOX.h * s, line: BOX_LINE * s };   // the press frame (outer edge of the white line)
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
    {cx:209.5, r:161.5, white:328, we:351, wT:573.5, yT:552, ryT:9, top:C.green, yB:1000, col:C.green},   // wT: the white stripe starts below the top face (Figma 9680:636)
    {cx:209.5, r:141.5, white:312, we:333, wT:522.5, yT:520, ryT:12, top:C.orange, yB:552, ryB:16, col:C.orange},
    {cx:210,   r:50,    white:240, we:251, yT:452, ryT:8,  top:C.blueTop, yB:517, ryB:8, col:C.blue},   // bottom curves like its top: it stands in the plate
  ],
  OPEN: +(new URLSearchParams(location.search).get('open') ?? 0), HIT: 33,   // ram offset at rest (0 = as in the frame) / at the blow
  coinK: 0.78,             // struck coin radius / punch radius
};
const mv = p => ({ ...p, cx: p.cx + OX, white: p.white + OX, we: p.we + OX });
export const PRESS = { ...P0, UP: P0.UP.map(mv), LOW: P0.LOW.map(mv) };
