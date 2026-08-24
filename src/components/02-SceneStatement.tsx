"use client";

/** 2·5장 — 단어가 하나씩 떠오르는 문장 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/** 단어 사이 간격 */
const STAGGER = 0.22;
/** 장이 바뀌자마자 시작하지 않고 한 박자 쉽니다. */
const LEAD_IN = 0.15;

type Props = {
  /** 줄 단위로 묶은 단어들. 이 순서대로 하나씩 떠오릅니다. */
  lines: string[][];
  /** 아래로 더 내려가도록 유도하는 표시. 마지막 섹션에서는 끕니다. */
  cue?: boolean;
  /** 어두운 바탕 위의 밝은 글자 */
  dark?: boolean;
};

/** 캔버스 정중앙에서 단어가 하나씩 떠오르는 장 */
export function SceneStatement({ lines, cue = false, dark = false }: Props) {
  // 섹션이 화면에 들어왔을 때 단어 애니메이션을 시작합니다.
  const [ref, visible] = useInView<HTMLDivElement>(0.6);

  return (
    <div
      ref={ref}
      className={dark ? "statement statement-dark" : "statement"}
      data-visible={visible || undefined}
    >
      {cue && (
        <span className="scroll-cue" aria-hidden>
          <span className="scroll-cue-mouse">
            <span className="scroll-cue-dot" />
          </span>
          <span className="scroll-cue-chevron" />
        </span>
      )}

      <h2 className="type-display statement-text">
        {lines.map((line, lineIndex) => {
          // 앞 줄에 있던 단어 수만큼 순번을 밀어 줄이 바뀌어도 차례가 이어집니다.
          const offset = lines.slice(0, lineIndex).reduce((total, l) => total + l.length, 0);

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
