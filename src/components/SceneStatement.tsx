"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/** 2섹션 — 단어가 하나씩 떠오릅니다. */
const LINES = [
  ["What", "We"],
  ["Already", "Know"],
];

/** 단어 사이 간격 */
const STAGGER = 0.22;
/** 장이 바뀌자마자 시작하지 않고 한 박자 쉽니다. */
const LEAD_IN = 0.15;

export function SceneStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // 섹션이 화면에 들어왔을 때 단어 애니메이션을 시작합니다.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="statement" data-visible={visible || undefined}>
      <h2 className="type-display statement-text">
        {LINES.map((line, lineIndex) => {
          // 앞 줄에 있던 단어 수만큼 순번을 밀어 줄이 바뀌어도 차례가 이어집니다.
          const offset = LINES.slice(0, lineIndex).reduce((total, l) => total + l.length, 0);

          return (
            <span key={lineIndex} className="statement-line">
              {line.map((word, index) => (
                <span
                  key={word}
                  className="word"
                  style={
                    { "--delay": `${LEAD_IN + (offset + index) * STAGGER}s` } as CSSProperties
                  }
                >
                  {word}
                </span>
              ))}
            </span>
          );
        })}
      </h2>
    </div>
  );
}
