"use client";

/** 탬버린즈 향 선택 창. 15장 셋째·넷째 칸에 들어갑니다. */

/* 고를 수 있는 향. 설명은 이 창을 열어야만 드러납니다. */
const SCENTS = [
  {
    name: "에그 퍼퓸 레이트어텀",
    notes: "비터오렌지ㅣ사탕수수 풀내음ㅣ머스크",
  },
  {
    name: "에그 퍼퓸 카모",
    notes: "진득한 카모마일 | 부드러운 나무결 | 머스크",
  },
  {
    name: "에그 퍼퓸 블루히노키",
    notes: "상쾌한 파인오일 | 푸른 히노키 | 드리프트우드",
  },
  {
    name: "에그 퍼퓸 이브닝글로우",
    notes: "노을에 물든 장미 | 라즈베리 | 머스크",
  },
];

/**
 * 세트에 든 제품 수만큼 넘겨야 하는 창.
 * dim 에 든 번호는 흐려져, 고를 수 없는 향임을 그때서야 알게 됩니다.
 */
export function TamburinsScentScreen({
  step,
  dim = [],
}: {
  step: 1 | 2;
  dim?: number[];
}) {
  return (
    <div className="scent-screen">
      <div className="scent-sheet">
        <header className="scent-head">
          <span className="scent-back" aria-hidden />
          <h4>향을 선택하세요 ( {step}/2 )</h4>
          <span className="scent-close" aria-hidden />
        </header>

        <ul className="scent-list">
          {SCENTS.map((scent, i) => (
            <li key={scent.name} data-dim={dim.includes(i) || undefined}>
              <div className="scent-shot" />
              <div className="scent-text">
                <span className="scent-name">{scent.name}</span>
                <span className="scent-price">₩ 48,000</span>
                <span className="scent-notes">{scent.notes}</span>
                <span className="scent-more">
                  더보기
                  <i aria-hidden />
                </span>
              </div>
              <span className="scent-check" aria-hidden />
            </li>
          ))}
        </ul>

        <div className="scent-next">다음</div>
      </div>
    </div>
  );
}
