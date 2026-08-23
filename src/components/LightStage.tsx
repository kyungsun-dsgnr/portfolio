"use client";

import {
  createContext,
  useContext,
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

/**
 * 페이지 그리드를 겸하는 조명 상태 저장소.
 * 밝기를 --light (0~1) 로 내려보내서 CSS 쪽에서도 반응할 수 있게 합니다.
 */
export function LightStage({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState(0);

  return (
    <LightContext.Provider value={{ level, setLevel }}>
      <main className="page-grid" style={{ "--light": level } as CSSProperties}>
        {children}
      </main>
    </LightContext.Provider>
  );
}
