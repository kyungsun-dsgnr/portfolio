"use client";

/**
 * 20장 — The Experience Is Still Bound to Place.
 *
 * 오른쪽 지도 위에 닷 둘, 그 아래에 매장 정보 카드가 붙습니다.
 * 왼쪽 아래에는 매장 사진 둘이 한 행 높이로 낮게 깔려 있다가,
 * 그 매장의 닷이나 카드를 누르면 두 행 높이로 자라며 색을 되찾습니다.
 * 자리는 늘 두 행을 잡아 두고 높이만 바꿉니다 — 그리드 행을 갈아 끼우면
 * 높이가 뚝 끊기고, 높이는 애니메이션이 걸립니다.
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

export function SceneNudakeContext2() {
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
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1">
        The Experience
        <br />
        Is Still Bound to Place.
      </h2>

      <p
        className="type-body rise self-end col-start-1 col-span-4 row-start-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        누데이크의 경험은 강렬하지만,
        <br />
        직접 경험할 수 있는 공간은 제한적입니다.
      </p>

      {/* 두 매장이 놓인 서울. 닷 아래에 그 매장의 정보가 붙습니다. */}
      <div
        className="nud-atlas rise col-start-5 col-span-4 row-start-1 row-span-6"
        style={{ "--delay": "0.12s" } as CSSProperties}
      >
        <Image
          src="/images/nudake-map.png"
          alt=""
          fill
          sizes="50vw"
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
            aria-pressed={picked === i}
            onClick={() => look(i)}
            style={{ left: store.left, top: store.top }}
          >
            <span className="nud-pin-dot" aria-hidden>
              {store.no}
            </span>

            <span className="nud-pin-card">
              <span className="nud-eyebrow">
                Store {store.no} - Korea &middot; Seoul
              </span>
              <span className="nud-pin-name">{store.name}</span>
              <span className="nud-pin-where">{store.where}</span>
            </span>
          </button>
        ))}
      </div>

      {/* 매장 사진. 고르기 전에는 색을 빼고 한 행으로 낮게 눕혀 둡니다. */}
      {STORES.map((store, i) => (
        <button
          key={store.key}
          type="button"
          className={`nud-shot rise ${store.col} row-start-5 row-span-2`}
          data-on={picked === i || undefined}
          aria-label={store.name}
          aria-pressed={picked === i}
          onClick={() => look(i)}
          style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
        >
          <Image
            src={store.shot}
            alt=""
            fill
            sizes="25vw"
            className="object-cover"
          />

          {/* 켜졌을 때만 뜨는 이름표. 어느 매장을 보고 있는지 사진 위에서 읽힙니다. */}
          <span className="nud-shot-tag" aria-hidden>
            Store {store.no}
          </span>
        </button>
      ))}
    </div>
  );
}
