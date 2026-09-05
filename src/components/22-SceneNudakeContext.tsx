"use client";

/**
 * 19장 — The Experience Is Still Bound to Place.
 *
 * 지금은 제목과 설명만 세워 둡니다. 아래에 무엇을 놓을지는 다시 잡습니다.
 *
 * 걷어 낸 것들은 지우지 않고 아래에 내려 두었습니다.
 * 매장 정보는 2026-09-01 nudake.com/store 에서 직접 확인한 값이라
 * 다시 구하기 번거롭습니다. 되살릴 때 주석만 풀면 됩니다.
 */

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/** 사진이 다음 매장으로 넘어가기까지 */
const SWAP = 3600;

/* 서울의 두 매장. 2026-09-01 nudake.com/store 에 올라 있는 전부입니다.
   두 곳이 전부이고, 둘 다 서울입니다. */
const STORES = [
  {
    key: "teahouse",
    no: "01",
    name: "누데이크 티 하우스",
    where: "서울 성동구 뚝섬로 433 5F",
    shot: "/images/nudake-store-teahouse.webp",
    place: "col-start-1 col-span-2",
  },
  {
    key: "dosan",
    no: "02",
    name: "하우스 노웨어 도산",
    where: "서울 강남구 압구정로 46길 50 B1",
    shot: "/images/nudake-store-dosan.webp",
    place: "col-start-3 col-span-2",
  },
];

/* 내려 둔 것 2 — 방문하지 않고도 그 경험을 건널 길. 이미 사이트 안에 있는 것들입니다.
const SIGNS = [
  {
    index: "01",
    name: "Tea Gift",
    body: "메뉴 상단 아이콘 셋 중 하나가 통째로 기프트입니다. 열여섯 종이 여기 있습니다.",
    place: "col-start-1 col-span-2",
  },
  {
    index: "02",
    name: "Gift Package",
    body: "티 컬렉션·아카이브·테이스터처럼 선물을 전제로 구성한 패키지가 따로 있습니다.",
    place: "col-start-4 col-span-2",
  },
  {
    index: "03",
    name: "Priced to Send",
    body: "매장 메뉴와 달리 값이 붙어 있고, 카카오 선물하기로 연결되어 있습니다.",
    place: "col-start-7 col-span-2",
  },
];
*/

export function SceneNudakeContext() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  /* 두 매장을 번갈아 보여 줍니다. 카드에 손을 올리면 그 매장에서 멈춥니다 —
     글과 사진이 같은 곳을 가리켜야 둘이 한 짝으로 읽힙니다. */
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState<number | null>(null);
  const shown = held ?? at;

  useEffect(() => {
    if (!inView || held !== null) return;
    const id = window.setInterval(
      () => setAt((n) => (n + 1) % STORES.length),
      SWAP,
    );
    return () => clearInterval(id);
  }, [inView, held]);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1">
        The Experience
        <br />
        Is Still Bound to Place.
      </h2>

      {/* 설명은 제목 바로 아랫행, 같은 단에 놓입니다. */}
      <p
        className="type-body rise col-start-1 col-span-4 row-start-5"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        누데이크의 경험은 강렬하지만,
        <br />
        직접 경험할 수 있는 공간은 두 곳으로 제한적입니다.
      </p>

      {/* 그 제한이 실제로 어느 정도인지. 두 곳이 전부입니다. */}
      {STORES.map((store, i) => (
        <div
          key={store.key}
          className={`nud-store rise ${store.place} row-start-6`}
          data-on={shown === i || undefined}
          onPointerEnter={() => setHeld(i)}
          onPointerLeave={() => setHeld(null)}
          style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
        >
          <p className="nud-eyebrow">
            Store {store.no} - Korea &middot; Seoul
          </p>
          <h3 className="nud-store-name">{store.name}</h3>
          <p className="type-body">{store.where}</p>
        </div>
      ))}

      {/* 오른쪽 네 단을 사진이 꽉 채웁니다. 글로만 적힌 '제한적' 이
          실제로 어떤 자리인지 눈으로 보이게 하는 몫입니다. */}
      <div className="nud-stores rise col-start-5 col-span-4 row-start-1 row-span-6">
        {STORES.map((store, i) => (
          <Image
            key={store.key}
            src={store.shot}
            alt=""
            fill
            sizes="50vw"
            priority={i === 0}
            className="object-cover"
            data-on={shown === i || undefined}
          />
        ))}

        <p className="nud-stores-tag" aria-hidden>
          {STORES[shown].name}
        </p>
      </div>
    </div>
  );
}
