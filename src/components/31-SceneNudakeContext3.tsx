"use client";

/**
 * The Experience Is Still Bound to Place. — 20장을 그대로 복제한 장
 *
 * 다음 화면을 여기서 잡습니다. 원본과 갈라질 때까지는 같은 내용입니다.
 *
 * 앞 장과 좌우를 뒤집어 둡니다 — 왼쪽 넉 단은 매장 사진,
 * 오른쪽 아래 두 단은 작은 지도, 그 옆 두 단은 설명입니다.
 * 지도의 닷을 누르면 오른쪽 사진이 그 매장으로 넘어갑니다.
 *
 * 아무도 누르지 않으면 두 매장이 번갈아 켜집니다. 누르면 그 매장에서 멈추고,
 * 한 번 더 누르면 다시 번갈아 갑니다.
 *
 * 닷 자리는 강줄기를 기준으로 눈대중해 잡은 값입니다.
 * 어긋나면 STORES 의 left · top 만 고치면 됩니다.
 */

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

import { useInView } from "@/components/useInView";

const STORES = [
  {
    key: "dosan",
    no: "01",
    name: "하우스 노웨어 도산",
    where: "서울 강남구 압구정로 46길 50 B1",
    shot: "/images/nudake-store-dosan.webp",
    /* 지도 판을 기준으로 한 백분율 */
    left: "28%",
    top: "68%",
    col: "col-start-1 col-span-2",
  },
  {
    key: "teahouse",
    no: "02",
    name: "누데이크 티 하우스",
    where: "서울 성동구 뚝섬로 433 5F",
    shot: "/images/nudake-store-teahouse.webp",
    left: "72%",
    top: "32%",
    col: "col-start-3 col-span-2",
  },
];

/* 강을 사이에 둔 두 구. 자리는 닷과 같은 백분율 체계입니다. */
const AREAS = [
  { key: "seongdong", name: "성동구", left: "76%", top: "17%" },
  { key: "gangnam", name: "강남구", left: "39%", top: "88%" },
];

/** 다음 매장으로 넘어가기까지 */
const SWAP = 9000;

export function SceneNudakeContext3() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  /* 저절로 넘어가는 차례와, 손으로 붙잡아 둔 것. 붙잡은 쪽이 우선입니다. */
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState<number | null>(null);
  const picked = held ?? at;

  useEffect(() => {
    if (!inView || held !== null) return;
    const id = window.setInterval(
      () => setAt((n) => (n + 1) % STORES.length),
      SWAP,
    );
    return () => clearInterval(id);
  }, [inView, held]);

  /** 누르면 그 매장에서 멈추고, 한 번 더 누르면 다시 번갈아 갑니다. */
  const look = (i: number) => setHeld((now) => (now === i ? null : i));

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-5 col-span-4 row-start-1">
        The Experience
        <br />
        Is Still Bound to Place.
      </h2>

      {/* 오른쪽 넉 단을 매장 사진이 꽉 채웁니다. 고른 매장으로 넘어갑니다. */}
      <div
        className="nud-stores rise col-start-1 col-span-4 row-start-1 row-span-6"
        style={{ "--delay": "0.12s" } as CSSProperties}
      >
        {STORES.map((store, i) => (
          <Image
            key={store.key}
            src={store.shot}
            alt=""
            fill
            sizes="50vw"
            priority={i === 0}
            className="object-cover"
            data-on={picked === i || undefined}
          />
        ))}

        <p className="nud-stores-tag" aria-hidden>
          {STORES[picked].name}
        </p>
      </div>

      {/* 두 매장이 놓인 서울. 자리가 좁아 닷만 두고 정보 카드는 접습니다. */}
      <div
        className="nud-atlas rise col-start-5 col-span-2 row-start-5 row-span-2"
        data-mini
        style={{ "--delay": "0.2s" } as CSSProperties}
      >
        <Image
          src="/images/nudake-map.png"
          alt=""
          fill
          sizes="25vw"
          className="object-cover"
        />

        {AREAS.map((area) => (
          <span
            key={area.key}
            className="nud-area"
            style={{ left: area.left, top: area.top }}
            aria-hidden
          >
            {area.name}
          </span>
        ))}

        {STORES.map((store, i) => (
          <button
            key={store.key}
            type="button"
            className="nud-pin"
            data-on={picked === i || undefined}
            aria-label={store.name}
            aria-pressed={picked === i}
            onClick={() => look(i)}
            style={{ left: store.left, top: store.top }}
          >
            <span className="nud-pin-dot" aria-hidden>
              {store.no}
            </span>
          </button>
        ))}
      </div>

      {/* 설명은 지도 옆, 매장 02 가 서 있던 자리입니다.
          그 아래에 지금 보고 있는 매장의 정보가 따라 붙습니다. */}
      <div
        className="nud-aside rise self-end col-start-7 col-span-2 row-start-5 row-span-2"
        style={{ "--delay": "0.28s" } as CSSProperties}
      >
        <p className="type-body">
          누데이크의 경험은 강렬하지만,
          <br />
          직접 경험할 수 있는 공간은 제한적입니다.
        </p>

        <div className="nud-store" data-on>
          <p className="nud-eyebrow">
            Store {STORES[picked].no} - Korea &middot; Seoul
          </p>
          <h3 className="nud-store-name">{STORES[picked].name}</h3>
          <p className="type-body">{STORES[picked].where}</p>
        </div>
      </div>

    </div>
  );
}
