# Weather

A city-search weather app built with React, Vite, Tailwind CSS, TanStack Query, Floating UI, and the Temporal polyfill.

## What It Does

- Search for a city with live suggestions
- Select a location to load a five-day forecast
- View daily cards with high/low temperatures and hourly highlights
- Go back to search without losing the app flow

## Data Sources

- Open-Meteo geocoding API for city search
- Open-Meteo forecast API for weather data

No API key is required.

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 4
- TanStack Query
- Floating UI
- `@js-temporal/polyfill`
- `lucide-react`

## Scripts

- `npm run dev` starts the Vite dev server
- `npm run build` creates a production build
- `npm run preview` serves the production build locally

## Notes

- The app uses `latitude` and `longitude` to fetch forecasts.
- UI state is split across dedicated components under `src/components`.
- Time formatting uses Temporal instead of `Date`.
