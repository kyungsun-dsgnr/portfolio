"use client";

/**
 * 20장 — Nudake Is Already Being Sent
 *
 * 이 케이스에서 가장 중요한 장입니다. 선물을 우리가 지어낸 것이 아니라,
 * 누데이크가 이미 운영하고 있는 접점이라는 것을 먼저 보입니다.
 * 아래 넷은 2026-09-01 nudake.com/kr 에서 직접 확인한 것들입니다.
 * 그리드 7번 — 2단짜리 넷을 가로로.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 이미 있는 흔적 넷. 해석이 아니라 관찰입니다. */
const SIGNS = [
  {
    index: "01",
    name: "Tea Gift",
    body: "메뉴 상단 아이콘 셋 중 하나가 통째로 기프트입니다. 열여섯 종이 여기에 있습니다.",
    place: "col-start-1 col-span-2",
  },
  {
    index: "02",
    name: "Gift Package",
    body: "티 컬렉션·아카이브·테이스터처럼 선물을 전제로 구성한 패키지가 따로 있습니다.",
    place: "col-start-3 col-span-2",
  },
  {
    index: "03",
    name: "Kakao Gift",
    body: "제품 상세의 유일한 단추가 카카오톡 선물하기입니다. 선물로 팔리도록 연결되어 있습니다.",
    place: "col-start-5 col-span-2",
  },
  {
    index: "04",
    name: "Priced to Send",
    body: "매장 메뉴와 달리 값이 붙어 있습니다. 온라인으로 사고 보내는 것을 이미 셈에 넣고 있습니다.",
    place: "col-start-7 col-span-2",
  },
];

export function SceneNudakeOpportunity() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1">
        Nudake Is Already Being Sent
      </h2>

      <p
        className="type-body rise col-start-6 col-span-3 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        선물은 이 프로젝트가 만들어 낸 것이 아닙니다. 누데이크는 이미 선물을
        통해 물리적 공간 밖으로 접점을 넓히고 있습니다.
      </p>

      {/* 이 장의 한가운데에 놓이는 말 */}
      <p
        className="nud-claim rise col-start-1 col-span-8 row-start-3"
        style={{ "--delay": "0.2s" } as CSSProperties}
      >
        Gift is already part of Nudake.
      </p>

      {SIGNS.map((sign, i) => (
        <div
          key={sign.index}
          className={`nud-sign rise ${sign.place} row-start-5 row-span-2`}
          style={{ "--delay": `${0.3 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{sign.index}</span>
          <h3 className="nud-sign-name">{sign.name}</h3>
          <p className="type-body">{sign.body}</p>
        </div>
      ))}

      {/* 사업 전략을 단정하지 않습니다. 가능성까지만 적습니다. */}
      <p
        className="type-body rise col-start-1 col-span-4 row-start-4"
        style={{ "--delay": "0.62s" } as CSSProperties}
      >
        이는 선물이 누데이크의 경험을 확장할 수 있는
        <br />
        하나의 가능성임을 보여 줍니다.
      </p>
    </div>
  );
}
