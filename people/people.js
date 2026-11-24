// Drop-in for the LED pages: <script src="/people/people.js"></script>
//   watchPeople(list => { ... })   list = [{id,name,year,photo:'/people/photos/x.jpg',added}], newest first
// Calls back once at start and again whenever someone is added/removed. Checks every minute (ms to change).
// If the file can't be read (sync not running yet), keeps the last good list — the screen never goes empty.
window.watchPeople = function (onChange, ms = 60000, url = '/people/people.json') {
  let last = '';
  async function check() {
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) return;
      const txt = await r.text();
      if (txt === last) return;
      last = txt;
      const base = url.replace(/[^/]*$/, '');
      onChange(JSON.parse(txt).map(p => ({ ...p, photo: base + p.photo + '?v=' + encodeURIComponent(p.added || '') })));   // new photo = new URL, or the browser would show its cached old one
    } catch (e) { /* keep last list */ }
  }
  check(); return setInterval(check, ms);
};
