"use client";

import Image from "next/image";
import { useState } from "react";

import { GlobeDots } from "@/components/GlobeDots";
import { ChevronIcon, LocateIcon } from "@/components/StoreIcons";
import { STORES, type Store } from "@/data/gentle-monster-stores";

/** 현재 국가 탭. 지역을 고르면 그 지역 매장만 남습니다. */
const REGIONS: Record<string, { name: string; aside: string; line: string; where: string }[]> = {
  서울: [
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
    {
      name: "젠틀몬스터 더현대 서울",
      aside: "11.4km",
      line: "영업 중 - 오후 8:00에 종료",
      where: "서울특별시 영등포구 여의대로 108, 더현대 서울 3F",
    },
  ],
  경기: [
    {
      name: "젠틀몬스터 갤러리아 광교",
      aside: "21.3km",
      line: "영업 종료 - 내일 오전 10:30에 다시 오픈",
      where: "경기 수원시 영통구 광교중앙로 124 갤러리아백화점 1F",
    },
    {
      name: "젠틀몬스터 현대 판교",
      aside: "26.8km",
      line: "영업 중 - 오후 8:00에 종료",
      where: "경기도 성남시 분당구 판교역로146번길 20, 현대백화점 1F",
    },
    {
      name: "젠틀몬스터 스타필드 고양",
      aside: "45.2km",
      line: "영업 중 - 오후 9:00에 종료",
      where: "경기도 고양시 덕양구 고양대로 1955, 스타필드 1F",
    },
  ],
  부산: [
    {
      name: "젠틀몬스터 부산",
      aside: "2.1km",
      line: "영업 중 - 오후 8:00에 종료",
      where: "부산광역시 부산진구 중앙대로 673",
    },
    {
      name: "젠틀몬스터 신세계 센텀시티",
      aside: "4.8km",
      line: "영업 중 - 오후 8:00에 종료",
      where: "부산광역시 해운대구 센텀남대로 35, 신세계백화점 1F",
    },
  ],
  제주: [
    {
      name: "젠틀몬스터 제주",
      aside: "6.4km",
      line: "영업 중 - 오후 7:00에 종료",
      where: "제주특별자치도 제주시 탑동로 12",
    },
  ],
};

const REGION_NAMES = Object.keys(REGIONS);

const SERVICES = ["피팅 서비스", "간편 수리", "수리 제품 픽업"];

/** 도시 하나를 목록 카드 한 줄로 */
function card(store: Store) {
  return {
    name: store.name,
    aside: store.city,
    line: store.country,
    where: "도시를 골라 매장을 확인합니다",
  };
}

/**
 * 제안하는 스토어 화면.
 * 현재 국가 탭은 평면 지도, 글로벌 탭은 끌어 돌리는 지구본입니다.
 * 지구본에서 점을 집으면 그 나라 매장만 아래에 남습니다.
 */
export function StoreGlobeMock() {
  const [world, setWorld] = useState(false);
  const [picked, setPicked] = useState<Store | null>(null);
  const [region, setRegion] = useState(REGION_NAMES[0]);
  const [open, setOpen] = useState(false);

  const stores = !world
    ? REGIONS[region]
    : picked
      ? STORES.filter((store) => store.country === picked.country).map(card)
      : STORES.filter((store) => store.flagship).map(card);

  function show(next: boolean) {
    setWorld(next);
    setPicked(null);
    setOpen(false);
  }

  return (
    <div className="globe-mock">
      {/* 접속 국가 안에서 볼지, 전 세계를 볼지 */}
      <div className="globe-tabs" role="group">
        <button
          type="button"
          className="globe-tab"
          data-on={!world || undefined}
          onClick={() => show(false)}
        >
          현재 국가
        </button>
        <button
          type="button"
          className="globe-tab"
          data-on={world || undefined}
          onClick={() => show(true)}
        >
          글로벌
        </button>
      </div>

      {/* 선택 상자 대신 지금 보고 있는 범위만 한 줄로. 눌러서 지역을 바꿉니다. */}
      <div className="globe-scope-wrap">
        <button
          type="button"
          className="globe-scope"
          data-open={open || undefined}
          onClick={() => (world ? setPicked(null) : setOpen((now) => !now))}
        >
          {world ? (picked?.country ?? "전 세계 19개 도시") : `대한민국 · ${region}`}
          <ChevronIcon size={14} />
        </button>

        {open && !world && (
          <div className="globe-scope-list">
            {REGION_NAMES.map((name) => (
              <button
                type="button"
                key={name}
                className="globe-scope-item"
                data-on={name === region || undefined}
                onClick={() => {
                  setRegion(name);
                  setOpen(false);
                }}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="globe-stage">
        {world ? (
          <GlobeDots labels={false} onPickStore={setPicked} />
        ) : (
          <Image
            src="/images/store-map.png"
            alt=""
            fill
            sizes="25vw"
            className="object-cover"
          />
        )}

        {/* 현재 위치로 돌아오는 플로팅 버튼 */}
        <button type="button" className="globe-locate" onClick={() => show(false)}>
          <LocateIcon size={11} />
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
