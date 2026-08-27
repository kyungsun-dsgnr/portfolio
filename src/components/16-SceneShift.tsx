"use client";

/** 16장 — 고르는 절차에서 구성하는 행동으로 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 지금은 네 화면을 차례로 지나야 하나의 선물이 됩니다. */
const CURRENT = ["Gift Set", "Scent 01", "Scent 02", "Complete"];

/**
 * 문제에서 제안으로 넘어가는 장. 화면을 보여 주지 않고,
 * 걸음의 개수와 자리만으로 무엇이 달라지는지 말합니다.
 */
export function SceneShift() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-5 row-start-1 row-span-2">
        From Selection
        <br />
        to Composition.
      </h2>

      <div
        className="shift-side rise self-start col-start-2 col-span-2 row-start-3 row-span-3"
        style={{ "--delay": "0.12s" } as CSSProperties}
      >
        <p className="shift-label">Current</p>
        <ol className="shift-chain">
          {CURRENT.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div
        className="shift-side rise self-start col-start-6 col-span-2 row-start-3 row-span-3"
        style={{ "--delay": "0.22s" } as CSSProperties}
      >
        <p className="shift-label">Proposed</p>
        <p className="shift-one">Compose</p>
      </div>

      <p
        className="type-body rise col-start-5 col-span-4 row-start-6"
        style={{ "--delay": "0.3s" } as CSSProperties}
      >
        여러 화면에 나뉜 선택을 하나의 선물을 구성하는 연속적인 경험으로
        재구성합니다.
      </p>
    </div>
  );
}
