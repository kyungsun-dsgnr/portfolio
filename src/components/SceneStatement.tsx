"use client";

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/** 2섹션 — 단어가 하나씩 떠오릅니다. */
const LINES = [
  ["From", "Memory"],
  ["To", "Interaction"],
];

/** 단어 사이 간격 */
const STAGGER = 0.22;
/** 장이 바뀌자마자 시작하지 않고 한 박자 쉽니다. */
const LEAD_IN = 0.15;

export function SceneStatement() {
  // 섹션이 화면에 들어왔을 때 단어 애니메이션을 시작합니다.
  const [ref, visible] = useInView<HTMLDivElement>(0.6);

  return (
    <div ref={ref} className="statement" data-visible={visible || undefined}>
      {/* 아래로 더 내려가도록 유도하는 표시 */}
      <span className="scroll-cue" aria-hidden>
        <span className="scroll-cue-mouse">
          <span className="scroll-cue-dot" />
        </span>
        <span className="scroll-cue-chevron" />
      </span>

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
