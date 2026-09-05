"use client";

/**
 * 누데이크 05 — 전환
 *
 * 오른쪽 넉 단에 덩이 셋. 왼쪽 넉 단은 그림이 들어올 때까지 비워 둡니다.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 손이 닿는 걸음은 채워서 세웁니다 — 여기가 이 흐름의 몫입니다. */
const FILLED = new Set(["COMPOSE", "COMPOSE GIFT"]);

const NOTES: {
  eyebrow: string;
  title: string;
  body: string;
  chain?: string[];
}[] = [
  {
    eyebrow: "Design Direction",
    title: "Make the gift inside NUDAKE",
    body: "선물을 고른 뒤 외부 서비스로 이동하는 구매 흐름에서, 티를 선택하고 메시지를 작성해 하나의 선물을 직접 완성하는 경험으로 전환합니다.",
  },
  {
    eyebrow: "Proposed Flow",
    title: "From selection to composition",
    body: "선물을 ‘구매’하는 과정에서, 사용자가 직접 구성하고 완성하는 경험으로 전환합니다.",
    chain: ["CHOOSE TEA", "WRITE POSTCARD", "COMPOSE", "PREVIEW", "SEND"],
  },
  {
    eyebrow: "Core Interaction",
    title: "Write it. Place it. Complete it.",
    body: "",
    chain: ["WRITE POSTCARD", "COMPOSE GIFT"],
  },
];

function Chain({ steps }: { steps: string[] }) {
  return (
    <p className="nud-chain">
      {steps.map((step, n) => (
        <span key={step} className="contents">
          {n > 0 ? <i aria-hidden>→</i> : null}
          <span
            className="flow-pill"
            data-tone={
              FILLED.has(step) || step.startsWith("KAKAO") ? "start" : undefined
            }
          >
            {step}
          </span>
        </span>
      ))}
    </p>
  );
}

export function SceneNudakeGap4() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1 row-span-2">
        From Buying a Gift
        <br />
        to Making One.
      </h2>

      <div
        className="nud-notes col-start-5 col-span-4 row-start-3 row-span-4"
        data-spread
      >
        {NOTES.map((note, i) => (
          <div
            key={note.eyebrow}
            className="note nud-ruled rise"
            style={{ "--delay": `${0.12 + i * 0.1}s` } as CSSProperties}
          >
            <p className="nud-eyebrow">{note.eyebrow}</p>
            <h3 className="type-title">{note.title}</h3>
            {note.body ? <p className="type-body">{note.body}</p> : null}
            {note.chain ? <Chain steps={note.chain} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
