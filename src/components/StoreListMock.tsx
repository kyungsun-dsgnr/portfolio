import Image from "next/image";

/**
 * 젠틀몬스터 스토어 찾기 화면의 목업.
 * 국가 → 지역 → 목록 순으로 좁혀 들어가는 지금의 흐름을 그대로 옮겼습니다.
 * 실제 화면을 0.703배로 줄인 값이라 수치가 딱 떨어지지 않습니다.
 */

/** 경기로 좁혔을 때의 여섯 곳. 거리순으로 적어 둡니다. */
const STORES = [
  {
    name: "젠틀몬스터 갤러리아 광교",
    distance: "21.3km",
    address: "경기 수원시 영통구 광교중앙로 124 갤러리아백화점 1F",
  },
  {
    name: "젠틀몬스터 신세계 사우스시티",
    distance: "25.3km",
    address: "경기도 용인시 수지구 포은대로 536, 신세계백화점 B1F",
  },
  {
    name: "젠틀몬스터 현대 판교",
    distance: "26.8km",
    address: "경기도 성남시 분당구 판교역로146번길 20, 현대백화점 1F",
  },
  {
    name: "젠틀몬스터 롯데 동탄",
    distance: "34.7km",
    address: "경기도 화성시 동탄역로 160, 롯데백화점 1F",
  },
  {
    name: "젠틀몬스터 스타필드 고양",
    distance: "45.2km",
    address: "경기도 고양시 덕양구 고양대로 1955, 스타필드 1F",
  },
  {
    name: "젠틀몬스터 신세계 의정부",
    distance: "50.1km",
    address: "경기도 의정부시 평화로 525, 신세계백화점 3F",
  },
];

/** 서울로 다시 좁히면 나오는 다섯 곳 */
const SEOUL_STORES = [
  {
    name: "젠틀몬스터 하우스 도산",
    distance: "3.2km",
    address: "서울특별시 강남구 압구정로 46길 50",
  },
  {
    name: "젠틀몬스터 신세계 강남",
    distance: "5.1km",
    address: "서울특별시 서초구 신반포로 176, 신세계백화점 1F",
  },
  {
    name: "젠틀몬스터 성수",
    distance: "9.6km",
    address: "서울특별시 성동구 연무장길 42",
  },
  {
    name: "젠틀몬스터 더현대 서울",
    distance: "11.4km",
    address: "서울특별시 영등포구 여의대로 108, 더현대 서울 3F",
  },
  {
    name: "젠틀몬스터 롯데월드몰",
    distance: "14.8km",
    address: "서울특별시 송파구 올림픽로 300, 롯데월드몰 1F",
  },
];

/** 지도에서 고른 매장 */
const PICKED_STORE = {
  name: "젠틀몬스터 신세계 강남",
  distance: "26.3km",
  address: "서울특별시 서초구 신반포로 176, 신세계백화점 1F",
  hours: "- 오늘 오전 10:30에 오픈",
};

const SERVICES = ["피팅 서비스", "간편 수리", "수리 제품 픽업"];

/** 시/군/구를 켜면 펼쳐지는 지역 목록 */
const DISTRICTS = ["경기", "대전", "대구", "부산", "서울", "인천", "제주", "충남", "광주"];

/** STORES 는 거리순입니다. 현재 위치를 켜기 전에는 이 차례로 보여줍니다. */
const BROWSE_ORDER = [2, 0, 4, 1, 5, 3];

/** 두 줄에 손잡이가 하나씩 달린 필터 아이콘 */
function FilterIcon() {
  return (
    <svg
      className="store-icon"
      viewBox="0 0 21.08 21.08"
      style={{ width: "calc(21.08 * var(--u))", height: "calc(21.08 * var(--u))" }}
      fill="currentColor"
      aria-hidden
    >
      <rect x="3.51" y="6.94" width="14.05" height="1.05" />
      <rect x="13.41" y="4.83" width="1.05" height="3.63" />
      <rect x="3.51" y="13.09" width="14.05" height="1.05" />
      <rect x="8.38" y="10.98" width="1.05" height="3.63" />
    </svg>
  );
}

/** 선택 상자 오른쪽의 펼침 표시 */
function ChevronIcon({ size = 17.57 }: { size?: number }) {
  return (
    <svg
      className="store-icon"
      viewBox="0 0 17.57 17.57"
      style={{ width: `calc(${size} * var(--u))`, height: `calc(${size} * var(--u))` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.05"
      aria-hidden
    >
      <path d="M5 7.4 8.79 11.1 12.57 7.4" />
    </svg>
  );
}

/** 현재 위치 표시 */
function LocateIcon({ size = 14.05 }: { size?: number }) {
  return (
    <svg
      className="store-icon"
      viewBox="0 0 14.05 14.05"
      style={{ width: `calc(${size} * var(--u))`, height: `calc(${size} * var(--u))` }}
      fill="currentColor"
      aria-hidden
    >
      <rect
        x="3.51"
        y="3.51"
        width="7.02"
        height="7.02"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.88"
      />
      <rect
        x="6.15"
        y="6.15"
        width="1.75"
        height="1.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.88"
      />
      <rect x="6.58" y="0.88" width="0.88" height="1.81" />
      <rect x="6.58" y="10.72" width="0.88" height="1.81" />
      <rect x="10.71" y="6.59" width="2.46" height="0.88" />
      <rect x="0.88" y="6.59" width="2.46" height="0.88" />
    </svg>
  );
}

/** 점이 붙은 자리와 그 자리를 설명하는 항목 번호 */
const DOTS = {
  locate: { key: "01", label: "현재 위치 사용" },
  district: { key: "02", label: "시/군/구 선택" },
  map: { key: "03", label: "지도 탭" },
};

type Props = {
  /** 눌러야 하는 자리에 점을 얹습니다. */
  dots?: boolean;
  /** 골라 둔 점의 항목 번호 */
  picked?: string | null;
  /** 0 은 막 고른 참, 1 은 그다음에 이어지는 동작입니다. */
  phase?: number;
  onPick?: (key: string) => void;
};

export function StoreListMock({
  dots = false,
  picked = null,
  phase = 0,
  onPick,
}: Props) {
  const located = picked === DOTS.locate.key;
  const zoomed = picked === DOTS.district.key;
  /** 지도 탭을 켜면 목록 자리에 지도가 들어섭니다. */
  const mapped = picked === DOTS.map.key;
  /** 펼친 목록의 서울 위에 손이 올라간 참 */
  const pressing = zoomed && phase === 1;
  /** 서울을 누르고 목록이 닫힌 뒤 */
  const repicked = zoomed && phase >= 2;

  /* 서울로 다시 좁히면 목록이 통째로 바뀌고, 현재 위치를 켜면 거리순으로 섭니다.
     그 전에는 지역 필터가 돌려줄 법한 차례입니다. */
  const stores = repicked
    ? SEOUL_STORES
    : located
      ? STORES
      : BROWSE_ORDER.map((i) => STORES[i]);

  /** 점 하나. 좁은 자리에서는 글자를 피해 오른쪽으로 비켜 놓습니다. */
  const dot = (of: keyof typeof DOTS, side = false) => {
    if (!dots) return null;
    const { key, label } = DOTS[of];
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={picked === key}
        onClick={() => onPick?.(key)}
        className={`store-dot${side ? " store-dot-side" : ""}`}
      >
        <span>{key}</span>
      </button>
    );
  };

  return (
    <div className="store-panel" aria-hidden={dots ? undefined : true}>
      <div className="store-head">
        <p className="store-count">
          스토어 <span>{stores.length}</span>
        </p>
        <FilterIcon />
      </div>

      <div className="store-filters">
        <div className="store-selects">
          <div className="store-select">
            <span className="store-select-label">국가/지역</span>
            <span className="store-select-value">대한민국</span>
            <ChevronIcon />
          </div>
          <div className="store-select" data-hot={zoomed || undefined}>
            <span className="store-select-label">시/군/구</span>
            <span className="store-select-value">{repicked ? "서울" : "경기"}</span>
            <ChevronIcon />
            {dot("district")}
            {zoomed && !repicked && (
              <div className="store-open-list">
                {DISTRICTS.map((name) => (
                  <p
                    className="store-open-item"
                    key={name}
                    data-on={name === "경기" || undefined}
                    data-press={(pressing && name === "서울") || undefined}
                  >
                    {name}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="store-locate" data-hot={located || undefined}>
          <LocateIcon />
          현재 위치 사용
          {dot("locate", true)}
        </p>
      </div>

      <div className="store-tabs">
        <span className="store-tab" data-on={!mapped || undefined}>
          목록
        </span>
        <span className="store-tab" data-on={mapped || undefined} data-hot={mapped || undefined}>
          지도
          {dot("map", true)}
        </span>
      </div>

      {/* 목록과 지도가 서로 바뀔 때마다 이 자리를 새로 그려 한 번 떠오르게 합니다. */}
      <div
        className="store-results"
        key={mapped ? "map" : repicked ? "seoul" : located ? "near" : "browse"}
      >
      {mapped ? (
        <div className="store-map">
          <Image src="/images/store-map.png" alt="" fill sizes="25vw" className="object-cover" />
          {phase > 0 && (
            <>
              {/* 지도 위 핀 하나를 누른 참 */}
              <span className="store-pin" />
              <div className="store-tip">
                <div className="store-tip-top">
                  <h5 className="store-tip-name">{PICKED_STORE.name}</h5>
                  <span className="store-tip-distance">{PICKED_STORE.distance}</span>
                </div>
                <p className="store-tip-hours">
                  <span>영업 종료</span>
                  <span>{PICKED_STORE.hours}</span>
                </p>
                <p className="store-tip-address">{PICKED_STORE.address}</p>
                <div className="store-tip-tags">
                  {SERVICES.map((service) => (
                    <span className="store-tip-tag" key={service}>
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
      <div className="store-list" data-scrolled={(located && phase > 0) || undefined}>
        <div className="store-list-inner">
        {stores.map((store) => (
          <article className="store-card" key={store.name}>
            <div className="store-card-top">
              <h4 className="store-name">{store.name}</h4>
              <span className="store-distance">{store.distance}</span>
            </div>
            <p className="store-hours">
              <span>영업 종료</span>
              <span>- 내일 오전 10:30에 다시 오픈</span>
            </p>
            <p className="store-address">{store.address}</p>
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
      )}
      </div>
    </div>
  );
}
