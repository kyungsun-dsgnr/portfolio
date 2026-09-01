"use client";

/**
 * 19장 — 누데이크 지금의 선물 경험
 *
 * 13장 `Current User Flow` 와 같은 판을 씁니다. 다만 여기서 짚는 것은
 * "화면이 많다" 가 아니라, 건네는 행동이 주문 항목으로 줄어들었다는 것입니다.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 13장과 같은 눈금. 한 걸음이 한 단에 섭니다. */
const COL = 158.5;
const GAP = 16;
const STEP_X = COL + GAP;
const PILL_H = 38;
const TOP = 36;
/** 네 걸음이 네 단을 가로지릅니다. */
const PANEL_W = 4 * COL + 3 * GAP;
const PANEL_H = 110;
/** 선이 알약 테두리 아래로 살짝 들어가 틈을 없앱니다. */
const LINE_OVERLAP = 2;

/* 지금 nudake.com 에서 선물 하나를 사는 길입니다.
   메시지는 이 줄의 한 칸으로, 결제 바로 앞에 붙어 있습니다. */
const STEPS = [
  { id: "product", label: "Product" },
  { id: "options", label: "Options" },
  { id: "message", label: "Message", tone: "mark" },
  { id: "checkout", label: "Checkout", tone: "ghost" },
];

/* 짚는 것 셋. 불편이 아니라, 표현되지 못한 것을 적습니다. */
const POINTS = [
  {
    index: "01",
    title: "Message as a Form",
    body: "메시지가 구매 과정의 입력 항목으로 처리됩니다. 무엇을 적을지보다 어디에 적는지가 먼저 보입니다.",
    place: "col-start-1 col-span-2 row-start-4 row-span-2",
  },
  {
    index: "02",
    title: "No Physical Metaphor",
    body: "선물을 준비하고 건네는 실제 행동과 연결되지 않습니다. 적은 말이 어디에 담기는지 화면에 드러나지 않습니다.",
    place: "col-start-7 col-span-2 row-start-2 row-span-2",
  },
  {
    index: "03",
    title: "Experience Ends at Purchase",
    body: "구매자와 받는 사람 사이의 감정적 연결이 결제 단계에서 끊깁니다. 건네는 순간은 화면 밖에 남습니다.",
    place: "col-start-7 col-span-2 row-start-5 row-span-2",
  },
];

const px = (value: number) => `calc(${value} * var(--u))`;

export function SceneNudakeCurrent() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        Current Experience
      </h2>

      <div
        className="flow rise col-start-3 col-span-4 row-start-3"
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
          {STEPS.slice(1).map((step, i) => (
            <path
              key={step.id}
              d={`M ${i * STEP_X + COL - LINE_OVERLAP} ${TOP + PILL_H / 2} H ${(i + 1) * STEP_X + LINE_OVERLAP}`}
            />
          ))}
        </svg>

        {STEPS.map((step, i) => (
          <span
            key={step.id}
            className="flow-pill"
            data-tone={step.tone ?? "plain"}
            style={
              {
                left: px(i * STEP_X),
                top: px(TOP),
                width: px(COL),
                height: px(PILL_H),
              } as CSSProperties
            }
          >
            {step.label}
          </span>
        ))}
      </div>

      {POINTS.map((point, i) => (
        <div
          key={point.index}
          className={`issue rise ${point.place}`}
          style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{point.index}</span>
          <h3 className="type-title">{point.title}</h3>
          <p className="type-body">{point.body}</p>
        </div>
      ))}

      {/* 문제를 어떻게 정의했는지. 이 한 문장이 케이스 전체의 전제입니다. */}
      <p
        className="type-body rise col-start-3 col-span-4 row-start-5"
        style={{ "--delay": "0.44s" } as CSSProperties}
      >
        선물이라는 행위가 가진 감정적 경험이,
        <br />
        디지털 구매 구조 안에서는 충분히 표현되지 않습니다.
      </p>
    </div>
  );
}
