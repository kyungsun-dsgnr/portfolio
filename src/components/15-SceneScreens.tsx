"use client";

/** 15장 — 지금의 경험. 실제 화면을 지나는 순서대로 늘어놓습니다. */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 화면이 놓이는 판. 여덟 단 × 네 행을 씁니다. */
const BAND_W = 8 * 158.5 + 7 * 16;
/** 화면 하나. 휴대폰 비율(9:19.5)입니다. */
const SHOT_W = 162;
const SHOT_H = 351;
/** 한 걸음 옮길 때마다 오른쪽으로 이만큼, 아래로 이만큼 */
const STEP_X = 340;
const STEP_DOWN = 28;
/** 화면 넷을 판 가운데에 놓는 왼쪽 여백 */
const START_X = (BAND_W - (3 * STEP_X + SHOT_W)) / 2;

/* 사용자가 지나는 순서. 분석은 다음 장에서 하고 여기서는 있는 그대로 둡니다. */
const SHOTS = [
  { screen: "Custom Gifts", step: "Browse" },
  { screen: "Gift Set", step: "Select" },
  { screen: "Scent 1 / 2", step: "Select" },
  { screen: "Scent 2 / 2", step: "Complete" },
];

const px = (value: number) => `calc(${value} * var(--u))`;

/**
 * 화면 넷이 왼쪽에서 오른쪽으로, 조금씩 내려가며 놓입니다.
 * 나란히 세우는 것보다 여러 화면을 통과한다는 인상이 남습니다.
 */
export function SceneScreens() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <div className="rise col-start-1 col-span-4 row-start-1 row-span-2">
        <p className="eyebrow">03 / Current Experience</p>
        <h2 className="type-lead">
          One gift,
          <br />
          across multiple screens.
        </h2>
      </div>

      <div
        className="steps rise col-start-1 col-span-8 row-start-3 row-span-4"
        style={{ "--delay": "0.12s" } as CSSProperties}
      >
        {SHOTS.map((shot, i) => (
          <div
            key={shot.screen}
            className="steps-shot"
            style={
              {
                left: px(START_X + i * STEP_X),
                top: px(i * STEP_DOWN),
                width: px(SHOT_W),
                "--delay": `${0.2 + i * 0.1}s`,
              } as CSSProperties
            }
          >
            {/* 실제 화면이 들어갈 자리 */}
            <div className="steps-frame" style={{ height: px(SHOT_H) }}>
              <span>{shot.screen}</span>
            </div>
            <p className="steps-step">{shot.step}</p>
          </div>
        ))}
      </div>

      <p
        className="type-body rise self-end col-start-1 col-span-3 row-start-6"
        style={{ "--delay": "0.5s" } as CSSProperties}
      >
        세트 구성과 향 선택이 서로 다른 화면에 나뉘어 순차적으로 진행됩니다.
      </p>
    </div>
  );
}
