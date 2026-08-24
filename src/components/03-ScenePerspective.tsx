"use client";

/** 3장 — 관점 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/** 소제목 + 본문 한 덩어리 */
function Note({
  title,
  children,
  className,
  delay,
}: {
  title: string;
  children: React.ReactNode;
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

/** 3섹션 — 관점 */
export function ScenePerspective() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-span-7 row-span-3">
        UX begins before the screen appears, <br />
        where familiar senses and behaviors become expectations.
      </h2>

      <Note
        title="Perspective"
        className="col-start-3 col-span-3 row-start-5"
        delay="0.12s"
      >
        UX는 화면 안의 구성이나 기능 흐름에서만 시작되지 않습니다. <br />
        사용자가 이미 몸으로 알고 있는 감각, 행동, 기억이 디지털 경험 안에서
        <br />
        어떻게 이어지는지가 중요합니다.
      </Note>

      <Note
        title="Starting Point"
        className="col-start-6 col-span-3 row-start-5"
        delay="0.22s"
      >
        빛의 변화, 거리의 감각, 손의 움직임, 머무는 리듬처럼 익숙한 감각 단서는
        인터페이스를 이해하는 출발점이 됩니다.
      </Note>

      <Note
        title="Direction"
        className="col-start-6 col-span-3 row-start-6"
        delay="0.32s"
      >
        새롭게 배워야 하는 조작보다, 이미 알고 있던 감각을 통해 자연스럽게
        이해하고 반응할 수 있는 디지털 경험을 지향합니다.
      </Note>
    </div>
  );
}
