import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react";
import { LoaderCircle } from "lucide-react";
import ActionIcon from "./ActionIcon";
import { splitLocationLabel } from "../lib/weather";

function SearchView({
  isSearching,
  inputId,
  listboxId,
  onQueryChange,
  onSuggestionSelect,
  query,
  suggestions,
}) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const showSuggestions =
    isInputFocused && query.trim().length >= 2 && suggestions.length > 0;

  const { refs, floatingStyles } = useFloating({
    open: showSuggestions,
    placement: "bottom-start",
    strategy: "fixed",
    middleware: [
      offset(14),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          elements.floating.style.width = `${rects.reference.width}px`;
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const activeDescendantId =
    showSuggestions && activeSuggestionIndex >= 0
      ? `${listboxId}-option-${activeSuggestionIndex}`
      : undefined;

  useEffect(() => {
    if (!showSuggestions) {
      setActiveSuggestionIndex(-1);
      return;
    }

    setActiveSuggestionIndex((currentIndex) =>
      currentIndex >= 0 && currentIndex < suggestions.length ? currentIndex : 0,
    );
  }, [showSuggestions, suggestions]);

  const handleQueryChange = (event) => {
    onQueryChange(event.target.value);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleInputKeyDown = (event) => {
    if (!showSuggestions) {
      if (event.key === "Escape") {
        setActiveSuggestionIndex(-1);
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestionIndex((currentIndex) =>
        currentIndex >= suggestions.length - 1 ? 0 : currentIndex + 1,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((currentIndex) =>
        currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1,
      );
    }

    if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      onSuggestionSelect(suggestions[activeSuggestionIndex]);
    }

    if (event.key === "Escape") {
      setActiveSuggestionIndex(-1);
    }
  };

  const handleSuggestionHover = (event) => {
    const index = Number(event.currentTarget.dataset.index);
    setActiveSuggestionIndex(index);
  };

  const handleSuggestionSelect = (event) => {
    const index = Number(event.currentTarget.dataset.index);
    onSuggestionSelect(suggestions[index]);
  };

  const handleSuggestionMouseDown = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-8 text-center sm:px-6">
      <div className="relative w-full max-w-[760px]">
        <div className="grid gap-3">
          <div className="relative">
            <input
              ref={refs.setReference}
              autoFocus
              id={inputId}
              className="h-[108px] w-full rounded-[calc(999px-8px)] bg-[linear-gradient(180deg,rgba(255,255,255,0.54),rgba(255,255,255,0.22))] px-9 text-center text-[clamp(1.6rem,4vw,2.35rem)] font-semibold tracking-[-0.05em] text-[#17304a] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-18px_28px_rgba(175,205,255,0.14),0_18px_40px_rgba(108,131,171,0.16),0_0_0_1px_rgba(255,255,255,0.52)] backdrop-blur-[30px] transition duration-200 ease-out placeholder:text-[#17304a]/40 focus:-translate-y-px focus:outline-none focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-18px_28px_rgba(175,205,255,0.2),0_24px_52px_rgba(108,131,171,0.2),0_0_0_6px_rgba(255,255,255,0.22),0_0_0_1px_rgba(255,255,255,0.66)]"
              type="text"
              value={query}
              placeholder="Start typing a city"
              autoComplete="off"
              spellCheck="false"
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-expanded={showSuggestions}
              aria-activedescendant={activeDescendantId}
              onChange={handleQueryChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
            />

            {isSearching && (
              <span className="pointer-events-none absolute right-6 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full text-[#3f6da6]">
                <LoaderCircle
                  aria-hidden="true"
                  className="h-10 w-10 animate-spin"
                  strokeWidth={2.2}
                />
              </span>
            )}
          </div>
        </div>

        <FloatingPortal>
          {showSuggestions && (
            <ul
              ref={refs.setFloating}
              id={listboxId}
              style={floatingStyles}
              className="search-scrollbar z-50 grid max-h-[min(44vh,24rem)] gap-2 overflow-y-auto rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0.32))] p-3 shadow-[0_24px_70px_rgba(71,96,140,0.22),inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_1px_rgba(255,255,255,0.42)] backdrop-blur-[28px] saturate-150"
              role="listbox"
              aria-label="City suggestions"
            >
              {suggestions.map((suggestion, index) => {
                const { title, subtitle } = splitLocationLabel(
                  suggestion.label,
                );
                const isActive = index === activeSuggestionIndex;

                return (
                  <li key={suggestion.id} role="presentation">
                    <button
                      data-index={index}
                      id={`${listboxId}-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      className={clsx(
                        "group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl border border-white/30 bg-white/20 px-4 py-3 text-left text-[#17304a] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition duration-150 ease-out hover:-translate-y-px hover:border-white/55 hover:bg-white/40 hover:shadow-[0_14px_28px_rgba(100,120,160,0.14),inset_0_1px_0_rgba(255,255,255,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4d8dff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                        isActive &&
                          "border-[#4d8dff]/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(230,239,255,0.76))] shadow-[0_18px_34px_rgba(77,141,255,0.14),inset_0_1px_0_rgba(255,255,255,0.92)] ring-1 ring-[#4d8dff]/20",
                      )}
                      onMouseDown={handleSuggestionMouseDown}
                      onMouseEnter={handleSuggestionHover}
                      onClick={handleSuggestionSelect}
                    >
                      <span className="grid min-w-0 gap-1">
                        <span className="truncate text-base font-bold">
                          {title}
                        </span>
                        <span className="truncate text-sm text-[#17304a]/60">
                          {subtitle}
                        </span>
                      </span>
                      {isActive && (
                        <span
                          className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full bg-[#d7e6ff] text-[#1f4f87] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_24px_rgba(53,109,255,0.18)]"
                          aria-hidden="true"
                        >
                          <ActionIcon kind="selected" className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </FloatingPortal>
      </div>
    </div>
  );
}

export default SearchView;
