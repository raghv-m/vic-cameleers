"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

/**
 * Google Places (new API) for address autocomplete. Loads only when a key is configured and only
 * the first time someone types in an address field. Everything fails soft: no key, a blocked
 * script or a network error all resolve to null, and the inputs keep working as plain text with
 * the suburb list.
 *
 * Cost: one AutocompleteSessionToken per typing session, reused for every suggestion request and
 * ended by the single fetchFields call when a suggestion is picked (Google's session pricing).
 */

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/** About 80 km around the Cranbourne depot, to bias (not restrict) results to Greater Melbourne. */
const BIAS = { south: -38.82, north: -37.38, west: 144.37, east: 146.2 };

export type PlaceMode = "address" | "suburb";

export interface PickedPlace {
  formattedAddress: string;
  suburb: string | null;
  postcode: string | null;
  lat: number;
  lng: number;
  placeId: string;
}

export interface Suggestion {
  id: string;
  main: string;
  secondary: string;
  prediction: google.maps.places.PlacePrediction;
}

let placesLib: Promise<google.maps.PlacesLibrary | null> | null = null;

export function placesAvailable(): boolean {
  return Boolean(KEY);
}

function loadPlaces(): Promise<google.maps.PlacesLibrary | null> {
  if (!KEY) return Promise.resolve(null);
  placesLib ??= (async () => {
    try {
      setOptions({ key: KEY, v: "weekly", region: "AU", language: "en-AU" });
      return await importLibrary("places");
    } catch {
      return null;
    }
  })();
  return placesLib;
}

export class PlacesSession {
  private token: google.maps.places.AutocompleteSessionToken | null = null;

  constructor(private mode: PlaceMode) {}

  async suggest(input: string): Promise<Suggestion[] | null> {
    const lib = await loadPlaces();
    if (!lib) return null;
    try {
      this.token ??= new lib.AutocompleteSessionToken();
      const { suggestions } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        sessionToken: this.token,
        includedRegionCodes: ["au"],
        locationBias: BIAS,
        includedPrimaryTypes:
          this.mode === "suburb"
            ? ["locality", "postal_code", "street_address", "premise", "route"]
            : ["street_address", "premise", "subpremise", "route", "locality"],
      });
      return suggestions
        .map((s) => s.placePrediction)
        .filter((p): p is google.maps.places.PlacePrediction => Boolean(p))
        .slice(0, 5)
        .map((p) => ({
          id: p.placeId,
          main: p.mainText?.text ?? p.text.text,
          secondary: p.secondaryText?.text ?? "",
          prediction: p,
        }));
    } catch {
      return null;
    }
  }

  /** Resolves a suggestion to the few fields we use. Ends the billing session. */
  async pick(suggestion: Suggestion): Promise<PickedPlace | null> {
    try {
      const place = suggestion.prediction.toPlace();
      await place.fetchFields({ fields: ["formattedAddress", "location", "addressComponents"] });
      this.token = null;
      const component = (type: string) =>
        place.addressComponents?.find((c) => c.types.includes(type))?.shortText ?? null;
      const location = place.location;
      if (!location) return null;
      return {
        formattedAddress: place.formattedAddress ?? suggestion.main,
        suburb: component("locality"),
        postcode: component("postal_code"),
        lat: location.lat(),
        lng: location.lng(),
        placeId: place.id,
      };
    } catch {
      this.token = null;
      return null;
    }
  }
}
