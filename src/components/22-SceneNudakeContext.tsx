"use client";

/**
 * 19장 — Limited Offline Experience → Gift as a New Touchpoint
 *
 * 맥락과 기회를 한 장에서 잇습니다. 위에서 접점이 제한적이라는 사실을
 * 보이고, 아래에서 그 한계를 넘을 길이 이미 사이트 안에 있다는 것을 보입니다.
 * 매장 정보는 2026-09-01 nudake.com/store 에 올라 있는 전부입니다.
 * 그리드 10번 — 제목 1–3단 1행 · 본문 5–8단 1행 · 단 셋 5–6행.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

const STORES = [
  {
    key: "teahouse",
    name: "누데이크 티 하우스",
    where: "서울 성동구 뚝섬로 433 5F",
    hours: [
      { label: "기프트 샵", time: "11:00 – 21:00", lead: true },
      { label: "티 라운지", time: "12:00 – 21:00" },
    ],
    place: "col-start-1 col-span-2",
  },
  {
    key: "dosan",
    name: "하우스 노웨어 도산",
    where: "서울 강남구 압구정로 46길 50 B1",
    hours: [{ label: "운영시간", time: "11:00 – 21:00" }],
    place: "col-start-3 col-span-2",
  },
];

/* 방문하지 않고도 그 경험을 건널 길. 이미 사이트 안에 있는 것들입니다. */
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

export function SceneNudakeContext() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        Limited Offline Experience
      </h2>

      <p
        className="type-body rise col-start-6 col-span-3 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        누데이크는 독특한 공간과 제품 경험으로 강한 인상을 만들어 왔습니다.
        다만 그 접점은 서울의 두 곳뿐이라, 더 많은 사람이 브랜드를 만나는 데는
        물리적인 한계가 있습니다.
      </p>

      {STORES.map((store, i) => (
        <div
          key={store.key}
          className={`nud-store rise ${store.place} row-start-2 row-span-2`}
          style={{ "--delay": `${0.16 + i * 0.08}s` } as CSSProperties}
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

      <p
        className="type-title rise self-start col-start-6 col-span-3 row-start-2 row-span-2"
        style={{ "--delay": "0.3s" } as CSSProperties}
      >
        직접 경험할 수 있는 접점이 제한적입니다.
        <br />
        그래서 온라인이 브랜드 경험을 넓힐 채널이 됩니다.
      </p>

      {/* 이 케이스의 관점이 넘어가는 자리 */}
      <p
        className="nud-shift rise col-start-1 col-span-8 row-start-4"
        style={{ "--delay": "0.38s" } as CSSProperties}
      >
        <span>Store Experience</span>
        <i aria-hidden />
        <b>Gift Experience</b>
      </p>

      {SIGNS.map((sign, i) => (
        <div
          key={sign.index}
          className={`nud-sign rise ${sign.place} row-start-5 row-span-2`}
          style={{ "--delay": `${0.46 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{sign.index}</span>
          <h3 className="nud-sign-name">{sign.name}</h3>
          <p className="type-body">{sign.body}</p>
        </div>
      ))}
    </div>
  );
}
