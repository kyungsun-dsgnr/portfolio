"use client";

import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/components/useInView";

type Props = {
  title: ReactNode;
  body: ReactNode;
  /** 큰 자리 — 바뀐 뒤 */
  after: ReactNode;
  /** 작은 자리 — 바뀌기 전 */
  before: ReactNode;
};

/**
 * 비포/애프터를 크기로 말하는 장.
 * 좌측 4칼럼 × 6행에 바뀐 화면을, 우측 하단 2칼럼 × 2행에 기존 화면을 둡니다.
 * 나란히 놓고 고르게 하는 대신 위계로 주장합니다.
 */
export function SceneCompare({ title, body, after, before }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <div className="compare-after rise col-span-4 row-start-1 row-span-6">{after}</div>

      <h2
        className="type-display rise col-span-3 col-start-6 row-start-1 row-span-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        {title}
      </h2>

      <div
        className="type-body rise col-span-3 col-start-6 row-start-3"
        style={{ "--delay": "0.18s" } as CSSProperties}
      >
        {body}
      </div>

      <div
        className="compare-before rise col-start-7 col-span-2 row-start-5 row-span-2"
        style={{ "--delay": "0.26s" } as CSSProperties}
      >
        {before}
      </div>
    </div>
  );
}
