"use client";

/**
 * 24장 — Receiver Experience
 *
 * 건넨다는 행동은 상대가 있어야 완성되므로, 받는 쪽 화면까지 보여 줍니다.
 * 패키지 → 카드 → 메시지 순서로 하나씩 드러납니다.
 */

import { useEffect, useState, type CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 받는 사람이 지나는 세 박자. 순서대로 하나씩 열립니다. */
const BEATS = [
  {
    index: "01",
    title: "Package",
    body: "선물이 먼저 도착합니다. 무엇이 들었는지는 아직 보이지 않습니다.",
  },
  {
    index: "02",
    title: "Card",
    body: "제품보다 카드가 먼저 나옵니다. 보낸 사람이 고른 종이가 먼저 손에 닿습니다.",
  },
  {
    index: "03",
    title: "Message",
    body: "카드를 열어 말을 읽습니다. 이 자리에서 선물이 완성됩니다.",
  },
];

/** 한 박자가 머무는 시간 */
const HOLD = 2000;

export function SceneNudakeReceive() {
  const [ref, inView] = useInView<HTMLDivElement>(0.45);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!inView) {
      const back = window.setTimeout(() => setBeat(0), 0);
      return () => clearTimeout(back);
    }

    const timers = BEATS.map((_, i) =>
      window.setTimeout(() => setBeat(i), 700 + i * HOLD),
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        Receiver Experience
      </h2>

      <p
        className="type-body rise col-start-5 col-span-3 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        보내는 화면만으로는 &lsquo;건넸다&rsquo;가 성립하지 않습니다. 받는 쪽에서
        카드가 먼저 나와야, 메시지가 주문 항목이 아니라 선물의 일부로 읽힙니다.
      </p>

      {/* 세 박자가 한 자리에서 겹쳐 열립니다. */}
      <div
        className="nud-receive rise col-start-3 col-span-4 row-start-3 row-span-3"
        data-beat={beat}
      >
        <div className="nud-recv-pack">
          <span className="nud-recv-lid" aria-hidden />
          <span className="nud-recv-body" aria-hidden>
            NUDAKE
          </span>

          <div className="nud-recv-card">
            <em>NUDAKE</em>
            <b>좋은 날에 함께 있어 줘서 고마워요.</b>
            <span>28 June 2026</span>
          </div>
        </div>

        {/* 지금 어느 박자인지. 눌러서 그 박자로 갈 수도 있습니다. */}
        <div className="nud-recv-dots">
          {BEATS.map((one, i) => (
            <button
              key={one.index}
              type="button"
              className="nud-recv-dot"
              data-on={beat === i || undefined}
              aria-label={one.title}
              onClick={() => setBeat(i)}
            >
              {one.index}
            </button>
          ))}
        </div>
      </div>

      {BEATS.map((one, i) => (
        <div
          key={one.index}
          className={`issue rise ${
            i === 0
              ? "col-start-1 col-span-2 row-start-4 row-span-2"
              : i === 1
                ? "col-start-7 col-span-2 row-start-3 row-span-2"
                : "col-start-7 col-span-2 row-start-5 row-span-2"
          }`}
          data-dim={beat !== i || undefined}
          style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{one.index}</span>
          <h3 className="type-title">{one.title}</h3>
          <p className="type-body">{one.body}</p>
        </div>
      ))}
    </div>
  );
}
