# Wix 20 — coin screen (v2 design)

The LED wall for the Wix 20 celebration: coins fly across the event's pink frame and new ones are struck by the press on the right.

## Folders
- `screen/` — the screen itself. `office.html` = the whole frame (title, QR, press, strip). `index.html` = the 3D coins, `mint.html` = the press, `v2-style.js` = layout, press shapes and coin colours (measured off the final frame, 2000 x 759).
- `screen/icons/` — the 8 strip icons. `screen/fonts/` — Wix Madefor Display.
- `upload-page/` — the "Make Your Mark" selfie page (Google Apps Script web app). IDs removed from `Code.gs`.
- `figma/` — the mobile upload page as SVG (drag into Figma) + the final frame reference.
- `coin-gif/` — per-employee coin animation tests (GIF, WebP, WhatsApp sticker 512 px).

## See it running
From this folder:

```
python3 -m http.server 5207
```

Open http://localhost:5207/screen/office.html — press **C** on the screen to pick coin colours.

No employee photos or HR data are in this repo.
