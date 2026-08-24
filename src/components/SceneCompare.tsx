"use client";

import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/components/useInView";

export type CompareView = {
  /** Before / After */
  label: string;
  name: string;
  /** 화면을 이루는 요소들 */
  parts: string;
  visual?: ReactNode;
};

type Props = {
  title: ReactNode;
  after: CompareView;
  before: CompareView;
};

function Caption({ view }: { view: CompareView }) {
  return (
    <div className="compare-caption">
      <span className="card-index">{view.label}</span>
      <h3 className="type-title">{view.name}</h3>
      <p className="type-body">{view.parts}</p>
    </div>
  );
}

/**
 * 비포/애프터를 나란히 두되 크기로 위계를 주는 장.
 * 바뀐 화면은 우측 전체 높이를, 기존 화면은 좌측 아래를 씁니다.
 */
export function SceneCompare({ title, after, before }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display compare-headline rise col-start-1 col-span-3 row-start-1 row-span-2">
        {title}
      </h2>

      <div
        className="compare-frame compare-after rise col-start-5 col-span-4 row-start-1 row-span-6"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        {after.visual}
        <Caption view={after} />
      </div>

      <div
        className="compare-frame compare-before rise col-start-1 col-span-4 row-start-3 row-span-4"
        style={{ "--delay": "0.18s" } as CSSProperties}
      >
        {before.visual}
        <Caption view={before} />
      </div>
    </div>
  );
}
