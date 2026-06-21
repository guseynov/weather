import { Temporal } from "@js-temporal/polyfill";

export const SEARCH_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";
export const FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
export const MAX_SUGGESTIONS = 6;
export const HOUR_SLOTS = [6, 9, 12, 15, 18, 21];

const WEATHER_STYLES = {
  0: { label: "Clear", tone: "clear" },
  1: { label: "Mostly clear", tone: "clear" },
  2: { label: "Partly cloudy", tone: "cloud" },
  3: { label: "Overcast", tone: "cloud" },
  45: { label: "Fog", tone: "mist" },
  48: { label: "Rime fog", tone: "mist" },
  51: { label: "Light drizzle", tone: "rain" },
  53: { label: "Drizzle", tone: "rain" },
  55: { label: "Heavy drizzle", tone: "rain" },
  56: { label: "Freezing drizzle", tone: "rain" },
  57: { label: "Heavy freezing drizzle", tone: "rain" },
  61: { label: "Light rain", tone: "rain" },
  63: { label: "Rain", tone: "rain" },
  65: { label: "Heavy rain", tone: "rain" },
  66: { label: "Freezing rain", tone: "rain" },
  67: { label: "Heavy freezing rain", tone: "rain" },
  71: { label: "Light snow", tone: "snow" },
  73: { label: "Snow", tone: "snow" },
  75: { label: "Heavy snow", tone: "snow" },
  77: { label: "Snow grains", tone: "snow" },
  80: { label: "Rain showers", tone: "rain" },
  81: { label: "Heavy showers", tone: "rain" },
  82: { label: "Violent showers", tone: "storm" },
  85: { label: "Snow showers", tone: "snow" },
  86: { label: "Heavy snow showers", tone: "snow" },
  95: { label: "Thunderstorm", tone: "storm" },
  96: { label: "Storm with hail", tone: "storm" },
  99: { label: "Severe storm", tone: "storm" },
};

const FORECAST_DAYS_LIMIT = 5;
const MIDDAY_HOUR = 12;

export const formatLocationLabel = (place) => {
  const parts = [place.name, place.admin1, place.country].filter(Boolean);
  return parts.join(", ");
};

export const splitLocationLabel = (label) => {
  const [title, ...rest] = label.split(",");
  const subtitle = rest.join(",").trim();

  return {
    title,
    subtitle: subtitle || "Load forecast",
  };
};

export const formatHourLabel = (hour) =>
  Temporal.PlainTime.from({
    hour,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0,
  }).toLocaleString(undefined, {
    hour: "numeric",
  });

export const formatDateLabel = (dateString, options) =>
  Temporal.PlainDate.from(dateString.slice(0, 10)).toLocaleString(undefined, options);

export const getForecastRangeLabel = (forecastDays) => {
  if (forecastDays.length === 0) {
    return "";
  }

  const firstDay = forecastDays[0].key;
  const lastDay = forecastDays[forecastDays.length - 1].key;
  const firstLabel = formatDateLabel(`${firstDay}T12:00:00`, {
    month: "short",
    day: "numeric",
  });
  const lastLabel = formatDateLabel(`${lastDay}T12:00:00`, {
    month: "short",
    day: "numeric",
  });

  return `${firstLabel} - ${lastLabel}`;
};

export const getForecastSummary = (forecastDays) => {
  if (forecastDays.length === 0) {
    return "";
  }

  const today = forecastDays[0];
  return `${today.weather.label} today, with temperatures between ${today.low}° and ${today.high}°.`;
};

const getWeatherStyle = (code) => WEATHER_STYLES[code] || { label: "Mixed weather", tone: "cloud" };

const createHourlyEntry = (hourly, index) => {
  const timestamp = Temporal.PlainDateTime.from(hourly.time[index]);

  return {
    dayKey: timestamp.toPlainDate().toString(),
    hour: timestamp.hour,
    temperature: Math.round(hourly.temperature_2m[index]),
    code: hourly.weather_code[index],
  };
};

const groupHourlyEntriesByDay = (hourly) => {
  const groupedDays = new Map();

  hourly.time.forEach((_, index) => {
    const entry = createHourlyEntry(hourly, index);

    if (!groupedDays.has(entry.dayKey)) {
      groupedDays.set(entry.dayKey, []);
    }

    groupedDays.get(entry.dayKey).push(entry);
  });

  return groupedDays;
};

const getHighlightEntries = (entries) =>
  HOUR_SLOTS.map((slot) => entries.find((entry) => entry.hour === slot)).filter(Boolean);

const getRepresentativeEntry = (entries) =>
  entries.find((entry) => entry.hour === MIDDAY_HOUR) || entries[0];

const createForecastDay = (dayKey, entries) => {
  const temperatures = entries.map((entry) => entry.temperature);
  const representativeEntry = getRepresentativeEntry(entries);
  const day = Temporal.PlainDate.from(dayKey);

  return {
    key: dayKey,
    label: day.toLocaleString(undefined, {
      weekday: "short",
    }),
    dateLabel: day.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
    }),
    high: Math.max(...temperatures),
    low: Math.min(...temperatures),
    weather: getWeatherStyle(representativeEntry.code),
    entries: getHighlightEntries(entries),
  };
};

export const buildForecastDays = (hourly) =>
  Array.from(groupHourlyEntriesByDay(hourly).entries())
    .slice(0, FORECAST_DAYS_LIMIT)
    .map(([dayKey, entries]) => createForecastDay(dayKey, entries));
