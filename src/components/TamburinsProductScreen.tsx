"use client";

/** 탬버린즈 제품 상세 화면. 15장 둘째 칸에 들어갑니다. */

/* 아래쪽에 접혀 있는 항목들 */
const FOLDS = ["제품 상세정보", "전성분", "배송 및 반품", "유료 쇼핑백 서비스"];

/**
 * 기프트에서 한 번 더 들어와야 닿는 화면.
 * 향은 여기서도 바로 고를 수 없고 "선택하기" 를 눌러 창을 열어야 합니다.
 */
export function TamburinsProductScreen() {
  return (
    <div className="prod-screen">
      <div className="prod-screen-hero">
        {/* 몇 번째 장인지 알려 주는 막대 */}
        <span className="prod-screen-bar" aria-hidden>
          <span />
        </span>
      </div>

      <div className="prod-screen-head">
        <h4>쉘 퍼퓸 핸드 & 립밤 세트</h4>
        <p className="prod-screen-price">₩ 52,400</p>
        <p className="prod-screen-pack">
          Special Gift S 선물 포장 &amp; 쇼핑백 증정
          <i aria-hidden />
        </p>
      </div>

      <div className="prod-screen-thumbs">
        <figure>
          <div className="prod-screen-thumb" />
          <figcaption>쉘 퍼퓸 핸드 & 립밤 세트</figcaption>
        </figure>
      </div>

      <hr className="prod-screen-rule" />

      <div className="prod-screen-size">
        <span>사이즈</span>
        <button type="button">15mL+5g</button>
      </div>

      {/* 향을 고르려면 이 카드의 "선택하기" 를 눌러 창을 열어야 합니다. */}
      <div className="prod-screen-option">
        <p>(필수) 제품의 옵션을 선택해 주세요.</p>
        <div className="prod-screen-card">
          <div className="prod-screen-card-shot" />
          <div>
            <span>쉘 퍼퓸 핸드 & 립밤 세트</span>
            <em>선택하기</em>
          </div>
        </div>
      </div>

      <div className="prod-screen-add">쇼핑백에 추가</div>

      <ul className="prod-screen-folds">
        {FOLDS.map((fold) => (
          <li key={fold}>
            {fold}
            <i aria-hidden />
          </li>
        ))}
      </ul>
    </div>
  );
}
