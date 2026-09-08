"use client";

/**
 * 누데이크 05 — 한 흐름, 네 장면
 *
 * 판은 `Already There, Just Not Visible`(37장) 과 같습니다 —
 * 제목 1–6단 1행 · 설명 1–4단 2행 · 카드 넷 1–2 / 3–4 / 5–6 / 7–8단 3–6행.
 * 카드 글도 그 장과 같은 세 단(steps-no · steps-step · steps-kind)입니다.
 *
 * 앞 장이 밖으로 새는 길을 보여 준다면, 이 장은 그 네 걸음이
 * 누데이크 안에서 이어지는 모습입니다. 카드마다 개선 화면의 한 걸음을
 * 세워 두고, 화면은 그대로 살아 있어 손으로 만져 볼 수 있습니다.
 * 그래서 카드는 단추가 아닙니다 — 단추 안에 단추를 둘 수 없습니다.
 */

import type { CSSProperties } from "react";

import { NudakeMockCompose } from "@/components/NudakeComposeScreen";
import { useInView } from "@/components/useInView";

/* 네 걸음. `step` 은 개선 화면이 서 있을 자리입니다. */
const MOMENTS = [
  {
    index: "01",
    title: "Choose Tea",
    body: "티 기프트 상품을 선택하는 화면",
    place: "col-start-1 col-span-2",
    step: "list" as const,
  },
  {
    index: "02",
    title: "Product Detail",
    body: "선택한 티 기프트의 정보와 ‘선물하기’ CTA를 확인하는 화면",
    place: "col-start-3 col-span-2",
    step: "detail" as const,
  },
  {
    index: "03",
    title: "Write Message",
    body: "선물 카드에 메시지를 작성하는 화면",
    place: "col-start-5 col-span-2",
    step: "note" as const,
  },
  {
    index: "04",
    title: "Send Gift",
    body: "받는 사람 정보와 결제 과정을 거쳐 선물을 보내는 화면",
    place: "col-start-7 col-span-2",
    step: "pay" as const,
  },
];

export function SceneNudakeFlow() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-6 row-start-1">
        One Flow, Four Moments
      </h2>

      <p
        className="type-body rise self-start col-start-1 col-span-4 row-start-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        차를 고르고, 메시지를 쓰고, 선물을 구성하고, 결제까지 이어지는 과정이
        NUDAKE 안에서 하나의 흐름으로 연결됩니다.
      </p>

      {MOMENTS.map((moment, i) => (
        <div
          key={moment.index}
          className={`work nud-cap-card rise self-end row-start-3 row-span-4 ${moment.place}`}
          style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
        >
          {/* 화면이 카드를 통째로 쓰고, 글 셋은 그 아래쪽 밝은 판 위에 얹힙니다. */}
          <div className="work-visual">
            <NudakeMockCompose step={moment.step} />

            <div className="nud-cap">
              <p className="steps-no">STEP {moment.index}</p>
              <h3 className="steps-step">{moment.title}</h3>
              <p className="steps-kind">{moment.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
