"use client";

/** 탬버린즈 장바구니 화면. 담은 뒤에야 고른 구성이 한자리에 모입니다. */

import Image from "next/image";

/* 담긴 것들. 세트 하나에 쇼핑백이 따라옵니다. */
const LINES = [
  {
    name: "룸 스프레이 & 핸드워시 세트",
    price: "₩ 93,500",
    shot: "/images/tam-prod-option.png",
    picks: ["선택1: 룸 스프레이 파인네스트", "선택2: 퍼퓸드 핸드워시 카모"],
    removable: true,
  },
  { name: "쇼핑백 (L)", price: "무료 증정", shot: "/images/tam-bag.png" },
];

/** 담은 뒤 열리는 장바구니 */
export function TamburinsCartScreen() {
  return (
    <div className="cart-screen">
      <header className="cart-head">
        <h4>장바구니</h4>
        <span className="scent-close" aria-hidden />
      </header>

      <div className="cart-body">
        <ul className="cart-list">
          {LINES.map((line) => (
            <li key={line.name}>
              <div className="cart-shot">
                {line.shot && (
                  <Image
                    src={line.shot}
                    alt=""
                    fill
                    sizes="8vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="cart-text">
                <span className="cart-name">{line.name}</span>
                <span className="cart-price">{line.price}</span>
                {/* 고른 구성은 담고 나서야 이렇게 한자리에 보입니다. */}
                {line.picks && (
                  <span className="cart-picks">
                    {line.picks.map((pick) => (
                      <span key={pick}>{pick}</span>
                    ))}
                  </span>
                )}
                <span className="cart-foot">
                  <span className="cart-count">
                    수량
                    <i aria-hidden />
                  </span>
                  {line.removable && <em>삭제</em>}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* 목록 위로 떠 있는 권유 카드 */}
        <div className="cart-nudge">
          <div className="cart-nudge-shot">
            <Image
              src="/images/tam-bag.png"
              alt=""
              fill
              sizes="6vw"
              className="object-cover"
            />
          </div>
          <div>
            <span>쇼핑백을 추가하시겠습니까?</span>
            <em>추가하기</em>
          </div>
        </div>

        <div className="cart-sum">
          <p>
            <span>주문금액</span>
            <span>₩ 93,500</span>
          </p>
          <p>
            <span>
              배송비<i>3만원 이상 구매시 무료</i>
            </span>
            <span>₩ 0</span>
          </p>
          <p className="cart-total">
            <span>총 주문금액</span>
            <span>₩ 93,500</span>
          </p>
        </div>
      </div>

      <div className="cart-pay">₩ 93,500 결제하기</div>
    </div>
  );
}
