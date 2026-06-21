import clsx from "clsx";
import { ArrowRight, ChevronLeft } from "lucide-react";

const ICONS = {
  back: ChevronLeft,
  selected: ArrowRight,
};

function ActionIcon({ kind, className }) {
  const Icon = ICONS[kind] || ArrowRight;

  return <Icon aria-hidden="true" className={clsx("shrink-0", className)} strokeWidth={2} />;
}

export default ActionIcon;
