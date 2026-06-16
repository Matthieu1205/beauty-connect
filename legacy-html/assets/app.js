/* BeautyConnect — interactions, donnees de demo, photos reelles & illustrations de repli */

const SALONS = [
  { id: 1, nom: "Maison Awa", commune: "Cocody", quartier: "Riviera Golf", note: 4.9, avis: 214, prixMin: 3000, types: ["Tresses","Locks","Coupe","Coloration"], desc: "Institut haut de gamme specialise dans les tresses fines et les soins capillaires premium.", c1:"#6E1E33", c2:"#C9A24B" },
  { id: 2, nom: "Studio Nappy", commune: "Marcory", quartier: "Zone 4", note: 4.7, avis: 168, prixMin: 2500, types: ["Braids","Locks","Défrisage"], desc: "Specialiste du cheveu naturel et des locks entretenus avec produits bio.", c1:"#872A42", c2:"#D7B968" },
  { id: 3, nom: "Belle Époque", commune: "Plateau", quartier: "Centre", note: 4.8, avis: 301, prixMin: 4000, types: ["Coloration","Coupe","Perruques"], desc: "Salon elegant au coeur du Plateau, expert en colorations et poses de perruques.", c1:"#511325", c2:"#E7D29A" },
  { id: 4, nom: "Tresses & Co", commune: "Yopougon", quartier: "Selmer", note: 4.6, avis: 142, prixMin: 2000, types: ["Tresses","Braids","Défrisage"], desc: "Le rendez-vous des tresses africaines, rapide et soigne, a prix accessible.", c1:"#3D0E1C", c2:"#C9A24B" },
  { id: 5, nom: "Salon Royal", commune: "Cocody", quartier: "Angré", note: 4.9, avis: 256, prixMin: 5000, types: ["Perruques","Coloration","Coupe"], desc: "Experience luxe : perruques sur mesure et colorations signature.", c1:"#511325", c2:"#D7B968" },
  { id: 6, nom: "Afro Glam", commune: "Bingerville", quartier: "Centre-ville", note: 4.5, avis: 98, prixMin: 2500, types: ["Locks","Tresses","Coupe"], desc: "Ambiance chaleureuse et coiffures afro tendance pour toute occasion.", c1:"#872A42", c2:"#C9A24B" }
];

const PRESTATIONS = [
  { nom: "Tresses", prix: 10000, duree: "2h" },
  { nom: "Braids", prix: 12000, duree: "2h30" },
  { nom: "Locks", prix: 15000, duree: "3h" },
  { nom: "Perruques", prix: 18000, duree: "1h30" },
  { nom: "Défrisage", prix: 7000, duree: "1h" },
  { nom: "Coupe", prix: 3000, duree: "30 min" },
  { nom: "Coloration", prix: 14000, duree: "2h" }
];

const fcfa = function (n) { return n.toLocaleString('fr-FR') + " FCFA"; };
const stars = function (n) { return "★★★★★".slice(0, Math.round(n)) + "☆☆☆☆☆".slice(0, 5 - Math.round(n)); };

/* ============================================================
   Photos reelles (Wikimedia Commons, lien direct stable).
   Repli automatique sur l'illustration vectorielle si echec.
   ============================================================ */
const WM = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const PHOTOS = {
  Tresses:    WM + "Hair%20braiding%20Kinshasa%202.jpg?width=800",
  Braids:     WM + "Combo%20Braid.JPG?width=800",
  Locks:      WM + "Dreadlocks.JPG?width=800",
  Coloration: WM + "Natural%20redhead%20black%20girl%20(red%20power%20hairstyle).jpg?width=800",
  Coupe:      WM + "Peinados%20Afro.jpg?width=800",
  Perruques:  WM + "Paris%20Dreadlocks.JPG?width=800",
  "Défrisage":WM + "Hair%20salon%20(51212326557).jpg?width=800",
  Salon:      WM + "Elmina%20Hairdresser%20Salon%20B002.jpg?width=800"
};
function photoURL(type) { return PHOTOS[type] || PHOTOS.Salon; }
function photoImg(type) {
  return '<img src="' + photoURL(type) + '" alt="Coiffure ' + type + '" loading="lazy" ' +
    'onerror="this.style.display=\'none\'" ' +
    'style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;z-index:1">';
}

/* ============================================================
   Illustrations vectorielles de repli — portraits stylises
   ============================================================ */
const CREAM = "#FBF7F1";
const GOLD = "#E7D29A";

function hairBraids() {
  var s = '<path d="M242 168 C248 118 352 118 358 168" fill="none" stroke="' + CREAM + '" stroke-width="3" opacity=".85"/>';
  var xs = [206, 226, 246, 354, 374, 394];
  xs.forEach(function (x) {
    s += '<path d="M' + x + ' 150 q-9 70 0 130 q9 70 0 130" fill="none" stroke="' + CREAM + '" stroke-width="5" opacity=".8"/>';
    s += '<circle cx="' + x + '" cy="402" r="4.5" fill="' + GOLD + '"/>';
  });
  [285, 315].forEach(function (x) {
    s += '<path d="M' + x + ' 122 q-6 90 0 180" fill="none" stroke="' + CREAM + '" stroke-width="4" opacity=".55"/>';
  });
  return s;
}
function hairLocks() {
  var s = '<path d="M240 170 C246 112 354 112 360 170" fill="none" stroke="' + CREAM + '" stroke-width="3" opacity=".85"/>';
  var xs = [210, 234, 366, 390];
  xs.forEach(function (x) {
    s += '<path d="M' + x + ' 150 q-12 80 0 160 q10 60 0 95" fill="none" stroke="' + CREAM + '" stroke-width="9" stroke-linecap="round" opacity=".8"/>';
    var k = 0;
    for (var y = 180; y < 400; y += 46) {
      var cx = x + (k % 2 === 0 ? -1 : 1);
      k += 1;
      s += '<circle cx="' + cx + '" cy="' + y + '" r="6" fill="none" stroke="' + GOLD + '" stroke-width="1.5" opacity=".6"/>';
    }
  });
  return s;
}
function hairLong(withColor) {
  var s = '<path d="M250 150 C270 118 330 118 350 150" fill="none" stroke="' + CREAM + '" stroke-width="3" opacity=".85"/>';
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
  var s = '<path d="M243 152 C232 104 368 104 357 152" fill="none" stroke="' + CREAM + '" stroke-width="3" opacity=".85"/>';
  s += '<path d="M243 152 C228 196 240 236 258 252" fill="none" stroke="' + CREAM + '" stroke-width="6" opacity=".8"/>';
  s += '<path d="M357 152 C372 196 360 236 342 252" fill="none" stroke="' + CREAM + '" stroke-width="6" opacity=".8"/>';
  s += '<path d="M262 128 C290 116 320 118 344 130" fill="none" stroke="' + GOLD + '" stroke-width="2" opacity=".7"/>';
  return s;
}
function hairFor(type) {
  if (type === "Locks") return hairLocks();
  if (type === "Perruques" || type === "Défrisage") return hairLong(false);
  if (type === "Coloration") return hairLong(true);
  if (type === "Coupe") return hairShort();
  return hairBraids();
}
function hairSVG(type, c1, c2) {
  var face =
    '<path d="M252 176 C252 240 280 286 300 286 C320 286 348 240 348 176" fill="none" stroke="' + CREAM + '" stroke-width="2.5" opacity=".9"/>' +
    '<path d="M286 286 L284 320 M314 286 L316 320" stroke="' + CREAM + '" stroke-width="2.5" fill="none" opacity=".85"/>' +
    '<path d="M205 400 C232 346 266 323 300 323 C334 323 368 346 395 400" fill="none" stroke="' + CREAM + '" stroke-width="2.5" opacity=".85"/>' +
    '<path d="M270 206 q11 8 22 0 M308 206 q-11 8 -22 0" fill="none" stroke="' + GOLD + '" stroke-width="2" opacity=".85"/>' +
    '<path d="M300 212 l-4 24 q4 6 8 0" fill="none" stroke="' + GOLD + '" stroke-width="1.6" opacity=".7"/>' +
    '<path d="M289 250 q11 8 22 0" fill="none" stroke="' + GOLD + '" stroke-width="2" opacity=".85"/>' +
    '<circle cx="350" cy="276" r="7" fill="none" stroke="' + GOLD + '" stroke-width="2.4"/>';
  var deco =
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
function hairURI(type, c1, c2) {
  return "data:image/svg+xml," + encodeURIComponent(hairSVG(type, c1, c2));
}

/* Carte salon : photo reelle + illustration de repli en fond */
function salonCardHTML(s) {
  var uri = hairURI(s.types[0], s.c1, s.c2);
  return '<a class="card salon-card reveal" href="salon.html?id=' + s.id + '">' +
    '<div class="thumb" style="position:relative;background-image:url(\'' + uri + '\');background-size:cover;background-position:center">' +
      photoImg(s.types[0]) +
      '<span class="badge" style="z-index:2">' + s.commune + '</span>' +
    '</div>' +
    '<div class="body">' +
      '<h3>' + s.nom + '</h3>' +
      '<div class="meta">' + s.quartier + ' · ' + s.commune + '</div>' +
      '<div class="row">' +
        '<span class="rating"><span class="stars">' + stars(s.note) + '</span> ' + s.note + '</span>' +
        '<span class="price-tag">dès ' + fcfa(s.prixMin) + '</span>' +
      '</div>' +
    '</div>' +
  '</a>';
}

/* Applique illustration de repli + photo reelle a un element */
function setIllustration(el, type, c1, c2) {
  if (!el) return;
  el.style.backgroundImage = "url('" + hairURI(type, c1, c2) + "')";
  el.style.backgroundSize = "cover";
  el.style.backgroundPosition = "center";
  if (getComputedStyle(el).position === "static") el.style.position = "relative";
  el.insertAdjacentHTML("afterbegin", photoImg(type));
  Array.prototype.forEach.call(el.children, function (ch) { if (ch.tagName !== "IMG") ch.style.zIndex = "2"; });
}

function toggleMenu() {
  var l = document.querySelector('.nav-links');
  if (l) l.style.display = (l.style.display === 'flex') ? 'none' : 'flex';
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });
  document.querySelectorAll('[data-illus]').forEach(function (el) {
    var parts = el.dataset.illus.split('|');
    setIllustration(el, parts[0], parts[1] || "#6E1E33", parts[2] || "#C9A24B");
  });
});

/* ============================================================
   Géolocalisation, carte Google Maps & liens Yango / Maps
   ============================================================ */
var COORDS = {
  1: [5.3599, -3.9803],  // Cocody, Riviera Golf
  2: [5.3002, -3.9950],  // Marcory, Zone 4
  3: [5.3247, -4.0218],  // Plateau, Centre
  4: [5.3450, -4.0850],  // Yopougon, Selmer
  5: [5.3960, -3.9840],  // Cocody, Angré
  6: [5.3550, -3.8860]   // Bingerville
};
SALONS.forEach(function (s) { var c = COORDS[s.id] || [5.3364, -4.0267]; s.lat = c[0]; s.lng = c[1]; });

var COMMUNE_COORDS = {
  "Cocody": [5.3599, -3.9803], "Marcory": [5.3002, -3.9950], "Plateau": [5.3247, -4.0218],
  "Yopougon": [5.3450, -4.0850], "Bingerville": [5.3550, -3.8860], "Abidjan": [5.3364, -4.0267]
};

function mapEmbedQuery(query, zoom) {
  return "https://www.google.com/maps?q=" + encodeURIComponent(query) + "&z=" + (zoom || 13) + "&output=embed";
}
function mapEmbedLatLng(lat, lng, zoom) {
  return "https://www.google.com/maps?q=" + lat + "," + lng + "&z=" + (zoom || 15) + "&output=embed";
}
function gmapsDirURL(lat, lng) {
  return "https://www.google.com/maps/dir/?api=1&destination=" + lat + "," + lng;
}
function gmapsViewURL(lat, lng) {
  return "https://www.google.com/maps/search/?api=1&query=" + lat + "," + lng;
}
function yangoURL(lat, lng) {
  return "https://yango.go.link/route?end-lat=" + lat + "&end-lon=" + lng + "&lang=fr";
}
