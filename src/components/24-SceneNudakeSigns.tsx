"use client";

/**
 * 21장 — 선물로 가는 길
 *
 * 판은 6장 `Three Directions` 와 같습니다 —
 * 제목 1–3단 1–2행 · 본문 5–8단 1–2행 · 카드 셋 3–4 / 5–6 / 7–8단 3–6행.
 *
 * 카드 글은 2장의 STEP 라벨과 같은 세 단(steps-no · steps-step · steps-kind)을 씁니다.
 * 세 걸음은 2026-09-01 nudake.com/kr 에서 직접 지난 경로입니다.
 * 그림 자리는 아직 비어 있어, 채울 것이 정해지면 넣습니다.
 */

import type { CSSProperties } from "react";

import { NudakeMockList, NudakeMockMenu } from "@/components/NudakeScreens";
import { useInView } from "@/components/useInView";

/* 홈에서 선물 상세까지 직접 밟아 센 수입니다 (2026-09-01, nudake.com/kr). */
const COUNTS = [
  { value: "6", unit: "clicks" },
  { value: "5", unit: "screens" },
  { value: "3rd", unit: "discovery" },
];

const SIGNS = [
  {
    index: "01",
    title: "Menu Entry",
    body: "선물 메뉴를 찾기 위해 탐색 시작",
    place: "col-start-3 col-span-2",
    screen: "menu",
  },
  {
    index: "02",
    title: "Category Depth",
    body: "하위 카테고리를 다시 선택",
    place: "col-start-5 col-span-2",
    screen: "open",
  },
  {
    index: "03",
    title: "Hidden Gift",
    body: "세 번째 화면에서 Gift 발견",
    place: "col-start-7 col-span-2",
    screen: "list",
  },
];

export function SceneNudakeSigns() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      {/* 한 줄로 서려면 네 단으로는 좁아, 여섯 단을 씁니다. 카드는 3행부터라 겹치지 않습니다. */}
      <h2 className="type-lead capitalize rise col-start-1 col-span-6 row-start-1">
        Already There, Just Not Visible
      </h2>

      {/* 오른쪽 끝 두 단, 제목과 같은 행에 그 길의 길이를 숫자로 세웁니다. */}
      <p
        className="nud-counts rise self-start col-start-7 col-span-2 row-start-1"
        data-tight
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        {COUNTS.map((count) => (
          <span key={count.unit + count.value}>
            <b>{count.value}</b>
            <em>{count.unit}</em>
          </span>
        ))}
      </p>

      {/* 설명은 왼쪽 넉 단, 2행부터. 끊지 않고 한 덩이로 흐릅니다. */}
      <p
        className="type-body rise self-start col-start-1 col-span-4 row-start-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        선물 목적의 사용자는 NUDAKE 안에 도착해도, ‘Gift’를 발견하기까지 메뉴
        구조를 여러 번 거쳐야 합니다. 기능은 존재하지만 탐색 흐름 안에서 충분히
        드러나지 않습니다.
      </p>

      {SIGNS.map((sign, i) => (
        <div
          key={sign.index}
          className={`work rise row-start-4 row-span-3 ${sign.place}`}
          style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
        >
          {/* 글자 크기는 2장 `STEP 01 / Gift / 목록에서…` 와 같은 세 단을 씁니다. */}
          <div className="work-head">
            <p className="steps-no">STEP {sign.index}</p>
            <h3 className="steps-step">{sign.title}</h3>
            <p className="steps-kind">{sign.body}</p>
          </div>

          {/* 세 걸음을 그대로 화면 셋으로 보여 줍니다. */}
          <div className="work-visual">
            {sign.screen === "list" ? (
              <NudakeMockList />
            ) : (
              <NudakeMockMenu open={sign.screen === "open"} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
