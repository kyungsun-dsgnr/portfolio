"use client";

/** 탬버린즈 기프트 목록 화면. 15장 첫 칸에 들어갑니다. */

import type { CSSProperties } from "react";

/* 화면 원본 폭. 칸(333)보다 조금 넓어 그만큼 줄여 앉힙니다. */
const SCREEN_W = 338;

/* 가로로 이어지는 세트들. 목록에서는 이름만 보이고
   어떤 향이 들어가는지는 알 수 없습니다 — 이 장이 짚는 지점입니다. */
const SETS = [
  "에그 퍼퓸 & 립밤 세트",
  "룸 스프레이 & 핸드워시 세트",
  "쉘 퍼퓸 핸드 & 립밤 세트",
  "에그 퍼퓸 & 퍼퓸 밤 세트",
  "캔들 & 룸 스프레이 세트",
  "캔들 & 핸드워시 세트",
];

const px = (value: number) => `calc(${value} * var(--u))`;

/** 실제 화면 하나. 칸 안에서 위쪽부터 보이고 아래는 잘립니다. */
export function TamburinsGiftScreen({
  width,
  shift = 270,
}: {
  width: number;
  /** 본문을 이만큼 끌어올려, 이미 아래로 굴린 상태를 보여 줍니다. */
  shift?: number;
}) {
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

      <div
        className="gift-screen-body"
        style={{ marginTop: px(-shift) } as CSSProperties}
      >
        {/* 화면 폭을 꽉 채우는 큰 그림 */}
        <div className="gift-screen-hero" />

        <div className="gift-screen-lead">
          <strong>NEW 커스텀 기프트</strong>
          <span>
            감사의 마음을 담아, 소중한 사람에게 특별한 선물을 전해보세요.
          </span>
        </div>

        {/* 옆으로 이어지는 세트 줄. 손으로 옆으로 굴릴 수 있습니다. */}
        <div className="gift-screen-row">
          {SETS.map((name) => (
            <article key={name}>
              <div className="gift-screen-shot" />
              <h5>{name}</h5>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
