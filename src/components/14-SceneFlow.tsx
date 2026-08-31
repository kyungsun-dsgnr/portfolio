"use client";

/** 13장 — 탬버린즈 지금의 유저 플로우 */

import { useState, type CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 한 걸음이 한 단에 섭니다. 알약 폭은 단 폭과 같고, 걸음 사이는 그리드 간격입니다. */
const COL = 158.5;
const GAP = 16;
const STEP_X = COL + GAP;
/** 여섯 단을 가로지르는 판. 두 행 높이를 씁니다. */
const PANEL_W = 6 * COL + 5 * GAP;
const PANEL_H = 2 * 110 + GAP;
const PILL_H = 38;
/** 첫 줄이 시작하는 높이와, 줄과 줄 사이 */
const TOP = 28;
const DOWN = 72;
/** 선이 알약 테두리 아래로 살짝 들어가도록 해 미세한 틈을 없앱니다. */
const LINE_OVERLAP = 2;
/** 걸리는 지점 카드가 그 단의 맨 아래 마디에서 떨어지는 거리 */
const NOTE_GAP = 16;

type Tone = "plain" | "start" | "ghost";
type Node = {
  id: string;
  label: string;
  /** 몇 번째 단인지 */
  step: number;
  /** 몇 번째 줄인지. 아래로 내려갈 때마다 한 줄씩 */
  line: number;
  tone?: Tone;
  /** 앞 걸음. 같은 줄이면 곧게, 아래 줄이면 단 가운데를 타고 내려옵니다. */
  from?: string;
  /** 이 걸음에서 걸리는 지점. 번호는 마디에 붙고, 번호에 손을 올리면
   *  그 걸음 아래 칸에서 내용이 열립니다. */
  pain?: { no: string; text: string };
};

/* 지금 tamburins.com 에서 선물 하나를 사는 길입니다.
   향을 묻는 자리에서 한 줄 내려가고, 담은 뒤 주문으로 또 한 줄 내려갑니다. */
const NODES: Node[] = [
  { id: "home", label: "Home", step: 0, line: 0, tone: "start" },
  {
    id: "custom",
    label: "Custom Gifts",
    step: 1,
    line: 0,
    from: "home",
    pain: {
      no: "01",
      text: "목록에서는 세트에 어떤 향이 들어가는지 알 수 없습니다.",
    },
  },
  {
    id: "set",
    label: "Gift Set",
    step: 2,
    line: 0,
    from: "custom",
    pain: {
      no: "02",
      text: "향은 세트 상세에서 선택 창을 따로 열어야 고를 수 있습니다.",
    },
  },
  {
    id: "scent1",
    label: "Scent 1 / 2",
    step: 3,
    line: 0,
    from: "set",
    pain: {
      no: "03",
      text: "세트에 든 제품 수만큼 창을 넘겨 하나씩 고릅니다. 향 설명은 창을 열어야 드러납니다.",
    },
  },
  { id: "scent2", label: "Scent 2 / 2", step: 3, line: 1, from: "scent1" },
  { id: "bag", label: "Add to Bag", step: 4, line: 1, from: "scent2" },
  {
    id: "cart",
    label: "Cart",
    step: 5,
    line: 1,
    from: "bag",
    pain: {
      no: "04",
      text: "고른 구성은 담은 뒤 장바구니에서야 한자리에서 확인됩니다.",
    },
  },
  {
    id: "order",
    label: "Order",
    step: 5,
    line: 2,
    tone: "ghost",
    from: "cart",
  },
];

const place = (node: Node) => ({
  x: node.step * STEP_X,
  y: TOP + node.line * DOWN,
});

/** 그 단에서 가장 아래에 선 마디의 밑선. 카드는 여기서 한 칸 띄고 섭니다. */
const floorOf = (step: number) =>
  Math.max(
    ...NODES.filter((node) => node.step === step).map(
      (node) => place(node).y + PILL_H,
    ),
  );

const px = (value: number) => `calc(${value} * var(--u))`;

/** 같은 줄이면 곧은 가로선, 아래 줄이면 단 가운데를 타고 내려가는 세로선 */
function trace(from: Node, to: Node) {
  const a = place(from);
  const b = place(to);
  if (from.line === to.line) {
    return `M ${a.x + COL - LINE_OVERLAP} ${a.y + PILL_H / 2} H ${b.x + LINE_OVERLAP}`;
  }
  const x = a.x + COL / 2;
  return `M ${x} ${a.y + PILL_H - LINE_OVERLAP} V ${b.y + LINE_OVERLAP}`;
}

/** 소제목 + 본문 한 덩어리 */
function Brief({ title, children }: { title: string; children: string }) {
  return (
    <div>
      <h3 className="flow-brief-title">{title}</h3>
      <p>{children}</p>
    </div>
  );
}

/**
 * 지금의 흐름 한 장. 제목이 왼쪽 위, 다이어그램이 가운데,
 * 흐름과 그 안에서 사용자가 하는 판단이 오른쪽 아래에 나란히 섭니다.
 */
export function SceneFlow() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const byId = new Map(NODES.map((node) => [node.id, node]));
  /** 지금 열려 있는 걸리는 지점. 번호에 손을 올린 동안만 열립니다. */
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        Current User Flow
      </h2>

      <div
        className="flow rise col-start-2 col-span-6 row-start-3 row-span-2"
        style={
          {
            "--delay": "0.1s",
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
          {NODES.filter((node) => node.from).map((node) => (
            <path key={node.id} d={trace(byId.get(node.from!)!, node)} />
          ))}
        </svg>

        {NODES.map((node) => (
          <span
            key={node.id}
            className="flow-pill"
            data-tone={node.tone ?? "plain"}
            style={
              {
                left: px(place(node).x),
                top: px(place(node).y),
                width: px(COL),
                height: px(PILL_H),
              } as CSSProperties
            }
          >
            {node.label}
            {node.pain && (
              /* 번호가 곧 손잡이입니다. 여기 손을 올리면 아래 카드가 열립니다. */
              <em
                className="flow-pain"
                tabIndex={0}
                onMouseEnter={() => setOpen(node.id)}
                onMouseLeave={() => setOpen(null)}
                onFocus={() => setOpen(node.id)}
                onBlur={() => setOpen(null)}
              >
                {node.pain.no}
              </em>
            )}
          </span>
        ))}

        {/* 걸리는 지점. 좌우는 그 걸음이 선 단에 그대로 맞추고,
            위아래는 그 단에서 가장 아래에 선 마디에서 한 칸(16) 띄고 섭니다. */}
        {NODES.filter((node) => node.pain).map((node) => (
          <div
            key={`${node.id}-note`}
            className="flow-note"
            data-open={open === node.id || undefined}
            style={
              {
                left: px(place(node).x),
                top: px(floorOf(node.step) + NOTE_GAP),
                width: px(COL),
              } as CSSProperties
            }
          >
            <em>{node.pain!.no}</em>
            <p>{node.pain!.text}</p>
          </div>
        ))}
      </div>

      <div
        className="flow-brief rise col-start-5 col-span-4 row-start-6"
        style={{ "--delay": "0.18s" } as CSSProperties}
      >
        <Brief title="Flow">
          사용자는 Custom Gifts에 진입한 뒤, 기프트 세트와 각 제품의 향을
          순차적으로 선택해 장바구니와 주문 단계로 이동합니다.
        </Brief>
        <Brief title="Decision">
          하나의 기프트를 완성하기 위해 세트 구성과 향 선택을 여러 화면에 걸쳐
          단계별로 수행합니다.
        </Brief>
      </div>
    </div>
  );
}
