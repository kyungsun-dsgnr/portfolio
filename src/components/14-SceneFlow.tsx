"use client";

/** 14장 — 탬버린즈 유저 플로우 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 여덟 걸음이 여덟 단에 하나씩 섭니다.
   알약 폭은 단 폭과 같고, 걸음 사이 간격은 그리드 간격과 같습니다. */
const COL = 158.5;
const GAP = 16;
const STEP_X = COL + GAP;
const PANEL_W = 8 * COL + 7 * GAP;
/** 다섯 행 높이 */
const PANEL_H = 5 * 110 + 4 * GAP;
const PILL_H = 34;
/** 선물 사는 길이 놓이는 높이 */
const LINE_Y = 8;
/** 한 걸음이 화면 둘일 때, 두 번째 화면이 본선 아래로 내려오는 높이 */
const UNDER = 56;
/** 나머지 갈래가 시작되는 높이와, 갈래 사이 간격 */
const MAP_Y = 132;
const MAP_STEP = 48;
/** 꺾이는 자리를 둥글게 만드는 반지름 */
const BEND = 9;

type Tone = "start" | "plain" | "ghost";

/** 선물을 사기까지 지나는 화면들. 한 걸음이 한 단입니다. */
const FLOW: {
  id: string;
  label: string;
  tone?: Tone;
  pain?: string;
  under?: { label: string; tone?: Tone };
}[] = [
  { id: "home", label: "Home", tone: "start" },
  { id: "gift", label: "Gift" },
  {
    id: "custom",
    label: "Custom Gifts",
    pain: "01",
    under: { label: "Best Gifts", tone: "ghost" },
  },
  { id: "set", label: "Gift Set" },
  { id: "option", label: "Select Option", pain: "03" },
  {
    id: "scent",
    label: "Scent 1 / 2",
    pain: "02",
    under: { label: "Scent 2 / 2" },
  },
  { id: "bag", label: "Add to Bag" },
  {
    id: "cart",
    label: "Cart",
    pain: "04",
    under: { label: "Order", tone: "ghost" },
  },
];

/* 선물을 사는 길에서 벗어나는 갈래. 홈에서 함께 나가지만 이 프로젝트가 다루는 자리는 아닙니다.
   갈래 이름은 둘째 단에 알약으로, 그 안의 화면은 셋째 단에 목록으로 적습니다.
   서른 개가 넘는 화면을 모두 알약으로 세우면 정작 흐름이 묻힙니다. */
const MAP: { label: string; pages: string[] }[] = [
  {
    label: "Perfume",
    pages: ["퍼퓸", "헤어 퍼퓸", "퍼퓸 밤", "퍼퓸 오일", "퍼퓸 웨어"],
  },
  { label: "Body", pages: ["헤어 오일", "샤워리바디"] },
  {
    label: "Hand & Lip",
    pages: [
      "쉘 퍼퓸 핸드",
      "에그 립밤",
      "체인 핸드",
      "퍼퓸드 핸드",
      "핸드앤립 웨어",
    ],
  },
  {
    label: "Home Fragrance",
    pages: ["카 디퓨저", "룸 프래그런스", "퍼퓸 캔들"],
  },
  {
    label: "Scent Note",
    pages: ["우디", "머스크", "플로럴", "시트러스", "프루티"],
  },
  {
    label: "Collection",
    pages: ["썸머테일스", "선샤인", "블루히노키", "보타리", "이브닝글로우"],
  },
  { label: "Store", pages: ["대한민국", "일본", "중국", "태국"] },
  {
    label: "Customer Service",
    pages: ["자주 묻는 질문", "1:1 문의하기", "기업 구매", "공지사항"],
  },
  { label: "My Page", pages: ["주문 내역", "비회원 주문 조회"] },
];

/** 갈래는 같은 간격으로 나란히 내려갑니다. */
const MAP_AT = MAP.map((_branch, i) => MAP_Y + i * MAP_STEP);

const px = (value: number) => `calc(${value} * var(--u))`;

/** 걸음과 걸음은 같은 높이에 서므로 곧은 가로선으로 잇습니다. */
const link = (step: number) =>
  `M ${step * STEP_X + COL} ${LINE_Y + PILL_H / 2} H ${(step + 1) * STEP_X}`;

/** 같은 걸음의 두 번째 화면으로는 단 가운데를 곧게 내려갑니다. */
const drop = (step: number) => {
  const x = step * STEP_X + COL / 2;
  return `M ${x} ${LINE_Y + PILL_H} V ${LINE_Y + UNDER}`;
};

/** 홈에서 갈라져 나가는 갈래. 첫 단과 둘째 단 사이 여백에서 한 번 꺾습니다. */
function branch(y: number) {
  const x1 = COL;
  const y1 = LINE_Y + PILL_H / 2;
  const x2 = STEP_X;
  const y2 = y + PILL_H / 2;
  const mid = (x1 + x2) / 2;
  return [
    `M ${x1} ${y1}`,
    `H ${mid - BEND}`,
    `Q ${mid} ${y1} ${mid} ${y1 + BEND}`,
    `V ${y2 - BEND}`,
    `Q ${mid} ${y2} ${mid + BEND} ${y2}`,
    `H ${x2}`,
  ].join(" ");
}

/** 갈래에서 그 안의 화면 목록으로 */
const leaf = (y: number) =>
  `M ${STEP_X + COL} ${y + PILL_H / 2} H ${2 * STEP_X}`;

/**
 * 지금 선물을 사는 흐름과, 그 옆으로 벗어나는 나머지 갈래.
 * 걸음은 한 줄로 곧게 가고, 갈래는 그 아래에 모입니다.
 */
export function SceneFlow() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-3 row-start-1">
        User Flow
      </h2>

      <div className="flow rise col-start-1 col-span-8 row-start-2 row-span-5">
        <svg
          className="flow-lines"
          viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
          aria-hidden
        >
          {FLOW.slice(0, -1).map((node, i) => (
            <path key={`${node.id}-next`} d={link(i)} />
          ))}
          {FLOW.map((node, i) =>
            node.under ? <path key={`${node.id}-under`} d={drop(i)} /> : null,
          )}
          {MAP.map((one, i) => (
            <path key={`${one.label}-branch`} d={branch(MAP_AT[i])} />
          ))}
          {MAP.map((one, i) => (
            <path key={`${one.label}-leaf`} d={leaf(MAP_AT[i])} />
          ))}
        </svg>

        {FLOW.map((node, i) => (
          <span
            key={node.id}
            className="flow-pill"
            data-tone={node.tone ?? "plain"}
            style={
              {
                left: px(i * STEP_X),
                top: px(LINE_Y),
                width: px(COL),
                height: px(PILL_H),
              } as CSSProperties
            }
          >
            {node.label}
            {node.pain && <em className="flow-pain">{node.pain}</em>}
          </span>
        ))}

        {/* 한 걸음이 화면 둘인 자리. 두 번째 화면이 본선 아래에 붙습니다. */}
        {FLOW.map((node, i) =>
          node.under ? (
            <span
              key={`${node.id}-under`}
              className="flow-pill"
              data-tone={node.under.tone ?? "plain"}
              style={
                {
                  left: px(i * STEP_X),
                  top: px(LINE_Y + UNDER),
                  width: px(COL),
                  height: px(PILL_H),
                } as CSSProperties
              }
            >
              {node.under.label}
            </span>
          ) : null,
        )}

        {MAP.map((one, i) => (
          <span
            key={one.label}
            className="flow-pill"
            data-tone="ghost"
            style={
              {
                left: px(STEP_X),
                top: px(MAP_AT[i]),
                width: px(COL),
                height: px(PILL_H),
              } as CSSProperties
            }
          >
            {one.label}
          </span>
        ))}

        {MAP.map((one, i) => (
          <p
            key={`${one.label}-pages`}
            className="flow-pages"
            style={
              {
                left: px(2 * STEP_X),
                top: px(MAP_AT[i]),
                height: px(PILL_H),
                width: px(3 * COL + 2 * GAP),
              } as CSSProperties
            }
          >
            {one.pages.join(" · ")}
          </p>
        ))}
      </div>
    </div>
  );
}
