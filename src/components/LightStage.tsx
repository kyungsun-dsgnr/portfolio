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
/** 스크롤이 끝나고 1섹션을 원래 상태로 돌려놓기까지 */
const RESET_DELAY = 1000;

/**
 * 조명 상태 저장소이자 섹션 스크롤 영역.
 * 밝기를 --light (0~1) 로 내려보내 CSS 쪽에서도 반응할 수 있게 하고,
 * 노브가 끝까지 돌아가면 잠깐 뒤 다음 섹션으로 넘깁니다.
 */
export function LightStage({ sections }: { sections: ReactNode[] }) {
  const [level, setLevel] = useState(0);
  /** 다음 장으로 넘어가는 중. 이어지는 단어를 키우는 데 씁니다. */
  const [advancing, setAdvancing] = useState(false);
  /** 노브를 다 돌렸을 때 내려갈 곳 — 두 번째 섹션 */
  const nextRef = useRef<HTMLElement>(null);
  /** 100% 에 막 도달한 순간에만 넘깁니다. 이미 100% 인 채로 올라온 경우는 그대로 둡니다. */
  const wasFull = useRef(false);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  useEffect(() => clearTimers, []);

  function handleLevel(next: number) {
    setLevel(next);

    if (next < 1) {
      wasFull.current = false;
      clearTimers();
      setAdvancing(false);
      return;
    }

    if (wasFull.current) return;
    wasFull.current = true;
    setAdvancing(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(
      window.setTimeout(() => {
        nextRef.current?.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "center",
        });
        // 다음 장에 도착한 뒤 1섹션은 원래 크기로 돌려 둡니다.
        // 화면 밖에서 일어나므로 되돌아가는 모습은 보이지 않습니다.
        timers.current.push(window.setTimeout(() => setAdvancing(false), RESET_DELAY));
      }, ADVANCE_DELAY),
    );
  }

  return (
    <LightContext.Provider value={{ level, setLevel: handleLevel }}>
      <main
        className="scroll-root"
        data-advancing={advancing || undefined}
        style={{ "--light": level } as CSSProperties}
      >
        {sections.map((section, index) => (
          <section
            key={index}
            className="section"
            ref={index === 1 ? nextRef : undefined}
          >
            <div className="canvas">{section}</div>
          </section>
        ))}
      </main>
    </LightContext.Provider>
  );
}
