export const mapEmbedQuery = (query, zoom = 13) =>
  'https://www.google.com/maps?q=' + encodeURIComponent(query) + '&z=' + zoom + '&output=embed';
export const mapEmbedLatLng = (lat, lng, zoom = 15) =>
  'https://www.google.com/maps?q=' + lat + ',' + lng + '&z=' + zoom + '&output=embed';
export const gmapsDirURL = (lat, lng) =>
  'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng;
export const gmapsViewURL = (lat, lng) =>
  'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng;
export const yangoURL = (lat, lng) =>
  'https://yango.go.link/route?end-lat=' + lat + '&end-lon=' + lng + '&lang=fr';
