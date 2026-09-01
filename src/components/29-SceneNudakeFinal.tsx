"use client";

/**
 * 26장 — Experience Nudake, Anywhere
 *
 * UI 를 더 설명하지 않고 결과만 한 장으로 정리합니다.
 * 표지에서 꺼낸 말을 여기서 다시 불러 케이스를 닫습니다.
 * 그리드 11번 — 큰 문장 1–7단 1–3행 · 본문 두 단락 5–6행.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

const COL = 158.5;
const PILL_H = 38;
const PANEL_W = 1380;
const PANEL_H = 60;
const STEP_X = (PANEL_W - COL) / 4;
const LINE_OVERLAP = 2;

/* 마지막 걸음 하나가 늘었습니다 — 받는 사람의 자리입니다.
   여기까지 이어져야 '전달할 수 있는 경험' 이 됩니다. */
const FLOW = [
  { id: "discover", label: "Discover" },
  { id: "choose", label: "Choose" },
  { id: "personal", label: "Personalize" },
  { id: "send", label: "Send" },
  { id: "experience", label: "Experience", tone: "start" },
];

const px = (value: number) => `calc(${value} * var(--u))`;

export function SceneNudakeFinal() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-start-1 col-span-7 row-start-1 row-span-2">
        Experience Nudake,
        <br />
        Anywhere
      </h2>

      <div
        className="flow rise col-start-1 col-span-8 row-start-4"
        style={
          {
            "--delay": "0.16s",
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
          {FLOW.slice(1).map((step, i) => (
            <path
              key={step.id}
              d={`M ${i * STEP_X + COL - LINE_OVERLAP} ${PILL_H / 2} H ${(i + 1) * STEP_X + LINE_OVERLAP}`}
            />
          ))}
        </svg>

        {FLOW.map((step, i) => (
          <span
            key={step.id}
            className="flow-pill"
            data-tone={step.tone ?? "plain"}
            style={
              {
                left: px(i * STEP_X),
                top: 0,
                width: px(COL),
                height: px(PILL_H),
              } as CSSProperties
            }
          >
            {step.label}
          </span>
        ))}
      </div>

      <p
        className="type-body rise col-start-1 col-span-3 row-start-6"
        style={{ "--delay": "0.3s" } as CSSProperties}
      >
        누데이크의 경험을
        <br />
        방문해야 하는 경험에서
        <br />
        전달할 수 있는 경험으로 확장합니다.
      </p>

      {/* 표지의 말을 그대로 다시 꺼내 케이스를 닫습니다. */}
      <p
        className="type-title rise col-start-6 col-span-3 row-start-6 text-right"
        style={{ "--delay": "0.42s" } as CSSProperties}
      >
        From Visiting Nudake
        <br />
        to Sending Nudake
      </p>
    </div>
  );
}
