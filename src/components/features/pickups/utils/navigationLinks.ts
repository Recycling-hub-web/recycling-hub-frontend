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
//
// `destination` can be an address instead of coordinates — pass the
// store's address for the route's end point: bare coordinates make Google
// label the pin after whatever business is nearest (e.g. a restaurant in
// the same mall) instead of the store itself.
//
// Built with URLSearchParams so the waypoint separator `|` and the commas
// in coordinates are encoded (%7C, %2C), as Google's Maps URLs require.
// Desktop browsers forgive them raw, but the Google Maps mobile app
// doesn't: it showed "3 stops" and then no route at all.
const googleMapsMultiStopUrl = (
  origin: LatLng,
  stops: LatLng[],
  destination: LatLng | string,
) => {
  const params = new URLSearchParams({
    api: '1',
    origin: `${origin.lat},${origin.lng}`,
    destination:
      typeof destination === 'string'
        ? destination
        : `${destination.lat},${destination.lng}`,
    travelmode: 'driving',
  });
  if (stops.length) {
    params.set(
      'waypoints',
      stops.map((stop) => `${stop.lat},${stop.lng}`).join('|'),
    );
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
};

const googleMapsEmbedUrl = (
  origin: LatLng,
  stops: LatLng[],
  destination: LatLng,
): string | null => {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  if (!key) return null;
  const params = new URLSearchParams({
    key,
    origin: `${origin.lat},${origin.lng}`,
    destination: `${destination.lat},${destination.lng}`,
    waypoints: stops.map((stop) => `${stop.lat},${stop.lng}`).join('|'),
    mode: 'driving',
  });
  return `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;
};

export {
  googleMapsDirectionsUrl,
  googleMapsEmbedUrl,
  googleMapsMultiStopUrl,
  wazeNavigateUrl,
};
