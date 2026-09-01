"use client";

/**
 * 25장 — Turning a Gift into an Experience
 *
 * 여기서 처음 UI 를 제안합니다. 걸음 넷을 위에 띠로 세우고,
 * 그중 Personalize 를 판 한가운데에 크게 둡니다 —
 * 실제 선물에 메시지를 넣어 건네는 행동을 그대로 옮긴 자리라
 * 이 케이스에서 유일하게 손으로 만져 보는 장면입니다.
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

/* 06장에서 정한 Discover · Experience · Send 가 여기서 걸음 넷이 됩니다. */
const BEATS = [
  { id: "discover", label: "Discover", tone: "start" },
  { id: "choose", label: "Choose" },
  { id: "personal", label: "Personalize", tone: "mark" },
  { id: "send", label: "Send" },
];

const px = (value: number) => `calc(${value} * var(--u))`;

export function SceneNudakeGift() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        Turning a Gift into an Experience
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

      <div
        className="issue rise col-start-1 col-span-2 row-start-3 row-span-2"
        style={{ "--delay": "0.2s" } as CSSProperties}
      >
        <span className="card-index">01</span>
        <h3 className="type-title">Discover &middot; Choose</h3>
        <p className="type-body">
          격자에 늘어놓은 상품몰 대신 누데이크의 비주얼로 고릅니다. 값보다 제품의
          분위기와 성격을 먼저 만납니다.
        </p>
      </div>

      <div
        className="issue rise col-start-7 col-span-2 row-start-3 row-span-2"
        style={{ "--delay": "0.28s" } as CSSProperties}
      >
        <span className="card-index">02</span>
        <h3 className="type-title">Personalize</h3>
        <p className="type-body">
          실제 선물을 건네며 메시지를 함께 넣는 행동을 디지털 인터랙션으로
          옮겼습니다. 그래서 엽서는 장식이 아니라 &lsquo;준비를 마쳤다&rsquo;는
          신호입니다.
        </p>
      </div>

      <div
        className="issue rise col-start-7 col-span-2 row-start-5 row-span-2"
        style={{ "--delay": "0.36s" } as CSSProperties}
      >
        <span className="card-index">03</span>
        <h3 className="type-title">Send</h3>
        <p className="type-body">
          Send as a Gift ↗
          <br />
          Continue with Kakao Gift — 밖으로 나간다는 사실을 감추지 않고 미리
          알립니다.
        </p>
      </div>
    </div>
  );
}
