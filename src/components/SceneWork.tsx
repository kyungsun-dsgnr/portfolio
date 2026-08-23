"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";

import { useInView } from "@/components/useInView";

/** 카드 셋은 3칼럼부터 두 칼럼씩 차지하고 3~6행에 놓입니다. */
const WORKS = [
  {
    index: "01",
    title: "Gentle Monster Explore",
    body: "거리감과 시선의 흐름을 바탕으로 브랜드 공간을 탐색하는 경험",
    place: "col-start-3 col-span-2",
  },
  {
    index: "02",
    title: "Tamburins Compose",
    body: "감각을 이용해 선물꾸러미를 조합하는 방식으로 선물의 무드와 구성을 만드는 경험",
    place: "col-start-5 col-span-2",
  },
  {
    index: "03",
    title: "Nudake Gift",
    body: "고르고 건네는 행동 기억을 바탕으로 선물의 감정을 구성하는 경험",
    place: "col-start-7 col-span-2",
  },
];

/** 6섹션 — 세 가지 실험 */
export function SceneWork() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  /* 카드 위에서는 기본 커서를 감추고 원형 "View" 를 따라다니게 합니다.
     위치는 매 움직임마다 리렌더하지 않도록 ref 로 직접 갱신합니다. */
  const cursorRef = useRef<HTMLDivElement>(null);
  const [showCursor, setShowCursor] = useState(false);

  function moveCursor(event: PointerEvent<HTMLDivElement>) {
    const el = cursorRef.current;
    if (!el) return;
    // 퍼센트는 요소 자기 크기 기준이라, 이 한 줄로 커서 중심에 맞춰집니다.
    el.style.translate = `calc(${event.clientX}px - 50%) calc(${event.clientY}px - 50%)`;
  }

  function enter(event: PointerEvent<HTMLDivElement>) {
    // 터치로는 커서가 남아 버리므로 마우스일 때만 씁니다.
    if (event.pointerType !== "mouse") return;
    moveCursor(event);
    setShowCursor(true);
  }

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-span-4 row-start-1 row-span-2">
        Three Directions
      </h2>

      <p
        className="type-body rise col-span-3 col-start-6 row-start-1 row-span-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        하나의 UX 관점에서 출발한 세 가지 실험입니다.
        <br />
        <br />
        익숙한 감각과 행동의 기억을 각각 탐색, 선택, 구성의 디지털 경험으로 확장했습니다.
      </p>

      {WORKS.map((work, i) => (
        <div
          key={work.index}
          className={`work rise row-start-3 row-span-4 ${work.place}`}
          style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
          onPointerEnter={enter}
          onPointerMove={showCursor ? moveCursor : undefined}
          onPointerLeave={() => setShowCursor(false)}
        >
          <div className="work-head">
            <span className="card-index">{work.index}</span>
            <h3 className="type-title">{work.title}</h3>
            <p className="type-body">{work.body}</p>
          </div>

          {/* 작업 이미지 자리 */}
          <div className="work-visual" />
        </div>
      ))}

      <div ref={cursorRef} className="view-cursor" data-on={showCursor || undefined} aria-hidden>
        VIEW
      </div>
    </div>
  );
}
