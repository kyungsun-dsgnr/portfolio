"use client";

/**
 * 누데이크 04 — 단절 (변주 3)
 *
 * 판은 08장 `Beyond Finding / Toward Global Awareness` 의 것을 씁니다 —
 * 제목이 왼쪽 위, 화면이 가운데 넉 단, 덩이 셋이 좌우로 흩어져 화면을 둘러쌉니다.
 *
 * 08장의 점선과 점은 가져오지 않았습니다. 자리만 같은 판입니다.
 * 카드 위의 선과 들여쓰기는 두지 않습니다 — 흩어 놓은 판에서는 가를 것이 없습니다.
 */

import type { CSSProperties } from "react";

import { NudakeMockList } from "@/components/NudakeScreens";
import { useInView } from "@/components/useInView";

/* 자리는 문자열 그대로 둡니다(템플릿으로 만들면 Tailwind 가 클래스를 찾지 못합니다). */
const NOTES = [
  {
    eyebrow: "Experience Gap",
    title: "Found in NUDAKE",
    body: "사용자는 누데이크 안에서 Tea Gift를 발견하고 제품을 확인합니다. 하지만 Gift를 발견한 이후의 경험은 브랜드 안에서 이어지지 않습니다.",
    place: "col-start-1 col-span-2 row-start-4 row-span-2",
  },
  {
    eyebrow: "Current Journey",
    title: "The experience leaves the brand.",
    body: "제품 상세 이후 사용자는 외부 선물 서비스로 이동합니다. 선물을 고르고, 메시지를 만들고, 전달하는 핵심 경험은 누데이크 밖에서 진행됩니다.",
    place: "col-start-7 col-span-2 row-start-2 row-span-2",
  },
  {
    eyebrow: "Break Point",
    title: "거래는 이어지지만, 누데이크의 경험은 여기서 멈춥니다.",
    body: "Gift를 단순 구매 경로가 아니라, 브랜드 안에서 직접 구성하고 완성하는 경험으로 확장할 필요가 있습니다.",
    chain: ["TEA GIFT", "PRODUCT DETAIL", "KAKAO GIFT ↗"],
    place: "self-end col-start-7 col-span-2 row-start-5 row-span-2",
  },
];

export function SceneNudakeGap5() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1 row-span-2">
        Found Here,
        <br />
        Experienced Elsewhere
      </h2>

      {/* 화면은 가운데 넉 단의 한가운데에 섭니다. 남는 좌우는 덩이가 걸칠 자리입니다. */}
      <div
        className="nud-stage rise col-start-3 col-span-4 row-start-2 row-span-5"
        style={{ "--delay": "0.1s" } as CSSProperties}
        aria-hidden
      >
        <NudakeMockList />
      </div>

      {NOTES.map((note, i) => (
        <div
          key={note.eyebrow}
          className={`note rise ${note.place}`}
          style={{ "--delay": `${0.18 + i * 0.08}s` } as CSSProperties}
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
  );
}
