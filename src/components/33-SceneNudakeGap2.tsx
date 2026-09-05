"use client";

/**
 * 누데이크 04 — 단절 (변주)
 *
 * 32장과 같은 글을 다른 판에 올립니다 — 제목이 왼쪽 넉 단을 크게 차지하고,
 * 덩이 셋은 오른쪽 넉 단에 위에서 아래로 나란히 쌓입니다.
 *
 * 셋은 오른쪽 넉 단에 20 간격으로 쌓이고, 무리째 판 아래에 붙습니다.
 * 덩이마다 위에 가르는 선이 그어집니다.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 띠는 마지막 덩이에만 답니다 — 밖으로 나가는 걸음이 거기서 드러납니다. */
const NOTES = [
  {
    eyebrow: "Experience Gap",
    title: "Found in NUDAKE",
    body: "사용자는 누데이크 안에서 Tea Gift를 발견하고 제품을 확인합니다. 하지만 Gift를 발견한 이후의 경험은 브랜드 안에서 이어지지 않습니다.",
  },
  {
    eyebrow: "Current Journey",
    title: "The experience leaves the brand.",
    body: "제품 상세 이후 사용자는 외부 선물 서비스로 이동합니다. 선물을 고르고, 메시지를 만들고, 전달하는 핵심 경험은 누데이크 밖에서 진행됩니다.",
  },
  {
    eyebrow: "Break Point",
    title: "거래는 이어지지만, 누데이크의 경험은 여기서 멈춥니다.",
    body: "Gift를 단순 구매 경로가 아니라, 브랜드 안에서 직접 구성하고 완성하는 경험으로 확장할 필요가 있습니다.",
    chain: ["TEA GIFT", "PRODUCT DETAIL", "KAKAO GIFT ↗"],
  },
];

export function SceneNudakeGap2() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      {/* 왼쪽 넉 단을 2행부터 판 끝까지 흰 바닥으로 깝니다. */}
      <span
        className="nud-field col-start-1 col-span-4 row-start-2 row-span-5"
        aria-hidden
      />

      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1 row-span-2">
        Found Here,
        <br />
        Experienced Elsewhere.
      </h2>

      <div className="nud-notes col-start-5 col-span-4 row-start-1 row-span-6">
        {NOTES.map((note, i) => (
          <div
            key={note.eyebrow}
            className="note nud-ruled rise"
            style={{ "--delay": `${0.12 + i * 0.1}s` } as CSSProperties}
          >
            <p className="nud-eyebrow">{note.eyebrow}</p>
            <h3 className="type-title">{note.title}</h3>
            <p className="type-body">{note.body}</p>

            {note.chain ? (
              <p className="nud-chain">
                {note.chain.map((step, n) => (
                  <span key={step} className="contents">
                    {n > 0 ? <i aria-hidden>→</i> : null}
                    <span
                      className="flow-pill"
                      /* 브랜드 밖으로 나가는 걸음만 채웁니다. */
                      data-tone={step.startsWith("KAKAO") ? "start" : undefined}
                    >
                      {step}
                    </span>
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
