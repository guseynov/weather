import ForecastCard from "./ForecastCard";
import ActionIcon from "./ActionIcon";
import ForecastLoadingState from "./ForecastLoadingState";
import ForecastErrorState from "./ForecastErrorState";

function ForecastView({
  currentSummary,
  forecastDays,
  forecastError,
  forecastRangeLabel,
  isForecastLoading,
  onBack,
  selectedPlace,
}) {
  let timezoneLabel = "";
  let locationLabel = "Updating forecast";
  let statusLabel = currentSummary;

  if (selectedPlace?.timezone) {
    timezoneLabel = ` · ${selectedPlace.timezone}`;
  }

  if (selectedPlace) {
    locationLabel = selectedPlace.label;
  }

  if (isForecastLoading) {
    statusLabel = "Loading forecast...";
  } else if (forecastError) {
    statusLabel = forecastError;
  }

  return (
    <div className="grid gap-6">
      <header className="flex items-center gap-4 rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.18))] p-4 shadow-[0_24px_70px_rgba(66,94,138,0.18),inset_0_1px_0_rgba(255,255,255,0.76),0_0_0_1px_rgba(255,255,255,0.36)] backdrop-blur-[24px] saturate-150">
        <button
          type="button"
          className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-white/55 px-4 font-bold text-[#17304a] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_10px_24px_rgba(102,125,170,0.14)] transition duration-150 ease-out hover:-translate-y-px hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4d8dff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          onClick={onBack}
        >
          <ActionIcon kind="back" className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="grid gap-2">
          <p className="m-0 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#356ecb]">
            {forecastRangeLabel || "Five-day outlook"}
            {timezoneLabel}
          </p>
          <p className="m-0 font-['Sora'] text-[clamp(1.2rem,2.6vw,1.75rem)] tracking-[-0.04em]">
            {locationLabel}
          </p>
          <p className="m-0 text-sm leading-6 text-[#17304a]/70">
            {statusLabel}
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {isForecastLoading && <ForecastLoadingState />}

        {!isForecastLoading && forecastError && <ForecastErrorState />}

        {forecastDays.map((day, index) => (
          <ForecastCard key={day.key} day={day} index={index} />
        ))}
      </div>
    </div>
  );
}

export default ForecastView;
