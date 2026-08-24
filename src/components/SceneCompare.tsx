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

/** 설명 한 묶음 + 그 아래 화면 목업 자리 */
function Frame({
  view,
  className,
  delay,
}: {
  view: CompareView;
  className: string;
  delay: string;
}) {
  return (
    <div
      className={`compare-frame rise ${className}`}
      style={{ "--delay": delay } as CSSProperties}
    >
      <div className="compare-caption">
        <span className="card-index">{view.label}</span>
        <h3 className="type-title">{view.name}</h3>
        <p className="type-body">{view.parts}</p>
      </div>
      <div className="compare-shot">{view.visual}</div>
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

      <Frame
        view={after}
        delay="0.1s"
        className="compare-after col-start-5 col-span-4 row-start-1 row-span-6"
      />

      <Frame
        view={before}
        delay="0.18s"
        className="compare-before col-start-1 col-span-4 row-start-3 row-span-4"
      />
    </div>
  );
}
