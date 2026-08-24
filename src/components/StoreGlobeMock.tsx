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

/** 글로벌 탭에서 고를 수 있는 나라와, 그 나라의 도시 */
const COUNTRIES = [...new Set(STORES.map((store) => store.country))];
const ALL_COUNTRIES = "전 세계";
const ALL_CITIES = "전체 도시";

/** 한 줄짜리 선택기. 누르면 아래로 목록이 열립니다. */
function Pick({
  text,
  items,
  open,
  disabled,
  onToggle,
  onPick,
}: {
  text: string;
  items: string[];
  open: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onPick: (item: string) => void;
}) {
  return (
    <span className="globe-pick">
      <button
        type="button"
        className="globe-scope"
        data-open={open || undefined}
        disabled={disabled}
        onClick={onToggle}
      >
        {text}
        <ChevronIcon size={14} />
      </button>

      {open && (
        <div className="globe-scope-list">
          {items.map((item) => (
            <button
              type="button"
              key={item}
              className="globe-scope-item"
              data-on={item === text || undefined}
              onClick={() => onPick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}

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
  const [region, setRegion] = useState(REGION_NAMES[0]);
  /** 글로벌 탭의 두 선택기. 지구본에서 점을 집으면 둘 다 채워집니다. */
  const [country, setCountry] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [open, setOpen] = useState<null | "region" | "country" | "city">(null);

  const stores = !world
    ? REGIONS[region]
    : city
      ? STORES.filter((store) => store.city === city).map(card)
      : country
        ? STORES.filter((store) => store.country === country).map(card)
        : STORES.filter((store) => store.flagship).map(card);

  function show(next: boolean) {
    setWorld(next);
    setCountry(null);
    setCity(null);
    setOpen(null);
  }

  /** 지구본에서 집은 매장을 두 선택기에 옮겨 담습니다. */
  function fromGlobe(store: Store | null) {
    setCountry(store?.country ?? null);
    setCity(store?.city ?? null);
    setOpen(null);
  }

  function toggle(which: "region" | "country" | "city") {
    setOpen((now) => (now === which ? null : which));
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

      {/* 선택 상자 대신 지금 보고 있는 범위만 한 줄로. 눌러서 바꿉니다. */}
      <div className="globe-scope-row">
        {world ? (
          <>
            <Pick
              text={country ?? ALL_COUNTRIES}
              items={[ALL_COUNTRIES, ...COUNTRIES]}
              open={open === "country"}
              onToggle={() => toggle("country")}
              onPick={(item) => {
                setCountry(item === ALL_COUNTRIES ? null : item);
                setCity(null);
                setOpen(null);
              }}
            />
            <span className="globe-scope-sep">·</span>
            <Pick
              text={city ?? ALL_CITIES}
              items={[
                ALL_CITIES,
                ...STORES.filter((store) => store.country === country).map(
                  (store) => store.city,
                ),
              ]}
              open={open === "city"}
              disabled={!country}
              onToggle={() => toggle("city")}
              onPick={(item) => {
                setCity(item === ALL_CITIES ? null : item);
                setOpen(null);
              }}
            />
          </>
        ) : (
          <>
            <span className="globe-scope-fixed">대한민국</span>
            <span className="globe-scope-sep">·</span>
            <Pick
              text={region}
              items={REGION_NAMES}
              open={open === "region"}
              onToggle={() => toggle("region")}
              onPick={(item) => {
                setRegion(item);
                setOpen(null);
              }}
            />
          </>
        )}
      </div>

      <div className="globe-stage">
        {world ? (
          <GlobeDots labels={false} onPickStore={fromGlobe} />
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
