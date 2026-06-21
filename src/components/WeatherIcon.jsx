import clsx from "clsx";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudSnow,
  Sun,
} from "lucide-react";

const ICONS_BY_TONE = {
  clear: Sun,
  cloud: Cloud,
  mist: CloudFog,
  rain: CloudDrizzle,
  snow: CloudSnow,
  storm: CloudLightning,
};

function WeatherIcon({ tone, className }) {
  const Icon = ICONS_BY_TONE[tone] || Cloud;

  return <Icon aria-hidden="true" className={clsx("h-full w-full", className)} strokeWidth={1.8} />;
}

export default WeatherIcon;
