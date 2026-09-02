"use client";

/**
 * 20장 — Current Experience + Current IA
 *
 * 같은 문제를 두 방식으로 보입니다. 위는 지나야 하는 길, 아래는 그 길이
 * 그렇게 생긴 이유. 2026-09-01 nudake.com/kr 에서 직접 지난 경로입니다.
 * 시간(time-on-task)은 사용자 테스트 없이 적을 수 없어, 지금 셀 수 있는
 * 것만 적습니다 — 클릭 수, 화면 수, 선물이라는 말이 처음 나오는 자리.
 * 그리드 10번 — 제목 1–3단 1행 · 흐름 1–8단 2행 · 구조 1–2단 · 읽는 눈 우측.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

const PANEL_W = 1380;
const PANEL_H = 54;
const PILL_H = 34;
const PILL_W = (PANEL_W - 6 * 14) / 7;
const STEP_X = PILL_W + 14;
const LINE_OVERLAP = 2;

/* 선물 하나에 닿기까지 지나는 일곱 걸음. */
const STEPS = [
  { id: "home", label: "Nudake", tone: "start" },
  { id: "menu", label: "Menu" },
  { id: "house", label: "Teahouse" },
  /* 여기서 처음 '기프트' 라는 말이 나옵니다. 네 번째 화면입니다. */
  { id: "tea", label: "Tea Gift", tone: "mark" },
  { id: "product", label: "Product" },
  { id: "icon", label: "Gift Icon", tone: "mark" },
  { id: "kakao", label: "Kakao Gift", tone: "ghost", away: true },
];

/* 셀 수 있는 것만 적습니다. 초는 사용자 테스트로 채울 자리입니다. */
const COUNTS = [
  { value: "6", unit: "clicks", body: "홈에서 선물 상세까지" },
  { value: "5", unit: "screens", body: "그 사이에 지나는 화면" },
  { value: "4th", unit: "screen", body: "‘기프트’ 가 처음 나오는 화면" },
];

/* 지금의 상위 구조. 선물은 제 자리를 갖지 못하고 상세 안의 기능처럼 있습니다. */
const TREE = [
  { label: "Home", depth: 0 },
  { label: "Menu", depth: 1 },
  { label: "Tea", depth: 2 },
  { label: "Product Detail", depth: 3 },
  { label: "Gift Icon", depth: 4, lead: true },
];

const READS = [
  {
    index: "01",
    title: "목적지가 아니라 기능",
    body: "선물이 상위에 없습니다. 제품 상세 안의 아이콘 하나로 존재합니다.",
    place: "col-start-4 col-span-2",
  },
  {
    index: "02",
    title: "매장에 종속",
    body: "티 하우스라는 특정 매장 아래에 매여 있어, 브랜드 전체의 것으로 읽히지 않습니다.",
    place: "col-start-7 col-span-2",
  },
];

const px = (value: number) => `calc(${value} * var(--u))`;

export function SceneNudakeCurrent() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        Current Experience
      </h2>

      <p
        className="nud-counts rise col-start-5 col-span-4 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        {COUNTS.map((count) => (
          <span key={count.unit + count.value}>
            <b>{count.value}</b>
            <em>{count.unit}</em>
            <i>{count.body}</i>
          </span>
        ))}
      </p>

      <div
        className="flow rise col-start-1 col-span-8 row-start-2"
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
              strokeDasharray={step.away ? "4 5" : undefined}
              d={`M ${i * STEP_X + PILL_W - LINE_OVERLAP} ${PILL_H / 2} H ${(i + 1) * STEP_X + LINE_OVERLAP}`}
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
                top: 0,
                width: px(PILL_W),
                height: px(PILL_H),
              } as CSSProperties
            }
          >
            {step.label}
          </span>
        ))}
      </div>

      {/* 같은 문제를 구조로 다시 보입니다. */}
      <div
        className="nud-ia rise col-start-1 col-span-2 row-start-4 row-span-3"
        style={{ "--delay": "0.26s" } as CSSProperties}
      >
        <p className="nud-eyebrow">Current IA</p>

        <ul className="nud-tree">
          {TREE.map((node, i) => (
            <li
              key={`${node.label}-${i}`}
              data-depth={node.depth}
              data-lead={node.lead || undefined}
            >
              {node.label}
            </li>
          ))}
        </ul>
      </div>

      <p
        className="nud-claim rise col-start-4 col-span-5 row-start-4 text-right"
        style={{ "--delay": "0.34s" } as CSSProperties}
      >
        Gift exists, but it is structurally hidden.
      </p>

      {READS.map((read, i) => (
        <div
          key={read.index}
          className={`issue rise ${read.place} row-start-6`}
          style={{ "--delay": `${0.42 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{read.index}</span>
          <h3 className="type-title">{read.title}</h3>
          <p className="type-body">{read.body}</p>
        </div>
      ))}
    </div>
  );
}
