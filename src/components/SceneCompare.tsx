"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

import { useInView } from "@/components/useInView";

export type CompareView = {
  /** Before / After */
  label: string;
  name: string;
  /** 화면을 이루는 요소들. 큰 카드에서만 보입니다. */
  parts: string;
  visual?: ReactNode;
};

type Props = {
  title: ReactNode;
  after: CompareView;
  before: CompareView;
};

/** 큰 카드는 자기 쪽 바깥선에 붙어 다섯 단, 작은 카드는 세 단 아래쪽을 씁니다. */
const PLACE = {
  left: {
    big: "col-start-1 col-span-5 row-start-1 row-span-6",
    small: "col-start-1 col-span-3 row-start-4 row-span-3",
  },
  right: {
    big: "col-start-4 col-span-5 row-start-1 row-span-6",
    small: "col-start-6 col-span-3 row-start-4 row-span-3",
  },
};

function Card({
  view,
  side,
  big,
  delay,
  onSelect,
}: {
  view: CompareView;
  side: "left" | "right";
  big: boolean;
  delay: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={big}
      onClick={onSelect}
      style={{ "--delay": delay } as CSSProperties}
      className={`compare-card rise compare-${side} ${big ? "compare-big" : "compare-small"} ${PLACE[side][big ? "big" : "small"]}`}
    >
      <div className="compare-caption">
        <span className="card-index">{view.label}</span>
        <h3 className="type-title">{view.name}</h3>
        {big && <p className="type-body">{view.parts}</p>}
      </div>
      {view.visual}
    </button>
  );
}

/**
 * 비포/애프터를 나란히 두되 크기로 위계를 주는 장.
 * 두 카드는 각자 자리를 지키고, 작은 쪽을 누르면 크기만 서로 바뀝니다.
 */
export function SceneCompare({ title, after, before }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [big, setBig] = useState<"before" | "after">("before");

  const beforeIsBig = big === "before";

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      {/* 헤드라인은 작은 카드가 있는 쪽 단 위에 놓입니다. */}
      <h2
        className={`type-display compare-headline rise col-span-3 row-start-1 row-span-2 ${
          beforeIsBig ? "col-start-6" : "col-start-1"
        }`}
      >
        {title}
      </h2>

      <Card
        view={before}
        side="left"
        big={beforeIsBig}
        delay="0.1s"
        onSelect={() => setBig("before")}
      />
      <Card
        view={after}
        side="right"
        big={!beforeIsBig}
        delay="0.18s"
        onSelect={() => setBig("after")}
      />
    </div>
  );
}
