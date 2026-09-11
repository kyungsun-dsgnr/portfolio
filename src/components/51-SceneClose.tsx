"use client";

/**
 * 맺음 — What We Already Know Becomes Interaction.
 *
 * 6장 `Three Directions` 의 판을 그대로 맨 뒤에 세웁니다 — 밝은 장입니다.
 * 제목 1–6단 1–2행 두 줄 · 카드 셋 3–4 / 5–6 / 7–8단 3–6행.
 * 카드마다 그 갈래의 고친 뒤 화면이 살아 있는 채로 담깁니다.
 * 누르면 6장처럼 그 갈래의 첫 장으로 건너갑니다.
 */

import {
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";

import { NudakeMockCompose } from "@/components/NudakeComposeScreen";
import { StoreGlobeMock } from "@/components/StoreGlobeMock";
import { TamburinsComposeScreenB } from "@/components/TamburinsComposeScreenB";
import { useInView } from "@/components/useInView";

const WORKS = [
  {
    index: "01",
    title: "Explore — Gentle Monster",
    project:
      "익숙한 지구본 탐색 방식을 활용해, 가까운 매장을 찾는 경험을 전 세계의 브랜드 공간을 탐색하는 경험으로 확장했습니다.",
    place: "col-start-3 col-span-2",
    target: "gentle-monster-paper",
  },
  {
    index: "02",
    title: "Compose — Tamburins",
    project:
      "여러 화면에 나뉘어 있던 제품과 향 선택을 하나의 화면에 모아, 옵션을 고르는 과정에서 선물을 직접 구성하는 경험으로 전환했습니다.",
    place: "col-start-5 col-span-2",
    target: "tamburins",
  },
  {
    index: "03",
    title: "Give — Nudake",
    project:
      "외부 서비스로 이어지던 선물 구매 과정을 브랜드 안에서 직접 고르고, 메시지를 작성하고, 완성해 전달하는 경험으로 확장했습니다.",
    place: "col-start-7 col-span-2",
    target: "nudake",
  },
];

export function SceneClose() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  /* 카드 위에서는 기본 커서를 감추고 원형 "VIEW" 를 따라다니게 합니다. */
  const cursorRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const [showCursor, setShowCursor] = useState(false);

  function moveCursor(event: PointerEvent<HTMLElement>) {
    const el = cursorRef.current;
    if (!el) return;
    const at = `calc(${event.clientX}px - 50%) calc(${event.clientY}px - 50%)`;
    el.style.translate = at;
    /* 글이 앉는 가운데 원도 같은 자리로 — 섞지 않으려 따로 세운 것입니다. */
    if (coreRef.current) coreRef.current.style.translate = at;
  }

  function enter(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    moveCursor(event);
    setShowCursor(true);
  }

  function open(event: MouseEvent<HTMLAnchorElement>, target: string) {
    const section = document.getElementById(target);
    if (!section) return;
    event.preventDefault();
    setShowCursor(false);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    section.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
  }

  return (
    <div
      ref={ref}
      className="page-grid close"
      data-visible={inView || undefined}
    >
      <h2 className="type-display rise col-span-6 row-start-1 row-span-2">
        What We Already Know
        <br />
        Becomes Interaction
      </h2>

      {/* 6장의 설명 자리 — 이 덱이 한 일을 한 줄로 맺습니다. */}
      <p
        className="type-body rise col-span-2 col-start-7 row-start-1 row-span-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        익숙한 행동과 감각, 기대를
        <br />
        자연스럽게 이해되는 디지털 경험으로 번역합니다.
      </p>

      {WORKS.map((work, i) => (
        <a
          key={work.index}
          href={`#${work.target}`}
          data-linked
          className={`work nud-cap-card rise row-start-3 row-span-4 ${work.place}`}
          style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
          onClick={(event) => open(event, work.target)}
          onPointerEnter={enter}
          onPointerMove={showCursor ? moveCursor : undefined}
          onPointerLeave={() => setShowCursor(false)}
        >
          <div className="work-head">
            <span className="card-index">{work.index}</span>
            <h3 className="type-title">{work.title}</h3>
          </div>

          {/* 그 갈래의 고친 뒤 화면. 위에서부터 보이는 만큼만 담깁니다. */}
          <div className="work-visual close-shot" aria-hidden>
            {work.index === "01" && <StoreGlobeMock initialWorld />}
            {work.index === "02" && <TamburinsComposeScreenB preset />}
            {work.index === "03" && (
              <NudakeMockCompose step="note" written height={726} />
            )}

            {/* 설명은 화면 아래쪽 흰 유리 판 위에 얹힙니다 —
                `Already There, Just Not Visible` 의 글판과 같은 결입니다. */}
            <div className="nud-cap">
              <p className="type-body">{work.project}</p>
            </div>
          </div>
        </a>
      ))}

      {/* 바깥 원은 아래 색을 뒤집고, 글이 앉는 가운데 원은 따로 서서 섞이지 않습니다. */}
      <div
        ref={cursorRef}
        className="view-cursor"
        data-on={showCursor || undefined}
        aria-hidden
      />
      <div
        ref={coreRef}
        className="view-cursor-core"
        data-on={showCursor || undefined}
        aria-hidden
      >
        VIEW
      </div>
    </div>
  );
}
