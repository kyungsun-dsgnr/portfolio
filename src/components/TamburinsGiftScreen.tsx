"use client";

/** 탬버린즈 기프트 목록 화면. 15장 첫 칸에 들어갑니다. */

import type { CSSProperties } from "react";

/* 화면 원본 폭. 칸(333)보다 조금 넓어 그만큼 줄여 앉힙니다. */
const SCREEN_W = 338;

/* 목록에 서는 세트들. 목록에서는 이름과 값만 보이고
   어떤 향이 들어가는지는 알 수 없습니다 — 이 장이 짚는 지점입니다. */
const SETS = [
  { name: "에그 퍼퓸 & 립밤 세트", gift: "Special Gift S", price: "81,900" },
  { name: "쉘 퍼퓸 핸드 & 립밤 세트", gift: "Special Gift S", price: "52,400" },
  {
    name: "룸 스프레이 & 핸드워시 세트",
    gift: "Special Gift L",
    price: "93,500",
  },
  {
    name: "에그 퍼퓸 & 퍼퓸 밤 세트",
    gift: "Special Gift M",
    price: "100,000",
  },
];

const px = (value: number) => `calc(${value} * var(--u))`;

/** 실제 화면 하나. 칸 안에서 위쪽부터 보이고 아래는 잘립니다. */
export function TamburinsGiftScreen({ width }: { width: number }) {
  return (
    <div
      className="gift-screen"
      style={
        {
          width: px(SCREEN_W),
          scale: width / SCREEN_W,
        } as CSSProperties
      }
    >
      <header className="gift-screen-top">
        <h4>기프트</h4>
        <div className="gift-screen-tabs">
          <span data-on="">커스텀 기프트</span>
          <span>베스트 기프트</span>
        </div>
      </header>

      <div className="gift-screen-lead">
        <strong>NEW 커스텀 기프트</strong>
        <span>
          감사의 마음을 담아, 소중한 사람에게 특별한 선물을 전해보세요.
        </span>
      </div>

      <div className="gift-screen-grid">
        {SETS.map((set) => (
          <article key={set.name}>
            <div className="gift-screen-shot" />
            <h5>{set.name}</h5>
            <span>{set.gift} 선물 포장 & 쇼핑백 증정</span>
            <em>₩ {set.price}</em>
          </article>
        ))}
      </div>
    </div>
  );
}
