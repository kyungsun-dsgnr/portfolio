"use client";

/** 탬버린즈 커스텀 기프트 상세 화면. 15장 첫 칸에 들어갑니다. */

import Image from "next/image";
import { useEffect, useRef } from "react";

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
  { name: "쉘 퍼퓸 핸드 & 립밤 세트" },
  { name: "에그 퍼퓸 & 퍼퓸 밤 세트" },
  { name: "캔들 & 룸 스프레이 세트" },
  { name: "캔들 & 핸드워시 세트" },
];

/** 고르는 참인 세트의 차례 */
const PICKED = 1;

/**
 * 실제 화면 하나. 칸 안에서 위아래로 굴려 볼 수 있고,
 * 관련 제품 줄은 옆으로 굴러갑니다.
 */
export function TamburinsGiftScreen() {
  const page = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);

  /* 처음부터 관련 제품 줄이 보이고, 고르는 세트가 앞에 오게 굴려 둡니다.
     화면 크기에 따라 픽셀 값이 달라지므로 요소의 실제 자리에서 끌어옵니다. */
  useEffect(() => {
    const sub = page.current?.querySelector<HTMLElement>(".gift-screen-sub");
    if (page.current && sub) page.current.scrollTop = sub.offsetTop;

    const card = row.current?.children[PICKED] as HTMLElement | undefined;
    if (row.current && card) row.current.scrollLeft = card.offsetLeft;
  }, []);

  return (
    <div className="gift-screen" ref={page}>
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
