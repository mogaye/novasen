/**
 * NovaSen - Google Maps Integration Service
 * Support for Google Places Autocomplete, Directions, Distance Matrix & Geocoding (Senegal)
 */

declare global {
  interface Window {
    google?: any;
    initGoogleMapsCallback?: () => void;
  }
}

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

let googleMapsPromise: Promise<any> | null = null;

/**
 * Loads the Google Maps Javascript SDK with Places & Geometry libraries.
 */
export function loadGoogleMaps(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps must be loaded in the browser.'));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY non configurée.'));
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google?.maps));
      existingScript.addEventListener('error', (err) => reject(err));
      return;
    }

    const callbackName = `initGoogleMapsCallback_${Date.now()}`;
    (window as any)[callbackName] = () => {
      delete (window as any)[callbackName];
      resolve(window.google?.maps);
    };

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = (err) => {
      delete (window as any)[callbackName];
      reject(new Error('Erreur de chargement du script Google Maps'));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

/**
 * Autocompletes addresses and places strictly inside Senegal (SN)
 */
export async function getSenegalPlacePredictions(query: string): Promise<PlacePrediction[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const maps = await loadGoogleMaps();
    const service = new maps.places.AutocompleteService();

    return new Promise((resolve) => {
      service.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'sn' }, // Senegal only
          types: ['geocode', 'establishment'],
        },
        (predictions: any[], status: any) => {
          if (status === maps.places.PlacesServiceStatus.OK && predictions) {
            const results: PlacePrediction[] = predictions.map((p) => ({
              placeId: p.place_id,
              description: p.description,
              mainText: p.structured_formatting?.main_text || p.description,
              secondaryText: p.structured_formatting?.secondary_text || 'Sénégal',
            }));
            resolve(results);
          } else {
            resolve([]);
          }
        }
      );
    });
  } catch (e) {
    // If Google Maps is unavailable, return empty to fallback on local database
    return [];
  }
}

/**
 * Calculates exact road distance (in km) and duration (in minutes) via Google Distance Matrix
 */
export async function getRoadDistance(
  origin: string,
  destination: string
): Promise<{ distanceKm: number; durationMin: number; formattedDistance: string; formattedDuration: string } | null> {
  try {
    const maps = await loadGoogleMaps();
    const service = new maps.DistanceMatrixService();

    return new Promise((resolve) => {
      service.getDistanceMatrix(
        {
          origins: [origin.includes('Sénégal') ? origin : `${origin}, Sénégal`],
          destinations: [destination.includes('Sénégal') ? destination : `${destination}, Sénégal`],
          travelMode: maps.TravelMode.DRIVING,
          unitSystem: maps.UnitSystem.METRIC,
        },
        (response: any, status: any) => {
          if (status === maps.DistanceMatrixStatus.OK && response?.rows?.[0]?.elements?.[0]?.status === 'OK') {
            const element = response.rows[0].elements[0];
            const distanceKm = Math.round((element.distance.value / 1000) * 10) / 10;
            const durationMin = Math.round(element.duration.value / 60);

            resolve({
              distanceKm,
              durationMin,
              formattedDistance: element.distance.text,
              formattedDuration: element.duration.text,
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  } catch (e) {
    return null;
  }
}
