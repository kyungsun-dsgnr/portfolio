"use client";

/**
 * 누데이크 04 — 단절 (변주 2)
 *
 * 32장과 같은 글을 다른 판에 올립니다 — 제목이 왼쪽 넉 단을 크게 차지하고,
 * 그 아래에 목록 화면 하나, 덩이 셋은 오른쪽 넉 단에 나란히 쌓입니다.
 *
 * 33장과 같되, 셋을 여섯 행 위아래 끝에 붙이고 사이를 고르게 벌립니다.
 * 덩이마다 위에 가르는 선이 그어집니다.
 */

import type { CSSProperties } from "react";

import { NudakeMockList } from "@/components/NudakeScreens";
import { useInView } from "@/components/useInView";

/* 띠는 아래로 갈수록 한 걸음씩 길어집니다. 브랜드 밖으로 나가는 걸음만 채웁니다. */
const NOTES = [
  {
    eyebrow: "Experience Gap",
    title: "Found in NUDAKE",
    body: "사용자는 누데이크 안에서 Tea Gift를 발견하고 제품을 확인합니다",
    chain: ["TEA GIFT"],
  },
  {
    eyebrow: "Current Journey",
    title: "The Experience Leaves the Brand",
    body: "제품 상세 이후 사용자는 외부 선물 서비스로 이동합니다. 선물을 고르고, 메시지를 만들고, 전달하는 과정은 누데이크 밖에서 진행됩니다",
    chain: ["TEA GIFT", "PRODUCT DETAIL"],
  },
  {
    eyebrow: "Break Point",
    title: "The Experience Does Not Continue in NUDAKE",
    body: "거래는 외부 서비스에서 가능하지만, 선물 경험은 누데이크 안에서 이어지지 않습니다",
    chain: ["TEA GIFT", "PRODUCT DETAIL", "KAKAO GIFT ↗"],
  },
];

export function SceneNudakeGap3() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      {/* 왼쪽 넉 단에 화면 하나. 선물이 '여기서' 보이는 그 목록입니다.
          바닥색 없이 페이지 바탕 위에 바로 서고,
          화면이 판보다 길어 위에서부터 들여다보는 만큼만 보입니다. */}
      <div
        className="nud-stage col-start-1 col-span-4 row-start-2 row-span-5"
        aria-hidden
      >
        <NudakeMockList gift />
      </div>

      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1 row-span-2">
        Found Here,
        <br />
        Experienced Elsewhere
      </h2>

      <div
        className="nud-notes col-start-5 col-span-4 row-start-2 row-span-5"
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
