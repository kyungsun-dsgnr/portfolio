"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

import { useInView } from "@/components/useInView";

export type CompareView = {
  /** Before / After */
  label: string;
  name: string;
  /** 화면을 이루는 요소들. 큰 쪽에서만 보입니다. */
  parts: string;
  visual?: ReactNode;
};

type Props = {
  title: ReactNode;
  after: CompareView;
  before: CompareView;
};

/**
 * 비포/애프터를 나란히 두되 크기로 위계를 주는 장.
 * 작은 쪽을 누르면 두 화면이 자리를 바꿉니다.
 */
export function SceneCompare({ title, after, before }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [swapped, setSwapped] = useState(false);

  const big = swapped ? before : after;
  const small = swapped ? after : before;

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display compare-headline rise col-start-1 col-span-3 row-start-1 row-span-2">
        {title}
      </h2>

      <div
        className="compare-frame compare-big rise col-start-4 col-span-5 row-start-1 row-span-6"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        <div className="compare-caption">
          <span className="card-index">{big.label}</span>
          <h3 className="type-title">{big.name}</h3>
          <p className="type-body">{big.parts}</p>
        </div>
        {big.visual}
      </div>

      <button
        type="button"
        onClick={() => setSwapped((on) => !on)}
        className="compare-frame compare-small rise col-start-1 col-span-3 row-start-4 row-span-3"
        style={{ "--delay": "0.18s" } as CSSProperties}
      >
        <div className="compare-caption">
          <span className="card-index">{small.label}</span>
          <h3 className="type-title">{small.name}</h3>
        </div>
        {small.visual}
      </button>
    </div>
  );
}
