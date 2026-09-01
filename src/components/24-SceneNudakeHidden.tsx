"use client";

/**
 * 21장 — Gift, Hidden in the Menu
 *
 * 여기서 처음 실제 사이트가 나옵니다. 2026-09-01 nudake.com/kr 에서
 * 직접 따라간 길이라, 없는 기능을 지어낸 것이 아니라
 * 이미 있는 기능이 어디에 묻혀 있는지를 짚는 장입니다.
 * 그리드 10번 — 제목 1–3단 1–2행 · 본문 5–7단 1행 · 단 셋 3–6행.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

const COL = 158.5;
const PILL_H = 38;
const TOP = 36;
/** 여덟 단 전체 */
const PANEL_W = 1380;
const PANEL_H = 110;
/** 일곱 걸음이 판을 가로지릅니다. */
const STEP_X = (PANEL_W - COL) / 6;
const LINE_OVERLAP = 2;

/* 선물 하나를 보내려면 지나야 하는 일곱 걸음. */
const STEPS = [
  { id: "home", label: "Nudake", tone: "start" },
  { id: "menu", label: "Menu" },
  { id: "house", label: "Teahouse" },
  /* 상단 아이콘 셋 중 가운데. 여기가 숨어 있는 자리입니다. */
  { id: "tea", label: "Tea Gift", tone: "mark" },
  { id: "product", label: "Product" },
  /* 제품 상세의 유일한 단추 */
  { id: "icon", label: "Gift Icon", tone: "mark" },
  { id: "kakao", label: "Kakao Gift", tone: "ghost", away: true },
];

const POINTS = [
  {
    index: "01",
    title: "Six Steps Before the Gift",
    body: "홈에서 선물에 닿기까지 여섯 번을 눌러야 합니다. 그 사이 어디에도 선물이라는 말이 먼저 나오지 않습니다.",
    place: "col-start-1 col-span-2",
  },
  {
    index: "02",
    title: "Buried Under a Store",
    body: "선물은 메뉴 안, 그것도 특정 매장(티 하우스) 아래 카테고리로 들어가 있습니다.",
    place: "col-start-4 col-span-2",
  },
  {
    index: "03",
    title: "Ends Outside the Brand",
    body: "제품 상세의 유일한 단추가 카카오톡 선물하기입니다. 고르는 데까지가 누데이크입니다.",
    place: "col-start-7 col-span-2",
  },
];

const px = (value: number) => `calc(${value} * var(--u))`;

export function SceneNudakeHidden() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        Gift, Hidden in the Menu
      </h2>

      <p
        className="type-body rise col-start-5 col-span-3 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        선물 기능은 이미 있습니다. 다만 그것을 찾으려면 여러 단계의 제품 탐색을
        먼저 거쳐야 합니다.
      </p>

      <div
        className="flow rise col-start-1 col-span-8 row-start-3"
        style={
          {
            "--delay": "0.16s",
            width: px(PANEL_W),
            height: px(PANEL_H),
          } as CSSProperties
        }
      >
        <svg
          className="flow-lines"
          viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
          aria-hidden
        >
          {STEPS.slice(1).map((step, i) => (
            <path
              key={step.id}
              /* 누데이크 밖으로 나가는 마지막 구간만 끊어 긋습니다. */
              strokeDasharray={step.away ? "4 5" : undefined}
              d={`M ${i * STEP_X + COL - LINE_OVERLAP} ${TOP + PILL_H / 2} H ${(i + 1) * STEP_X + LINE_OVERLAP}`}
            />
          ))}
        </svg>

        {STEPS.map((step, i) => (
          <span
            key={step.id}
            className="flow-pill"
            data-tone={step.tone ?? "plain"}
            style={
              {
                left: px(i * STEP_X),
                top: px(TOP),
                width: px(COL),
                height: px(PILL_H),
              } as CSSProperties
            }
          >
            {step.label}
          </span>
        ))}

        <span
          className="flow-edge"
          style={{ left: px(5 * STEP_X + COL + 14) } as CSSProperties}
          aria-hidden
        >
          누데이크 밖
        </span>
      </div>

      {POINTS.map((point, i) => (
        <div
          key={point.index}
          className={`issue rise ${point.place} row-start-5 row-span-2`}
          style={{ "--delay": `${0.28 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{point.index}</span>
          <h3 className="type-title">{point.title}</h3>
          <p className="type-body">{point.body}</p>
        </div>
      ))}
    </div>
  );
}
