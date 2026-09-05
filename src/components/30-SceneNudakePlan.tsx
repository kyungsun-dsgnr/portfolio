"use client";

/**
 * 누데이크 05–06 — 아직 비어 있는 두 장
 *
 * 무엇을 넣을지만 적어 둔 자리입니다. 내용은 나중에 새로 만듭니다.
 * 두 장이 판을 같이 쓰므로 컴포넌트 하나에 넣고, 각 장은 데이터만 다릅니다.
 * 04 는 다른 판을 쓰게 되어 32장으로 따로 나갔습니다.
 *
 * 판 — 제목 1–4단 1행 · 할 말 1–3단 2–6행 · 채울 자리 5–8단 1–6행.
 * 채울 자리(.nud-empty)는 그림이나 화면이 들어오면 그대로 갈아 끼우면 됩니다.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

type Plan = {
  /** 제목. 줄바꿈은 배열로 끊습니다. */
  title: string[];
  /** 이 장이 맡는 몫 */
  kind: string;
  /** 흐름을 한 줄로 보일 때만 */
  chain?: string[];
  /** 넣을 것들 */
  items: string[];
};

/** 05 — 전환 */
export const NUDAKE_TURN: Plan = {
  title: ["From Buying a Gift", "to Making One"],
  kind: "Design Direction / Proposed Flow",
  chain: ["Choose Tea", "Write Postcard", "Compose", "Preview", "Send"],
  items: ["선물을 구매하는 과정에서, 선물을 직접 만드는 경험으로 전환"],
};

/** 06 — 결과 */
export const NUDAKE_COMPOSE: Plan = {
  title: ["Compose a", "Nudake Gift"],
  kind: "최종 UX/UI + 인터랙션",
  items: [
    "Tea 선택",
    "Postcard 작성",
    "엽서를 Gift Box에 넣는 핵심 인터랙션",
    "Preview",
    "Send",
    "마지막에 Before / After 또는 기대효과까지 짧게 정리",
  ],
};

export function SceneNudakePlan({ plan }: { plan: Plan }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1">
        {plan.title.map((line, i) => (
          <span key={line}>
            {i > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </h2>

      <div
        className="nud-plan rise col-start-1 col-span-3 row-start-2 row-span-5"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        <p className="nud-eyebrow">{plan.kind}</p>

        {/* 흐름이 있는 장은 그 흐름을 한 줄로 먼저 보입니다. */}
        {plan.chain ? (
          <p className="nud-plan-chain">
            {plan.chain.map((step, i) => (
              <span key={step}>
                {i > 0 ? <i aria-hidden>→</i> : null}
                {step}
              </span>
            ))}
          </p>
        ) : null}

        <ul className="nud-plan-list">
          {plan.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 그림이나 화면이 정해지면 이 자리를 갈아 끼웁니다. */}
      <div
        className="nud-empty rise col-start-5 col-span-4 row-start-1 row-span-6"
        style={{ "--delay": "0.18s" } as CSSProperties}
      />
    </div>
  );
}
