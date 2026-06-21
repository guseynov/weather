import { useId, useState } from "react";
import { useDebounce } from "use-debounce";
import clsx from "clsx";
import SearchView from "./components/SearchView";
import ForecastView from "./components/ForecastView";
import { useCitySuggestions, useForecast } from "./lib/weatherQueries";
import { getForecastRangeLabel, getForecastSummary } from "./lib/weather";

function App() {
  const inputId = useId();
  const listboxId = `${inputId}-suggestions`;

  const [query, setQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [debouncedQuery] = useDebounce(query, 250);
  const searchQuery = selectedPlace ? "" : debouncedQuery;
  const citySuggestionsQuery = useCitySuggestions(searchQuery);
  const forecastQuery = useForecast(selectedPlace);

  const trimmedQuery = query.trim();
  const isSearchable = !selectedPlace && trimmedQuery.length >= 2;
  const suggestions = isSearchable ? citySuggestionsQuery.data ?? [] : [];
  const isSearching = isSearchable && citySuggestionsQuery.isFetching;
  const forecastDays = selectedPlace ? forecastQuery.data ?? [] : [];
  const isForecastLoading = Boolean(selectedPlace) && forecastQuery.isFetching;
  const forecastError =
    selectedPlace && forecastQuery.error instanceof Error ? forecastQuery.error.message : "";
  const showForecastView =
    Boolean(selectedPlace) ||
    isForecastLoading ||
    Boolean(forecastError) ||
    forecastDays.length > 0;

  const currentSummary = getForecastSummary(forecastDays);
  const forecastRangeLabel = getForecastRangeLabel(forecastDays);

  const resetSearch = () => {
    setSelectedPlace(null);
    setQuery("");
  };

  const loadForecast = (place) => {
    setSelectedPlace(place);
    setQuery(place.label);
  };

  const handleQueryChange = (nextQuery) => {
    setQuery(nextQuery);
    setSelectedPlace(null);
  };

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <section
        className={clsx(
          "relative z-10 mx-auto min-h-dvh w-[min(1180px,calc(100%-32px))]",
          showForecastView && "py-7 pb-10",
        )}
      >
        {showForecastView ? (
          <ForecastView
            currentSummary={currentSummary}
            forecastDays={forecastDays}
            forecastError={forecastError}
            forecastRangeLabel={forecastRangeLabel}
            isForecastLoading={isForecastLoading}
            onBack={resetSearch}
            selectedPlace={selectedPlace}
          />
        ) : (
          <SearchView
            isSearching={isSearching}
            inputId={inputId}
            listboxId={listboxId}
            onQueryChange={handleQueryChange}
            onSuggestionSelect={loadForecast}
            query={query}
            suggestions={suggestions}
          />
        )}
      </section>
    </main>
  );
}

export default App;
