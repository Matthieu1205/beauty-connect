/* Photos reelles (Wikimedia Commons) + illustration vectorielle de repli */
const WM = 'https://commons.wikimedia.org/wiki/Special:FilePath/';
export const PHOTOS = {
  Tresses:    WM + 'Hair%20braiding%20Kinshasa%202.jpg?width=800',
  Braids:     WM + 'Combo%20Braid.JPG?width=800',
  Locks:      WM + 'Dreadlocks.JPG?width=800',
  Coloration: WM + 'Natural%20redhead%20black%20girl%20(red%20power%20hairstyle).jpg?width=800',
  Coupe:      WM + 'Peinados%20Afro.jpg?width=800',
  Perruques:  WM + 'Paris%20Dreadlocks.JPG?width=800',
  'Défrisage':WM + 'Hair%20salon%20(51212326557).jpg?width=800',
  Salon:      WM + 'Elmina%20Hairdresser%20Salon%20B002.jpg?width=800',
};
export const photoURL = (type) => PHOTOS[type] || PHOTOS.Salon;

const CREAM = '#FBF7F1';
const GOLD = '#E7D29A';

function hairBraids() {
  let s = '<path d="M242 168 C248 118 352 118 358 168" fill="none" stroke="' + CREAM + '" stroke-width="3" opacity=".85"/>';
  [206,226,246,354,374,394].forEach((x) => {
    s += '<path d="M' + x + ' 150 q-9 70 0 130 q9 70 0 130" fill="none" stroke="' + CREAM + '" stroke-width="5" opacity=".8"/>';
    s += '<circle cx="' + x + '" cy="402" r="4.5" fill="' + GOLD + '"/>';
  });
  [285,315].forEach((x) => { s += '<path d="M' + x + ' 122 q-6 90 0 180" fill="none" stroke="' + CREAM + '" stroke-width="4" opacity=".55"/>'; });
  return s;
}
function hairLocks() {
  let s = '<path d="M240 170 C246 112 354 112 360 170" fill="none" stroke="' + CREAM + '" stroke-width="3" opacity=".85"/>';
  [210,234,366,390].forEach((x) => {
    s += '<path d="M' + x + ' 150 q-12 80 0 160 q10 60 0 95" fill="none" stroke="' + CREAM + '" stroke-width="9" stroke-linecap="round" opacity=".8"/>';
    let k = 0;
    for (let y = 180; y < 400; y += 46) {
      const cx = x + (k % 2 === 0 ? -1 : 1); k += 1;
      s += '<circle cx="' + cx + '" cy="' + y + '" r="6" fill="none" stroke="' + GOLD + '" stroke-width="1.5" opacity=".6"/>';
    }
  });
  return s;
}
function hairLong(withColor) {
  let s = '<path d="M250 150 C270 118 330 118 350 150" fill="none" stroke="' + CREAM + '" stroke-width="3" opacity=".85"/>';
  s += '<path d="M250 150 C198 165 184 290 202 400" fill="none" stroke="' + CREAM + '" stroke-width="5" opacity=".8"/>';
  s += '<path d="M350 150 C402 165 416 290 398 400" fill="none" stroke="' + CREAM + '" stroke-width="5" opacity=".8"/>';
  s += '<path d="M270 150 C236 180 230 300 250 400" fill="none" stroke="' + CREAM + '" stroke-width="2.5" opacity=".5"/>';
  s += '<path d="M330 150 C364 180 370 300 350 400" fill="none" stroke="' + CREAM + '" stroke-width="2.5" opacity=".5"/>';
  s += '<line x1="300" y1="126" x2="300" y2="172" stroke="' + GOLD + '" stroke-width="2" opacity=".8"/>';
  if (withColor) {
    s += '<path d="M258 155 C214 178 206 300 222 400" fill="none" stroke="' + GOLD + '" stroke-width="3" opacity=".85"/>';
    s += '<path d="M342 155 C386 178 394 300 378 400" fill="none" stroke="' + GOLD + '" stroke-width="3" opacity=".85"/>';
  }
  return s;
}
function hairShort() {
  let s = '<path d="M243 152 C232 104 368 104 357 152" fill="none" stroke="' + CREAM + '" stroke-width="3" opacity=".85"/>';
  s += '<path d="M243 152 C228 196 240 236 258 252" fill="none" stroke="' + CREAM + '" stroke-width="6" opacity=".8"/>';
  s += '<path d="M357 152 C372 196 360 236 342 252" fill="none" stroke="' + CREAM + '" stroke-width="6" opacity=".8"/>';
  s += '<path d="M262 128 C290 116 320 118 344 130" fill="none" stroke="' + GOLD + '" stroke-width="2" opacity=".7"/>';
  return s;
}
function hairFor(type) {
  if (type === 'Locks') return hairLocks();
  if (type === 'Perruques' || type === 'Défrisage') return hairLong(false);
  if (type === 'Coloration') return hairLong(true);
  if (type === 'Coupe') return hairShort();
  return hairBraids();
}
function hairSVG(type, c1, c2) {
  const face =
    '<path d="M252 176 C252 240 280 286 300 286 C320 286 348 240 348 176" fill="none" stroke="' + CREAM + '" stroke-width="2.5" opacity=".9"/>' +
    '<path d="M286 286 L284 320 M314 286 L316 320" stroke="' + CREAM + '" stroke-width="2.5" fill="none" opacity=".85"/>' +
    '<path d="M205 400 C232 346 266 323 300 323 C334 323 368 346 395 400" fill="none" stroke="' + CREAM + '" stroke-width="2.5" opacity=".85"/>' +
    '<path d="M270 206 q11 8 22 0 M308 206 q-11 8 -22 0" fill="none" stroke="' + GOLD + '" stroke-width="2" opacity=".85"/>' +
    '<path d="M300 212 l-4 24 q4 6 8 0" fill="none" stroke="' + GOLD + '" stroke-width="1.6" opacity=".7"/>' +
    '<path d="M289 250 q11 8 22 0" fill="none" stroke="' + GOLD + '" stroke-width="2" opacity=".85"/>' +
    '<circle cx="350" cy="276" r="7" fill="none" stroke="' + GOLD + '" stroke-width="2.4"/>';
  const deco =
    '<circle cx="522" cy="72" r="46" fill="none" stroke="' + GOLD + '" stroke-width="2" opacity=".5"/>' +
    '<circle cx="86" cy="338" r="74" fill="none" stroke="' + CREAM + '" stroke-width="1.5" opacity=".15"/>' +
    '<circle cx="498" cy="300" r="3" fill="' + GOLD + '" opacity=".7"/>' +
    '<circle cx="120" cy="90" r="3" fill="' + CREAM + '" opacity=".5"/>';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">' +
    '<defs>' +
    '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>' +
    '<radialGradient id="gl" cx=".8" cy=".12" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
    '</defs>' +
    '<rect width="600" height="400" fill="url(#g)"/>' +
    '<rect width="600" height="400" fill="url(#gl)"/>' +
    deco + hairFor(type) + face +
    '</svg>';
}
export const hairURI = (type, c1 = '#6E1E33', c2 = '#C9A24B') =>
  'data:image/svg+xml,' + encodeURIComponent(hairSVG(type, c1, c2));
