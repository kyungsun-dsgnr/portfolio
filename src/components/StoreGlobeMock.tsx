"use client";

import { useState } from "react";

import { GlobeDots } from "@/components/GlobeDots";
import { ChevronIcon, LocateIcon } from "@/components/StoreIcons";
import { STORES } from "@/data/gentle-monster-stores";

/** 지구본에 이름표를 다는 도시. 탭에 따라 갈립니다. */
const HOME_TAGS = ["Seoul"];
const WORLD_TAGS = ["Seoul", "Los Angeles", "Sydney", "Kuala Lumpur", "Milan", "Dubai"];

/** 현재 국가 탭에서 보여 주는 가까운 매장 */
const NEARBY = [
  {
    name: "젠틀몬스터 하우스 도산",
    aside: "3.2km",
    line: "영업 중 - 오후 8:00에 종료",
    where: "서울특별시 강남구 압구정로 46길 50",
  },
  {
    name: "젠틀몬스터 신세계 강남",
    aside: "5.1km",
    line: "영업 중 - 오후 8:00에 종료",
    where: "서울특별시 서초구 신반포로 176, 신세계백화점 1F",
  },
  {
    name: "젠틀몬스터 성수",
    aside: "9.6km",
    line: "영업 종료 - 내일 오전 11:00에 다시 오픈",
    where: "서울특별시 성동구 연무장길 42",
  },
];

/** 글로벌 탭에서 보여 주는 도시별 대표 매장 */
const WORLDWIDE = STORES.filter((store) => store.flagship).map((store) => ({
  name: store.name,
  aside: store.city,
  line: store.country,
  where: "도시를 골라 매장을 확인합니다",
}));

const SERVICES = ["피팅 서비스", "간편 수리", "수리 제품 픽업"];

/**
 * 제안하는 스토어 화면.
 * 위에서부터 현재 국가/글로벌 전환, 좁힌 범위, 지구본, 그 아래 매장 목록입니다.
 * 탭은 실제로 작동해서 지구본과 목록이 함께 바뀝니다.
 */
export function StoreGlobeMock() {
  const [world, setWorld] = useState(false);
  const stores = world ? WORLDWIDE : NEARBY;

  return (
    <div className="globe-mock">
      {/* 접속 국가 안에서 볼지, 전 세계를 볼지 */}
      <div className="globe-tabs" role="group">
        <button
          type="button"
          className="globe-tab"
          data-on={!world || undefined}
          onClick={() => setWorld(false)}
        >
          현재 국가
        </button>
        <button
          type="button"
          className="globe-tab"
          data-on={world || undefined}
          onClick={() => setWorld(true)}
        >
          글로벌
        </button>
      </div>

      {/* 선택 상자 대신 지금 보고 있는 범위만 한 줄로 */}
      <p className="globe-scope">
        {world ? "전 세계 19개 도시" : "대한민국 · 서울"}
        <ChevronIcon size={14} />
      </p>

      <div className="globe-stage">
        <GlobeDots
          interactive={false}
          labels
          still={!world}
          tags={world ? WORLD_TAGS : HOME_TAGS}
        />

        {/* 현재 위치로 돌아오는 플로팅 버튼 */}
        <button
          type="button"
          className="globe-locate"
          onClick={() => setWorld(false)}
        >
          <LocateIcon size={12} />
          현재 위치 사용
        </button>
      </div>

      <div className="globe-list">
        {stores.map((store) => (
          <article className="store-card" key={store.name}>
            <div className="store-card-top">
              <h4 className="store-name">{store.name}</h4>
              <span className="store-distance">{store.aside}</span>
            </div>
            <p className="store-hours">{store.line}</p>
            <p className="store-address">{store.where}</p>
            <div className="store-tags">
              {SERVICES.map((service) => (
                <span className="store-tag" key={service}>
                  {service}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
