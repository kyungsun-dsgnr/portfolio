"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type LightValue = { level: number; setLevel: (level: number) => void };

const LightContext = createContext<LightValue | null>(null);

export function useLight() {
  const value = useContext(LightContext);
  if (!value)
    throw new Error("useLight 는 <LightStage> 안에서만 쓸 수 있습니다.");
  return value;
}

/** 조명이 다 켜진 뒤 다음 섹션으로 넘어가기까지 두는 사이 */
const ADVANCE_DELAY = 900;

/** 휠 잡음만 걸러 내는 최소값. 저항이 아니라 오작동을 막는 바닥값입니다. */
const WHEEL_MIN = 4;
/** 한 장 넘긴 뒤 다시 받지 않는 시간(ms). 관성으로 두 장씩 넘어가지 않게 합니다. */
const WHEEL_REST = 700;

/**
 * 조명 상태 저장소이자 섹션 스크롤 영역.
 * 밝기를 --light (0~1) 로 내려보내 CSS 쪽에서도 반응할 수 있게 하고,
 * 노브가 끝까지 돌아가면 잠깐 뒤 다음 섹션으로 넘깁니다.
 */
/** 각 장. id 는 카드에서 해당 장으로 건너뛸 때 쓰이고, label 은 하단 목차에 적힙니다.
 *  index 는 판 위쪽 여백에 적히는 쪽번호입니다(예: "04 — Tamburins"). */
export type Section = {
  id: string;
  node: ReactNode;
  label?: string;
  index?: string;
};

export function LightStage({ sections }: { sections: Section[] }) {
  const [level, setLevel] = useState(0);
  /** 노브를 다 돌렸을 때 내려갈 곳 — 두 번째 섹션 */
  const nextRef = useRef<HTMLElement>(null);
  /** 100% 에 막 도달한 순간에만 넘깁니다. 이미 100% 인 채로 올라온 경우는 그대로 둡니다. */
  const wasFull = useRef(false);
  const timers = useRef<number[]>([]);
  const rootRef = useRef<HTMLElement>(null);
  /** 지금 보고 있는 장. 하단 목차에서 표시합니다. */
  const [at, setAt] = useState(0);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  useEffect(() => clearTimers, []);

  /* 지금 몇 번째 장인지 따라갑니다. 한 프레임에 한 번으로 묶습니다. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let queued = 0;
    function onScroll() {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        setAt(Math.round(root!.scrollTop / root!.clientHeight));
      });
    }

    onScroll();
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(queued);
      root.removeEventListener("scroll", onScroll);
    };
  }, []);

  /** 목차에서 고른 장으로 옮깁니다. */
  function go(index: number) {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    root.scrollTo({
      top: index * root.clientHeight,
      behavior: reduced ? "auto" : "smooth",
    });
  }

  /* 넘김 자체에는 저항을 두지 않습니다. 한 번 굴리면 곧바로 옮겨 갑니다.
     다만 한 번의 손짓이 여러 장을 건너뛰지는 못하게 잠금만 겁니다. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let resting = false;
    /* 손을 뗀 뒤에도 관성으로 휠이 한동안 더 들어옵니다.
       그 흐름이 멎을 때까지 잠금을 계속 미뤄, 한 번의 손짓이 한 장만 넘기게 합니다. */
    let unlock = 0;

    function holdRest() {
      window.clearTimeout(unlock);
      unlock = window.setTimeout(() => {
        resting = false;
      }, WHEEL_REST);
    }

    /** 손끝 아래에 아직 굴러갈 데가 있으면 그 쪽에 맡깁니다(목업 목록, 매장 카드). */
    function inner(from: EventTarget | null) {
      let node = from instanceof HTMLElement ? from : null;
      while (node && node !== root) {
        const flow = getComputedStyle(node).overflowY;
        if (
          (flow === "auto" || flow === "scroll") &&
          node.scrollHeight > node.clientHeight + 1
        ) {
          return node;
        }
        node = node.parentElement;
      }
      return null;
    }

    function onWheel(event: WheelEvent) {
      // 지구본이 확대에 쓴 휠입니다.
      if (event.defaultPrevented) return;

      const box = inner(event.target);
      if (box) {
        const up = event.deltaY < 0;
        const done = up
          ? box.scrollTop <= 0
          : box.scrollTop + box.clientHeight >= box.scrollHeight - 1;
        if (!done) return;
      }

      event.preventDefault();

      /* 아직 관성이 흐르는 중이면 그만큼 잠금을 늘립니다. */
      if (resting) {
        holdRest();
        return;
      }

      if (Math.abs(event.deltaY) < WHEEL_MIN) return;

      const step = root!.clientHeight;
      const at = Math.round(root!.scrollTop / step);
      const to = Math.max(
        0,
        Math.min(sections.length - 1, at + (event.deltaY > 0 ? 1 : -1)),
      );
      if (to === at) return;

      resting = true;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      root!.scrollTo({
        top: to * step,
        behavior: reduced ? "auto" : "smooth",
      });
      holdRest();
    }

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", onWheel);
      window.clearTimeout(unlock);
    };
  }, [sections.length]);

  function handleLevel(next: number) {
    setLevel(next);

    if (next < 1) {
      wasFull.current = false;
      clearTimers();
      return;
    }

    if (wasFull.current) return;
    wasFull.current = true;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    timers.current.push(
      window.setTimeout(() => {
        nextRef.current?.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "center",
        });
      }, ADVANCE_DELAY),
    );
  }

  return (
    <LightContext.Provider value={{ level, setLevel: handleLevel }}>
      <main
        ref={rootRef}
        className="scroll-root"
        style={{ "--light": level } as CSSProperties}
      >
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="section"
            ref={index === 1 ? nextRef : undefined}
          >
            <div className="canvas">
              {/* 쪽번호는 판 바깥 여백에 앉아 그리드 어느 칸도 건드리지 않습니다. */}
              {section.index && (
                <p className="page-index" aria-hidden>
                  {section.index}
                </p>
              )}
              {section.node}
            </div>
          </section>
        ))}
      </main>

      {/* 하단 목차. 평소에는 손잡이만 걸쳐 두고, 다가가면 올라옵니다. */}
      <nav className="pager" aria-label="목차">
        <span className="pager-grip" aria-hidden />
        <ol className="pager-list">
          {sections.map((section, index) => (
            <li key={section.id}>
              <button
                type="button"
                className="pager-item"
                aria-current={index === at ? "true" : undefined}
                onClick={() => go(index)}
              >
                {section.label ?? section.id}
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </LightContext.Provider>
  );
}
