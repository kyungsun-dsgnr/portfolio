"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";

import { useInView } from "@/components/useInView";

/** 카드 셋은 3칼럼부터 두 칼럼씩 차지하고 3~6행에 놓입니다.
 *  target 은 눌렀을 때 건너뛸 장의 id 입니다. 아직 없는 장은 비워 둡니다. */
const WORKS = [
  {
    index: "01",
    title: "Gentle Monster Explore",
    body: "거리감과 시선의 흐름을 바탕으로 브랜드 공간을 탐색하는 경험",
    place: "col-start-3 col-span-2",
    image: "/images/work-gentle-monster.png",
    target: "gentle-monster",
  },
  {
    index: "02",
    title: "Tamburins Compose",
    body: "감각을 이용해 선물꾸러미를 조합하는 방식으로 선물의 무드와 구성을 만드는 경험",
    place: "col-start-5 col-span-2",
    image: "/images/work-tamburins.png",
    target: undefined,
  },
  {
    index: "03",
    title: "Nudake Gift",
    body: "고르고 건네는 행동 기억을 바탕으로 선물의 감정을 구성하는 경험",
    place: "col-start-7 col-span-2",
    image: "/images/work-nudake.png",
    target: undefined,
  },
];

/** 6섹션 — 세 가지 실험 */
export function SceneWork() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  /* 카드 위에서는 기본 커서를 감추고 원형 "VIEW" 를 따라다니게 합니다.
     위치는 매 움직임마다 리렌더하지 않도록 ref 로 직접 갱신합니다. */
  const cursorRef = useRef<HTMLDivElement>(null);
  const [showCursor, setShowCursor] = useState(false);

  function moveCursor(event: PointerEvent<HTMLElement>) {
    const el = cursorRef.current;
    if (!el) return;
    // 퍼센트는 요소 자기 크기 기준이라, 이 한 줄로 커서 중심에 맞춰집니다.
    el.style.translate = `calc(${event.clientX}px - 50%) calc(${event.clientY}px - 50%)`;
  }

  function enter(event: PointerEvent<HTMLElement>) {
    // 터치로는 커서가 남아 버리므로 마우스일 때만 씁니다.
    if (event.pointerType !== "mouse") return;
    moveCursor(event);
    setShowCursor(true);
  }

  function open(event: MouseEvent<HTMLAnchorElement>, target: string) {
    const section = document.getElementById(target);
    if (!section) return;

    // 기본 앵커 이동은 순간이동이라 막고, 노브가 넘어갈 때와 같은 방식으로 스크롤합니다.
    event.preventDefault();
    setShowCursor(false);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-span-4 row-start-1 row-span-2">
        Three Directions
      </h2>

      <p
        className="type-body rise col-span-2 col-start-7 row-start-1 row-span-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        하나의 UX 관점에서 출발한 세 가지 실험입니다.
        <br />
        <br />
        익숙한 감각과 행동의 기억을 각각 탐색, 선택, 구성의 디지털 경험으로 확장했습니다.
      </p>

      {WORKS.map((work, i) => {
        const className = `work rise row-start-3 row-span-4 ${work.place}`;
        const style = { "--delay": `${0.2 + i * 0.08}s` } as CSSProperties;

        const inner = (
          <>
            <div className="work-head">
              <span className="card-index">{work.index}</span>
              <h3 className="type-title">{work.title}</h3>
              <p className="type-body">{work.body}</p>
            </div>

            <div className="work-visual">
              <Image
                src={work.image}
                alt={work.title}
                fill
                sizes="(min-width: 1024px) 24vw, 90vw"
                className="object-cover"
              />
            </div>
          </>
        );

        // 갈 곳이 있는 카드만 링크로 만듭니다. 나머지는 VIEW 커서도 띄우지 않습니다.
        if (!work.target) {
          return (
            <div key={work.index} className={className} style={style}>
              {inner}
            </div>
          );
        }

        return (
          <a
            key={work.index}
            href={`#${work.target}`}
            data-linked
            className={className}
            style={style}
            onClick={(event) => open(event, work.target)}
            onPointerEnter={enter}
            onPointerMove={showCursor ? moveCursor : undefined}
            onPointerLeave={() => setShowCursor(false)}
          >
            {inner}
          </a>
        );
      })}

      <div ref={cursorRef} className="view-cursor" data-on={showCursor || undefined} aria-hidden>
        VIEW
      </div>
    </div>
  );
}
