"use client";

/** 탬버린즈 커스텀 기프트 상세 화면. 15장 첫 칸에 들어갑니다. */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useInView } from "@/components/useInView";

/* 안내 문구. 향은 여기서 "제품별로 고를 수 있다" 고만 적혀 있고,
   정작 어떤 향이 있는지는 이 화면에서 알 수 없습니다. */
const NOTES = [
  "제품별로 원하는 향을 담아 선물을 구성할 수 있습니다.",
  "본 상품은 기프트 패키지 가격이 포함된 구성입니다. (S 5,000원 / M 5,500원 / L 6,000원)",
  "커스텀 기프트 구매 시, 쇼핑백을 증정해 드립니다.",
];

/* 아래에 가로로 이어지는 관련 제품. 두 번째를 고르는 참입니다. */
const RELATED = [
  { name: "에그 퍼퓸 & 립밤 세트", shot: "/images/tam-set-1.png" },
  { name: "룸 스프레이 & 핸드워시 세트", shot: "/images/tam-set-2.png" },
  { name: "쉘 퍼퓸 핸드 & 립밤 세트", shot: "/images/tam-set-3.png" },
  { name: "에그 퍼퓸 & 퍼퓸 밤 세트", shot: "/images/tam-set-4.png" },
  { name: "캔들 & 룸 스프레이 세트" },
  { name: "캔들 & 핸드워시 세트" },
];

/** 고르는 참인 세트의 차례 */
const PICKED = 1;

/* 장에 들어서면 스스로 훑습니다.
   아래로 내려가 관련 제품을 보고, 옆으로 밀어 세트를 찾고, 그것을 엽니다. */
const SCROLL_AT = 700;
const SLIDE_AT = 2000;
const OPEN_AT = 3100;

/**
 * 실제 화면 하나. 칸 안에서 위아래로 굴려 볼 수 있고,
 * 관련 제품 줄은 옆으로 굴러갑니다.
 */
export function TamburinsGiftScreen() {
  const [page, inView] = useInView<HTMLDivElement>(0.3);
  const row = useRef<HTMLDivElement>(null);
  /** 세트를 여는 참 */
  const [opening, setOpening] = useState(false);

  /* 장에 들어설 때마다 처음부터 다시 훑습니다.
     굴리는 양은 요소의 실제 자리에서 끌어와 화면 크기와 무관합니다. */
  useEffect(() => {
    const view = page.current;
    const line = row.current;
    if (!view || !line) return;

    if (!inView) {
      /* 장을 벗어나면 처음으로 돌려 둡니다. 그리는 중에 바로 바꾸지 않고 한 박자 뒤에 둡니다. */
      view.scrollTo({ top: 0 });
      line.scrollTo({ left: 0 });
      const back = window.setTimeout(() => setOpening(false), 0);
      return () => clearTimeout(back);
    }

    const timers = [
      window.setTimeout(() => {
        const sub = view.querySelector<HTMLElement>(".gift-screen-sub");
        if (sub) view.scrollTo({ top: sub.offsetTop, behavior: "smooth" });
      }, SCROLL_AT),
      window.setTimeout(() => {
        const card = line.children[PICKED] as HTMLElement | undefined;
        if (card) line.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
      }, SLIDE_AT),
      window.setTimeout(() => setOpening(true), OPEN_AT),
    ];

    return () => timers.forEach(clearTimeout);
  }, [inView, page]);

  return (
    <div className="gift-screen" ref={page} data-opening={opening || undefined}>
      {/* 뒤는 어둡게 깔리고, 그 위에 흰 화면이 놓입니다. */}
      <div className="gift-sheet">
        <h4 className="gift-screen-title">NEW 커스텀 기프트</h4>

        <section className="gift-screen-main">
          <div className="gift-screen-hero">
            <Image
              src="/images/tam-gift-hero.png"
              alt=""
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>

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
        <div className="gift-screen-row" ref={row}>
          {RELATED.map((set, i) => (
            <article key={set.name} data-pick={i === PICKED || undefined}>
              <div className="gift-screen-shot">
                {set.shot && (
                  <Image
                    src={set.shot}
                    alt=""
                    fill
                    sizes="12vw"
                    className="object-cover"
                  />
                )}
              </div>
              <h6>{set.name}</h6>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
