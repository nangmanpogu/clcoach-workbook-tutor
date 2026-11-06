"use client";

import { useState } from "react";
import {
  ELEMENTS,
  yearFlow,
  type BirthInput,
  type Char,
  type Pillar,
  type Saju,
} from "../lib/saju";
import {
  ELEMENT_HANJA,
  ELEMENT_NAME,
  FILL,
  YEAR_TEXT,
  elementState,
  elementTitle,
  reading,
} from "../lib/readings";
import GodsSheet from "./GodsSheet";

type Props = { input: BirthInput; saju: Saju; onBack: () => void };

const ICONS = {
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6",
  coin: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 9h6M9 13h6M12 9v8",
  chat: "M4 5h16v11H9l-5 4zM8 10h8",
};

function birthLabel(input: BirthInput) {
  const cal =
    input.calendar === "solar"
      ? "양력"
      : input.leapMonth
        ? "음력(윤달)"
        : "음력";
  const time = input.time
    ? `${input.time.hour < 12 ? "오전" : "오후"} ${((input.time.hour + 11) % 12) + 1}:${String(input.time.minute).padStart(2, "0")}`
    : "시각 모름";
  return `${cal} ${input.year}.${input.month}.${input.day} ${time}`;
}

function Tile({ c, me }: { c: Char; me?: boolean }) {
  return (
    <div className={`tile el-${c.element}${me ? " me" : ""}`}>
      <span className="hanja serif">{c.hanja}</span>
      <span className="read">
        {c.element} · {c.ko}
      </span>
    </div>
  );
}

function PillarColumn({
  head,
  p,
  me,
}: {
  head: string;
  p: Pillar | null;
  me?: boolean;
}) {
  if (!p) {
    return (
      <div className="pillar">
        <span className="pillar-head">{head}</span>
        <span className="god">&nbsp;</span>
        <div className="tile unknown">모름</div>
        <div className="tile unknown">모름</div>
        <span className="god">&nbsp;</span>
      </div>
    );
  }
  return (
    <div className="pillar">
      <span className="pillar-head">{head}</span>
      <span className={`god${me ? " me" : ""}`}>{p.stem.god}</span>
      <Tile c={p.stem} me={me} />
      <Tile c={p.branch} />
      <span className="god">{p.branch.god}</span>
    </div>
  );
}

export default function Result({ input, saju, onBack }: Props) {
  const [sheet, setSheet] = useState(false);
  const text = reading(saju);
  const now = new Date().getFullYear();
  const years = [
    yearFlow(now, saju.dayMaster.index),
    yearFlow(now + 1, saju.dayMaster.index),
  ];
  const missing = ELEMENTS.filter((e) => saju.elementCounts[e] === 0);
  const readings = [
    {
      title: "타고난 성격",
      text: text.personality,
      bg: "#FFE4DE",
      ic: "#D23B30",
      icon: ICONS.person,
    },
    {
      title: "일과 돈",
      text: text.work,
      bg: "#FFF2C2",
      ic: "#B7791F",
      icon: ICONS.coin,
    },
    {
      title: "사람 관계",
      text: text.people,
      bg: "#DDF3E6",
      ic: "#1F8A55",
      icon: ICONS.chat,
    },
  ];

  return (
    <div className="page paper">
      <section className="bg-red hero">
        <div className="hero-bar" style={{ marginTop: 44 }}>
          <button
            className="icon-btn"
            type="button"
            aria-label="다시 입력"
            onClick={onBack}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <span className="hero-date">{birthLabel(input)}</span>
          <span style={{ width: 44 }} />
        </div>
        <div className="hero-body">
          <div className="seal" aria-hidden="true">
            <div className="seal-inner serif">
              <span>{saju.ilju.hanja[0]}</span>
              <span>{saju.ilju.hanja[1]}</span>
            </div>
          </div>
          <span className="ilju">
            {saju.ilju.name} · {saju.ilju.animal}
          </span>
          <h1 className="hero-title">{text.title}</h1>
          <ul className="tags">
            {text.keywords.map((k) => (
              <li key={k}># {k}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="chart bg-navy" aria-label="사주 여덟 글자">
        <h2 className="section-title">
          {saju.hour ? "사주 여덟 글자" : "사주 여섯 글자"}
        </h2>
        <div className="pillars">
          <PillarColumn head="시" p={saju.hour} />
          <PillarColumn head="일" p={saju.day} me />
          <PillarColumn head="월" p={saju.month} />
          <PillarColumn head="년" p={saju.year} />
        </div>
        <button
          className="link-pill"
          type="button"
          onClick={() => setSheet(true)}
        >
          비견·겁재가 무슨 뜻이에요?
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E5E9F2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </section>

      <section className="card" aria-label="오행">
        <h2 className="section-title">{elementTitle(saju)}</h2>
        <div className="elements">
          {ELEMENTS.map((e) => {
            const n = saju.elementCounts[e];
            const size = n === 0 ? 36 : 36 + n * 7;
            return (
              <div
                key={e}
                className="element"
                style={{ height: 64, justifyContent: "flex-end" }}
              >
                <span
                  className={`dot serif ${n === 0 ? "none" : `el-${e}`}`}
                  style={{
                    width: size,
                    height: size,
                    fontSize: n === 0 ? 16 : 16 + n * 3,
                  }}
                >
                  {ELEMENT_HANJA[e]}
                </span>
              </div>
            );
          })}
          {ELEMENTS.map((e) => {
            const n = saju.elementCounts[e];
            const state = elementState(n, saju.total);
            return (
              <div key={`${e}-label`} className="element" style={{ gap: 2 }}>
                <span className="element-name">{ELEMENT_NAME[e]}</span>
                <span
                  className={`element-state${state === "알맞음" ? " ok" : ""}`}
                >
                  {Math.round((n / saju.total) * 1000) / 10}%
                  <br />
                  {state}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="readings" aria-label="풀이">
        {readings.map((r) => (
          <article
            key={r.title}
            className="reading"
            style={{ background: r.bg }}
          >
            <div className="reading-head">
              <span className="reading-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={r.ic}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={r.icon} />
                </svg>
              </span>
              <h2 className="section-title">{r.title}</h2>
            </div>
            <p>{r.text}</p>
          </article>
        ))}
      </section>

      <section className="band" aria-label="올해와 내년">
        <h2 className="band-title">올해와 내년엔 이런 흐름이에요</h2>
        {years.map((y) => (
          <div key={y.year} className="row-card">
            <div className="mini-tiles">
              <span className={`serif el-${y.stem.element}`}>
                {y.stem.hanja}
              </span>
              <span className={`serif el-${y.branch.element}`}>
                {y.branch.hanja}
              </span>
            </div>
            <div className="row-text">
              <strong>
                {y.year}년 {y.name}
              </strong>
              <span>{YEAR_TEXT[y.god]}</span>
            </div>
          </div>
        ))}
      </section>

      {missing.length > 0 && (
        <section className="fill" aria-label="없는 기운 채우기">
          <h2 className="band-title">없는 기운은 이렇게 채워요</h2>
          {missing.map((e) => (
            <div key={e} className="row-card small">
              <span className={`round serif el-${e}`}>{ELEMENT_HANJA[e]}</span>
              <div className="row-text">
                <strong>{ELEMENT_NAME[e]} 기운</strong>
                <span>{FILL[e]}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      <footer className="end">
        <button className="btn-primary" type="button" onClick={onBack}>
          다른 사주 보기
        </button>
      </footer>

      {sheet && <GodsSheet onClose={() => setSheet(false)} />}
    </div>
  );
}
