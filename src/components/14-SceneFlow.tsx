"use client";

/** 14장 — 탬버린즈 유저 플로우 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 다이어그램은 3–8단 여섯 단(1031×740) 안에서 제 좌표계를 씁니다.
   칸 하나가 알약 하나이고, 단계가 오른쪽으로 한 칸씩 밀립니다. */
const PANEL_W = 1031;
const PANEL_H = 740;
const PILL_W = 118;
const PILL_H = 30;
const STEP_X = 130;
const STEP_Y = 78;
const TOP = 43;
/** 꺾이는 자리를 둥글게 만드는 반지름 */
const BEND = 9;

type Tone = "start" | "plain" | "ghost";
type Node = {
  id: string;
  label: string;
  /** 단계(가로) 와 줄(세로) */
  step: number;
  row: number;
  tone?: Tone;
  /** 이 마디로 들어오는 앞 마디들 */
  from?: string[];
  /** 이 마디에서 걸리는 지점. 왼쪽 목록의 번호와 맞춥니다. */
  pain?: string;
};

/** 흐름에서 걸리는 지점. 번호가 다이어그램의 마디에 붙습니다. */
const PAINS = [
  { no: "01", text: "목록에서는 세트에 어떤 향이 들어가는지 알 수 없습니다." },
  { no: "02", text: "향은 제품 수만큼 창을 넘겨 하나씩 고릅니다." },
  { no: "03", text: "품절과 향 설명은 선택 창을 열어야 드러납니다." },
  { no: "04", text: "고른 구성은 담은 뒤 장바구니에서야 확인됩니다." },
];

/* 지금 tamburins.com 에서 선물 하나를 고르는 데 거치는 화면들입니다.
   커스텀 기프트 목록 → 세트 상세 → 향 선택 창(1/2, 2/2) → 쇼핑백 순서이고,
   향은 세트에 든 제품 수만큼 한 칸씩 나뉘어 물어봅니다.
   회색 마디는 선물을 고르는 길에서 벗어나는 갈래입니다. */
const NODES: Node[] = [
  { id: "home", label: "Home", step: 0, row: 4, tone: "start" },

  {
    id: "gift",
    label: "Custom Gifts",
    step: 1,
    row: 1,
    from: ["home"],
    pain: "01",
  },
  {
    id: "best",
    label: "Best Gifts",
    step: 1,
    row: 4,
    tone: "ghost",
    from: ["home"],
  },
  { id: "shop", label: "Shop", step: 1, row: 6, tone: "ghost", from: ["home"] },
  {
    id: "cs",
    label: "Store & CS",
    step: 1,
    row: 8,
    tone: "ghost",
    from: ["home"],
  },

  { id: "set", label: "Gift Set", step: 2, row: 1, from: ["gift"] },

  {
    id: "option",
    label: "Select Option",
    step: 3,
    row: 1,
    from: ["set"],
    pain: "03",
  },
  {
    id: "info",
    label: "Product Info",
    step: 3,
    row: 3,
    tone: "ghost",
    from: ["set"],
  },

  {
    id: "scent1",
    label: "Scent 1 / 2",
    step: 4,
    row: 0,
    from: ["option"],
    pain: "02",
  },
  { id: "scent2", label: "Scent 2 / 2", step: 4, row: 2, from: ["option"] },

  {
    id: "bag",
    label: "Add to Bag",
    step: 5,
    row: 1,
    from: ["scent1", "scent2"],
  },
  { id: "cart", label: "Cart", step: 6, row: 1, from: ["bag"], pain: "04" },
  {
    id: "order",
    label: "Order",
    step: 7,
    row: 1,
    tone: "ghost",
    from: ["cart"],
  },
];

const place = (node: Node) => ({
  x: node.step * STEP_X,
  y: TOP + node.row * STEP_Y,
});

/** 앞 마디 오른쪽에서 다음 마디 왼쪽으로, 가운데에서 한 번 꺾어 들어갑니다. */
function elbow(from: Node, to: Node) {
  const a = place(from);
  const b = place(to);
  const x1 = a.x + PILL_W;
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
    width: `calc(${PILL_W} * var(--u))`,
    height: `calc(${PILL_H} * var(--u))`,
  } as CSSProperties;
};

/**
 * 지금 선물을 사는 흐름. 제목과 노트가 왼쪽 두 단에 서고,
 * 다이어그램이 남은 여섯 단을 씁니다.
 */
export function SceneFlow() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const byId = new Map(NODES.map((node) => [node.id, node]));

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-2 row-start-1 row-span-2">
        User Flow
      </h2>

      {/* 걸리는 지점을 모아 두고, 번호로 다이어그램의 마디와 잇습니다. */}
      <ol
        className="flow-pains rise self-start col-start-1 col-span-2 row-start-3 row-span-3"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        {PAINS.map((pain) => (
          <li key={pain.no}>
            <span className="flow-pains-no">{pain.no}</span>
            {pain.text}
          </li>
        ))}
      </ol>

      <div
        className="flow rise col-start-3 col-span-6 row-start-1 row-span-6"
        style={{ "--delay": "0.16s" } as CSSProperties}
      >
        <svg
          className="flow-lines"
          viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
          preserveAspectRatio="none"
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
    </div>
  );
}
