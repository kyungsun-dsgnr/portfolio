"use client";

/** 14장 — 탬버린즈 유저 플로우 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 선물 하나를 사기까지 여덟 걸음. 그리드도 여덟 단이라 한 걸음이 한 단에 섭니다.
   알약 폭은 단 폭과 같고, 걸음 사이 간격은 그리드 간격과 같습니다. */
const COL = 158.5;
const GAP = 16;
const STEP_X = COL + GAP;
/** 여덟 단을 가로지르는 판 */
const PANEL_W = 8 * COL + 7 * GAP;
/** 두 행 높이 */
const PANEL_H = 2 * 110 + GAP;
const PILL_H = 34;
/** 같은 단에서 한 번 더 묻는 칸이 본선에서 벗어나는 높이 */
const TWICE_Y = 62;
/** 꺾이는 자리를 둥글게 만드는 반지름 */
const BEND = 9;

type Tone = "start" | "plain" | "ghost";
type Node = {
  id: string;
  label: string;
  /** 몇 번째 걸음인지(0~7). 그대로 그리드 단이 됩니다. */
  step: number;
  /** 본선에서 위아래로 벗어난 정도 */
  off?: number;
  tone?: Tone;
  from?: string[];
  /** 이 걸음에서 걸리는 지점. 무엇이 걸리는지는 다음 장에서 화면과 함께 풉니다. */
  pain?: string;
};

/* 지금 tamburins.com 에서 선물 하나를 고르는 길입니다.
   한 줄로 곧게 가다가 향을 고르는 데서만 두 갈래로 갈라졌다 다시 모입니다 —
   세트에 든 제품 수만큼 창을 넘겨 하나씩 골라야 하는 자리입니다. */
const NODES: Node[] = [
  { id: "home", label: "Home", step: 0, tone: "start" },
  { id: "gift", label: "Custom Gifts", step: 1, from: ["home"], pain: "01" },
  { id: "set", label: "Gift Set", step: 2, from: ["gift"] },
  { id: "option", label: "Select Option", step: 3, from: ["set"], pain: "03" },
  /* 향은 한 걸음 안에서 두 번 묻습니다. 갈라지는 것이 아니라 같은 자리를 다시 지납니다. */
  {
    id: "scent1",
    label: "Scent 1 / 2",
    step: 4,
    off: -TWICE_Y,
    from: ["option"],
    pain: "02",
  },
  { id: "scent2", label: "Scent 2 / 2", step: 4, from: ["scent1"] },
  { id: "bag", label: "Add to Bag", step: 5, from: ["scent2"] },
  { id: "cart", label: "Cart", step: 6, from: ["bag"], pain: "04" },
  { id: "order", label: "Order", step: 7, tone: "ghost", from: ["cart"] },
];

const place = (node: Node) => ({
  x: node.step * STEP_X,
  y: (PANEL_H - PILL_H) / 2 + (node.off ?? 0),
});

/** 앞 걸음 오른쪽에서 다음 걸음 왼쪽으로. 높이가 다르면 단 사이 여백에서 한 번 꺾습니다.
    같은 단 안에서 이어질 때는 단 가운데를 곧게 내려갑니다. */
function elbow(from: Node, to: Node) {
  const a = place(from);
  const b = place(to);
  if (from.step === to.step) {
    const x = a.x + COL / 2;
    return `M ${x} ${a.y + PILL_H} V ${b.y}`;
  }
  const x1 = a.x + COL;
  const y1 = a.y + PILL_H / 2;
  const x2 = b.x;
  const y2 = b.y + PILL_H / 2;
  if (Math.abs(y1 - y2) < 1) return `M ${x1} ${y1} H ${x2}`;

  const mid = (x1 + x2) / 2;
  const way = y2 > y1 ? 1 : -1;
  return [
    `M ${x1} ${y1}`,
    `H ${mid - BEND}`,
    `Q ${mid} ${y1} ${mid} ${y1 + way * BEND}`,
    `V ${y2 - way * BEND}`,
    `Q ${mid} ${y2} ${mid + BEND} ${y2}`,
    `H ${x2}`,
  ].join(" ");
}

const at = (node: Node) => {
  const { x, y } = place(node);
  return {
    left: `calc(${x} * var(--u))`,
    top: `calc(${y} * var(--u))`,
    width: `calc(${COL} * var(--u))`,
    height: `calc(${PILL_H} * var(--u))`,
  } as CSSProperties;
};

/**
 * 지금 선물을 사는 흐름. 여덟 걸음이 여덟 단에 하나씩 서고,
 * 향을 고르는 자리에서만 본선이 갈라졌다 모입니다.
 */
export function SceneFlow() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const byId = new Map(NODES.map((node) => [node.id, node]));

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-3 row-start-1 row-span-2">
        User Flow
      </h2>

      <div className="flow rise col-start-1 col-span-8 row-start-3 row-span-2">
        <svg
          className="flow-lines"
          viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
          aria-hidden
        >
          {NODES.flatMap((node) =>
            (node.from ?? []).map((id) => (
              <path key={`${id}-${node.id}`} d={elbow(byId.get(id)!, node)} />
            )),
          )}
        </svg>

        {NODES.map((node) => (
          <span
            key={node.id}
            className="flow-pill"
            data-tone={node.tone ?? "plain"}
            style={at(node)}
          >
            {node.label}
            {node.pain && <em className="flow-pain">{node.pain}</em>}
          </span>
        ))}
      </div>

      <p
        className="type-body rise self-end col-start-1 col-span-3 row-start-6"
        style={{ "--delay": "0.14s" } as CSSProperties}
      >
        선물 하나를 사기까지 여덟 걸음입니다. 네 번째 걸음에서는 세트에 든 제품
        수만큼 같은 창을 다시 지납니다.
      </p>
    </div>
  );
}
