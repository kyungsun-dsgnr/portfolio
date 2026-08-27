"use client";

/** 탬버린즈 향 선택 창. 15장 셋째 칸에서 1/2 → 2/2 로 넘어갑니다. */

import Image from "next/image";
import { useEffect, useState } from "react";

import { TamburinsProductScreen } from "@/components/TamburinsProductScreen";
import { useInView } from "@/components/useInView";

/* 첫 창에서 고를 수 있는 향(룸 스프레이). 설명은 이 창을 열어야만 드러납니다. */
const FIRST = [
  {
    name: "룸 스프레이 파인네스트",
    notes: "유칼립투스ㅣ파인니들ㅣ히노키우드",
    shot: "/images/tam-scent-1.png",
  },
  {
    name: "룸 스프레이 먹",
    notes: "그을린 소나무ㅣ먹물ㅣ패출리",
    shot: "/images/tam-scent-2.png",
  },
  {
    name: "룸 스프레이 멈버드",
    notes: "유자ㅣ국화ㅣ머스크",
    shot: "/images/tam-scent-3.png",
  },
  {
    name: "룸 스프레이 파피루스",
    notes: "파피루스ㅣ그린티ㅣ샌달우드",
    shot: "/images/tam-scent-4.png",
  },
];

/* 두 번째 창(핸드워시). 첫 줄은 "더보기" 를 펼친 참이라 설명이 딸려 나옵니다. */
const SECOND = [
  {
    name: "퍼퓸드 핸드워시 카모",
    notes: "진득한 카모마일 | 부드러운 나무결 | 머스크",
    shot: "/images/tam-wash-1.png",
    open: true,
    story:
      "꿀처럼 진득하고 달콤한 카모마일과 씁쓸한 클라리세이지의 허브 향이 오묘한 조화를 이루어 중독성 있는 향을 선사합니다. 자칫 차갑게 느껴질 수 있는 촉촉한 이끼의 느낌을 우아하고 부드러운 나무결의 블론드 우드와 따뜻한 머스크로 감싸주어 당신의 지친 마음에 특별하고 작은 위안을 선물합니다.",
    top: "Top: 클라리세이지, 카모마일",
    middle: "Middle: 워터, 사이프리올",
    base: "Base: 앰버, 머스크, 블론드우드",
  },
  {
    name: "퍼퓸드 핸드워시 000",
    notes: "샌달우드 | 패츌리 | 흙 내음",
    shot: "/images/tam-wash-2.png",
  },
  {
    name: "퍼퓸드 핸드워시 이브닝글로우",
    notes: "노을에 물든 장미 ㅣ 라즈베리 ㅣ 머스크",
    shot: "/images/tam-wash-3.png",
  },
  {
    name: "퍼퓸드 핸드워시 썸머테일스",
    notes: "연두색 하늬바람 ㅣ 은방울꽃 ㅣ 시더우드",
    shot: "/images/tam-wash-4.png",
  },
];

/** 첫 창에서 고르는 향의 차례 */
const PICKED = 0;

/* 장에 들어서면 스스로 고르고 넘어갑니다. */
const CHECK_AT = 900;
const PRESS_AT = 2100;
const TURN_AT = 2600;
/* 두 번째 창에서도 하나를 고르고 "선택" 을 누릅니다. */
const CHECK2_AT = 4000;
const PRESS2_AT = 5300;
/* 다 고르면 창이 닫히고, 고른 것이 적힌 제품 화면으로 돌아옵니다. */
const DONE_AT = 6000;

/** 향 한 줄 */
function Row({
  scent,
  dim,
  checked,
  shut,
}: {
  scent: {
    name: string;
    notes: string;
    price?: string;
    shot?: string;
    open?: boolean;
    story?: string;
    top?: string;
    middle?: string;
    base?: string;
  };
  dim?: boolean;
  checked?: boolean;
  /** 펼쳐 둔 설명을 접습니다. 고르고 나면 목록으로 돌아갑니다. */
  shut?: boolean;
}) {
  return (
    <li data-dim={dim || undefined}>
      <div className="scent-row">
        <div className="scent-shot">
          {scent.shot && (
            <Image
              src={scent.shot}
              alt=""
              fill
              sizes="8vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="scent-text">
          <span className="scent-name">{scent.name}</span>
          <span className="scent-price">{scent.price ?? "₩ 34,000"}</span>
          <span className="scent-notes">{scent.notes}</span>
          <span className="scent-more">
            더보기
            <i aria-hidden />
          </span>
        </div>
        <span
          className="scent-check"
          data-on={checked || undefined}
          aria-hidden
        />
      </div>

      {/* 펼친 줄에만 딸려 나오는 설명과 향노트 */}
      {scent.open && !shut && (
        <div className="scent-story">
          <p>{scent.story}</p>
          <p className="scent-story-head">향노트</p>
          <p>{scent.top}</p>
          <p>{scent.middle}</p>
          <p>{scent.base}</p>
        </div>
      )}
    </li>
  );
}

/**
 * 세트에 든 제품 수만큼 넘겨야 하는 창.
 * 하나를 고르면 "다음" 이 살아나고, 누르면 두 번째 창으로 넘어갑니다.
 */
export function TamburinsScentScreen({
  onStep,
}: {
  /** 창이 넘어갈 때 알려 줍니다. 칸 아래 마디를 같이 바꾸는 데 씁니다. */
  onStep?: (step: 1 | 2) => void;
}) {
  const [page, inView] = useInView<HTMLDivElement>(0.3);
  const [checked, setChecked] = useState(false);
  const [press, setPress] = useState(false);
  const [second, setSecond] = useState(false);
  const [chosen, setChosen] = useState(false);
  const [press2, setPress2] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) {
      const back = window.setTimeout(() => {
        setChecked(false);
        setPress(false);
        setSecond(false);
        setChosen(false);
        setPress2(false);
        setDone(false);
        onStep?.(1);
      }, 0);
      return () => clearTimeout(back);
    }

    const timers = [
      window.setTimeout(() => setChecked(true), CHECK_AT),
      window.setTimeout(() => setPress(true), PRESS_AT),
      window.setTimeout(() => {
        setSecond(true);
        onStep?.(2);
      }, TURN_AT),
      window.setTimeout(() => setChosen(true), CHECK2_AT),
      window.setTimeout(() => setPress2(true), PRESS2_AT),
      window.setTimeout(() => setDone(true), DONE_AT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView, onStep]);

  return (
    <div className="scent-screen" ref={page}>
      {/* 첫 창 */}
      <div
        className="scent-sheet"
        data-gone={(second || done) && "y"}
        data-hide={done || undefined}
      >
        <header className="scent-head">
          <span className="scent-back" aria-hidden />
          <h4>향을 선택하세요 ( 1/2 )</h4>
          <span className="scent-close" aria-hidden />
        </header>

        <ul className="scent-list">
          {FIRST.map((scent, i) => (
            <Row
              key={scent.name}
              scent={{ ...scent, price: "₩ 53,500" }}
              dim={checked && i !== PICKED}
              checked={checked && i === PICKED}
            />
          ))}
        </ul>

        <div
          className="scent-next"
          data-on={checked || undefined}
          data-press={press || undefined}
        >
          다음
        </div>
      </div>

      {/* 두 번째 창. "다음" 을 누르면 옆에서 밀려 들어옵니다. */}
      <div
        className="scent-sheet scent-sheet-2"
        data-in={second || undefined}
        data-hide={done || undefined}
      >
        <header className="scent-head">
          <span className="scent-back" aria-hidden />
          <h4>향을 선택하세요 ( 2/2 )</h4>
          <span className="scent-close" aria-hidden />
        </header>

        <ul className="scent-list">
          {SECOND.map((scent, i) => (
            <Row
              key={scent.name}
              scent={scent}
              dim={chosen && i !== 0}
              checked={chosen && i === 0}
              shut={chosen}
            />
          ))}
        </ul>

        <div className="scent-pair">
          <span className="scent-back-btn">이전</span>
          <span
            className="scent-pick"
            data-on={chosen || undefined}
            data-press={press2 || undefined}
          >
            선택
          </span>
        </div>
      </div>

      {/* 창이 닫히고 돌아온 제품 화면. 고른 향이 옵션 자리에 적혀 있습니다. */}
      <div className="scent-done" data-in={done || undefined}>
        <TamburinsProductScreen chosen still />
      </div>
    </div>
  );
}
