"use client";

/**
 * 개선 화면 — COMPOSE GIFT.
 * 네 화면에 나뉘어 있던 고르기를 한 화면에서 끝냅니다.
 * 값은 12장 목업에서 뽑은 규칙을 그대로 씁니다(여백 15, 잉크 #1d1d1d,
 * 라운드 3·5·알약, 화면 안 버튼 45).
 */

import Image from "next/image";
import { useState } from "react";

/** 고를 수 있는 세트. 첫 번째를 고른 참입니다. */
const SETS = [
  {
    name: "룸 스프레이 & 핸드워시 세트",
    shot: "/images/tam-set-2.png",
  },
  {
    name: "에그 퍼퓸 & 립밤 세트",
    shot: "/images/tam-set-1.png",
  },
  {
    name: "쉘 퍼퓸 핸드 & 립밤 세트",
    shot: "/images/tam-set-3.png",
  },
  {
    name: "에그 퍼퓸 & 퍼퓸 밤 세트",
    shot: "/images/tam-set-4.png",
  },
];

/** 향은 두 제품이 같은 목록에서 고릅니다. 사진만 제품에 따라 갈립니다. */
const SCENTS = [
  {
    name: "CHAMO",
    notes: "Woody · Herbal",
    note: "카모마일ㅣ블론드우드ㅣ머스크",
  },
  { name: "LALE", notes: "Floral · Musk", note: "장미ㅣ라즈베리ㅣ머스크" },
  {
    name: "BERGA SANDAL",
    notes: "Woody · Amber",
    note: "베르가못ㅣ샌달우드ㅣ앰버",
  },
  {
    name: "UNKNOWN OUD",
    notes: "Woody · Leather",
    note: "우드ㅣ레더ㅣ패출리",
  },
];

/** 지금 고른 것 */
const PICKED_ONE = 0;
const PICKED_TWO = 2;

/**
 * 향 고르개. 펼쳐 둔 옵션 목록입니다.
 * 알약을 옆으로 미는 대신, 스토어에서 쓰는 방식대로 한 줄에 하나씩 세웁니다.
 */
function ScentPicker({
  label,
  picked,
  shots,
}: {
  /** 어떤 제품의 향을 고르는지 머리에 적습니다. */
  label: string;
  picked: number;
  shots: string[];
}) {
  /* 평소에는 닫혀 있고, 머리를 누르면 목록이 열립니다. */
  const [open, setOpen] = useState(false);

  return (
    <div className="cmp-pick" data-open={open || undefined}>
      <button
        type="button"
        className="cmp-pick-head"
        aria-expanded={open}
        onClick={() => setOpen((was) => !was)}
      >
        {label}
        <i aria-hidden />
      </button>

      <ul>
        {SCENTS.map((scent, i) => (
          <li key={scent.name} data-on={i === picked || undefined}>
            <span className="cmp-pick-shot">
              <Image
                src={shots[i]}
                alt=""
                fill
                sizes="4vw"
                className="object-cover"
              />
            </span>
            <span className="cmp-pick-text">
              <b>{scent.name}</b>
              <em>{scent.note}</em>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 제품마다 목록에 걸리는 사진이 다릅니다. */
const BALM_SHOTS = [
  "/images/tam-scent-1.png",
  "/images/tam-scent-2.png",
  "/images/tam-scent-3.png",
  "/images/tam-scent-4.png",
];

const WASH_SHOTS = [
  "/images/tam-wash-1.png",
  "/images/tam-wash-2.png",
  "/images/tam-wash-3.png",
  "/images/tam-wash-4.png",
];

export function TamburinsComposeScreen() {
  /* 아직 아무것도 고르지 않았습니다. 세트를 고르면 상자가 채워집니다. */
  const [set, setSet] = useState<number | null>(null);
  const filled = set !== null;

  return (
    <div className="cmp-screen">
      {/* 머리 */}
      <header className="cmp-head">
        <span className="cmp-back" aria-hidden />
        <h4>COMPOSE GIFT</h4>
        <span className="cmp-bag" aria-hidden />
      </header>

      <div className="cmp-body">
        {/* 01 — 상자. 고르기 전에는 비어 있고, 세트를 고르면 그 자리에 담깁니다. */}
        <section className="cmp-sec">
          <figure className="cmp-box" data-filled={filled || undefined}>
            <Image src="/images/tamburins-box.png" alt="" fill sizes="16vw" />
            <span className="cmp-in-balm">
              <Image
                src="/images/tamburins-perfume.png"
                alt=""
                fill
                sizes="6vw"
              />
            </span>
            <span className="cmp-in-wash">
              <Image
                src="/images/tamburins-handwash.png"
                alt=""
                fill
                sizes="4vw"
              />
            </span>
          </figure>
        </section>

        {/* 02 — 세트. 고른 것만 흰 카드로 떠오르고 나머지는 판에 잠깁니다. */}
        <section className="cmp-sec" data-shade>
          <h5>
            Choose Gift Set
            <span className="cmp-all">
              더보기
              <i aria-hidden />
            </span>
          </h5>
          <p className="cmp-sub">보내는 자리에 맞는 구성을 고릅니다.</p>

          <div className="cmp-cards">
            {SETS.map((item, i) => (
              <article
                key={item.name}
                className="cmp-card"
                data-on={set === i || undefined}
                role="button"
                tabIndex={0}
                onClick={() => setSet(i)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSet(i);
                  }
                }}
              >
                <span className="cmp-card-text">
                  <b>{item.name}</b>
                </span>
                <span className="cmp-card-shot">
                  <Image
                    src={item.shot}
                    alt=""
                    fill
                    sizes="6vw"
                    className="object-cover"
                  />
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* 03 · 04 — 향은 제품 수만큼 이 자리에서 이어 고릅니다. */}
        <section className="cmp-sec">
          <h5>Choose Scent 1</h5>
          <p className="cmp-sub">첫 번째 제품(퍼퓸 밤)의 향입니다.</p>
          <ScentPicker
            label="퍼퓸 밤 향을 선택해 주세요"
            picked={PICKED_ONE}
            shots={BALM_SHOTS}
          />
        </section>

        <section className="cmp-sec">
          <h5>Choose Scent 2</h5>
          <p className="cmp-sub">두 번째 제품(핸드워시)의 향입니다.</p>
          <ScentPicker
            label="핸드워시 향을 선택해 주세요"
            picked={PICKED_TWO}
            shots={WASH_SHOTS}
          />
        </section>

        {/* 고른 것이 그대로 목록이 됩니다. */}
        <div className="cmp-list">
          <h5>
            Included in this set
            <em>2 items</em>
          </h5>
          <ul>
            <li>
              <span className="cmp-list-shot">
                <Image
                  src="/images/tam-set-1.png"
                  alt=""
                  fill
                  sizes="4vw"
                  className="object-cover"
                />
              </span>
              <span className="cmp-list-text">
                <b>Perfume Balm</b>
                <em>CHAMO</em>
              </span>
              <span className="cmp-list-qty">1 ×</span>
              <span className="cmp-list-price">50,000</span>
            </li>
            <li>
              <span className="cmp-list-shot">
                <Image
                  src="/images/tam-wash-1.png"
                  alt=""
                  fill
                  sizes="4vw"
                  className="object-cover"
                />
              </span>
              <span className="cmp-list-text">
                <b>Hand Wash</b>
                <em>BERGA SANDAL</em>
              </span>
              <span className="cmp-list-qty">1 ×</span>
              <span className="cmp-list-price">38,000</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 바닥에 붙어 따라오는 셈과 담기 */}
      <div className="cmp-bar">
        <span className="cmp-total">
          <em>Total</em>
          <b>
            88,000<i>KRW</i>
          </b>
        </span>
        <span className="cmp-add">Add to Bag</span>
      </div>
    </div>
  );
}
