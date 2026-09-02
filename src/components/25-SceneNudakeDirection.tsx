"use client";

/**
 * 22장 — Design Direction + Proposed IA
 *
 * 이 케이스의 전략이 서는 자리입니다. 중심 문장을 크게 두고,
 * 관점이 어떻게 뒤집혔는지(Product → Gift 에서 Gift → Experience → Product 로)와
 * 그 결과인 구조를 한 장에서 함께 보입니다.
 * 그리드 1번 — 큰 문장 1–7단 1–2행 · 전환 1–4단 · 구조 6–8단.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

type Node = { label: string; depth: number; lead?: boolean; add?: boolean };

/* 선물이 제 자리를 가진 목적지가 됩니다. 메뉴는 그대로 둡니다. */
const AFTER: Node[] = [
  { label: "Home", depth: 0 },
  { label: "Menu", depth: 1 },
  { label: "Gift", depth: 1, lead: true, add: true },
  { label: "Tea Gift", depth: 2, add: true },
  { label: "Gift Set", depth: 2, add: true },
  { label: "Gift Guide", depth: 2, add: true },
];

/* 07장이 아니라 여기서 이름을 붙여 두고, 다음 장이 그대로 따라갑니다. */
const RULES = ["Discover", "Experience", "Gift"];

export function SceneNudakeDirection() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-start-1 col-span-7 row-start-1 row-span-2">
        Gift the
        <br />
        Nudake Experience
      </h2>

      <p
        className="type-title rise self-start col-start-1 col-span-5 row-start-3"
        style={{ "--delay": "0.12s" } as CSSProperties}
      >
        누구나 누릴 수 있는 고급 티 경험을 선물하다.
      </p>

      {/* 관점이 뒤집히는 자리 */}
      <div
        className="nud-turn rise col-start-1 col-span-4 row-start-4 row-span-2"
        style={{ "--delay": "0.24s" } as CSSProperties}
      >
        <p className="nud-eyebrow">Before</p>
        <p className="nud-turn-line" data-old>
          Product <i aria-hidden /> Gift
        </p>

        <p className="nud-eyebrow">After</p>
        <p className="nud-turn-line">
          Gift <i aria-hidden /> Experience <i aria-hidden /> Product
        </p>
      </div>

      <div
        className="nud-ia rise col-start-6 col-span-3 row-start-4 row-span-3"
        style={{ "--delay": "0.34s" } as CSSProperties}
      >
        <p className="nud-eyebrow">Proposed IA</p>

        <ul className="nud-tree">
          {AFTER.map((node, i) => (
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
      </div>

      {/* 다음 장의 뼈대 */}
      <p
        className="nud-triad rise col-start-1 col-span-4 row-start-6"
        style={{ "--delay": "0.46s" } as CSSProperties}
      >
        {RULES.map((rule) => (
          <span key={rule}>{rule}</span>
        ))}
      </p>
    </div>
  );
}
