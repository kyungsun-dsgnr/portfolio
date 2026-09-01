"use client";

/**
 * 20장 — From Message to Gesture
 *
 * 이 케이스에서 논리가 도는 자리입니다. 화면은 한 장도 넣지 않습니다.
 * 손이 이미 아는 순서를 왼쪽에 적고, 그것을 화면의 말로 옮겨 오른쪽에 적습니다.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 손이 아는 순서와, 그것을 화면으로 옮긴 순서.
   같은 자리에 같은 걸음이 서야 옮겨진 것으로 읽힙니다. */
const TRANSLATION = [
  {
    key: "physical",
    label: "Physical",
    steps: ["Choose a card", "Write", "Put it inside", "Give"],
  },
  {
    key: "digital",
    label: "Digital Translation",
    steps: ["Choose", "Write", "Insert", "Send"],
  },
];

export function SceneNudakeGesture() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-start-1 col-span-4 row-start-1 row-span-3">
        From
        <br />
        Message
        <br />
        to Gesture
      </h2>

      {/* 손의 순서 → 화면의 순서. 위아래로 겹쳐 두어 걸음이 서로 마주 봅니다. */}
      <div
        className="nud-trans rise col-start-5 col-span-4 row-start-2 row-span-3"
        style={{ "--delay": "0.14s" } as CSSProperties}
      >
        {TRANSLATION.map((row, r) => (
          <div className="nud-trans-row" key={row.key} data-of={row.key}>
            <p className="nud-trans-label">{row.label}</p>

            <ol className="nud-trans-steps">
              {row.steps.map((step, i) => (
                <li
                  key={step}
                  style={
                    { "--delay": `${0.3 + r * 0.4 + i * 0.1}s` } as CSSProperties
                  }
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <p
        className="type-body rise col-start-1 col-span-3 row-start-5"
        style={{ "--delay": "0.2s" } as CSSProperties}
      >
        메시지를 입력하는 기능이 아니라,
        <br />
        마음을 적어 선물 안에 넣는 행동으로 다시 읽습니다.
        <br />
        <br />
        목표는 하나입니다 &mdash; 어디서 만나든 누데이크.
        <br />
        사이트에서든, 메신저에서든, 받는 사람의 화면에서든.
      </p>

      {/* 세 케이스를 하나로 묶는 자리. 여기서만 다른 두 케이스를 부릅니다. */}
      <p
        className="nud-echo rise col-start-5 col-span-4 row-start-6"
        style={{ "--delay": "0.34s" } as CSSProperties}
      >
        <span>
          Gentle Monster <em>Turn → Explore</em>
        </span>
        <span>
          Tamburins <em>Compose → Pack</em>
        </span>
        <span data-on>
          Nudake <em>Write → Insert → Give</em>
        </span>
      </p>
    </div>
  );
}
