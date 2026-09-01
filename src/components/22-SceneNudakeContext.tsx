"use client";

/**
 * 19장 — A Brand Built Around Physical Experience
 *
 * 아직 문제를 말하지 않습니다. 누데이크의 경험이 무엇으로 이루어져 있는지만
 * 보이고, 그것이 공간에 묶여 있다는 사실까지만 적습니다.
 * 그리드 7번 — 2단짜리 넷을 가로로.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 누데이크의 경험을 이루는 넷. 어느 하나만으로는 설명되지 않습니다. */
const PARTS = [
  {
    key: "space",
    label: "Space",
    body: "공간이 먼저 말을 겁니다.",
    place: "col-start-1 col-span-2",
  },
  {
    key: "product",
    label: "Product",
    body: "디저트와 티가 그 말을 잇습니다.",
    place: "col-start-3 col-span-2",
  },
  {
    key: "visual",
    label: "Visual",
    body: "이미지가 브랜드의 결을 만듭니다.",
    place: "col-start-5 col-span-2",
  },
  {
    key: "package",
    label: "Package",
    body: "손에 남는 것이 마지막을 맡습니다.",
    place: "col-start-7 col-span-2",
  },
];

/* 넷이 한 점으로 모이는 그림. 판 좌표는 8단 폭(1380)을 그대로 씁니다. */
const PANEL_W = 1380;
const PANEL_H = 120;
/** 각 기둥의 가로 한가운데 */
const AT = PARTS.map((_, i) => (i * 2 + 1) * (1380 / 8));

export function SceneNudakeContext() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1 row-span-2">
        A Brand Built Around
        <br />
        Physical Experience
      </h2>

      <p
        className="type-body rise col-start-6 col-span-3 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        누데이크의 경험은 디저트를 사는 일에서 끝나지 않습니다. 공간과 제품,
        이미지와 패키지가 함께 움직여 하나의 인상을 만듭니다.
      </p>

      {PARTS.map((part, i) => (
        <div
          key={part.key}
          className={`nud-part rise ${part.place} row-start-3`}
          style={{ "--delay": `${0.16 + i * 0.08}s` } as CSSProperties}
        >
          <h3 className="nud-part-name">{part.label}</h3>
          <p className="type-body">{part.body}</p>
        </div>
      ))}

      {/* 넷이 한 점으로 모입니다. */}
      <div
        className="nud-merge rise col-start-1 col-span-8 row-start-4"
        style={{ "--delay": "0.5s" } as CSSProperties}
      >
        <svg viewBox={`0 0 ${PANEL_W} ${PANEL_H}`} aria-hidden>
          {AT.map((x, i) => (
            <path
              key={i}
              d={`M ${x} 0 V ${PANEL_H * 0.42} Q ${x} ${PANEL_H * 0.72} ${PANEL_W / 2} ${PANEL_H * 0.72} `}
            />
          ))}
          <path d={`M ${PANEL_W / 2} ${PANEL_H * 0.72} V ${PANEL_H}`} />
        </svg>
      </div>

      <p
        className="nud-merge-name rise col-start-3 col-span-4 row-start-5"
        style={{ "--delay": "0.66s" } as CSSProperties}
      >
        Nudake Experience
      </p>

      {/* 여기서는 "스토어가 적다" 고 단정하지 않습니다.
          공간 중심 경험에는 물리적 접근의 한계가 있다는 것까지만 적습니다. */}
      <p
        className="type-body rise col-start-3 col-span-4 row-start-6 text-center"
        style={{ "--delay": "0.74s" } as CSSProperties}
      >
        이 강한 경험은 오프라인 공간을 중심으로 만들어져 있습니다.
        <br />
        다만 물리적 공간은 모두가 쉽게 닿을 수 있는 접점은 아닙니다.
      </p>
    </div>
  );
}
