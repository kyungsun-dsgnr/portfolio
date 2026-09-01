"use client";

/**
 * 22장 — The Structure Follows Products, Not Intent
 *
 * 앞장이 "몇 번을 눌러야 하는가" 였다면, 여기는 "왜 그렇게 되었는가" 입니다.
 * 사용자의 목적은 하나인데, 지금 구조는 제품을 묻는 질문 셋을 먼저 던집니다.
 * 그리드 10번 — 제목 1–3단 1–2행 · 본문 5–7단 1행 · 단 셋 3–6행.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 지금 구조가 사용자에게 먼저 묻는 것들. 답은 모두 제품의 자리입니다. */
const ASKS = [
  { ask: "Where?", answer: "Menu" },
  { ask: "Which store?", answer: "Teahouse" },
  { ask: "Which category?", answer: "Tea Gift" },
];

const POINTS = [
  {
    index: "01",
    title: "Findability",
    body: "선물이 상위 정보 구조에 보이지 않습니다. 홈에서는 선물이라는 말 자체가 나오지 않습니다.",
    place: "col-start-1 col-span-2",
  },
  {
    index: "02",
    title: "Information Scent",
    body: "메뉴가 선물로 이어진다는 단서가 없습니다. 메뉴는 먹을 것을 보러 가는 말로 읽힙니다.",
    place: "col-start-4 col-span-2",
  },
  {
    index: "03",
    title: "Intent Mismatch",
    body: "사용자의 목적은 선물하기인데, 구조는 제품 카테고리 탐색을 요구합니다.",
    place: "col-start-7 col-span-2",
  },
];

export function SceneNudakeProblem() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1 row-span-2">
        The Structure Follows
        <br />
        Products, Not Intent
      </h2>

      {/* 사용자가 들고 온 것 하나 */}
      <div
        className="nud-intent rise col-start-1 col-span-3 row-start-3"
        style={{ "--delay": "0.14s" } as CSSProperties}
      >
        <p className="nud-eyebrow">User Intent</p>
        <p className="nud-intent-say">
          &ldquo;I want to send
          <br />a Nudake gift.&rdquo;
        </p>
      </div>

      {/* 화면이 되묻는 것 셋 */}
      <div
        className="nud-asks rise col-start-5 col-span-4 row-start-3"
        style={{ "--delay": "0.24s" } as CSSProperties}
      >
        <p className="nud-eyebrow">Current IA</p>

        <ol>
          {ASKS.map((one) => (
            <li key={one.ask}>
              <em>{one.ask}</em>
              <i aria-hidden />
              <b>{one.answer}</b>
            </li>
          ))}
        </ol>
      </div>

      {POINTS.map((point, i) => (
        <div
          key={point.index}
          className={`issue rise ${point.place} row-start-5 row-span-2`}
          style={{ "--delay": `${0.36 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{point.index}</span>
          <h3 className="type-title">{point.title}</h3>
          <p className="type-body">{point.body}</p>
        </div>
      ))}
    </div>
  );
}
