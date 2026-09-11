/**
 * 누데이크 모바일 화면 목업 셋
 *
 * 피그마에서 뽑아 주신 판을 그대로 옮긴 것입니다. 가로는 셋 다 333 이고,
 * 자리·크기는 모두 그 판의 값입니다. `--s` 를 곱해 화면 크기로 옮기는데,
 * 카드 자리의 가로가 마침 333u 라 `--s` 는 `--u` 그대로입니다 — 즉 폭에 꼭 맞고
 * 남는 세로는 잘립니다(화면을 위에서부터 들여다보는 셈입니다).
 *
 * 내보내기에서 아이콘과 로고는 벡터가 검은 네모로 눌려 나왔습니다. 그대로 두면
 * 네모만 남아, 돋보기·장바구니·꺾쇠·닫기는 같은 크기의 도형으로 다시 그렸고
 * 로고 자리에는 갖고 있는 워드마크를 넣었습니다.
 *
 * 2번 판은 메뉴 안쪽만 주셔서, 1번과 같은 화면에 메뉴만 펼친 것으로 두었습니다 —
 * 상단 바와 닫기는 1번 것을 그대로 씁니다.
 */

import Image from "next/image";
import type { CSSProperties } from "react";

/** 도면 좌표(가로 333)를 화면 크기로 */
const mk = (value: number) => `calc(${value} * var(--s))`;

const box = (b: {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}) => {
  const out: CSSProperties = {};
  if (b.left !== undefined) out.left = mk(b.left);
  if (b.top !== undefined) out.top = mk(b.top);
  if (b.width !== undefined) out.width = mk(b.width);
  if (b.height !== undefined) out.height = mk(b.height);
  return out;
};

/* 내보내기에서 네모로 눌려 나온 벡터들. 굵기를 하나로 맞춰 다시 그립니다. */
const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
} as const;

export function IconSearch() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden {...STROKE}>
      <circle cx="7" cy="7" r="5.1" />
      <path d="M10.8 10.8 L14.6 14.6" strokeLinecap="round" />
    </svg>
  );
}

/* 카카오 선물하기 머리의 장바구니와 닫기. 그 화면은 선이 조금 굵습니다. */
function IconBag() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden {...STROKE} strokeWidth={1.6}>
      <path d="M3.4 6.6 H16.6 V17.2 H3.4 Z" strokeLinejoin="round" />
      <path d="M7 8.4 V5.6 a3 3 0 0 1 6 0 V8.4" strokeLinecap="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      {...STROKE}
      strokeWidth={1.6}
      strokeLinecap="round"
    >
      <path d="M4.6 4.6 L15.4 15.4 M15.4 4.6 L4.6 15.4" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden {...STROKE} strokeLinecap="round">
      <path d="M1.6 4 H14.4 M1.6 8 H14.4 M1.6 12 H14.4" />
    </svg>
  );
}

/** 하위가 더 있다는 표시. 꺾쇠만이 아니라 선이 붙은 화살표입니다. */
function IconArrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      {...STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.8 8 H13.4 M9.4 4.2 L13.6 8 L9.4 11.8" />
    </svg>
  );
}

const type = (size: number, line: number): CSSProperties => ({
  fontSize: mk(size),
  lineHeight: mk(line),
});

/* 왼쪽 위에 세로로 놓이는 메뉴. 꺾쇠가 붙는 항목은 하위가 더 있다는 뜻입니다. */
const MENU = [
  { label: "스토어", caret: false },
  { label: "메뉴", caret: true },
  { label: "프로젝트", caret: true },
  { label: "SNS", caret: false },
];

/** 메뉴를 펼쳤을 때 오른쪽으로 나오는 하위 항목 */
const SUBMENU = ["누데이크 티 하우스", "하우스 노웨어 도산", "아카이브"];

/* 상품이 놓이는 2×2 칸. 왼쪽 칸이 1px 넓은 것도 판의 값 그대로입니다. */
const CELLS = [
  { left: 0, top: 0, width: 166.5, edge: false },
  { left: 166.5, top: 0, width: 165.5, edge: true },
  { left: 0, top: 223, width: 166.5, edge: false },
  { left: 166.5, top: 223, width: 165.5, edge: true },
];

/** 3번 판 위쪽의 세 갈래. 첫 갈래만 켜져 있습니다. */
const TABS = ["누데이크 티 하우스", "하우스 노웨어 도산", "아카이브"];

/* 그 아래 동그라미 셋. 가운데가 선물입니다.
   그림은 2026-09-07 nudake.com/kr/menu 에서 받아 480px 로 줄여 둔 것입니다. */
const KINDS = [
  { name: "티", img: "/images/nudake-tea/kind-tea.webp" },
  { name: "티 기프트", img: "/images/nudake-tea/kind-teagift.webp" },
  { name: "디저트", img: "/images/nudake-tea/kind-dessert.webp" },
];

/** 선물 갈래를 고른 목록. 2026-09-08 nudake.com/kr/menu (티 기프트) 그대로입니다 —
 *  앞의 셋이 세트고, 그 뒤로 티백 에디션이 이어집니다. */
const GIFTS = [
  { name: "누데이크 티 컬렉션", img: "nudake-gift/collection" },
  { name: "누데이크 티 아카이브", img: "nudake-gift/archive" },
  { name: "누데이크 티 테이스터", img: "nudake-gift/taster" },
  { name: "루스 리프 에디션", img: "nudake-gift/looseleaf" },
  { name: "티백 에디션 - 블루 몽크", img: "nudake-gift/bag-bluemonk" },
  { name: "티백 에디션 - 레더 부츠", img: "nudake-gift/bag-leatherboots" },
  { name: "티백 에디션 - 더 마피아", img: "nudake-gift/bag-themafia" },
  { name: "티백 에디션 - 샤토 누아르", img: "nudake-gift/bag-chateaunoir" },
  { name: "티백 에디션 - 넘버88", img: "nudake-gift/bag-no88" },
  { name: "티백 에디션 - 블랙 캐러멜", img: "nudake-gift/bag-blackcaramel" },
  { name: "티백 에디션 - 화이트 선셋", img: "nudake-gift/bag-whitesunset" },
  { name: "티백 에디션 - 피치 로지", img: "nudake-gift/bag-peachrosy" },
  { name: "티백 에디션 - 맨티스", img: "nudake-gift/bag-mantis" },
  { name: "티백 에디션 - 루이", img: "nudake-gift/bag-louis" },
  { name: "티백 에디션 - 캐모 필로우", img: "nudake-gift/bag-camopillow" },
  { name: "티백 에디션 - 기문", img: "nudake-gift/bag-keemun" },
];

/** 목록에 깔리는 티 열두 종. 그림은 같은 자리에서 받았습니다. */
const TEAS = [
  { name: "블루 몽크", img: "nudake-tea/bluemonk" },
  { name: "레더 부츠", img: "nudake-tea/leatherboots" },
  { name: "더 마피아", img: "nudake-tea/themafia" },
  { name: "샤토 누아르", img: "nudake-tea/chateaunoir" },
  { name: "블랙 캐러멜", img: "nudake-tea/blackcaramel" },
  { name: "넘버 88", img: "nudake-tea/no88" },
  { name: "화이트 선셋", img: "nudake-tea/whitesunset" },
  { name: "피치 로지", img: "nudake-tea/peachrosy" },
  { name: "맨티스", img: "nudake-tea/mantis" },
  { name: "루이", img: "nudake-tea/louis" },
  { name: "캐모 필로우", img: "nudake-tea/camopillow" },
  { name: "기문", img: "nudake-tea/keemun" },
];

/** 어느 화면에나 떠 있는 상단 바 */
function TopBar({ tap }: { tap?: "hamburger" } = {}) {
  return (
    <div className="nud-mock-bar" style={box({ height: 49 })}>
      <span
        className="nud-mock-tap"
        style={box({ left: 0, top: 0, width: 60, height: 48 })}
      >
        <i className="nud-mock-icon" style={box({ width: 16, height: 16 })}>
          <IconSearch />
        </i>
      </span>

      <span
        className="nud-mock-logo"
        style={box({ left: 125, top: 14.5, width: 83, height: 19 })}
      >
        <Image
          src="/images/nudake-mock-logo2.png"
          alt="Nudake"
          fill
          sizes="20vw"
          className="object-contain"
        />
      </span>

      <span
        className="nud-mock-tap"
        style={box({ left: 273, top: 0, width: 60, height: 48 })}
      >
        <i
          className="nud-mock-icon"
          data-tap={tap === "hamburger" || undefined}
          style={box({ width: 15, height: 15 })}
        >
          <IconMenu />
        </i>
      </span>
    </div>
  );
}

/**
 * 01 — 메뉴 화면
 *
 * `open` 을 주면 '메뉴' 만 남고 나머지는 옅어지며, 오른쪽으로 하위 항목이 펼쳐집니다.
 * 메뉴 판이 화면 전체를 덮으므로 그 아래 상품·푸터는 가려집니다. 내보내기에 있던
 * 겹이라 지우지 않고 그대로 두었습니다 — 메뉴를 걷으면 드러납니다.
 */
export function NudakeMockMenu({
  open = false,
  menu = true,
  hero,
  tap,
}: {
  open?: boolean;
  /** 메뉴 판을 걷으면 그 아래 홈 화면이 드러납니다. */
  menu?: boolean;
  /** 맨 위 큰 그림. 주지 않으면 회색 자리만 놓입니다. */
  hero?: string;
  /** 이 걸음의 마지막에 눌리는 자리. 손끝이 닿은 표시가 남습니다. */
  tap?: "hamburger" | "menu" | "teahouse";
}) {
  return (
    <div className="nud-mock" style={box({ width: 333, height: 726 })}>
      {/* 메뉴가 걷혔을 때 드러나는 화면 */}
      <div className="nud-mock-page" style={{ paddingTop: mk(49) }}>
        <div
          className="nud-mock-hero"
          data-shot={hero ? "" : undefined}
          style={box({ height: 373.95 })}
        >
          <span
            style={box({
              left: -3.33,
              top: -3.73,
              width: 339.66,
              height: 380.46,
            })}
          >
            {hero ? (
              <Image
                src={hero}
                alt=""
                fill
                sizes="25vw"
                className="object-cover"
              />
            ) : null}
          </span>
        </div>

        <div className="nud-mock-band" style={box({ height: 280.58 })} />

        <div className="nud-mock-cells" style={box({ height: 446 })}>
          {CELLS.map((cell) => (
            <span
              key={`${cell.left}-${cell.top}`}
              data-edge={cell.edge || undefined}
              style={box({ ...cell, height: 222 })}
            />
          ))}
        </div>

        {/* 화면 맨 아래. 메뉴를 걷었을 때만 눈에 듭니다. */}
        <div className="nud-mock-foot" style={box({ height: 121 })}>
          <div className="nud-mock-foot-in" style={{ padding: `${mk(22)} 0` }}>
            <div
              className="nud-mock-sns"
              style={{ ...box({ width: 127, height: 30 }), gap: mk(22) }}
            >
              {[0, 1, 2, 3].map((i) => (
                <span key={i} style={box({ width: 15, height: 15 })} />
              ))}
            </div>

            <p
              className="nud-mock-legal"
              style={{ fontSize: mk(9), lineHeight: mk(14) }}
            >
              ㈜아이아이컴바인드 | 사업자등록번호: 119-86-38589 | 대표자: 김한국
              <br />
              서울특별시 성동구 뚝섬로 433
              <br />
              ©NUDAKE
            </p>
          </div>
        </div>
      </div>

      <TopBar tap={tap === "hamburger" ? "hamburger" : undefined} />

      {/* 열려 있는 메뉴 판. 화면 전체를 덮습니다. */}
      {menu ? (
        <div className="nud-mock-menu" style={box({ width: 333, height: 726 })}>
          <nav
            className="nud-mock-list"
            style={{ ...box({ left: 30, top: 30, width: 77.31 }), gap: mk(6) }}
          >
            {MENU.map((item) => (
              <span
                key={item.label}
                /* 펼쳤을 때는 지금 보고 있는 갈래만 검게 남습니다. */
                data-off={(open && item.label !== "메뉴") || undefined}
                style={{ height: mk(32), gap: mk(8) }}
              >
                <b
                  data-tap={
                    (tap === "menu" && item.label === "메뉴") || undefined
                  }
                  style={type(16, 24)}
                >
                  {item.label}
                </b>
                {item.caret ? (
                  <i
                    className="nud-mock-icon"
                    style={box({ width: 14, height: 14 })}
                  >
                    <IconArrow />
                  </i>
                ) : null}

                {open && item.label === "메뉴" ? (
                  <span
                    className="nud-mock-sub"
                    style={box({ left: 110, top: 0, width: 154.67 })}
                  >
                    {SUBMENU.map((name) => (
                      <b
                        key={name}
                        data-tap={
                          (tap === "teahouse" &&
                            name === "누데이크 티 하우스") ||
                          undefined
                        }
                        style={{ ...type(16, 30), height: mk(39) }}
                      >
                        {name}
                      </b>
                    ))}
                  </span>
                ) : null}
              </span>
            ))}
          </nav>

          <span
            className="nud-mock-lang"
            style={{ ...box({ left: 30, top: 670, height: 24 }), gap: mk(4) }}
          >
            <b style={type(16, 24)}>한국어</b>
            <i
              className="nud-mock-caret"
              style={box({ width: 6, height: 6 })}
            />
          </span>

          <span
            className="nud-mock-close"
            style={box({ left: 293, top: 20, width: 16, height: 16 })}
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * 03 — 티 목록 화면
 *
 * 위에서부터 갈래 셋 · 종류 동그라미 셋 · 거른 수와 필터 · 티 열두 종입니다.
 * 가운데 동그라미가 '티 기프트' — 여기서 처음 선물이라는 분류가 보입니다.
 */
/* 상세에 서는 세트 넷. 2026-09-11 nudake.com/kr/menu (티 기프트) 각 상세 그대로 —
   목록(GIFTS)과 같은 차례라 `이전 제품 · 다음 제품` 이 이 순서로 넘어갑니다. */
const DETAILS = [
  {
    name: "누데이크 티 컬렉션",
    img: "collection",
    price: "53,000원",
    desc: "티백(18개입)\n블루 몽크(2개입), 레더 부츠(2개입), 블랙 캐러멜(2개입),\n화이트 선셋(2개입), 피치 로지(2개입), 맨티스(2개입),\n더 마피아, 샤토 누아르, 넘버 88, 루이, 캐모 필로우, 기문\n\nCaffeine-Free: 맨티스 · 루이 · 캐모 필로우",
  },
  {
    name: "누데이크 티 아카이브",
    img: "archive",
    price: "38,900원",
    desc: "티백(16개입)\n블루 몽크(2개입), 레더 부츠(2개입), 맨티스(2개입), 화이트 선셋(2개입),\n더 마피아, 샤토 누아르, 블랙 캐러멜, 넘버 88, 피치 로지,\n루이, 캐모 필로우, 기문\n\nCaffeine-Free: 맨티스 · 루이 · 캐모 필로우",
  },
  {
    name: "누데이크 티 테이스터",
    img: "taster",
    price: "28,500원",
    desc: "티백(10개입)\n블루 몽크, 레더 부츠, 더 마피아, 넘버 88, 화이트 선셋,\n피치 로지, 맨티스, 루이, 캐모 필로우, 기문\n\nCaffeine-Free: 맨티스 · 루이 · 캐모 필로우",
  },
  {
    name: "루스 리프 에디션",
    img: "looseleaf",
    price: "48,000원",
    desc: "잎차(12종)\n*기문: 56,000원\n\nCaffeine-Free: 맨티스 · 루이 · 캐모 필로우",
  },
];

/**
 * 04 — 제품 상세 화면
 *
 * 2026-09-11 nudake.com/kr/menu 의 세트 상세를 그대로 옮긴 판입니다 —
 * 이름·값 줄, 그림 셋이 옆으로 넘어가는 자리(점 셋), 설명, 카카오톡 선물하기,
 * 그리고 바닥의 이전·다음 제품. 목록에서 하나를 고르면 이 화면으로 넘어갑니다.
 * 기본은 둘째 세트(티 아카이브)고, `item` 으로 다른 세트를 세웁니다.
 */
export function NudakeMockDetail({
  tap = false,
  down = false,
  item = 1,
  next = false,
}: {
  /** 선물하기 단추에 손끝이 닿는 순간 */
  tap?: boolean;
  /** 단추가 보이도록 화면을 조금 내린 상태 */
  down?: boolean;
  /** 서 있는 세트 — DETAILS 의 차례 */
  item?: number;
  /** 바닥의 `다음 제품` 에 손끝이 닿는 순간 */
  next?: boolean;
} = {}) {
  const one = DETAILS[item] ?? DETAILS[1];
  return (
    /* 키는 안에 든 것이 정합니다 — 아래 단추까지 한 화면에 들어와야 합니다. */
    <div
      className="nud-mock nud-detail"
      data-down={down || undefined}
      style={box({ width: 333 })}
    >
      <div className="nud-mock-page" style={{ paddingTop: mk(49) }}>
        {/* 이름과 값, 그 아래 갈래 한 줄 */}
        <div
          className="nud-detail-head"
          style={{ padding: `${mk(10)} ${mk(24)} ${mk(12)}` }}
        >
          <div className="nud-detail-name">
            <b style={type(16, 16)}>{one.name}</b>
            <em style={type(16, 16)}>{one.price}</em>
          </div>
          <p style={{ ...type(13, 13), paddingTop: mk(5) }}>
            누데이크 티 하우스
          </p>
        </div>

        {/* 그림 셋이 옆으로 넘어가는 자리. 지금은 첫 장이 서 있습니다. */}
        <div className="nud-detail-shots" style={box({ height: 363 })}>
          <div className="nud-detail-track">
            {[0, 1, 2].map((n) => (
              <span key={n} style={box({ width: 333, height: 363 })}>
                <Image
                  src={`/images/nudake-gift/${one.img}.webp`}
                  alt=""
                  fill
                  sizes="30vw"
                  className="object-contain"
                />
              </span>
            ))}
          </div>

          <span className="nud-detail-dots" style={{ gap: mk(10) }}>
            {[0, 1, 2].map((n) => (
              <i
                key={n}
                data-on={n === 0 || undefined}
                style={box({ width: 6, height: 6 })}
              />
            ))}
          </span>
        </div>

        {/* 설명과 선물 단추 */}
        <div
          className="nud-detail-body"
          style={{ padding: `${mk(16)} ${mk(20)} ${mk(12)}` }}
        >
          <p
            style={{
              ...type(13, 19.5),
              width: mk(293),
              whiteSpace: "pre-line",
            }}
          >
            {one.desc}
          </p>

          <span
            className="nud-detail-cta"
            /* 스스로 밟아 보여 줄 때, 이 단추에 손끝이 닿습니다. */
            data-tap={tap || undefined}
            style={
              {
                ...box({ width: 293, height: 36 }),
                "--tap-wait": "0s",
              } as CSSProperties
            }
          >
            <b style={type(13, 13)}>카카오톡 선물하기</b>
          </span>
        </div>

        {/* 바닥 — 이전·다음 제품. 첫 세트에서만 이전이 꺼집니다.
            스스로 넘겨 보여 줄 때는 `다음 제품` 에 손끝이 닿습니다. */}
        <div className="nud-detail-feet" style={box({ height: 48 })}>
          <span data-off={item === 0 || undefined} style={{ gap: mk(10) }}>
            <i className="nud-detail-arrow" data-back aria-hidden />
            <b style={type(13, 19.5)}>이전 제품</b>
          </span>
          <span
            data-tap={next || undefined}
            style={{ gap: mk(10), "--tap-wait": "0s" } as CSSProperties}
          >
            <b style={type(13, 19.5)}>다음 제품</b>
            <i className="nud-detail-arrow" aria-hidden />
          </span>
        </div>
      </div>

      <TopBar />
    </div>
  );
}

/**
 * 05 — 카카오 선물하기 화면
 *
 * 상세에서 `카카오톡 선물하기` 를 누르면 브랜드 밖으로 나가 여기에 섭니다.
 * 판은 보내 주신 마크업 그대로입니다 — 44 짜리 머리, 정사각 그림과 `1 / 4`,
 * 판매자 줄, 긴 이름, 값, 배송정보, 그리고 바닥의 `나에게 선물` · `선물하기`.
 *
 * 이 장이 말하는 단절이 눈에 보이는 자리라, 남의 화면인 티가 나야 합니다 —
 * 글꼴도 누데이크의 것이 아니라 시스템 고딕(Inter)입니다.
 *
 * `away` 가 서면 화면이 통째로 흑백이 되고 딤드 위에 한 마디가 뜹니다 —
 * 경험이 브랜드 밖으로 나갔다는 표시입니다. `quiet` 면 색만 빼고 딤드와 말은
 * 바깥(판)이 맡습니다.
 */
export function NudakeMockKakao({
  away = false,
  quiet = false,
}: { away?: boolean; quiet?: boolean } = {}) {
  return (
    <div
      className="nud-mock nud-kakao"
      style={box({ width: 333 })}
      data-away={away || undefined}
      data-quiet={quiet || undefined}
    >
      {/* 밖으로 나간 표시. 색을 빼는 건 아래 판이고, 글은 그 위에 또렷이 섭니다. */}
      <div className="nud-away" aria-hidden>
        {/* 오른쪽 글판 마지막 걸음과 같은 채운 알약에 한 마디를 담습니다. */}
        {quiet ? null : (
          <span className="flow-pill nud-away-pill" data-tone="start">
            누데이크 경험 종료
          </span>
        )}
      </div>
      <div className="nud-mock-page" style={{ paddingTop: mk(44) }}>
        {/* 그림과 그 위에 얹히는 두 표 */}
        <div className="nud-kakao-shot" style={box({ height: 333 })}>
          <Image
            src="/images/nudake-gift/archive.webp"
            alt=""
            fill
            sizes="30vw"
            className="object-cover"
          />

          <span
            className="nud-kakao-only"
            style={{
              ...box({ left: 279.6, top: 10, height: 30 }),
              ...type(14, 30),
            }}
          >
            단독
          </span>

          <span
            className="nud-kakao-count"
            style={{
              ...box({ left: 289.2, top: 299 }),
              padding: `${mk(5)} ${mk(8)}`,
              ...type(12, 14),
            }}
          >
            <b>1</b> / 4
          </span>
        </div>

        {/* 판매자 · 이름 · 값 */}
        <div
          className="nud-kakao-info"
          style={{ padding: `${mk(16)} ${mk(16)} ${mk(20)}` }}
        >
          <span className="nud-kakao-seller" style={{ gap: mk(8) }}>
            <i style={box({ width: 30, height: 30 })}>
              <Image
                src="/images/nudake-mock-logo.png"
                alt=""
                fill
                sizes="8vw"
                className="object-contain"
              />
            </i>
            <b style={type(15, 18)}>누데이크</b>
          </span>

          <p
            className="nud-kakao-name"
            style={{ ...type(18, 24), paddingTop: mk(6) }}
          >
            BEST 티백 선물 세트 / TEA 기프트 ‘티 아카이브’
          </p>

          <p
            className="nud-kakao-name"
            style={{ ...type(18, 24), paddingTop: mk(6) }}
          >
            원산지 : 상세설명에 표시
          </p>

          <p
            className="nud-kakao-reviews"
            style={{ ...type(13, 20), paddingTop: mk(6) }}
          >
            154건의 선물후기
          </p>

          <p className="nud-kakao-price" style={{ paddingTop: mk(12) }}>
            <b style={type(20, 22)}>38,900</b>
            <em style={type(19, 22)}>원</em>
          </p>
        </div>

        {/* 띠 하나. 내보내기에서도 그림 자리로만 있던 곳입니다. */}
        <span
          className="nud-kakao-band"
          style={box({ left: 16, width: 301, height: 42 })}
        />

        {/* 배송정보 */}
        <div
          className="nud-kakao-ship"
          style={{ padding: `${mk(20)} ${mk(16)} ${mk(30)}`, gap: mk(8) }}
        >
          <b style={{ ...type(14, 20), width: mk(60) }}>배송정보</b>
          <span>
            <b style={type(14, 20)}>배송비 무료</b>
            <em style={type(14, 20)}>제주, 도서산간지역 배송불가</em>
          </span>
        </div>

        {/* 바닥 단추 둘 */}
        <div
          className="nud-kakao-feet"
          style={{ padding: `${mk(12)}`, gap: mk(8) }}
        >
          <b style={{ ...box({ height: 48 }), ...type(15, 48) }}>나에게 선물</b>
          <em style={{ ...box({ height: 48 }), ...type(15, 48) }}>선물하기</em>
        </div>
      </div>

      {/* 머리 — 누데이크의 것이 아닙니다. 장바구니 · 선물하기 · 찾기 · 닫기. */}
      <div className="nud-kakao-bar" style={box({ height: 44 })}>
        <i style={box({ width: 24, height: 24 })}>
          <IconBag />
        </i>

        <b style={type(16, 44)}>선물하기</b>

        <span style={{ gap: mk(10) }}>
          <i style={box({ width: 22, height: 22 })}>
            <IconSearch />
          </i>
          <i style={box({ width: 22, height: 22 })}>
            <IconClose />
          </i>
        </span>
      </div>
    </div>
  );
}

export function NudakeMockList({
  tap,
  gift = false,
  pick = false,
}: {
  tap?: "teagift";
  /** 선물 갈래를 고른 뒤의 목록. 거른 수와 깔리는 것이 함께 바뀝니다. */
  gift?: boolean;
  /** 둘째 칸(누데이크 티 아카이브)에 손끝이 닿는 순간 */
  pick?: boolean;
} = {}) {
  const list = gift ? GIFTS : TEAS;
  return (
    <div className="nud-mock" style={box({ width: 333, height: 1517 })}>
      <div className="nud-mock-page" style={{ paddingTop: mk(49) }}>
        <div
          className="nud-mock-tabs"
          style={{
            ...box({ height: 46.2 }),
            padding: `${mk(13)} 0 ${mk(14)}`,
            gap: mk(19),
          }}
        >
          {TABS.map((tab, i) => (
            <b key={tab} data-off={i > 0 || undefined} style={type(14, 18.2)}>
              {tab}
            </b>
          ))}
        </div>

        <div
          className="nud-mock-kinds"
          style={{
            ...box({ height: 124 }),
            padding: `${mk(21)} 0`,
            gap: mk(14),
          }}
        >
          {KINDS.map((kind) => (
            <span
              key={kind.name}
              data-tap={
                (tap === "teagift" && kind.name === "티 기프트") || undefined
              }
              style={{ maxWidth: mk(59), gap: mk(6) }}
            >
              {/* 선물 갈래를 고른 화면에서만 그 동그라미에 테를 둘립니다.
                  As-is 걸음의 티 목록은 테 없이 두기로 한 자리입니다. */}
              <i
                data-ring={(gift && kind.name === "티 기프트") || undefined}
                style={box({ width: 54, height: 54 })}
              >
                <Image
                  src={kind.img}
                  alt=""
                  fill
                  sizes="10vw"
                  className="object-cover"
                />
              </i>
              <b style={type(12, 14.4)}>{kind.name}</b>
            </span>
          ))}
        </div>

        <div
          className="nud-mock-filter"
          style={{ padding: `${mk(10)} ${mk(20)}` }}
        >
          <b style={type(13, 24)}>{gift ? "티 기프트(16)" : "티(12)"}</b>
          <span style={{ gap: mk(5) }}>
            <i style={box({ width: 12, height: 12 })} />
            <b style={type(12, 24)}>필터</b>
          </span>
        </div>

        <div className="nud-mock-grid">
          {list.map((tea, i) => (
            <span
              key={tea.name}
              data-edge={i % 2 === 0 || undefined}
              /* 스스로 밟아 보여 줄 때, 둘째 칸(티 아카이브)에 손끝이 닿습니다. */
              data-tap={(pick && i === 1) || undefined}
              style={
                {
                  ...box({ height: 207.78 }),
                  "--tap-wait": "0s",
                } as CSSProperties
              }
            >
              {/* 그림이 칸을 통째로 씁니다. 이름은 그 위 아래쪽에 얹힙니다. */}
              <i>
                <Image
                  src={`/images/${tea.img}.webp`}
                  alt=""
                  fill
                  sizes="15vw"
                  className="object-contain"
                />
              </i>

              <b
                style={{
                  ...box({ left: 0, width: 166.5 }),
                  bottom: mk(18),
                  textAlign: "center",
                  ...type(13, 16),
                }}
              >
                {tea.name}
              </b>
            </span>
          ))}
        </div>
      </div>

      <TopBar />
    </div>
  );
}
