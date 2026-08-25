"use client";

/** 14장 — 탬버린즈 유저 플로우 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 선물 하나를 사기까지 여섯 걸음. 한 걸음이 한 단에 섭니다.
   알약 폭은 단 폭과 같고, 걸음 사이 간격은 그리드 간격과 같습니다. */
const COL = 158.5;
const GAP = 16;
const STEP_X = COL + GAP;
/** 여섯 단을 가로지르는 판 */
const STEPS = 6;
const PANEL_W = STEPS * COL + (STEPS - 1) * GAP;
/** 두 행 높이 */
const PANEL_H = 2 * 110 + GAP;
const PILL_H = 34;
/** 한 걸음이 화면 둘일 때, 두 번째 화면이 본선 아래로 내려오는 높이 */
const UNDER = 62;
type Tone = "start" | "plain" | "ghost";
type Node = {
  id: string;
  label: string;
  /** 몇 번째 걸음인지. 그대로 그리드 단이 됩니다. */
  step: number;
  tone?: Tone;
  from?: string[];
  /** 이 걸음에서 걸리는 지점. 무엇이 걸리는지는 다음 장에서 화면과 함께 풉니다. */
  pain?: string;
  /** 같은 걸음의 두 번째 화면. 본선 아래에 붙습니다. */
  under?: { label: string; tone?: Tone };
};

/* 지금 tamburins.com 에서 선물 하나를 고르는 길입니다.
   걸음은 한 줄로 곧게 이어지고, 한 걸음이 화면 둘인 자리에서는
   두 번째 화면이 그 아래에 붙습니다 — 고르는 자리, 향을 묻는 자리, 담고 주문하는 자리. */
const NODES: Node[] = [
  { id: "home", label: "Home", step: 0, tone: "start" },
  {
    id: "gift",
    label: "Custom Gifts",
    step: 1,
    from: ["home"],
    pain: "01",
    under: { label: "Gift Set" },
  },
  { id: "option", label: "Select Option", step: 2, from: ["gift"], pain: "03" },
  {
    id: "scent",
    label: "Scent 1 / 2",
    step: 3,
    from: ["option"],
    pain: "02",
    under: { label: "Scent 2 / 2" },
  },
  { id: "bag", label: "Add to Bag", step: 4, from: ["scent"] },
  {
    id: "cart",
    label: "Cart",
    step: 5,
    from: ["bag"],
    pain: "04",
    under: { label: "Order", tone: "ghost" },
  },
];

const place = (node: Node) => ({
  x: node.step * STEP_X,
  y: (PANEL_H - PILL_H) / 2,
});

/** 걸음과 걸음은 같은 높이에 서므로 곧은 가로선으로 잇습니다. */
function link(from: Node, to: Node) {
  const a = place(from);
  const b = place(to);
  return `M ${a.x + COL} ${a.y + PILL_H / 2} H ${b.x}`;
}

/** 같은 걸음의 두 번째 화면으로는 단 가운데를 곧게 내려갑니다. */
function drop(node: Node) {
  const a = place(node);
  const x = a.x + COL / 2;
  return `M ${x} ${a.y + PILL_H} V ${a.y + UNDER}`;
}

const at = (node: Node, below = false) => {
  const { x, y } = place(node);
  return {
    left: `calc(${x} * var(--u))`,
    top: `calc(${y + (below ? UNDER : 0)} * var(--u))`,
    width: `calc(${COL} * var(--u))`,
    height: `calc(${PILL_H} * var(--u))`,
  } as CSSProperties;
};

/**
 * 지금 선물을 사는 흐름. 한 걸음이 한 단에 서고,
 * 화면 둘로 나뉘는 걸음은 본선을 사이에 두고 위아래로 붙습니다.
 */
export function SceneFlow() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const byId = new Map(NODES.map((node) => [node.id, node]));

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-3 row-start-1 row-span-2">
        User Flow
      </h2>

      <div className="flow rise col-start-1 col-span-6 row-start-3 row-span-2">
        <svg
          className="flow-lines"
          viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
          aria-hidden
        >
          {NODES.flatMap((node) => [
            ...(node.from ?? []).map((id) => (
              <path key={`${id}-${node.id}`} d={link(byId.get(id)!, node)} />
            )),
            ...(node.under
              ? [<path key={`${node.id}-under`} d={drop(node)} />]
              : []),
          ])}
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

        {/* 한 걸음이 화면 둘인 자리. 두 번째 화면이 본선 아래에 붙습니다. */}
        {NODES.filter((node) => node.under).map((node) => (
          <span
            key={`${node.id}-under`}
            className="flow-pill"
            data-tone={node.under!.tone ?? "plain"}
            style={at(node, true)}
          >
            {node.under!.label}
          </span>
        ))}
      </div>
    </div>
  );
}
