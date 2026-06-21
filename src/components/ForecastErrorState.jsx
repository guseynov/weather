function ForecastErrorState() {
  return (
    <div className="md:col-span-3 xl:col-span-5 grid min-h-[260px] place-items-center gap-3 rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.18))] p-6 text-center shadow-[0_24px_70px_rgba(66,94,138,0.18),inset_0_1px_0_rgba(255,255,255,0.76),0_0_0_1px_rgba(255,255,255,0.36)] backdrop-blur-[24px] saturate-150">
      <p className="m-0 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-[#356ecb]">
        Forecast unavailable
      </p>
      <p className="m-0 font-['Sora'] text-[1.85rem] tracking-[-0.05em]">
        The weather could not be loaded right now.
      </p>
      <p className="m-0 max-w-[28rem] text-sm leading-6 text-[#17304a]/70">
        Go back and try another search in a moment.
      </p>
    </div>
  );
}

export default ForecastErrorState;
