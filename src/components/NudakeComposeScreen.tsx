"use client";

/**
 * 누데이크 개선 화면 — 고른 제품이 엽서가 되는 자리
 *
 * As-is 목업(NudakeScreens)과 같은 333 도면 위에 세웁니다. 자리·크기는 모두
 * 그 판의 값이고, `--s` 를 곱해 화면 크기로 옮깁니다.
 *
 * 걸음은 둘입니다.
 *   1) 티 기프트 목록에서 하나를 고릅니다.
 *   2) 고른 카드의 그림이 그대로 엽서로 불려옵니다 — 같은 요소가 자리와
 *      크기만 옮겨 가야, 다른 그림으로 갈아 끼운 것이 아니라
 *      '그 카드가 엽서가 된' 것으로 읽힙니다.
 *
 * 엽서에 글을 쓰는 걸음(메시지 카드)은 아직 두지 않았습니다.
 */

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { IconSearch } from "@/components/NudakeScreens";

/** 걸음 — 목록 · 상세 · 옮겨 가는 중 · 엽서 · 뒷장(메시지) · 결제 ·
 *  보냄 · 완료 · 받는 사람 화면 */
type Step =
  | "list"
  | "detail"
  | "fly"
  | "card"
  | "note"
  | "pay"
  | "sent"
  | "done"
  | "gift";

/* 엽서에 앉는 그림. 낱개 티(bag-…)는 nudake.com/kr/menu 의 `티` 화면에
   제 그림이 따로 있어, 상자 사진 대신 그 그림을 엽서에 씁니다.
   세트(컬렉션·아카이브·테이스터·루스 리프)는 그 화면에 없어 상자 사진 그대로입니다. */
const face = (img: string) =>
  img.startsWith("bag-")
    ? `/images/nudake-tea/${img}.webp`
    : `/images/nudake-gift/${img}.webp`;

/** 도면 좌표(가로 333)를 화면 크기로 */
const mk = (value: number) => `calc(${value} * var(--s))`;

type Box = { left: number; top: number; width: number; height: number };

const box = (b: Partial<Box> & { bottom?: number }) => {
  const out: CSSProperties = {};
  if (b.left !== undefined) out.left = mk(b.left);
  if (b.top !== undefined) out.top = mk(b.top);
  if (b.bottom !== undefined) out.bottom = mk(b.bottom);
  if (b.width !== undefined) out.width = mk(b.width);
  if (b.height !== undefined) out.height = mk(b.height);
  return out;
};

const type = (size: number, line: number): CSSProperties => ({
  fontSize: mk(size),
  lineHeight: mk(line),
});

/* 2026-09-08 nudake.com/kr/menu (티 기프트) 목록과 각 상세 화면에서
   그대로 옮겨 온 값입니다 — 이름 · 값 · 설명. */
const GIFTS = [
  {
    name: "누데이크 티 컬렉션",
    img: "collection",
    price: "53,000원",
    desc: "티백(18개입)\n\n블루 몽크(2개입), 레더 부츠(2개입), 블랙 캐러멜(2개입),\n화이트 선셋(2개입), 피치 로지(2개입), 맨티스(2개입),\n더 마피아, 샤토 누아르, 넘버 88, 루이, 캐모 필로우, 기문\n\nCaffeine-Free: 맨티스 · 루이 · 캐모 필로우",
  },
  {
    name: "누데이크 티 아카이브",
    img: "archive",
    price: "38,900원",
    desc: "티백(16개입)\n\n블루 몽크(2개입), 레더 부츠(2개입), 맨티스(2개입), 화이트 선셋(2개입),\n더 마피아, 샤토 누아르, 블랙 캐러멜, 넘버 88, 피치 로지,\n루이, 캐모 필로우, 기문\n\nCaffeine-Free: 맨티스 · 루이 · 캐모 필로우",
  },
  {
    name: "누데이크 티 테이스터",
    img: "taster",
    price: "28,500원",
    desc: "티백(10개입)\n\n블루 몽크, 레더 부츠, 더 마피아, 넘버 88, 화이트 선셋,\n피치 로지, 맨티스, 루이, 캐모 필로우, 기문\n\nCaffeine-Free: 맨티스 · 루이 · 캐모 필로우",
  },
  {
    name: "루스 리프 에디션",
    img: "looseleaf",
    price: "48,000원",
    desc: "잎차(12종)\n*기문: 56,000원\n\nCaffeine-Free: 맨티스 · 루이 · 캐모 필로우",
  },
  {
    name: "티백 에디션 - 블루 몽크",
    img: "bag-bluemonk",
    price: "36,000원",
    desc: "티백(15개입)\n\n푸른 로브를 걸친 스님의 뒷모습에서 발견한 고요하고\n세련된 무드를 담은 보이차. 시트러스한 베르가못 향,\n둥글게 퍼지는 코코넛 향, 청량한 스피어민트가\n완성하는 새벽 숲의 분위기.",
  },
  {
    name: "티백 에디션 - 레더 부츠",
    img: "bag-leatherboots",
    price: "36,000원",
    desc: "티백(15개입)\n\n고소한 피넛 향과 아몬드 향이 입안을 감싼 뒤,\n은은함이 천천히 스며드는 위스키 향의 블랙 티.\n오랜 시간 길들여진 레더의 감촉처럼\n부드럽고 따뜻하게 번지는 깊은 여운.",
  },
  {
    name: "티백 에디션 - 더 마피아",
    img: "bag-themafia",
    price: "36,000원",
    desc: "티백(15개입)\n\n캐러멜 한 조각을 베어물고 연기를 내뿜는 마피아를 상상하며\n만든 블랙 티. 시나몬의 알싸한 쌉쌀함에 캐러멜 단맛이 겹치며,\n거친 감각과 섬세한 부드러움이 교차하는 매력.",
  },
  {
    name: "티백 에디션 - 샤토 누아르",
    img: "bag-chateaunoir",
    price: "36,000원",
    desc: "티백(15개입)\n\n블랙커런트 향, 캐러멜 향, 바닐라 향이 녹아든 오크처럼\n깊고 스모키한 뉘앙스. 첫 모금에 퍼지는 레드 프루트의\n풍성한 바디감과 묵직하게 깔리는 우디 피니시가 남기는 긴 여운.",
  },
  {
    name: "티백 에디션 - 넘버88",
    img: "bag-no88",
    price: "36,000원",
    desc: "티백(15개입)\n\n인피니티 곡선(∞)처럼 다양한 맛과 향이 매끄럽게 연결되는\n그린 블랙 티. 상큼한 유자, 청량한 민트, 달콤한 허니부쉬가\n조화롭게 어우러져 매일 가볍게 즐길 수 있는 맛.",
  },
  {
    name: "티백 에디션 - 블랙 캐러멜",
    img: "bag-blackcaramel",
    price: "36,000원",
    desc: "티백(15개입)\n\n번트 캐러멜의 그을린 달콤함과 토스티한 고소함을 담은\n블랙 티. 캐러멜의 너티한 단맛 위로 쌉싸래한 베르가못 향이\n어우러진 은은한 여운.",
  },
  {
    name: "티백 에디션 - 화이트 선셋",
    img: "bag-whitesunset",
    price: "36,000원",
    desc: "티백(15개입)\n\n바닐라와 자스민의 쌉쌀한 달콤함에 베르가못의 잔향이\n투명하게 겹친 블랙 티. 은은하고 파우더리한 결이\n겹겹이 느껴지는 부드럽고 섬세한 터치.",
  },
  {
    name: "티백 에디션 - 피치 로지",
    img: "bag-peachrosy",
    price: "36,000원",
    desc: "티백(15개입)\n\n볼에 복숭앗빛을 머금은 소녀가 장미꽃 향을 맡는 순간을\n닮은 화이트 티. 복숭아의 사랑스러운 달콤함에 살구 향,\n장미 향이 스며든 맑고 달콤한 마무리.",
  },
  {
    name: "티백 에디션 - 맨티스",
    img: "bag-mantis",
    price: "36,000원",
    desc: "티백(15개입)\n\n젖은 풀잎 위를 천천히 걷는 사마귀처럼 조용하고 또렷하게\n스며드는 민트 티. 페퍼민트의 시원한 첫인상과\n스피어민트의 맑은 결을 타고 은은히 번지는 달콤함.\n\nCaffeine-Free",
  },
  {
    name: "티백 에디션 - 루이",
    img: "bag-louis",
    price: "36,000원",
    desc: "티백(15개입)\n\n붉은 사막을 달리는 검은 말처럼 자유롭게 퍼지는\n루이보스 티. 은은하게 감도는 단향과 오크의\n스모키한 잔향이 어우러진 깊고 담백한 마무리.\n\nCaffeine-Free",
  },
  {
    name: "티백 에디션 - 캐모 필로우",
    img: "bag-camopillow",
    price: "36,000원",
    desc: "티백(15개입)\n\n가볍고 포근한 베개에 얼굴을 기대는 듯한 아늑함을 품은\n캐모마일 티. 햇살이 스며든 오후처럼 따스한 단맛이\n산뜻하고 청량하게 이어지는 느긋한 부드러움.\n\nCaffeine-Free",
  },
  {
    name: "티백 에디션 - 기문",
    img: "bag-keemun",
    price: "46,000원",
    desc: "티백(15개입)\n\n중국 안후이성 기문 지역의 고유한 테루아가 빚어낸\n섬세하고 아름다운 향의 기문 홍차. 붉은 벨벳 드레스처럼\n실키하고 부드럽게 입안을 감싸며, 우아한 결을 따라 퍼지는\n아름다운 잔상.",
  },
];

/** 고르는 칸. 목록은 두 칸씩 깔립니다. */
const CELL = { width: 166.5, height: 207.78 };
/* 거른 수 줄(49 + 위아래 여백 10 + 글줄 24 + 선 1)이 끝나는 자리에서
   목록이 바로 시작합니다 — 사이를 띄우면 빈 줄로 보입니다. */
const GRID_TOP = 94;
/** 바닥 단추가 차지하는 키 */
const BAR = 96;
const cellAt = (i: number): Box => ({
  left: (i % 2) * CELL.width,
  top: GRID_TOP + Math.floor(i / 2) * CELL.height,
  width: CELL.width,
  height: CELL.height,
});

/** 엽서. 18장 표지(`Gift the Nudake Experience`)의 그 카드를 그대로 씁니다 —
 *  로고 · 이름줄 · 그림 · 주소, 같은 짜임입니다. 글이 그림 위에 서서
 *  카드 아래쪽은 봉투에 들어가도 읽을 것이 가려지지 않습니다. */
const CARD: Box = { left: 78, top: 29, width: 177, height: 252 };
/** 카드 안쪽 자리는 카드 판(201 × 286)을 기준으로 잽니다. */
/* 워드마크는 664 × 128 판(5.19 : 1)입니다. 카드에는 0.8 배로 줄여
   가운데에 놓습니다 — 폭 45, 키 8.7. */
const LOGO: Box = { left: 66, top: 17, width: 45, height: 8.7 };
/** 고른 칸이 그대로 자라 앉는 자리 — 카드의 그림 칸.
 *  그림이 정사각이라 자리도 정사각입니다. */
const SHOT: Box = { left: 91.5, top: 75, width: 150, height: 150 };
/** 카드 안에서 그림이 앉는 자리(카드 판 기준). 앞장은 정사각,
 *  뒷장은 높이만 잘린 띠입니다 — 한 요소가 두 자리를 오갑니다. */
const CARD_SHOT: Box = { left: 13.5, top: 46, width: 150, height: 150 };
const CARD_BAND: Box = { left: 13.5, top: 44, width: 150, height: 104 };

/** 편지봉투. 에셋 두 장을 그대로 겹칩니다 — 뒷면(열린 뚜껑까지 한 장)이
 *  편지지 뒤에 깔리고, 앞면(날개와 아래 접힘)이 편지지 위에 얹힙니다.
 *  크기는 두 그림의 제 비율(앞 760×538 · 뒤 760×899)이고, 같은 폭에
 *  바닥을 맞춰 세웁니다. */
const ENV_W = 216;
const ENV: Box = {
  left: 58.5,
  top: 203,
  width: ENV_W,
  height: (ENV_W * 538) / 760,
};
/** 닫힌 봉투 — 다 담고 나면 이 그림으로 바뀝니다. */
const SHUT_H = (ENV_W * 514) / 760;
const SHUT: Box = {
  left: 58.5,
  top: ENV.top + ENV.height - SHUT_H,
  width: ENV_W,
  height: SHUT_H,
};
const BACK_H = (ENV_W * 899) / 760;
const BACK: Box = {
  left: 58.5,
  top: ENV.top + ENV.height - BACK_H,
  width: ENV_W,
  height: BACK_H,
};

/** 머리의 햄버거를 누르면 펼쳐지는 메뉴.
 *  실제 화면의 갈래에 `티 기프트` 를 한 줄 더했습니다 —
 *  선물이 메뉴 안에서 제 이름으로 서는 자리입니다. */
const MENU = ["스토어", "메뉴", "티 기프트", "프로젝트", "SNS"];

/** 한 걸음 앞의 자리. 꺾쇠와 기기의 뒤로가기가 함께 씁니다 —
 *  뒷장 → 엽서 → 상세 → 목록 차례이고, 글을 쓰던 중이라도 상세로 갑니다. */
const PREV: Record<Step, Step> = {
  list: "list",
  detail: "list",
  fly: "detail",
  card: "detail",
  note: "detail",
  pay: "note",
  sent: "list",
  done: "list",
  gift: "done",
};

/** 받는 사람 화면의 자리. 봉투는 아래에 서고, 엽서가 그 위로 나옵니다. */
const GIFT_ENV: Box = {
  left: 58.5,
  top: 294,
  width: ENV_W,
  height: (ENV_W * 538) / 760,
};
const GIFT_BACK: Box = {
  left: 58.5,
  top: GIFT_ENV.top + GIFT_ENV.height - (ENV_W * 899) / 760,
  width: ENV_W,
  height: (ENV_W * 899) / 760,
};
const GIFT_SHUT: Box = {
  left: 58.5,
  top: GIFT_ENV.top + GIFT_ENV.height - (ENV_W * 514) / 760,
  width: ENV_W,
  height: (ENV_W * 514) / 760,
};
const GIFT_CARD: Box = { left: 78, top: 120, width: 177, height: 252 };

/** 스스로 훑을 때 고르는 칸 — 둘째 칸, 누데이크 티 아카이브. As-is 목업과 같은 제품입니다. */
const PICK = 1;

/** 스스로 훑을 때 적는 받는 사람과 번호 */
const WHO = "김민지";
const TEL = "010-2345-6789";

/* 이 화면이 스스로 지나가는 박자 */
const TAP_AT = 1100;
const PICK_AT = 1900;
/* 상세에 잠시 머물다 바닥의 `선물하기` 를 누르고, 그제야 엽서로 갑니다. */
const GIFT_AT = 3500;
const CARD_AT = 3900;

/** 엽서 뒷장에 미리 적혀 있는 글. 편집을 켜면 고쳐 쓸 수 있습니다. */
const NOTE = "생일 축하해.\n오늘도 행복한 하루 보내.";

/**
 * @param run 차례가 되면 스스로 고릅니다. 주지 않으면 목록에 멈춰 있습니다.
 * @param fill 손에 쥔 기기에서 화면을 통째로 채웁니다.
 * @param height 화면 높이(도면 값). 판 위에서는 잘리지 않게 목록 두 줄과
 *   바닥 단추가 딱 들어가는 키로 줄여 세웁니다.
 */
export function NudakeMockCompose({
  run = false,
  fill = false,
  height = 726,
  step: opening = "list",
  pick = PICK,
  written: writtenAtFirst = false,
  dots = false,
  dotRef,
  onFocus,
  swapTo = null,
  onDone,
}: {
  run?: boolean;
  fill?: boolean;
  height?: number;
  /** 처음 서는 걸음. 판 위에 한 장면만 세워 둘 때 씁니다. */
  step?: Step;
  /** 스스로 훑을 때 고르는 칸. 기본은 둘째 칸(티 아카이브)입니다. */
  pick?: number;
  /** 엽서에 글이 이미 적힌 채로 세웁니다 — 뒷장이 열려 있습니다. */
  written?: boolean;
  /** 번호 점 셋 — 그림 자리(01) · 메시지 단추(02) · 선물 보내기(03).
      판 위에서 글과 잇는 데 씁니다. */
  dots?: boolean;
  dotRef?: (key: string, el: HTMLElement | null) => void;
  /** 번호 점을 켜고 끌 때 판에 알립니다. */
  onFocus?: (key: string | null) => void;
  /** 세워 둔 엽서 화면에서, 아래 제품 줄의 이 칸을 눌러 바꿔 담습니다.
      비우면 처음 고른 칸으로 되돌아갑니다. */
  swapTo?: number | null;
  onDone?: () => void;
} = {}) {
  const [at, setAt] = useState<Step>(opening);
  /** 손끝이 닿는 순간 */
  const [tap, setTap] = useState(false);
  /** 뒷장에 적힌 글. 스스로 훑을 때는 한 글자씩 차고,
      손에 쥔 화면에서는 손으로 씁니다. */
  const [note, setNote] = useState(NOTE);
  /** 글을 한 번이라도 넣기 시작했는지 — 그 전까지 엽서는 앞장을 보입니다. */
  const [wrote, setWrote] = useState(
    writtenAtFirst ||
      opening === "pay" ||
      opening === "sent" ||
      opening === "done",
  );
  /** 글을 고쳐 쓰는 중인지 */
  const [editing, setEditing] = useState(false);
  /** 받는 사람 */
  const [to, setTo] = useState("");
  const [tel, setTel] = useState("");
  /** 고른 결제 수단 */
  const [pay, setPay] = useState(false);
  const pen = useRef<HTMLTextAreaElement>(null);
  /** 고치기 전의 글. 취소하면 이 자리로 되돌립니다. */
  const kept = useRef(NOTE);
  /** 고른 칸. 스스로 훑을 때는 `pick`, 손으로 고를 때는 누른 칸입니다. */
  const [chosen, setChosen] = useState(pick);
  /** 제품 줄에서 손끝이 닿는 칸 */
  const [press, setPress] = useState<number | null>(null);
  /** 바닥 단추(`선물하기` · `선물 보내기`)에 손끝이 닿는 순간 */
  const [hit, setHit] = useState(false);
  /** 엽서 아래 `메시지 입력` 에 손끝이 닿는 순간 */
  const [penHit, setPenHit] = useState(false);
  /** 결제 시트의 `결제하기` 에 손끝이 닿는 순간 */
  const [payHit, setPayHit] = useState(false);

  /* 밖에서 다른 칸을 가리키면 — 손끝이 닿고, 잠시 뒤 그 제품으로 바뀝니다.
     가리킴을 거두면 처음 칸으로 되돌아갑니다. */
  useEffect(() => {
    if (swapTo == null) {
      const back = window.setTimeout(() => {
        setPress(null);
        setChosen(pick);
      }, 0);
      return () => clearTimeout(back);
    }
    const clock = [
      window.setTimeout(() => setPress(swapTo), 700),
      window.setTimeout(() => setChosen(swapTo), 1100),
      window.setTimeout(() => setPress(null), 1700),
    ];
    return () => clock.forEach(clearTimeout);
  }, [swapTo, pick]);
  /** 받는 사람 화면에서 봉투가 열렸는지 */
  const [opened, setOpened] = useState(false);
  /** 머리의 메뉴가 펼쳐져 있는지 */
  const [menu, setMenu] = useState(false);
  /** 보내는 걸음 — 0 담기는 중 · 1 봉투가 닫힘 · 2 날아감 */
  const [send, setSend] = useState(0);
  /* 고른 칸이 제 자리를 떠났는지. 떠나기 전 한 틱은 칸 자리에 있어야
     자리 옮김이 이어져 보입니다. */
  const [flying, setFlying] = useState(false);

  /* 손에 쥔 화면에서는 기기의 뒤로가기도 한 걸음씩 되돌아옵니다.
     걸음마다 자리를 하나 쌓아 두고, 되돌아올 때 그만큼 물러납니다. */
  const atNow = useRef(at);
  useEffect(() => {
    atNow.current = at;
  }, [at]);

  const push = () => {
    if (fill) window.history.pushState({ nudc: 1 }, "");
  };

  useEffect(() => {
    if (!fill) return;
    const pop = () => {
      const now = atNow.current;
      /* 목록에서는 그대로 화면 밖으로 나갑니다. */
      if (now === "list") return;
      window.history.pushState({ nudc: 1 }, "");
      setAt(PREV[now]);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [fill]);

  const back = () => setAt((now) => PREV[now]);

  /* 번호 점. 누르면 그 자리만 남기고, 셋째(선물 보내기)는 그 화면까지 엽니다. */
  const [spot, setSpot] = useState<string | null>(null);
  const told = useRef(onFocus);
  useEffect(() => {
    told.current = onFocus;
  }, [onFocus]);

  const look = (key: string) => {
    const next = spot === key ? null : key;
    setSpot(next);
    /* 그리는 중에 부모를 건드리지 않도록 한 박자 뒤로 미룹니다. */
    window.setTimeout(() => told.current?.(next), 0);
    if (next === "03") setAt("pay");
    else if (at === "pay") setAt("note");
  };

  const dot = (id: string, style: CSSProperties, tone?: string) =>
    dots ? (
      <button
        type="button"
        className={`store-dot nudc-dot${tone ? ` ${tone}` : ""}`}
        ref={(el) => dotRef?.(id, el)}
        data-on={spot === id || undefined}
        aria-label={`${id} 자리만 보기`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => look(id)}
        style={style}
      >
        <span>{id}</span>
      </button>
    ) : null;

  /* 목록에서 하나를 누르면 그 제품의 상세로 갑니다. */
  const choose = (i: number) => {
    if (run || at !== "list") return;
    setChosen(i);
    setTap(true);
    push();
    setAt("detail");
  };

  /* 받는 사람 화면 — 닫힌 봉투가 열리며 엽서가 나옵니다. */
  useEffect(() => {
    if (at !== "gift") {
      const shut = window.setTimeout(() => setOpened(false), 0);
      return () => clearTimeout(shut);
    }
    const open = window.setTimeout(() => setOpened(true), 700);
    return () => clearTimeout(open);
  }, [at]);

  /* 상세에서 이전·다음 제품으로 넘깁니다. 끝에서는 처음으로 돌아옵니다. */
  const step = (way: number) =>
    setChosen((now) => (now + way + GIFTS.length) % GIFTS.length);

  /* 바닥 단추 — 상세에서는 엽서를 만들고, 뒷장에서는 봉투에 넣어 보냅니다. */
  const gift = () => {
    if (at === "detail") {
      push();
      setAt("fly");
      return;
    }
    if (at === "note") {
      pen.current?.blur();
      setEditing(false);
      push();
      setAt("pay");
    }
  };

  /* 결제까지 마치면 편지가 담겨 날아갑니다. */
  const payNow = () => {
    push();
    setSend(0);
    setAt("sent");
  };

  /* 담기고 → 봉투가 닫히고 → 슝 하고 날아갑니다. */
  useEffect(() => {
    if (at !== "sent") {
      const reset = window.setTimeout(() => setSend(0), 0);
      return () => clearTimeout(reset);
    }
    const clock = [
      window.setTimeout(() => setSend(1), 1000),
      window.setTimeout(() => setSend(2), 1700),
      window.setTimeout(() => setAt("done"), 2500),
    ];
    return () => clock.forEach(clearTimeout);
  }, [at]);

  /* 손끝 표시는 한 번만 지나갑니다. */
  useEffect(() => {
    if (!tap) return;
    const off = window.setTimeout(() => setTap(false), 760);
    return () => clearTimeout(off);
  }, [tap]);

  /* 자리를 옮기고 나면 종이가 깔리고, 이어서 뒷장이 열립니다. */
  useEffect(() => {
    if (at !== "fly") return;
    const on = window.setTimeout(() => setAt("card"), 620);
    return () => clearTimeout(on);
  }, [at]);

  useEffect(() => {
    if (at !== "card") return;
    const turn = window.setTimeout(() => setAt("note"), 900);
    return () => clearTimeout(turn);
  }, [at]);

  /* 떠나기 전 한 틱은 제 칸에 머물러야 자리 옮김이 이어져 보입니다. */
  const away = at !== "list" && at !== "detail";
  useEffect(() => {
    const go = window.setTimeout(() => setFlying(away), away ? 20 : 0);
    return () => clearTimeout(go);
  }, [away]);

  /* `메시지 편집` 을 누르면 그 자리에서 자판이 올라옵니다. */
  const edit = () => {
    if (run || editing) return;
    kept.current = note;
    setWrote(true);
    setEditing(true);
    /* 미리 적혀 있던 기본 글은 제안일 뿐이라 비웁니다 — 안내말이 대신 섭니다.
       손으로 쓴 글이 있으면 그대로 두고 그 뒤에서 이어 씁니다. */
    if (note === NOTE) setNote("");
    /* 누른 그 손짓 안에서 focus 해야 자판이 올라옵니다.
       다음 틱으로 미루면 기기가 사용자의 뜻으로 보지 않습니다. */
    const at = pen.current;
    at?.focus();
    /* 커서는 쓰던 글 끝에 섭니다. */
    const end = at?.value.length ?? 0;
    at?.setSelectionRange(end, end);
  };

  /* 다 썼으면 자판을 내리고 잠급니다. */
  const done = () => {
    setEditing(false);
    pen.current?.blur();
  };

  /* 취소하면 고치기 전의 글로 되돌립니다. */
  const undo = () => {
    setNote(kept.current);
    done();
  };

  /* 판 위에 한 장면만 세워 둔 목업은 그 걸음에 머뭅니다 —
     스스로 훑지도, 목록으로 돌아가지도 않습니다. */
  const frozen = opening !== "list";

  useEffect(() => {
    if (frozen) return;

    if (!run) {
      const still = window.setTimeout(() => {
        setAt("list");
        setTap(false);
        setNote("");
      }, 0);
      return () => clearTimeout(still);
    }

    const clock = [
      window.setTimeout(() => {
        setChosen(pick);
        setTap(true);
      }, TAP_AT),
      window.setTimeout(() => {
        setTap(false);
        setAt("detail");
      }, PICK_AT),
      window.setTimeout(() => setHit(true), GIFT_AT),
      window.setTimeout(() => {
        setHit(false);
        setAt("fly");
        onDone?.();
      }, CARD_AT),
    ];
    return () => clock.forEach(clearTimeout);
    /* 순서를 다시 돌릴 일은 없어 run 과 세워 둔 장면, 고를 칸만 봅니다. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, frozen, pick]);

  /* 열여섯 종이 그대로 깔립니다. 화면 밖으로 넘치는 것은 잘려 —
     실제 화면처럼 굴려 내려야 나오는 자리로 남습니다. */

  /* 목록·상세로 되돌아가면 쓰던 글과 받는 사람을 처음으로 되돌립니다. */
  useEffect(() => {
    if (at !== "list" && at !== "detail") return;
    const clear = window.setTimeout(() => {
      setNote(NOTE);
      setEditing(false);
      setWrote(false);
      setTo("");
      setTel("");
      setPay(false);
    }, 0);
    return () => clearTimeout(clear);
  }, [at]);

  /* 스스로 훑을 때는 엽서가 선 뒤 `메시지 입력` 을 눌러 뒷장에 글을 넣고,
     그 뒤 바닥의 `선물 보내기` 를 눌러 결제 시트까지 들어갑니다. */
  useEffect(() => {
    if (!run || at !== "note") return;
    const clock = [
      window.setTimeout(() => setPenHit(true), 700),
      window.setTimeout(() => {
        setPenHit(false);
        setWrote(true);
      }, 1100),
      window.setTimeout(() => setHit(true), 2800),
      window.setTimeout(() => {
        setHit(false);
        setAt("pay");
      }, 3200),
    ];
    return () => clock.forEach(clearTimeout);
  }, [run, at]);

  /* 스스로 훑을 때는 결제 시트가 선 뒤 받는 사람과 번호를 한 글자씩 적고,
     `결제하기` 를 눌러 편지를 보냅니다. */
  useEffect(() => {
    if (!run || at !== "pay") return;
    const clock: number[] = [];
    /* 이름은 400 부터 한 글자 140 씩, 번호는 이름 뒤 300 쉬고 한 글자 70 씩. */
    const NAME_AT = 400;
    const NAME_MS = 140;
    [...WHO].forEach((_, i) =>
      clock.push(
        window.setTimeout(
          () => setTo(WHO.slice(0, i + 1)),
          NAME_AT + (i + 1) * NAME_MS,
        ),
      ),
    );
    const TEL_AT = NAME_AT + WHO.length * NAME_MS + 300;
    const TEL_MS = 70;
    [...TEL].forEach((_, i) =>
      clock.push(
        window.setTimeout(
          () => setTel(TEL.slice(0, i + 1)),
          TEL_AT + (i + 1) * TEL_MS,
        ),
      ),
    );
    const PAY_AT = TEL_AT + TEL.length * TEL_MS + 600;
    clock.push(
      window.setTimeout(() => setPayHit(true), PAY_AT),
      window.setTimeout(() => {
        setPayHit(false);
        setSend(0);
        setAt("sent");
      }, PAY_AT + 400),
    );
    return () => clock.forEach(clearTimeout);
  }, [run, at]);

  const picked = GIFTS[chosen];
  /* 엽서가 뒷장을 보이는지 — 글을 넣기 시작한 뒤부터입니다. */
  const written = wrote || at === "pay" || at === "sent";
  const from = cellAt(chosen);
  const shot = flying ? SHOT : { ...from, top: from.top - 49 };

  return (
    <div
      className="nud-mock nudc"
      data-at={at}
      data-back={written || undefined}
      data-edit={editing || undefined}
      data-menu={menu || undefined}
      data-send={at === "sent" ? send : undefined}
      data-fill={fill || undefined}
      /* 손에 쥔 화면에서는 폭을 꽉 채우고 키는 기기 높이를 그대로 씁니다 —
         정해진 키를 곱하면 폭이 남거나 아래가 잘립니다. */
      style={{ ...box({ width: 333 }), height: fill ? "100dvh" : mk(height) }}
    >
      {/* 머리 — As-is 목업과 같은 바입니다. */}
      <div className="nud-mock-bar" style={box({ height: 49 })}>
        {/* 왼쪽 — 목록에서는 nudake.com 그대로 검색이고, 안으로 들어간 뒤에는
            되돌아올 꺾쇠가 섭니다. */}
        {at === "list" ? (
          <span
            className="nud-mock-tap"
            style={box({ left: 0, top: 0, width: 60, height: 48 })}
          >
            <i className="nud-mock-icon" style={box({ width: 16, height: 16 })}>
              <IconSearch />
            </i>
          </span>
        ) : (
          <button
            type="button"
            className="nud-mock-tap nudc-back-tap"
            aria-label="이전으로"
            onMouseDown={(event) => event.preventDefault()}
            onClick={back}
            style={box({ left: 0, top: 0, width: 60, height: 48 })}
          >
            <i className="nudc-back" style={box({ width: 9, height: 9 })} />
          </button>
        )}

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

        {/* 오른쪽 햄버거 — 누르면 메뉴가 펼쳐집니다. */}
        <button
          type="button"
          className="nud-mock-tap nudc-menu-tap"
          aria-label={menu ? "메뉴 닫기" : "메뉴 열기"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setMenu((now) => !now)}
          style={box({ left: 273, top: 0, width: 60, height: 48 })}
        >
          <i className="nud-mock-icon" style={box({ width: 15, height: 15 })}>
            <svg
              viewBox="0 0 16 16"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
            >
              {/* 펼쳐져 있는 동안에는 닫는 표시가 됩니다. */}
              <path
                d={
                  menu
                    ? "M3.2 3.2 L12.8 12.8 M12.8 3.2 L3.2 12.8"
                    : "M1.6 4 H14.4 M1.6 8 H14.4 M1.6 12 H14.4"
                }
              />
            </svg>
          </i>
        </button>
      </div>

      {/* 펼쳐진 메뉴. `티 기프트` 를 누르면 그 목록으로 돌아옵니다. */}
      <nav className="nudc-menu" data-open={menu || undefined}>
        <ul style={{ ...box({ left: 30, top: 72 }), gap: mk(6) }}>
          {MENU.map((item) => (
            <li key={item}>
              <button
                type="button"
                data-on={item === "티 기프트" || undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setMenu(false);
                  if (item === "티 기프트") setAt("list");
                }}
                style={{ ...type(16, 24), height: mk(32) }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>

        <span
          className="nudc-menu-lang"
          style={{ ...box({ left: 30, bottom: 56 }), ...type(16, 24) }}
        >
          한국어
        </span>
      </nav>

      {/* 걸러 놓은 수 — 실제 화면의 그 줄입니다. */}
      <div
        className="nudc-filter"
        style={{ ...box({ top: 49 }), padding: `${mk(10)} ${mk(20)}` }}
      >
        <b style={type(13, 24)}>티 기프트({GIFTS.length})</b>
        <span style={{ ...type(12, 24), gap: mk(5) }}>
          <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden>
            <g stroke="#000" strokeMiterlimit="10">
              <path d="M0 2.447h12M0 9.553h12M3 0v5M9 7v5" />
            </g>
          </svg>
          필터
        </span>
      </div>

      {/* 목록 — 고른 칸만 남기고 물러납니다. */}
      <div className="nudc-list">
        {GIFTS.map((gift, i) => (
          /* 고른 칸도 빈 칸으로 남깁니다 — 칸을 아예 빼면 그 자리만
             가르는 선이 끊깁니다. 그림은 그 위를 나는 요소가 맡습니다. */
          <button
            key={gift.name}
            type="button"
            className="nudc-cell"
            data-edge={i % 2 === 1 || undefined}
            data-pickable={(!run && at === "list") || undefined}
            aria-label={gift.name}
            /* 눌러도 포커스는 주지 않습니다 — 화면 밖으로 잘린 칸에 포커스가
               가면 브라우저가 그 칸을 보이려고 목업 안을 굴려 버립니다. */
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(i)}
            style={box(cellAt(i))}
          >
            {i === chosen && at !== "list" ? null : (
              <>
                <i>
                  <Image
                    src={`/images/nudake-gift/${gift.img}.webp`}
                    alt=""
                    fill
                    sizes="15vw"
                    /* 칸을 덮습니다 — 맞춰 넣으면 그림 위아래에 빈 띠가 남습니다. */
                    className="object-cover"
                  />
                </i>
                <b
                  style={{
                    ...box({ left: 0, width: CELL.width }),
                    bottom: mk(18),
                    ...type(13, 16),
                  }}
                >
                  {gift.name}
                </b>
              </>
            )}
          </button>
        ))}
      </div>

      {/* 상세 — 실제 화면 그대로 그림 · 이름 · 값 · 갈래 · 설명이 섭니다.
          아래 단추가 `선물하기` 이고, 누르면 엽서로 넘어갑니다. */}
      <div className="nudc-detail">
        <span
          className="nudc-detail-shot"
          /* 정사각에서 아래 36 을 잘라 냅니다 — 그림은 덮어 채우므로
             찌그러지지 않고 아랫동만 잘립니다. */
          style={box({ top: 49, height: 297 })}
        >
          <Image
            src={`/images/nudake-gift/${picked.img}.webp`}
            alt=""
            fill
            sizes="30vw"
            className="object-cover"
          />
        </span>

        {/* 그림 아래 이전·다음 제품 — 실제 화면의 그 줄입니다.
            위에 검은 선을 긋고 둘로 갈라 세웁니다. */}
        <div className="nudc-turns" style={box({ top: 346, height: 48 })}>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => step(-1)}
            style={type(13, 24)}
          >
            <svg viewBox="0 0 12 12" aria-hidden>
              <path
                d="M7.6 1.6 L3.2 6 L7.6 10.4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            이전 제품
          </button>

          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => step(1)}
            style={type(13, 24)}
          >
            다음 제품
            <svg viewBox="0 0 12 12" aria-hidden>
              <path
                d="M4.4 1.6 L8.8 6 L4.4 10.4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div
          className="nudc-detail-text"
          /* 그림과 제품명 사이를 한 숨 띄웁니다. */
          /* 아래는 바닥 단추가 덮는 만큼 비워, 마지막 줄이 가리지 않습니다. */
          style={{
            ...box({ top: 394 }),
            padding: `${mk(30)} ${mk(20)} ${mk(130)}`,
          }}
        >
          <h4 style={type(15, 24)}>{picked.name}</h4>
          <b style={type(15, 24)}>{picked.price}</b>
          <em style={type(11, 18)}>누데이크 티 하우스</em>
          <p style={type(11, 18)}>{picked.desc}</p>
        </div>
      </div>

      {/* 편지지 · 봉투 · 제품 줄이 한 판에 담겨 함께 굴러갑니다 —
          아래만 따로 굴리면 위 그림이 붙박이로 남습니다. */}
      <div className="nudc-scroll">
        {/* 편지 자리 한 판. 안쪽 자리는 모두 이 판을 기준으로 잽니다 —
            기기 키가 달라도 봉투가 아래 글줄로 흘러내리지 않습니다. */}
        <div className="nudc-letter" style={{ height: mk(411) }}>
          <span className="nudc-stage" aria-hidden />

          {/* 편지봉투 뒷면 — 열린 뚜껑까지 한 장입니다. 편지지 뒤에 깔립니다. */}
          <span className="nudc-env-back" style={box(BACK)}>
            <Image
              src="/images/nudake-env-back4.webp"
              alt=""
              fill
              sizes="30vw"
              className="object-fill"
            />
          </span>

          {/* 엽서 종이 — 그림이 자리를 옮겨 앉은 뒤 그 둘레로 깔립니다.
            로고 · 그림 · 이름줄 · 주소, 18장 표지 카드와 같은 짜임입니다. */}
          <div className="nudc-card" style={box(CARD)}>
            {/* 워드마크. 앞장·뒷장 어느 쪽에도 들지 않아,
              장이 넘어가는 동안에도 흐려지지 않고 제자리에 남습니다. */}
            <span className="nudc-card-logo" style={box(LOGO)}>
              <Image
                src="/images/nudake-mock-logo2.png"
                alt=""
                fill
                sizes="10vw"
                className="object-contain"
              />
            </span>

            {/* 고른 제품의 그림. 카드 안에 있어 카드와 늘 한 몸으로 움직이고,
              뒷장으로 넘어갈 때 이 자리에서 띠로 올라섭니다. */}
            <span
              className="nudc-card-shot"
              data-art={picked.img.startsWith("bag-") || undefined}
              style={box(written ? CARD_BAND : CARD_SHOT)}
            >
              <Image
                src={face(picked.img)}
                alt=""
                fill
                sizes="20vw"
                className="object-cover"
              />
            </span>

            {/* 앞장 — 뒷장으로 넘어가면 통째로 물러납니다. */}
            <span className="nudc-card-face" aria-hidden={written}>
              <p
                className="nudc-card-foot"
                style={{
                  ...box({ left: 13, top: 206, width: 150 }),
                  ...type(9, 12),
                }}
              >
                <em>{picked.name}</em>
                <em>Tea</em>
              </p>

              <span
                className="nudc-card-mark"
                style={{
                  ...box({ left: 0, width: 177 }),
                  bottom: mk(9),
                  ...type(5, 8),
                }}
              >
                nudake.com
              </span>
            </span>

            {/* 뒷장 — 넘어가고 나면 이 자리에 글이 놓입니다. */}
            <div className="nudc-card-back">
              {/* 글자리 바깥을 눌러도 고쳐 쓰기가 켜집니다. */}
              <button
                type="button"
                className="nudc-card-hit"
                aria-label="메시지 고쳐 쓰기"
                onMouseDown={(event) => event.preventDefault()}
                onClick={edit}
              />

              <textarea
                ref={pen}
                className="nudc-note"
                value={note}
                readOnly={run}
                rows={4}
                /* 글자리를 눌러도 바로 고쳐 쓸 수 있습니다. */
                onClick={edit}
                placeholder="메시지를 입력해주세요"
                /* 자판의 확인 자리를 `완료` 로 띄웁니다. */
                enterKeyHint="done"
                /* 그 확인을 누르면 쓴 그대로 반영하고 편집을 닫습니다.
                   한글을 조합하는 중의 엔터는 글자를 맺는 것이라 흘려보냅니다. */
                onKeyDown={(event) => {
                  if (event.nativeEvent.isComposing) return;
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    done();
                  }
                }}
                /* 자판이 내려가면 쓰던 그대로 닫힙니다. */
                onBlur={() => setEditing(false)}
                onChange={(event) => setNote(event.target.value)}
                style={{
                  ...box({ left: 18, top: 154, width: 140, height: 57 }),
                  ...type(11, 19),
                }}
              />
            </div>
          </div>

          {/* 고쳐 쓰는 동안 엽서만 남기고 나머지는 어둡게 물러납니다. */}
          <span className="nudc-veil" onClick={done} aria-hidden />

          <div
            className="nudc-edit-top"
            style={{ ...box({ top: 49, height: 44 }), padding: `0 ${mk(20)}` }}
          >
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={undo}
              style={type(12, 20)}
            >
              취소
            </button>
            <button
              type="button"
              data-on
              onMouseDown={(event) => event.preventDefault()}
              onClick={done}
              style={type(12, 20)}
            >
              확인
            </button>
          </div>

          {/* 닫힌 봉투 — 다 담기고 나면 이 그림으로 바뀌어 날아갑니다. */}
          <span className="nudc-env-shut" style={box(SHUT)}>
            <Image
              src="/images/nudake-env-shut.webp"
              alt=""
              fill
              sizes="30vw"
              className="object-fill"
            />
          </span>

          {/* 봉투 앞면 — 날개와 아래 접힘. 카드 앞을 덮습니다. */}
          <span className="nudc-env-front" style={box(ENV)}>
            <Image
              src="/images/nudake-env-front4.webp"
              alt=""
              fill
              sizes="30vw"
              className="object-fill"
            />
          </span>

          {/* 고른 칸. 고르고 난 뒤에만 서서, 목록 자리에서 엽서 자리로
            그대로 옮겨 갑니다. 목록에 있는 동안에는 칸이 제 그림을 지닙니다. */}
          {/* 나는 그림은 목록에서 엽서로 옮겨 가는 동안에만 섭니다.
              엽서가 선 뒤에는 카드 안의 그림이 그 자리를 잇습니다. */}
          {at === "fly" ? (
            <span
              className="nudc-pick"
              /* `data-tap` 은 As-is 목업의 손끝 표시가 이미 쓰는 이름입니다.
             그 규칙이 position: relative 를 얹어 자리를 잃게 하므로 따로 씁니다. */
              data-press={tap || undefined}
              style={box(shot)}
            >
              <i>
                <Image
                  src={`/images/nudake-gift/${picked.img}.webp`}
                  alt=""
                  fill
                  sizes="20vw"
                  /* 목록에서는 칸을 덮고, 엽서 자리는 그림과 같은 정사각이라
                 그대로 꼭 맞습니다. */
                  className="object-cover"
                />
              </i>

              {/* 목록에 있을 때만 이름이 그림 위에 얹힙니다. */}
              <b
                style={{
                  ...box({ left: 0, width: CELL.width }),
                  bottom: mk(18),
                  ...type(13, 16),
                }}
              >
                {picked.name}
              </b>
            </span>
          ) : null}

          {/* 번호 점 — 엽서 왼쪽 가장자리(그림 높이)와 메시지 단추 오른쪽 끝. */}
          {dot("01", box({ left: 78, top: 125 }))}
          {dot("02", box({ left: 215, top: 380.5 }))}

          {/* 엽서 하단의 편집 단추. 누르면 그 자리에서 고쳐 쓸 수 있습니다. */}
          <button
            type="button"
            className="nudc-edit"
            data-on={editing || undefined}
            /* 스스로 훑을 때, 뒷장을 열기 전에 여기에 손끝이 닿습니다. */
            data-tap={penHit || undefined}
            onMouseDown={(event) => event.preventDefault()}
            onClick={editing ? done : edit}
            style={
              {
                ...box({ left: 122, top: 367, width: 89, height: 27 }),
                ...type(10, 22),
                "--tap-wait": "0s",
              } as CSSProperties
            }
          >
            {/* 글을 고친다는 표시 — 활자의 T 입니다. */}
            <svg viewBox="0 0 12 12" aria-hidden>
              <path
                d="M2 2.7 H10 M6 2.7 V9.4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.3}
                strokeLinecap="round"
              />
            </svg>
            {editing ? "메시지 완료" : wrote ? "메시지 편집" : "메시지 입력"}
          </button>
        </div>

        {/* 판 아래 묶음. 설명이 길어도 여기서 굴려 끝까지 읽습니다. */}
        <div className="nudc-under">
          {/* 트랙 위의 작은 글 — 지금 고른 것이 무엇인지 한 줄로 알립니다. */}
          <p
            className="nudc-track-pick"
            style={{ padding: `${mk(10)} ${mk(20)} 0`, ...type(10, 14) }}
          >
            선택 - {picked.name} (
            {picked.desc.split("\n")[0].replace(/[()]/g, " ").trim()})
          </p>

          {/* 봉투 아래 제품 줄 — 여기서 다른 제품으로 바꿔 담을 수 있습니다.
            고른 것은 검은 테로 표시하고, 옆으로 굴려 나머지를 봅니다. */}
          <div
            className="nudc-track"
            style={{
              height: mk(62),
              margin: `${mk(12)} 0 0`,
              padding: `0 0 0 ${mk(20)}`,
              gap: mk(6),
            }}
          >
            {GIFTS.map((item, i) => (
              <button
                key={item.name}
                type="button"
                className="nudc-track-item"
                data-on={i === chosen || undefined}
                /* 스스로 바꿔 담을 때, 이 칸에 손끝이 닿습니다. */
                data-tap={press === i || undefined}
                aria-label={item.name}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setChosen(i)}
                style={
                  {
                    ...box({ width: 62, height: 62 }),
                    "--tap-wait": "0s",
                  } as CSSProperties
                }
              >
                <Image
                  src={`/images/nudake-gift/${item.img}.webp`}
                  alt=""
                  fill
                  sizes="10vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* 트랙 아래에 고른 제품의 이름과 값 — 상세 화면에 적힌 그대로입니다. */}
          <p
            className="nudc-track-name"
            style={{ padding: `${mk(12)} ${mk(20)} 0`, ...type(12, 20) }}
          >
            <b>{picked.name}</b>
            <em>{picked.price}</em>
          </p>

          {/* 그 아래에는 설명. 앞머리의 구성 줄은 빼고
            맛과 향을 적은 대목만 세 줄까지 보입니다. */}
          <p
            className="nudc-track-desc"
            style={{ padding: `${mk(8)} ${mk(20)} 0`, ...type(10, 15) }}
          >
            {picked.desc.split("\n\n").slice(1).join(" ").replace(/\n/g, " ")}
          </p>
        </div>
      </div>

      {/* 결제 시트 — `선물 보내기` 를 누르면 아래에서 올라옵니다.
          받는 사람 · 결제 수단 · 결제 정보 · 결제하기 차례입니다. */}
      <div
        className="nudc-sheet-veil"
        onClick={() => setAt("note")}
        aria-hidden
      />

      <section className="nudc-sheet" style={{ padding: `0 ${mk(20)}` }}>
        <i className="nudc-sheet-grip" aria-hidden />

        <h5 style={type(14, 22)}>받는 사람</h5>

        <label>
          <input
            value={to}
            onChange={(event) => setTo(event.target.value)}
            placeholder="이름"
            style={{ ...box({ height: 38 }), ...type(12, 38) }}
          />
        </label>

        <label>
          <input
            value={tel}
            inputMode="numeric"
            onChange={(event) => setTel(event.target.value)}
            placeholder="010-0000-0000"
            style={{ ...box({ height: 38 }), ...type(12, 38) }}
          />
        </label>

        <h5 style={type(14, 22)}>결제 수단</h5>

        <button
          type="button"
          className="nudc-pay-way"
          data-on={pay || undefined}
          onClick={() => setPay((now) => !now)}
          style={{ ...box({ height: 46 }), ...type(12, 20) }}
        >
          <i className="nudc-pay-card" aria-hidden />
          신용/체크카드
          <b aria-hidden />
        </button>

        <h5 style={type(14, 22)}>결제 정보</h5>

        <dl className="nudc-pay-sum" style={type(12, 20)}>
          <div>
            <dt>총 주문 금액</dt>
            <dd>{picked.price}</dd>
          </div>
          <div data-sub>
            <dt>ㄴ 상품 금액</dt>
            <dd>{picked.price}</dd>
          </div>
          <div data-total style={type(13, 22)}>
            <dt>최종 결제금액</dt>
            <dd>{picked.price}</dd>
          </div>
        </dl>

        <button
          type="button"
          className="nudc-pay-do"
          /* 스스로 훑을 때, 마지막으로 여기에 손끝이 닿습니다. */
          data-tap={payHit || undefined}
          onClick={payNow}
          style={
            {
              ...box({ height: 52 }),
              ...type(13, 52),
              "--tap-wait": "0s",
            } as CSSProperties
          }
        >
          {picked.price} 결제하기
        </button>
      </section>

      {/* 받는 사람 화면 — 닫힌 봉투가 열리고 엽서가 나옵니다.
          아래에는 매장에서 내미는 바코드가 붙습니다. */}
      <div className="nudc-gift" data-open={opened || undefined}>
        <p
          className="nudc-gift-top"
          style={{ ...box({ top: 74 }), ...type(11, 18) }}
        >
          {to ? `${to}님에게 도착한 선물` : "도착한 선물"}
        </p>

        {/* 열린 봉투 두 겹 */}
        <span className="nudc-gift-back" style={box(GIFT_BACK)}>
          <Image
            src="/images/nudake-env-back4.webp"
            alt=""
            fill
            sizes="30vw"
            className="object-fill"
          />
        </span>

        {/* 나온 엽서 */}
        <div className="nudc-gift-card" style={box(GIFT_CARD)}>
          <span className="nudc-card-logo" style={box(LOGO)}>
            <Image
              src="/images/nudake-mock-logo2.png"
              alt=""
              fill
              sizes="10vw"
              className="object-contain"
            />
          </span>

          <span
            className="nudc-card-shot"
            data-art={picked.img.startsWith("bag-") || undefined}
            style={box(CARD_BAND)}
          >
            <Image
              src={face(picked.img)}
              alt=""
              fill
              sizes="20vw"
              className="object-cover"
            />
          </span>

          <p
            className="nudc-gift-note"
            style={{
              ...box({ left: 18, top: 154, width: 140 }),
              ...type(11, 19),
            }}
          >
            {note}
          </p>
        </div>

        <span className="nudc-gift-front" style={box(GIFT_ENV)}>
          <Image
            src="/images/nudake-env-front4.webp"
            alt=""
            fill
            sizes="30vw"
            className="object-fill"
          />
        </span>

        {/* 닫힌 봉투 — 열리기 전의 모습입니다. */}
        <span className="nudc-gift-shut" style={box(GIFT_SHUT)}>
          <Image
            src="/images/nudake-env-shut.webp"
            alt=""
            fill
            sizes="30vw"
            className="object-fill"
          />
        </span>

        {/* 매장에서 내미는 바코드 */}
        <div className="nudc-gift-code" style={box({ top: 500 })}>
          <i style={box({ width: 200, height: 56 })} aria-hidden />
          <b style={type(11, 18)}>9 3120 4471 0088</b>
          <em style={type(10, 16)}>{picked.name}</em>
        </div>

        <button
          type="button"
          className="nudc-gift-close"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setAt("done")}
          style={{ ...box({ width: 176, height: 44 }), ...type(12, 44) }}
        >
          닫기
        </button>
      </div>

      {/* 완료 — 봉투가 날아간 자리에 남는 화면입니다. */}
      <div className="nudc-done">
        {/* 체크 대신 닫힌 봉투가 섭니다 — 방금 보낸 그 봉투입니다. */}
        <span
          className="nudc-done-shut"
          style={box({ width: 168, height: (168 * 514) / 760 })}
        >
          <Image
            src="/images/nudake-env-shut.webp"
            alt=""
            fill
            sizes="30vw"
            className="object-fill"
          />
        </span>
        {/* 받는 사람을 적었으면 그 이름으로 알립니다. */}
        <b style={type(15, 24)}>
          {to ? `‘${to}’님에게 선물을 보냈습니다` : "선물을 보냈습니다"}
        </b>
        <em style={type(11, 18)}>{picked.name}</em>
        {/* 보낸 선물을 다시 보는 자리와 목록으로 돌아가는 자리.
            둘은 같은 폭·같은 키로 나란히 섭니다. */}
        <span className="nudc-done-acts">
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setAt("list")}
            style={{ ...box({ width: 176, height: 44 }), ...type(12, 44) }}
          >
            티 기프트로 돌아가기
          </button>
        </span>
      </div>

      {/* 번호 점 — 바닥의 `선물 보내기`. */}
      {dot(
        "03",
        /* 점은 제 키의 반만큼 올라앉으니, 단추 세로 가운데(26)에 맞춰 9 를 뺍니다. */
        { ...box({ left: 305 }), bottom: mk(17), top: "auto" },
        "nudc-dot-top nudc-dot-light",
      )}

      {/* 바닥 — 고르고 난 뒤에야 다음 걸음이 열립니다.
          고르기 전에는 단추 자리도 두지 않습니다. */}
      <div
        /* 결제를 마친 뒤에는 둘 자리가 없습니다 — 봉투가 날아가고
           완료 화면이 그 몫을 합니다. */
        hidden={at === "list" || at === "sent" || at === "done"}
        className="nudc-bar"
        style={{ padding: 0, height: mk(BAR) }}
      >
        <button
          type="button"
          className="nudc-btn"
          data-on
          /* 스스로 훑을 때, 마지막에 이 단추에 손끝이 닿습니다. */
          data-tap={hit || undefined}
          /* 상세에서 누르면 고른 제품이 엽서가 되고 뒷장이 열립니다. */
          onClick={gift}
          style={
            {
              ...box({ height: 52 }),
              ...type(13, 52),
              "--tap-wait": "0s",
            } as CSSProperties
          }
        >
          {at === "note" || at === "pay" ? "선물 보내기" : "선물하기"}
        </button>
      </div>
    </div>
  );
}
