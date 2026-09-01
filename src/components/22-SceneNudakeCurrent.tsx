"use client";

/**
 * 19장 — 누데이크 지금의 선물 경험
 *
 * 2026-09-01 nudake.com/kr 에서 직접 따라간 길입니다.
 * 홈에는 선물 입구가 없고, 메뉴 안 아이콘 하나를 눌러야 기프트가 나오며,
 * 제품 상세의 유일한 단추는 `카카오톡 선물하기` 입니다 —
 * 고르는 일까지가 누데이크이고, 건네는 일은 통째로 밖에 있습니다.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 13장과 같은 눈금. 다만 걸음이 다섯이라 판 전체를 가로지릅니다. */
const COL = 158.5;
const GAP = 16;
const PILL_H = 38;
const TOP = 36;
/** 여덟 단 전체 */
const PANEL_W = 8 * COL + 7 * GAP;
const PANEL_H = 110;
/** 걸음과 걸음 사이가 멉니다. 그 먼 것이 이 장의 내용입니다. */
const STEP_X = (PANEL_W - COL) / 4;
/** 선이 알약 테두리 아래로 살짝 들어가 틈을 없앱니다. */
const LINE_OVERLAP = 2;

const STEPS = [
  { id: "home", label: "Home", tone: "start" },
  { id: "menu", label: "Menu" },
  /* 여기가 숨어 있는 자리입니다. */
  { id: "gift", label: "Tea Gift", tone: "mark" },
  { id: "product", label: "Product" },
  /* 여기서부터 누데이크가 아닙니다. */
  { id: "kakao", label: "KakaoTalk", tone: "ghost", away: true },
];

/* 짚는 것 셋. 불편이 아니라, 브랜드가 끊기는 자리를 적습니다. */
const POINTS = [
  {
    index: "01",
    title: "Hidden Behind a Menu",
    body: "홈에 선물 입구가 없습니다. 메뉴로 들어가 상단 아이콘 셋 중 가운데를 눌러야 기프트 열여섯 종이 나옵니다.",
    place: "col-start-1 col-span-2",
  },
  {
    index: "02",
    title: "Handed Off, Not Designed",
    body: "제품 상세의 유일한 단추는 카카오톡 선물하기입니다. 장바구니도, 결제도, 메시지를 적는 자리도 사이트에 없습니다.",
    place: "col-start-4 col-span-2",
  },
  {
    index: "03",
    title: "The Brand Stops at the Link",
    body: "고르는 데까지가 누데이크이고, 건네고 받는 자리는 메신저의 기본 화면입니다. 브랜드가 링크에서 멈춥니다.",
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
        className="type-body rise col-start-6 col-span-3 row-start-1"
        style={{ "--delay": "0.08s" } as CSSProperties}
      >
        선물은 사이트 안에 있지 않습니다. 메뉴 안쪽에 숨어 있고, 찾아내면 그
        자리에서 다른 서비스로 넘어갑니다.
      </p>

      <div
        className="flow rise col-start-1 col-span-8 row-start-3"
        style={
          {
            "--delay": "0.14s",
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

        {/* 어디까지가 누데이크인지 한 줄로 갈라 둡니다. */}
        <span
          className="flow-edge"
          style={{ left: px(3 * STEP_X + COL + 40) } as CSSProperties}
          aria-hidden
        >
          누데이크 밖
        </span>
      </div>

      {POINTS.map((point, i) => (
        <div
          key={point.index}
          className={`issue rise ${point.place} row-start-5 row-span-2`}
          style={{ "--delay": `${0.24 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{point.index}</span>
          <h3 className="type-title">{point.title}</h3>
          <p className="type-body">{point.body}</p>
        </div>
      ))}
    </div>
  );
}
