"use client";

/** 아직 화면을 짜지 않은 장 — 제목과 무엇을 넣을지만 적어 둡니다. */

import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/components/useInView";

type Props = {
  /** 제목. 줄바꿈은 부르는 쪽에서 넣습니다. */
  title: ReactNode;
  /** 이 장에 들어갈 것들. 한 줄에 하나씩. */
  lines: string[];
};

/**
 * 자리만 잡아 둔 장. 화면 구성은 나중에 함께 짜기로 하고,
 * 지금은 제목과 들어갈 내용만 남겨 순서를 확인할 수 있게 합니다.
 */
export function SceneDraft({ title, lines }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-5 row-start-1 row-span-2">
        {title}
      </h2>

      <ul
        className="draft-list rise col-start-1 col-span-4 row-start-5 row-span-2"
        style={{ "--delay": "0.12s" } as CSSProperties}
      >
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
