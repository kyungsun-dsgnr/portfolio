"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

import { useInView } from "@/components/useInView";

export type CompareView = {
  /** Before / After */
  label: string;
  name: string;
  /** 화면을 이루는 요소들 */
  parts: string;
  visual: ReactNode;
};

type Props = {
  title: ReactNode;
  body: ReactNode;
  after: CompareView;
  before: CompareView;
};

/**
 * 비포/애프터를 크기로 말하는 장.
 * 큰 자리에 지금 보는 화면을, 우측 하단 작은 카드에 나머지 하나를 둡니다.
 * 작은 카드를 누르면 둘이 자리를 바꿉니다.
 */
export function SceneCompare({ title, body, after, before }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [showing, setShowing] = useState<"after" | "before">("after");

  const big = showing === "after" ? after : before;
  const small = showing === "after" ? before : after;

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <div className="compare-frame rise col-span-4 row-start-1 row-span-6">
        {big.visual}

        {/* 큰 자리에 지금 무엇이 있는지, 그 위에 얹어 설명합니다. */}
        <div className="compare-caption">
          <span className="card-index">{big.label}</span>
          <h3 className="type-title">{big.name}</h3>
          <p className="type-body">{big.parts}</p>
        </div>
      </div>

      <h2
        className="type-display compare-headline rise col-span-3 col-start-6 row-start-1 row-span-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        {title}
      </h2>

      <div
        className="type-body compare-body rise col-start-7 col-span-2 row-start-3 row-span-2"
        style={{ "--delay": "0.18s" } as CSSProperties}
      >
        {body}
      </div>

      {/* 누르면 큰 자리와 맞바꿉니다. */}
      <button
        type="button"
        className="compare-swap rise col-start-7 col-span-2 row-start-5 row-span-2"
        style={{ "--delay": "0.26s" } as CSSProperties}
        onClick={() => setShowing(showing === "after" ? "before" : "after")}
      >
        <span className="compare-frame">{small.visual}</span>
        <span className="compare-swap-label">{small.label}</span>
      </button>
    </div>
  );
}
