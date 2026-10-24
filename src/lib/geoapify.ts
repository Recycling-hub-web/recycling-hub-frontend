/** Thin client for Geoapify's Address Autocomplete API — a plain REST
 * endpoint, no SDK/script to load. Used by AddressInput
 * (components/form/fields/AddressInput.tsx). Docs:
 * https://apidocs.geoapify.com/docs/geocoding/address-autocomplete/ */

const AUTOCOMPLETE_URL = 'https://api.geoapify.com/v1/geocode/autocomplete';

/** One suggestion from the autocomplete endpoint — only the fields this
 * app actually reads; Geoapify's response has more. `name` is only
 * present for POI/business results, not plain street addresses. */
type GeoapifyFeature = {
  place_id: string;
  formatted: string;
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  lat: number;
  lon: number;
};

type GeoapifyResponse = {
  results: GeoapifyFeature[];
};

type SelectedAddress = {
  placeId: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeName?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

class GeoapifyConfigError extends Error {}

/** Query the autocomplete endpoint for `text`. `countryCodes` restricts
 * results (e.g. ["my"]); `bias` nudges ranking toward a point without
 * excluding results elsewhere. Pass `signal` to cancel a stale request
 * when the user keeps typing — the caller is responsible for aborting
 * the previous call before firing a new one. */
const searchAddress = async (
  text: string,
  options: {
    countryCodes?: string[];
    bias?: { lat: number; lng: number };
    signal?: AbortSignal;
  } = {},
): Promise<GeoapifyFeature[]> => {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  if (!apiKey) {
    throw new GeoapifyConfigError(
      'NEXT_PUBLIC_GEOAPIFY_API_KEY is not set — address search is unavailable.',
    );
  }

  const params = new URLSearchParams({
    text,
    apiKey,
    format: 'json',
    limit: '5',
  });
  if (options.countryCodes?.length) {
    params.set(
      'filter',
      `countrycode:${options.countryCodes.join(',').toLowerCase()}`,
    );
  }
  if (options.bias) {
    params.set('bias', `proximity:${options.bias.lng},${options.bias.lat}`);
  }

  const response = await fetch(`${AUTOCOMPLETE_URL}?${params.toString()}`, {
    signal: options.signal,
  });
  if (!response.ok) {
    throw new Error(`Geoapify request failed (${response.status}).`);
  }
  const data = (await response.json()) as GeoapifyResponse;
  return data.results ?? [];
};

/** A raw autocomplete feature → the structured shape AddressInput hands
 * back to the app. Only populates fields Geoapify actually returned —
 * never invents missing location data. */
const toSelectedAddress = (feature: GeoapifyFeature): SelectedAddress => ({
  placeId: feature.place_id,
  formattedAddress: feature.formatted,
  latitude: feature.lat,
  longitude: feature.lon,
  placeName: feature.name,
  city: feature.city,
  state: feature.state,
  country: feature.country,
  postalCode: feature.postcode,
});

export { GeoapifyConfigError, searchAddress, toSelectedAddress };
export type { GeoapifyFeature, SelectedAddress };
