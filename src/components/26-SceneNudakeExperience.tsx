"use client";

/**
 * 23장 — Proposed Experience
 *
 * 상품 선택 → 옵션 → 결제가 아니라, 누구에게 어떤 경험을 보낼 것인가로
 * 흐릅니다. 여섯 걸음 중 Add Message 만 손으로 만져 볼 수 있습니다 —
 * 매장에서 카드를 적어 넣던 행동을 그대로 옮긴 자리입니다.
 * 그리드 10번 변형 — 제목 1–4단 1행 · 걸음 띠 1–8단 2행 · 주인공 3–6단.
 */

import type { CSSProperties } from "react";

import { NudakeInsertCard } from "@/components/NudakeInsertCard";
import { useInView } from "@/components/useInView";

const PILL_H = 34;
const PANEL_W = 1380;
const PANEL_H = 54;
const LINE_OVERLAP = 2;

/* 앞장의 Discover · Experience · Gift 가 여기서 다섯 걸음이 됩니다. */
const BEATS = [
  { id: "landing", label: "Gift Landing", tone: "start" },
  { id: "choose", label: "Choose Tea" },
  { id: "compose", label: "Compose Gift" },
  { id: "message", label: "Add Message", tone: "mark" },
  { id: "send", label: "Send" },
];

/* 걸음 폭. 다섯이 판을 고르게 나눠 씁니다. */
const PILL_W = (PANEL_W - 4 * 14) / 5;
const STEP_X = PILL_W + 14;

const NOTES = [
  {
    index: "01",
    title: "Discover",
    body: "Gift 랜딩에서 무엇을 보낼 수 있는지 먼저 만납니다. 격자에 늘어놓은 상품몰이 아니라, 브랜드 비주얼을 쓴 편집 화면으로 엽니다.",
    place: "col-start-1 col-span-2 row-start-3 row-span-2",
  },
  {
    index: "02",
    title: "Experience",
    body: "향과 맛, 구성과 패키지를 함께 봅니다. 값과 사양보다 어떤 경험을 보내는지가 먼저 읽히도록 순서를 바꿉니다.",
    place: "col-start-1 col-span-2 row-start-5 row-span-2",
  },
  {
    index: "03",
    title: "Add Message",
    body: "고른 뒤 카드를 적어 패키지에 직접 넣습니다. 매장에서 선물을 포장해 건네던 행동을 화면으로 옮긴 자리라, 엽서는 장식이 아니라 준비를 마쳤다는 신호입니다.",
    place: "col-start-7 col-span-2 row-start-3 row-span-3",
  },
  {
    index: "04",
    title: "Send",
    body: "Send as a Gift ↗ 아래에 Continue with Kakao Gift. 밖으로 나간다는 사실을 감추지 않고 미리 알립니다.",
    place: "col-start-7 col-span-2 row-start-6",
  },
];

const px = (value: number) => `calc(${value} * var(--u))`;

export function SceneNudakeExperience() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1">
        Discover, Experience, Gift
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
              d={`M ${i * STEP_X + PILL_W - LINE_OVERLAP} ${PILL_H / 2} H ${(i + 1) * STEP_X + LINE_OVERLAP}`}
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
                width: px(PILL_W),
                height: px(PILL_H),
              } as CSSProperties
            }
          >
            {beat.label}
          </span>
        ))}
      </div>

      {/* 이 케이스에서 유일하게 손으로 만져 보는 자리 */}
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
