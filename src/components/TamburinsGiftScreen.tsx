"use client";

/** 탬버린즈 커스텀 기프트 상세 화면. 15장 첫 칸에 들어갑니다. */

/* 화면 폭은 칸과 같아 줄이지 않고 그대로 앉습니다. */

/* 안내 문구. 향은 여기서 "제품별로 고를 수 있다" 고만 적혀 있고,
   정작 어떤 향이 있는지는 이 화면에서 알 수 없습니다. */
const NOTES = [
  "제품별로 원하는 향을 담아 선물을 구성할 수 있습니다.",
  "본 상품은 기프트 패키지 가격이 포함된 구성입니다. (S 5,000원 / M 5,500원 / L 6,000원)",
  "커스텀 기프트 구매 시, 쇼핑백을 증정해 드립니다.",
];

/* 아래에 가로로 이어지는 관련 제품 */
const RELATED = [
  "에그 퍼퓸 & 립밤 세트",
  "룸 스프레이 & 핸드워시 세트",
  "쉘 퍼퓸 핸드 & 립밤 세트",
  "에그 퍼퓸 & 퍼퓸 밤 세트",
  "캔들 & 룸 스프레이 세트",
  "캔들 & 핸드워시 세트",
];

/**
 * 실제 화면 하나. 칸 안에서 위아래로 굴려 볼 수 있고,
 * 관련 제품 줄은 옆으로 굴러갑니다.
 */
export function TamburinsGiftScreen() {
  return (
    <>
      <div className="gift-screen">
        <h4 className="gift-screen-title">NEW 커스텀 기프트</h4>

        <section className="gift-screen-main">
          <div className="gift-screen-hero" />

          <div className="gift-screen-body">
            <p>감사의 마음을 담아, 소중한 사람에게 특별한 선물을 전해보세요.</p>
            <ul>
              {NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </section>

        <h5 className="gift-screen-sub">관련 제품</h5>

        {/* 옆으로 굴러가는 관련 제품 줄 */}
        <div className="gift-screen-row">
          {RELATED.map((name) => (
            <article key={name}>
              <div className="gift-screen-shot" />
              <h6>{name}</h6>
            </article>
          ))}
        </div>
      </div>

      {/* 굴려도 자리에 남는 동그란 단추 */}
      <span className="gift-screen-fab" aria-hidden />
    </>
  );
}
