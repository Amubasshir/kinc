"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const monthFormatter = new Intl.DateTimeFormat("en-AU", {
  month: "long",
  year: "numeric",
});

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateValue(value: string) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function sameDay(first: Date | null, second: Date) {
  return Boolean(
    first &&
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export default function ModernDatePicker({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const today = useMemo(() => {
    const current = new Date();
    return new Date(current.getFullYear(), current.getMonth(), current.getDate());
  }, []);
  const selectedDate = fromDateValue(value);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    () => selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: Array<Date | null> = Array.from({ length: firstWeekDay }, () => null);

    for (let day = 1; day <= daysInMonth; day += 1) days.push(new Date(year, month, day));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [visibleMonth]);

  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoBack = visibleMonth > currentMonth;
  const chooseDate = (date: Date) => {
    onChange(toDateValue(date));
    setOpen(false);
  };

  return (
    <div className="relative mt-[7px]" ref={rootRef}>
      <input name={name} type="hidden" value={value} readOnly style={{ display: "none" }} />
      <button
        className="flex h-[48px] w-full items-center justify-between rounded-full border-2 border-[#aaaab5] bg-white px-4 text-left text-[14px] font-normal text-[#4f4f58] normal-case outline-none transition hover:border-[#00b982] focus-visible:border-[#00b982] focus-visible:shadow-[0_0_0_3px_rgb(0_209_143/16%)]"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={value ? "text-[#34343c]" : "text-[#9696a1]"}>
          {selectedDate ? dateFormatter.format(selectedDate) : "Choose a completion date"}
        </span>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#eaffdf] text-[#087b59]" aria-hidden="true">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-30 mt-2 w-[min(360px,calc(100vw-40px))] rounded-[22px] border border-[#e5e5e8] bg-white p-4 normal-case shadow-[0_18px_45px_rgb(38_52_67/18%)]" role="dialog" aria-label="Choose a priority completion date">
          <div className="flex items-center justify-between px-1">
            <button
              className="grid h-9 w-9 place-items-center rounded-full border-0 bg-[#f3f3f4] text-xl text-[#555560] transition hover:bg-[#e7e7e9] disabled:cursor-not-allowed disabled:opacity-30"
              type="button"
              disabled={!canGoBack}
              aria-label="Previous month"
              onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
            >
              ‹
            </button>
            <strong className="text-[16px] font-semibold tracking-[-0.1px] text-[#34343c]">{monthFormatter.format(visibleMonth)}</strong>
            <button
              className="grid h-9 w-9 place-items-center rounded-full border-0 bg-[#f3f3f4] text-xl text-[#555560] transition hover:bg-[#e7e7e9]"
              type="button"
              aria-label="Next month"
              onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
            >
              ›
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
            {weekDays.map((day) => <span className="py-1 text-[11px] font-semibold uppercase text-[#9a9aa3]" key={day}>{day}</span>)}
            {calendarDays.map((date, index) => {
              if (!date) return <span aria-hidden="true" key={`empty-${index}`} />;
              const disabled = date < today;
              const selected = sameDay(selectedDate, date);
              const isToday = sameDay(today, date);

              return (
                <button
                  className={`aspect-square rounded-full border-0 text-[13px] transition ${selected ? "bg-[#00d18f] font-bold text-[#17382f] shadow-[0_4px_10px_rgb(0_209_143/28%)]" : isToday ? "bg-[#eaffdf] font-semibold text-[#087b59]" : "bg-transparent text-[#555560] hover:bg-[#f0f0f1]"} disabled:cursor-not-allowed disabled:text-[#c9c9cf] disabled:hover:bg-transparent`}
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  aria-label={dateFormatter.format(date)}
                  key={toDateValue(date)}
                  onClick={() => chooseDate(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#ededf0] pt-3">
            <button className="border-0 bg-transparent px-2 py-1 text-[12px] text-[#777781] underline-offset-2 hover:underline disabled:opacity-35" type="button" disabled={!value} onClick={() => onChange("")}>Clear</button>
            <button className="rounded-full border-0 bg-[#eaffdf] px-4 py-2 text-[12px] font-semibold text-[#087b59] transition hover:bg-[#d9ffd0]" type="button" onClick={() => chooseDate(today)}>Today</button>
          </div>
        </div>
      )}
    </div>
  );
}
