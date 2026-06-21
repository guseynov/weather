import clsx from "clsx";
import WeatherIcon from "./WeatherIcon";
import { formatHourLabel } from "../lib/weather";

const toneClasses = {
  clear: "bg-[linear-gradient(180deg,rgba(202,232,255,0.44),rgba(255,255,255,0.18))]",
  cloud: "bg-[linear-gradient(180deg,rgba(222,230,242,0.54),rgba(255,255,255,0.16))]",
  mist: "bg-[linear-gradient(180deg,rgba(232,229,239,0.5),rgba(255,255,255,0.16))]",
  rain: "bg-[linear-gradient(180deg,rgba(194,224,255,0.56),rgba(255,255,255,0.16))]",
  snow: "bg-[linear-gradient(180deg,rgba(236,246,255,0.58),rgba(255,255,255,0.18))]",
  storm: "bg-[linear-gradient(180deg,rgba(210,215,255,0.48),rgba(255,255,255,0.16))]",
};

function ForecastCard({ day, index }) {
  const cardToneClass = toneClasses[day.weather.tone] || toneClasses.cloud;
  const todayVisible = index === 0;

  return (
    <article
      className={clsx(
        "relative overflow-hidden rounded-[28px] bg-[rgba(255,255,255,0.14)] p-[18px] shadow-[0_24px_70px_rgba(66,94,138,0.18),inset_0_1px_0_rgba(255,255,255,0.76),0_0_0_1px_rgba(255,255,255,0.36)] backdrop-blur-[24px] saturate-150",
        cardToneClass,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.38),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="m-0 font-['Sora'] text-[1.3rem] tracking-[-0.05em]">{day.label}</p>
            {todayVisible && (
              <span className="inline-flex min-h-6 items-center rounded-full bg-white/50 px-2 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#17304a]/70">
                Today
              </span>
            )}
          </div>
          <p className="m-0 mt-1 text-sm text-[#17304a]/60">{day.dateLabel}</p>
        </div>

        <div className="grid justify-items-end gap-2">
          <span className="h-10 w-10 text-[#315784]">
            <WeatherIcon tone={day.weather.tone} className="h-full w-full" />
          </span>
          <div className="inline-flex max-w-full items-center justify-center rounded-full bg-white/45 px-3 py-2 text-center text-sm font-bold leading-tight text-[#17304a]">
            {day.weather.label}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-3 border-b border-[#17304a]/10 py-4">
        <div>
          <span className="mb-1 block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#17304a]/55">
            High
          </span>
          <span className="block font-['Sora'] text-[2.25rem] tracking-[-0.08em]">{day.high}°</span>
        </div>
        <div className="text-right">
          <span className="mb-1 block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#17304a]/55">
            Low
          </span>
          <span className="block text-[1.22rem] text-[#17304a]/70">{day.low}°</span>
        </div>
      </div>

      <div className="relative z-10 grid gap-2 pt-4">
        {day.entries.map((entry) => (
          <div
            key={`${day.key}-${entry.hour}`}
            className="flex items-center justify-between gap-3 rounded-2xl bg-white/35 px-3 py-2"
          >
            <span className="text-sm text-[#17304a]/70">{formatHourLabel(entry.hour)}</span>
            <span className="font-bold text-[#17304a]">{entry.temperature}°</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ForecastCard;
