import { useQuery } from "@tanstack/react-query";
import {
  buildForecastDays,
  formatLocationLabel,
  FORECAST_ENDPOINT,
  MAX_SUGGESTIONS,
  SEARCH_ENDPOINT,
} from "./weather";

const SEARCH_ERROR = "City search is unavailable right now.";
const NO_RESULTS_ERROR = "No matching cities found.";
const FORECAST_ERROR = "Forecast data could not be loaded.";

const mapSuggestion = (place) => ({
  id: `${place.id}-${place.latitude}-${place.longitude}`,
  label: formatLocationLabel(place),
  latitude: place.latitude,
  longitude: place.longitude,
  timezone: place.timezone || "auto",
});

export function useCitySuggestions(query) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: ["city-suggestions", trimmedQuery],
    enabled: trimmedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `${SEARCH_ENDPOINT}?name=${encodeURIComponent(trimmedQuery)}&count=${MAX_SUGGESTIONS}&language=en&format=json`,
        { signal },
      );

      if (!response.ok) {
        throw new Error(SEARCH_ERROR);
      }

      const data = await response.json();
      const nextSuggestions = (data.results || []).map(mapSuggestion);

      if (nextSuggestions.length === 0) {
        throw new Error(NO_RESULTS_ERROR);
      }

      return nextSuggestions;
    },
  });
}

export function useForecast(place) {
  return useQuery({
    queryKey: ["forecast", place?.latitude, place?.longitude],
    enabled: Boolean(place),
    staleTime: 10 * 60 * 1000,
    retry: false,
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `${FORECAST_ENDPOINT}?latitude=${place.latitude}&longitude=${place.longitude}&hourly=temperature_2m,weather_code&forecast_days=5&timezone=auto`,
        { signal },
      );

      if (!response.ok) {
        throw new Error(FORECAST_ERROR);
      }

      const data = await response.json();
      return buildForecastDays(data.hourly);
    },
  });
}
