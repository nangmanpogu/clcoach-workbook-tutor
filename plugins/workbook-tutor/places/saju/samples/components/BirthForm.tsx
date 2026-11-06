"use client";

import { useState, type FormEvent } from "react";
import type { BirthInput } from "../lib/saju";

export type FormValues = {
  calendar: "solar" | "lunar";
  date: string; // YYYY-MM-DD
  leap: boolean;
  time: string; // HH:MM
  unknownTime: boolean;
};

type Props = {
  values: FormValues;
  onChange: (v: FormValues) => void;
  // 계산하다 막히면 날짜 칸에 보일 문장을 돌려준다
  onSubmit: (input: BirthInput) => string | null;
};

export default function BirthForm({ values, onChange, onSubmit }: Props) {
  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);
  const set = (patch: Partial<FormValues>) => onChange({ ...values, ...patch });

  function submit(e: FormEvent) {
    e.preventDefault();
    const dErr = values.date ? null : "생년월일을 골라 주세요";
    const tErr =
      values.time || values.unknownTime
        ? null
        : "시각을 고르거나, 모르면 아래를 눌러 주세요";
    setDateError(dErr);
    setTimeError(tErr);
    if (dErr || tErr) return;
    const [year, month, day] = values.date.split("-").map(Number);
    const [hour, minute] = values.time.split(":").map(Number);
    const err = onSubmit({
      calendar: values.calendar,
      year,
      month,
      day,
      leapMonth: values.calendar === "lunar" && values.leap,
      time: values.unknownTime ? null : { hour, minute },
    });
    setDateError(err);
  }

  return (
    <form className="page paper" onSubmit={submit} noValidate>
      <header className="brand" style={{ marginTop: 44 }}>
        사주풀이
      </header>
      <main className="form">
        <h1 className="headline">
          언제 태어났는지
          <br />
          알려 주세요
        </h1>

        <fieldset className="field">
          <legend className="field-label" style={{ marginBottom: 10 }}>
            생년월일
          </legend>
          <div className="segment" role="group" aria-label="달력">
            <button
              type="button"
              aria-pressed={values.calendar === "solar"}
              onClick={() => set({ calendar: "solar" })}
            >
              양력
            </button>
            <button
              type="button"
              aria-pressed={values.calendar === "lunar"}
              onClick={() => set({ calendar: "lunar" })}
            >
              음력
            </button>
          </div>
          <input
            className="input"
            type="date"
            aria-label="생년월일"
            min="1900-01-01"
            max="2100-12-31"
            value={values.date}
            aria-invalid={dateError ? true : undefined}
            onChange={(e) => {
              set({ date: e.target.value });
              setDateError(null);
            }}
          />
          {dateError && <p className="error">{dateError}</p>}
          {values.calendar === "lunar" && (
            <label className="check">
              <input
                type="checkbox"
                checked={values.leap}
                onChange={(e) => set({ leap: e.target.checked })}
              />
              윤달이에요
            </label>
          )}
        </fieldset>

        <fieldset className="field">
          <legend className="field-label" style={{ marginBottom: 10 }}>
            태어난 시각
          </legend>
          <input
            className="input"
            type="time"
            aria-label="태어난 시각"
            value={values.time}
            disabled={values.unknownTime}
            aria-invalid={timeError ? true : undefined}
            onChange={(e) => {
              set({ time: e.target.value });
              setTimeError(null);
            }}
          />
          {timeError && <p className="error">{timeError}</p>}
          <label className="check">
            <input
              type="checkbox"
              checked={values.unknownTime}
              onChange={(e) => {
                set({ unknownTime: e.target.checked });
                setTimeError(null);
              }}
            />
            시각을 몰라요
          </label>
        </fieldset>
      </main>
      <footer className="cta">
        <button className="btn-primary" type="submit">
          사주 보기
        </button>
      </footer>
    </form>
  );
}
