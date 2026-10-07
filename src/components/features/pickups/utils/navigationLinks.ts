/** Deep links to the two navigation apps drivers actually use here —
 * no in-app map, no route optimization, just hand the address to
 * whichever app the driver already has open. Per-stop only (not a
 * multi-stop route): Waze's URL scheme has no multi-destination
 * support, so a single consistent per-stop link works the same way
 * for both apps instead of two different experiences. */
const googleMapsDirectionsUrl = (address: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

const wazeNavigateUrl = (address: string) =>
  `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;

export { googleMapsDirectionsUrl, wazeNavigateUrl };
