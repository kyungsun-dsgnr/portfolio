"use client";

/**
 * 25장 — From Choosing a Product to Sending an Experience
 *
 * 06장에서 정한 Discover · Experience · Send 가 여기서 걸음 넷이 됩니다.
 * 그중 Personalize 를 판 한가운데에 크게 두어, 이 케이스에서 유일하게
 * 손으로 만져 보는 장면으로 만듭니다.
 * 그리드 10번 변형 — 제목 1–3단 1행 · 걸음 띠 1–8단 2행 · 주인공 3–6단.
 */

import type { CSSProperties } from "react";

import { NudakeInsertCard } from "@/components/NudakeInsertCard";
import { useInView } from "@/components/useInView";

const COL = 158.5;
const PILL_H = 38;
const PANEL_W = 1380;
const PANEL_H = 60;
const STEP_X = (PANEL_W - COL) / 3;
const LINE_OVERLAP = 2;

const BEATS = [
  { id: "discover", label: "Discover", tone: "start" },
  { id: "choose", label: "Choose" },
  { id: "personal", label: "Personalize", tone: "mark" },
  { id: "send", label: "Send" },
];

/* 걸음마다 무엇이 달라지는지. 자리는 목업을 사이에 두고 좌우로 갈립니다. */
const NOTES = [
  {
    index: "01",
    title: "Discover",
    body: "메인과 내비게이션에서 선물을 만납니다. Gift Shop 단추 하나보다, 브랜드 비주얼을 쓴 에디토리얼 진입이 누데이크답습니다.",
    place: "col-start-1 col-span-2 row-start-3 row-span-2",
  },
  {
    index: "02",
    title: "Choose",
    body: "격자에 늘어놓은 상품몰 대신 제품 비주얼과 티의 무드, 패키지, 짧은 이야기로 고릅니다. 값과 사양보다 어떤 경험을 선물하는지가 먼저입니다.",
    place: "col-start-1 col-span-2 row-start-5 row-span-2",
  },
  {
    index: "03",
    title: "Personalize",
    body: "For you · A small note · From Nudake. 실제 선물에 함께 건네는 메시지의 행동 기억을 디지털 인터랙션으로 넓혔습니다. 그래서 엽서는 장식이 아니라 선물 여정의 일부입니다.",
    place: "col-start-7 col-span-2 row-start-3 row-span-2",
  },
  {
    index: "04",
    title: "Send",
    body: "Send as a Gift ↗ 아래에 Continue with Kakao Gift. 아이콘만 두지 않고, 다음 행동과 밖으로 나간다는 사실을 함께 알립니다.",
    place: "col-start-7 col-span-2 row-start-5 row-span-2",
  },
];

const px = (value: number) => `calc(${value} * var(--u))`;

export function SceneNudakeGift() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1">
        From Choosing a Product to Sending an Experience
      </h2>

      <div
        className="flow rise col-start-1 col-span-8 row-start-2"
        style={
          {
            "--delay": "0.1s",
            width: px(PANEL_W),
            height: px(PANEL_H),
          } as CSSProperties
        }
      >
        <svg
          className="flow-lines"
          viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
          aria-hidden
        >
          {BEATS.slice(1).map((beat, i) => (
            <path
              key={beat.id}
              d={`M ${i * STEP_X + COL - LINE_OVERLAP} ${PILL_H / 2} H ${(i + 1) * STEP_X + LINE_OVERLAP}`}
            />
          ))}
        </svg>

        {BEATS.map((beat, i) => (
          <span
            key={beat.id}
            className="flow-pill"
            data-tone={beat.tone ?? "plain"}
            style={
              {
                left: px(i * STEP_X),
                top: 0,
                width: px(COL),
                height: px(PILL_H),
              } as CSSProperties
            }
          >
            {beat.label}
          </span>
        ))}
      </div>

      {/* 걸음 셋째 — 이 케이스의 시그니처 */}
      <div className="nud-gift-stage rise col-start-3 col-span-4 row-start-3 row-span-4">
        <NudakeInsertCard live={inView} />
      </div>

      {NOTES.map((note, i) => (
        <div
          key={note.index}
          className={`issue rise ${note.place}`}
          style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{note.index}</span>
          <h3 className="type-title">{note.title}</h3>
          <p className="type-body">{note.body}</p>
        </div>
      ))}
    </div>
  );
}
