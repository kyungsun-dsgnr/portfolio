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

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 서울의 두 매장. 2026-09-01 nudake.com/store 에 올라 있는 전부입니다.
   티 하우스에는 기프트 샵이 운영시간까지 따로 두고 열려 있습니다 —
   선물은 오프라인에서 이미 정식 코너라는 근거가 됩니다. */
const STORES = [
  {
    key: "teahouse",
    name: "누데이크 티 하우스",
    where: "서울 성동구 뚝섬로 433 5F",
    hours: [
      { label: "기프트 샵", time: "11:00 – 21:00", lead: true },
      { label: "티 라운지", time: "12:00 – 21:00" },
    ],
    place: "col-start-1 col-span-3",
  },
  {
    key: "dosan",
    name: "하우스 노웨어 도산",
    where: "서울 강남구 압구정로 46길 50 B1",
    hours: [{ label: "운영시간", time: "11:00 – 21:00" }],
    place: "col-start-5 col-span-3",
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

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1 row-span-2">
        The Experience
        <br />
        Is Still Bound to Place.
      </h2>

      {/* 설명은 제목 바로 아랫행, 같은 단에 놓입니다. */}
      <p
        className="type-body rise col-start-1 col-span-4 row-start-3"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        누데이크의 경험은 강렬하지만,
        <br />
        직접 경험할 수 있는 공간은 제한적입니다.
      </p>

      {/* 그 제한이 실제로 어느 정도인지. 두 곳이 전부입니다. */}
      {STORES.map((store, i) => (
        <div
          key={store.key}
          className={`nud-store rise ${store.place} row-start-5 row-span-2`}
          style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
        >
          <p className="nud-eyebrow">Korea &middot; Seoul</p>
          <h3 className="nud-store-name">{store.name}</h3>
          <p className="type-body">{store.where}</p>

          <dl className="nud-hours">
            {store.hours.map((hour) => (
              <div key={hour.label} data-lead={hour.lead || undefined}>
                <dt>{hour.label}</dt>
                <dd>{hour.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
