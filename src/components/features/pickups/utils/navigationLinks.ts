import type { LatLng } from '../types';

/** Deep links to the two navigation apps drivers actually use here —
 * no in-app map, just hand the address/coordinates to whichever app
 * the driver already has open. Per-stop only (not a multi-stop
 * route): Waze's URL scheme has no multi-destination support, so a
 * single consistent per-stop link works the same way for both apps
 * instead of two different experiences. */
const googleMapsDirectionsUrl = (address: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

const wazeNavigateUrl = (address: string) =>
  `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;

// The one exception to "per-stop only" above — used by the Optimize
// Route modal's Google Maps choice. Google Maps' deep link supports
// several waypoints in one continuous trip, but drives them in
// whatever order the link gives it; it does NOT reorder them itself.
// `stops` must already be in the real optimized order (from
// useOptimizeRoute), not raw selection order. Waze has no equivalent —
// there is no multi-stop builder for it, by design (see above).
const googleMapsMultiStopUrl = (
  origin: LatLng,
  stops: LatLng[],
  destination: LatLng,
) =>
  `https://www.google.com/maps/dir/?api=1` +
  `&origin=${origin.lat},${origin.lng}` +
  `&destination=${destination.lat},${destination.lng}` +
  `&waypoints=${stops.map((s) => `${s.lat},${s.lng}`).join('|')}` +
  `&travelmode=driving`;

export { googleMapsDirectionsUrl, googleMapsMultiStopUrl, wazeNavigateUrl };
