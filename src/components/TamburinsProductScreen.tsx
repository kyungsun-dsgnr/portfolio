"use client";

/** 탬버린즈 제품 상세 화면. 15장 둘째 칸에 들어갑니다. */

import Image from "next/image";
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
export function TamburinsProductScreen({
  chosen = false,
  still = false,
  addPress = false,
}: {
  /** 향을 다 고른 뒤. 옵션 카드에 고른 것이 적히고 담기 단추가 살아납니다. */
  chosen?: boolean;
  /** 스스로 훑지 않고 옵션 자리에 멈춰 있습니다. */
  still?: boolean;
  /** "쇼핑백에 추가" 를 누르는 참 */
  addPress?: boolean;
} = {}) {
  const [page, inView] = useInView<HTMLDivElement>(0.3);
  /** 선택하기를 누르는 참 */
  const [press, setPress] = useState(false);

  useEffect(() => {
    const view = page.current;
    if (!view) return;

    /* 다 고른 뒤 보여 주는 화면은 훑지 않고 옵션 자리에 바로 섭니다. */
    if (still) {
      /* 고른 향이 적힌 자리가 보이도록 옵션 칸에 맞춰 섭니다. */
      const option = view.querySelector<HTMLElement>(".prod-screen-option");
      if (option) view.scrollTo({ top: option.offsetTop });
      return;
    }

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
  }, [inView, page, still]);

  return (
    <div
      className="prod-screen"
      ref={page}
      data-press={press || undefined}
      data-chosen={chosen || undefined}
      data-add={addPress || undefined}
    >
      <div className="prod-screen-hero">
        <Image
          src="/images/tam-prod-hero.png"
          alt=""
          fill
          sizes="25vw"
          className="object-cover"
        />
      </div>

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
          <div className="prod-screen-thumb">
            <Image
              src="/images/tam-prod-thumb.png"
              alt=""
              fill
              sizes="8vw"
              className="object-cover"
            />
          </div>
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
          <div className="prod-screen-card-shot">
            <Image
              src="/images/tam-prod-option.png"
              alt=""
              fill
              sizes="8vw"
              className="object-cover"
            />
          </div>
          <div>
            <span>룸 스프레이 & 핸드워시 세트</span>
            {/* 다 고른 뒤에는 고른 향이 여기 적히고, 글자도 "변경하기" 가 됩니다. */}
            {chosen && (
              <span className="prod-screen-picks">
                <span>선택1: 룸 스프레이 파인네스트</span>
                <span>선택2: 퍼퓸드 핸드워시 카모</span>
              </span>
            )}
            <em>{chosen ? "변경하기" : "선택하기"}</em>
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
