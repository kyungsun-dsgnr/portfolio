"use client";

/**
 * 24장 — From Product-Driven to Intent-Aware
 *
 * 기존 경로를 지우지 않는 것이 이 장의 요점입니다.
 * 제품을 보러 온 사람의 길은 그대로 두고, 선물하러 온 사람에게
 * 직접 들어오는 문을 하나 더 냅니다. 두 길은 같은 상품에서 만납니다.
 * 그리드 3번 — 본문 왼쪽 · 큰 덩어리 둘을 좌우로.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

type Node = { label: string; depth: number; lead?: boolean; add?: boolean };

/* 지금의 구조. 선물은 메뉴 > 티 하우스 아래 세 번째 깊이에 있습니다. */
const BEFORE: Node[] = [
  { label: "Nudake", depth: 0 },
  { label: "Stores", depth: 1 },
  { label: "Menu", depth: 1 },
  { label: "Haus Nowhere", depth: 2 },
  { label: "Nudake Teahouse", depth: 2 },
  { label: "Tea Gift", depth: 3, lead: true },
  { label: "Projects", depth: 1 },
  { label: "Social", depth: 1 },
];

/* 제안하는 구조. 메뉴는 그대로 두고, 선물이 목적인 사람에게
   같은 층에 문을 하나 더 냅니다. */
const AFTER: Node[] = [
  { label: "Nudake", depth: 0 },
  { label: "Stores", depth: 1 },
  { label: "Menu", depth: 1 },
  { label: "Haus Nowhere", depth: 2 },
  { label: "Nudake Teahouse", depth: 2 },
  { label: "Gift", depth: 1, lead: true, add: true },
  { label: "Gift Collection", depth: 2, add: true },
  { label: "Tea Gift", depth: 2, add: true },
  { label: "Send a Gift", depth: 2, add: true },
  { label: "Projects", depth: 1 },
  { label: "Social", depth: 1 },
];

function Tree({ nodes }: { nodes: Node[] }) {
  return (
    <ul className="nud-tree">
      {nodes.map((node, i) => (
        <li
          key={`${node.label}-${i}`}
          data-depth={node.depth}
          data-lead={node.lead || undefined}
          data-add={node.add || undefined}
        >
          {node.label}
        </li>
      ))}
    </ul>
  );
}

export function SceneNudakeIA() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1">
        From Product-Driven to Intent-Aware
      </h2>

      <div
        className="nud-ia rise col-start-1 col-span-3 row-start-2 row-span-4"
        style={{ "--delay": "0.14s" } as CSSProperties}
      >
        <p className="nud-eyebrow">Before</p>
        <Tree nodes={BEFORE} />
      </div>

      <div
        className="nud-ia rise col-start-5 col-span-3 row-start-2 row-span-4"
        style={{ "--delay": "0.24s" } as CSSProperties}
      >
        <p className="nud-eyebrow">After</p>
        <Tree nodes={AFTER} />
      </div>

      {/* 기존 길을 지우지 않았다는 것이 이 제안의 핵심입니다. */}
      <p
        className="type-body rise col-start-1 col-span-6 row-start-6"
        style={{ "--delay": "0.4s" } as CSSProperties}
      >
        <b>Product intent</b> Menu → Teahouse → Tea Gift 와{" "}
        <b>Gift intent</b> Gift → Collection.
        <br />
        기존 메뉴 기반 제품 탐색 구조는 유지하면서, 선물이 목적인 사용자가 곧장
        닿을 수 있는 경로를 따로 냅니다. 두 길은 같은 상품에서 합류합니다.
      </p>
    </div>
  );
}
