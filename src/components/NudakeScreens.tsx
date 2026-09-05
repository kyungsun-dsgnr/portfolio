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
const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;

function IconSearch() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden {...STROKE}>
      <circle cx="7" cy="7" r="5.1" />
      <path d="M10.8 10.8 L14.6 14.6" strokeLinecap="round" />
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
    <svg viewBox="0 0 16 16" aria-hidden {...STROKE} strokeLinecap="round" strokeLinejoin="round">
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

/** 그 아래 동그라미 셋. 가운데가 선물입니다. */
const KINDS = ["티", "티 기프트", "디저트"];

/** 목록에 깔리는 티 열두 종 */
const TEAS = [
  "블루 몽크",
  "레더 부츠",
  "더 마피아",
  "샤토 누아르",
  "블랙 캐러멜",
  "넘버 88",
  "화이트 선셋",
  "피치 로지",
  "맨티스",
  "루이",
  "캐모 필로우",
  "기문",
];

/** 어느 화면에나 떠 있는 상단 바 */
function TopBar() {
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
          src="/images/nudake-mock-logo.png"
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
        <i className="nud-mock-icon" style={box({ width: 15, height: 15 })}>
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
export function NudakeMockMenu({ open = false }: { open?: boolean }) {
  return (
    <div className="nud-mock" style={box({ width: 333, height: 726 })}>
      {/* 메뉴가 걷혔을 때 드러나는 화면 */}
      <div className="nud-mock-page" style={{ paddingTop: mk(49) }}>
        <div className="nud-mock-hero" style={box({ height: 373.95 })}>
          <span
            style={box({
              left: -3.33,
              top: -3.73,
              width: 339.66,
              height: 380.46,
            })}
          />
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
      </div>

      <TopBar />

      {/* 열려 있는 메뉴 판. 화면 전체를 덮습니다. */}
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
              <b style={type(16, 24)}>{item.label}</b>
              {item.caret ? (
                <i className="nud-mock-icon" style={box({ width: 14, height: 14 })}>
                  <IconArrow />
                </i>
              ) : null}

              {open && item.label === "메뉴" ? (
                <span
                  className="nud-mock-sub"
                  style={box({ left: 110, top: 0, width: 154.67 })}
                >
                  {SUBMENU.map((name) => (
                    <b key={name} style={{ ...type(16, 30), height: mk(39) }}>
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
          <i className="nud-mock-caret" style={box({ width: 6, height: 6 })} />
        </span>

        <span
          className="nud-mock-close"
          style={box({ left: 293, top: 20, width: 16, height: 16 })}
        />
      </div>
    </div>
  );
}

/**
 * 03 — 티 목록 화면
 *
 * 위에서부터 갈래 셋 · 종류 동그라미 셋 · 거른 수와 필터 · 티 열두 종입니다.
 * 가운데 동그라미가 '티 기프트' — 여기서 처음 선물이라는 분류가 보입니다.
 */
export function NudakeMockList() {
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
          style={{ ...box({ height: 124 }), padding: `${mk(21)} 0`, gap: mk(14) }}
        >
          {KINDS.map((kind, i) => (
            <span key={kind} style={{ maxWidth: mk(59), gap: mk(6) }}>
              <i data-ring={i === 0 || undefined} style={box({ width: 54, height: 54 })} />
              <b style={type(12, 14.4)}>{kind}</b>
            </span>
          ))}
        </div>

        <div
          className="nud-mock-filter"
          style={{ padding: `${mk(10)} ${mk(20)}` }}
        >
          <b style={type(13, 24)}>티(12)</b>
          <span style={{ gap: mk(5) }}>
            <i style={box({ width: 12, height: 12 })} />
            <b style={type(12, 24)}>필터</b>
          </span>
        </div>

        <div className="nud-mock-grid">
          {TEAS.map((tea, i) => (
            <span
              key={tea}
              data-edge={i % 2 === 0 || undefined}
              style={box({ height: 207.78 })}
            >
              <b
                style={{
                  ...box({ left: 10.75, top: 169.34, width: 144 }),
                  ...type(13, 16),
                }}
              >
                {tea}
              </b>
            </span>
          ))}
        </div>
      </div>

      <TopBar />
    </div>
  );
}
