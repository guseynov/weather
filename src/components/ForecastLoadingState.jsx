import ForecastCardSkeleton from "./ForecastCardSkeleton";

const LOADING_CARD_KEYS = Array.from({ length: 5 }, (_, index) => `loading-${index}`);

function ForecastLoadingState() {
  return (
    <>
      {LOADING_CARD_KEYS.map((cardKey) => (
        <ForecastCardSkeleton key={cardKey} />
      ))}
    </>
  );
}

export default ForecastLoadingState;
