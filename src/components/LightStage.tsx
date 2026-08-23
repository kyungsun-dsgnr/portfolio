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
  if (!value) throw new Error("useLight 는 <LightStage> 안에서만 쓸 수 있습니다.");
  return value;
}

/** 조명이 다 켜진 뒤 다음 섹션으로 넘어가기까지 두는 사이 */
const ADVANCE_DELAY = 900;

/**
 * 조명 상태 저장소이자 섹션 스크롤 영역.
 * 밝기를 --light (0~1) 로 내려보내 CSS 쪽에서도 반응할 수 있게 하고,
 * 노브가 끝까지 돌아가면 잠깐 뒤 다음 섹션으로 넘깁니다.
 */
export function LightStage({
  intro,
  statement,
}: {
  intro: ReactNode;
  statement: ReactNode;
}) {
  const [level, setLevel] = useState(0);
  const statementRef = useRef<HTMLElement>(null);
  /** 100% 에 막 도달한 순간에만 넘깁니다. 이미 100% 인 채로 올라온 경우는 그대로 둡니다. */
  const wasFull = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function handleLevel(next: number) {
    setLevel(next);

    if (next < 1) {
      wasFull.current = false;
      return;
    }

    if (wasFull.current) return;
    wasFull.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(() => {
      statementRef.current?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "center",
      });
    }, ADVANCE_DELAY);
  }

  return (
    <LightContext.Provider value={{ level, setLevel: handleLevel }}>
      <main className="scroll-root" style={{ "--light": level } as CSSProperties}>
        <section className="section">
          <div className="canvas">{intro}</div>
        </section>

        <section className="section" ref={statementRef}>
          <div className="canvas">{statement}</div>
        </section>
      </main>
    </LightContext.Provider>
  );
}
