"use client";

/** 탬버린즈 커스텀 기프트 상세 화면. 15장 첫 칸에 들어갑니다. */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { glide } from "@/components/glide";
import { useInView } from "@/components/useInView";

/* 안내 문구. 향은 여기서 "제품별로 고를 수 있다" 고만 적혀 있고,
   정작 어떤 향이 있는지는 이 화면에서 알 수 없습니다. */
const NOTES = [
  "제품별로 원하는 향을 담아 선물을 구성할 수 있습니다.",
  "본 상품은 기프트 패키지 가격이 포함된 구성입니다. (S 5,000원 / M 5,500원 / L 6,000원)",
  "커스텀 기프트 구매 시, 쇼핑백을 증정해 드립니다.",
];

/* 아래에 가로로 이어지는 관련 제품. 두 번째를 고르는 참입니다.
   사진은 개선 화면(`One screen, one gift.`)의 세트 사진을 그대로 씁니다 —
   같은 세트가 앞뒤 장에서 다른 얼굴로 나오면 같은 것으로 읽히지 않습니다. */
const RELATED = [
  { name: "에그 퍼퓸 & 립밤 세트", shot: "/images/tam/set-egg-lip.png" },
  { name: "룸 스프레이 & 핸드워시 세트", shot: "/images/tam/set-room-wash.png" },
  { name: "쉘 퍼퓸 핸드 & 립밤 세트", shot: "/images/tam/set-hand-lip.png" },
  { name: "에그 퍼퓸 & 퍼퓸 밤 세트", shot: "/images/tam/set-egg-balm.png" },
  { name: "캔들 & 룸 스프레이 세트", shot: "/images/tam/set-candle-room.png" },
  { name: "캔들 & 핸드워시 세트", shot: "/images/tam/set-candle-wash.png" },
];

/** 고르는 참인 세트의 차례 */
const PICKED = 1;

/* 장에 들어서면 스스로 훑습니다.
   아래로 내려가 관련 제품을 보고, 옆으로 밀어 세트를 찾고, 그것을 엽니다. */
const SCROLL_AT = 700;
const SLIDE_AT = 2000;
const OPEN_AT = 3100;
const DONE_AT = 4300;

/**
 * 실제 화면 하나. 칸 안에서 위아래로 굴려 볼 수 있고,
 * 관련 제품 줄은 옆으로 굴러갑니다.
 */
export function TamburinsGiftScreen({
  run = true,
  onDone,
}: {
  /** 차례가 되면 스스로 훑기 시작합니다. */
  run?: boolean;
  /** 다 훑으면 다음 화면에 차례를 넘깁니다. */
  onDone?: () => void;
} = {}) {
  const [page] = useInView<HTMLDivElement>(0.3);
  const row = useRef<HTMLDivElement>(null);
  /** 세트를 여는 참 */
  const [opening, setOpening] = useState(false);
  /* 부모가 다시 그릴 때마다 콜백이 새로 만들어집니다. 그것 때문에 진행 중인
     순서가 처음부터 다시 돌지 않도록, 콜백은 ref 로 들고 있습니다. */
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  /* 장에 들어설 때마다 처음부터 다시 훑습니다.
     굴리는 양은 요소의 실제 자리에서 끌어와 화면 크기와 무관합니다. */
  useEffect(() => {
    const view = page.current;
    const line = row.current;
    if (!view || !line) return;

    /* 차례가 아니면 그대로 둡니다. 마친 화면은 마지막 장면에서 멈춰 있습니다. */
    if (!run) return;

    /* 굴러가던 것을 도중에 멈출 수 있게 들고 있습니다. */
    let stopDown = () => {};
    let stopSide = () => {};

    const timers = [
      window.setTimeout(() => {
        const sub = view.querySelector<HTMLElement>(".gift-screen-sub");
        if (sub) stopDown = glide(view, sub.offsetTop, 2000);
      }, SCROLL_AT),
      window.setTimeout(() => {
        const card = line.children[PICKED] as HTMLElement | undefined;
        if (card) stopSide = glide(line, card.offsetLeft, 1600, "left");
      }, SLIDE_AT),
      window.setTimeout(() => setOpening(true), OPEN_AT),
      window.setTimeout(() => done.current?.(), DONE_AT),
    ];

    return () => {
      timers.forEach(clearTimeout);
      stopDown();
      stopSide();
    };
  }, [run, page]);

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
                <Image src={set.shot} alt="" fill sizes="12vw" />
              </div>
              <h6>{set.name}</h6>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
