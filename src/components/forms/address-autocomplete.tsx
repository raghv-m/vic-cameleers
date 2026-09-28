"use client";

import { forwardRef, useEffect, useId, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "cn";

import {
  PlacesSession,
  placesAvailable,
  type PickedPlace,
  type PlaceMode,
  type Suggestion,
} from "@/lib/places";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

/**
 * A text input with Google Places suggestions (ARIA combobox). Picking one writes the formatted
 * address (or "Suburb VIC 3xxx" in suburb mode) into the input through a normal change event, so
 * react-hook-form register() and plain useState both work unchanged, then reports the place's
 * suburb, postcode and coordinates via onPlace.
 *
 * With no API key, or if Google fails to load, it's exactly the plain input it wraps, keeping its
 * `list` attribute, so the built-in suburb list still offers suggestions.
 */
export const AddressAutocomplete = forwardRef<
  HTMLInputElement,
  InputProps & { mode?: PlaceMode; onPlace?: (place: PickedPlace | null) => void }
>(function AddressAutocomplete({ mode = "address", onPlace, className, list, ...props }, ref) {
  const listboxId = useId();
  const innerRef = useRef<HTMLInputElement | null>(null);
  const session = useRef<PlacesSession | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const [googleWorks, setGoogleWorks] = useState(placesAvailable());
  const debounce = useRef(0);
  const open = suggestions.length > 0;

  useEffect(() => () => window.clearTimeout(debounce.current), []);

  function setRefs(el: HTMLInputElement | null) {
    innerRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  }

  function query(text: string) {
    window.clearTimeout(debounce.current);
    if (!googleWorks || text.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    debounce.current = window.setTimeout(async () => {
      session.current ??= new PlacesSession(mode);
      const result = await session.current.suggest(text);
      if (result === null) {
        setGoogleWorks(false); // fall back to the plain input for the rest of the visit
        setSuggestions([]);
        return;
      }
      setSuggestions(result);
      setActive(-1);
    }, 220);
  }

  async function choose(suggestion: Suggestion) {
    setSuggestions([]);
    const place = await session.current?.pick(suggestion);
    const input = innerRef.current;
    if (!input) return;
    const text =
      place && mode === "suburb" && place.suburb
        ? `${place.suburb} VIC${place.postcode ? ` ${place.postcode}` : ""}`
        : (place?.formattedAddress ?? `${suggestion.main}, ${suggestion.secondary}`);
    // Set the value the way a user would, so every kind of form state sees it.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, text);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    onPlace?.(place ?? null);
  }

  return (
    <div className="relative">
      <input
        {...props}
        ref={setRefs}
        list={googleWorks ? undefined : list}
        role={googleWorks ? "combobox" : undefined}
        aria-autocomplete={googleWorks ? "list" : undefined}
        aria-expanded={googleWorks ? open : undefined}
        aria-controls={googleWorks ? listboxId : undefined}
        aria-activedescendant={open && active >= 0 ? `${listboxId}-${active}` : undefined}
        autoComplete={googleWorks ? "off" : props.autoComplete}
        className={className}
        onChange={(event) => {
          props.onChange?.(event);
          if (event.nativeEvent.isTrusted) {
            onPlace?.(null); // typed by hand: any earlier pick no longer applies
            query(event.target.value);
          }
        }}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);
          if (!open) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((i) => (i + 1) % suggestions.length);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
          } else if (event.key === "Enter" && active >= 0) {
            event.preventDefault();
            void choose(suggestions[active]!);
          } else if (event.key === "Escape") {
            setSuggestions([]);
          }
        }}
        onBlur={(event) => {
          props.onBlur?.(event);
          window.setTimeout(() => setSuggestions([]), 150);
        }}
      />
      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className="border-navy-900 bg-sand-50 shadow-crate absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-sm border-2"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              id={`${listboxId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(event) => {
                event.preventDefault();
                void choose(s);
              }}
              className={cn(
                "flex cursor-pointer items-start gap-2 px-3 py-2.5 text-sm",
                i === active ? "bg-navy-900 text-sand-50" : "text-navy-900 hover:bg-sand-100",
              )}
            >
              <MapPin className="mt-0.5 size-4 shrink-0 opacity-70" aria-hidden="true" />
              <span>
                <span className="font-semibold">{s.main}</span>
                {s.secondary && <span className="block text-xs opacity-75">{s.secondary}</span>}
              </span>
            </li>
          ))}
          <li
            aria-hidden="true"
            className="text-muted-600 border-navy-900/15 border-t px-3 py-1 text-right text-[0.625rem]"
          >
            Powered by Google
          </li>
        </ul>
      )}
    </div>
  );
});
