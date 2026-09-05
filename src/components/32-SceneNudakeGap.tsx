"use client";

/**
 * 누데이크 04 — 단절
 *
 * 판은 3장(관점)의 것을 그대로 씁니다 — 큰 문장이 위 일곱 단을 차지하고,
 * 아래 5–6행에 덩이가 붙습니다. 왼쪽 열에 둘, 오른쪽 열 아랫행에 하나.
 *
 * 3장의 Note 와 다른 점은 위에 붙는 작은 머리말 한 줄뿐입니다.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 왼쪽 위 하나, 오른쪽 위아래 둘. 띠는 아래로 갈수록 한 걸음씩 길어집니다. 아래 덩이는 제 행의 끝에 붙습니다.
   자리는 문자열 그대로 둡니다
   (템플릿으로 만들면 Tailwind 가 클래스를 찾지 못합니다). */
const NOTES = [
  {
    eyebrow: "Experience Gap",
    title: "Found in NUDAKE",
    body: "사용자는 누데이크 안에서 Tea Gift를 발견하고 제품을 확인합니다. 하지만 Gift를 발견한 이후의 경험은 브랜드 안에서 이어지지 않습니다.",
    chain: ["TEA GIFT"],
    place: "col-start-3 col-span-3 row-start-4",
    delay: "0.12s",
  },
  {
    eyebrow: "Current Journey",
    title: "The experience leaves the brand.",
    body: "제품 상세 이후 사용자는 외부 선물 서비스로 이동합니다. 선물을 고르고, 메시지를 만들고, 전달하는 핵심 경험은 누데이크 밖에서 진행됩니다.",
    chain: ["TEA GIFT", "PRODUCT DETAIL"],
    place: "col-start-6 col-span-3 row-start-4 row-span-2",
    delay: "0.22s",
  },
  {
    eyebrow: "Break Point",
    title: "거래는 이어지지만, 누데이크의 경험은 여기서 멈춥니다.",
    body: "Gift를 단순 구매 경로가 아니라, 브랜드 안에서 직접 구성하고 완성하는 경험으로 확장할 필요가 있습니다.",
    chain: ["TEA GIFT", "PRODUCT DETAIL", "KAKAO GIFT ↗"],
    place: "self-end col-start-6 col-span-3 row-start-6",
    delay: "0.32s",
  },
];

export function SceneNudakeGap() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      {/* 제목은 다른 케이스의 하위 장들과 같은 단(type-lead)을 씁니다. */}
      <h2 className="type-lead capitalize rise col-start-1 col-span-6 row-start-1">
        Found Here, Experienced Elsewhere.
      </h2>

      {NOTES.map((note) => (
        <div
          key={note.eyebrow}
          className={`note rise ${note.place}`}
          style={{ "--delay": note.delay } as CSSProperties}
        >
          <p className="nud-eyebrow">{note.eyebrow}</p>
          <h3 className="type-title">{note.title}</h3>
          <p className="type-body">{note.body}</p>

          {note.chain ? (
            <p className="nud-chain">
              {note.chain.map((step, i) => (
                <span key={step} className="contents">
                  {i > 0 ? <i aria-hidden>→</i> : null}
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
