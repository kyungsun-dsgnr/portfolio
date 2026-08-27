"use client";

/** 탬버린즈 향 선택 창. 15장 셋째·넷째 칸에 들어갑니다. */

import Image from "next/image";

/* 고를 수 있는 향. 설명은 이 창을 열어야만 드러납니다. */
const SCENTS = [
  {
    name: "룸 스프레이 파인네스트",
    notes: "유칼립투스ㅣ파인니들ㅣ히노키우드",
    shot: "/images/tam-scent-1.png",
  },
  {
    name: "룸 스프레이 먹",
    notes: "그을린 소나무ㅣ먹물ㅣ패출리",
    shot: "/images/tam-scent-2.png",
  },
  {
    name: "룸 스프레이 멈버드",
    notes: "유자ㅣ국화ㅣ머스크",
    shot: "/images/tam-scent-3.png",
  },
  {
    name: "룸 스프레이 파피루스",
    notes: "파피루스ㅣ그린티ㅣ샌달우드",
    shot: "/images/tam-scent-4.png",
  },
];

/** 이 창의 향은 값이 모두 같습니다. */
const PRICE = "₩ 53,500";

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
              <div className="scent-shot">
                {scent.shot && (
                  <Image
                    src={scent.shot}
                    alt=""
                    fill
                    sizes="8vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="scent-text">
                <span className="scent-name">{scent.name}</span>
                <span className="scent-price">{PRICE}</span>
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
