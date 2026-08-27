"use client";

/** 탬버린즈 제품 상세 화면. 15장 둘째 칸에 들어갑니다. */

import { useEffect, useState } from "react";

import { useInView } from "@/components/useInView";

/* 아래쪽에 접혀 있는 항목들 */
const FOLDS = ["제품 상세정보", "전성분", "배송 및 반품"];

/* 장에 들어서면 스스로 훑습니다. 옵션 자리까지 내려가 "선택하기" 를 누릅니다. */
const SCROLL_AT = 800;
const PRESS_AT = 2200;

/**
 * 기프트에서 한 번 더 들어와야 닿는 화면.
 * 향은 여기서도 바로 고를 수 없고 "선택하기" 를 눌러 창을 열어야 합니다.
 */
export function TamburinsProductScreen() {
  const [page, inView] = useInView<HTMLDivElement>(0.3);
  /** 선택하기를 누르는 참 */
  const [press, setPress] = useState(false);

  useEffect(() => {
    const view = page.current;
    if (!view) return;

    if (!inView) {
      view.scrollTo({ top: 0 });
      const back = window.setTimeout(() => setPress(false), 0);
      return () => clearTimeout(back);
    }

    const timers = [
      window.setTimeout(() => {
        const option = view.querySelector<HTMLElement>(".prod-screen-option");
        if (option)
          view.scrollTo({ top: option.offsetTop, behavior: "smooth" });
      }, SCROLL_AT),
      window.setTimeout(() => setPress(true), PRESS_AT),
    ];

    return () => timers.forEach(clearTimeout);
  }, [inView, page]);

  return (
    <div className="prod-screen" ref={page} data-press={press || undefined}>
      <div className="prod-screen-hero" />

      <div className="prod-screen-head">
        <h4>룸 스프레이 & 핸드워시 세트</h4>
        <p className="prod-screen-price">₩ 93,500</p>
        <p className="prod-screen-pack">
          Special Gift L 선물 포장 &amp; 쇼핑백 증정
          <i aria-hidden />
        </p>
      </div>

      <div className="prod-screen-thumbs">
        <figure>
          <div className="prod-screen-thumb" />
          <figcaption>룸 스프레이 & 핸드워시 세트</figcaption>
        </figure>
      </div>

      <hr className="prod-screen-rule" />

      <div className="prod-screen-size">
        <span>사이즈</span>
        <button type="button">90mL+250mL</button>
      </div>

      {/* 향을 고르려면 이 카드의 "선택하기" 를 눌러 창을 열어야 합니다. */}
      <div className="prod-screen-option">
        <p>(필수) 제품의 옵션을 선택해 주세요.</p>
        <div className="prod-screen-card">
          <div className="prod-screen-card-shot" />
          <div>
            <span>룸 스프레이 & 핸드워시 세트</span>
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
