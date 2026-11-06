"use client";

import { useEffect } from "react";
import { GOD_GROUPS } from "../lib/readings";

export default function GodsSheet({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="sheet-dim" onClick={onClose}>
      <section
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gods-title"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="grabber" />
        <div className="sheet-head">
          <h2 id="gods-title">십성이 뭐예요?</h2>
          <button
            className="icon-btn"
            type="button"
            aria-label="닫기"
            onClick={onClose}
            style={{ marginRight: -10 }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4E5968"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <p>
          나(일간)와 다른 글자가 어떤 사이인지 부르는 이름이에요. 같은 사이를
          둘로 나눠 열 가지가 돼요.
        </p>
        <dl className="gods">
          {GOD_GROUPS.map((g) => (
            <div key={g.name}>
              <dt>{g.name}</dt>
              <dd>{g.text}</dd>
            </div>
          ))}
        </dl>
        <button className="btn-primary" type="button" onClick={onClose}>
          확인
        </button>
      </section>
    </div>
  );
}
