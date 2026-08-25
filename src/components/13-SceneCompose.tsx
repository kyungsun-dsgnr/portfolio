"use client";

/** 13장 — 탬버린즈 프로젝트 선언 */

import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/components/useInView";

/** 소제목 + 본문 한 덩어리. 3장 관점 페이지와 같은 짜임입니다. */
function Note({
  title,
  children,
  className,
  delay,
}: {
  title: string;
  children: ReactNode;
  className: string;
  delay: string;
}) {
  return (
    <div
      className={`note rise ${className}`}
      style={{ "--delay": delay } as CSSProperties}
    >
      <h3 className="type-title">{title}</h3>
      <p className="type-body">{children}</p>
    </div>
  );
}

/**
 * 한 문장으로 프로젝트를 정의하고, 그 아래 지금과 제안을 나란히 둡니다.
 * 3장 관점 페이지와 같은 자리 — 문장은 위 세 행을 쓰고, 두 단은 5행에 낮게 섭니다.
 * 위아래와 왼쪽이 넓게 비어 문장이 먼저 읽힙니다.
 */
export function SceneCompose() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-span-7 row-span-3">
        From buying products
        <br />
        to composing a gift.
      </h2>

      <Note
        title="Current"
        className="col-start-3 col-span-3 row-start-5"
        delay="0.14s"
      >
        사용자는 기프트 세트를 구성하기 위해 여러 화면을 이동하며 상품과 옵션을
        반복해서 확인합니다.
      </Note>

      <Note
        title="Proposed"
        className="col-start-6 col-span-3 row-start-5"
        delay="0.24s"
      >
        세트 선택과 향 선택을 하나의 화면에 연결해 구매 절차를 하나의 Gift
        Composition 경험으로 재구성합니다.
      </Note>
    </div>
  );
}
