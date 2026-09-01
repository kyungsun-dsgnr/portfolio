"use client";

/**
 * 개선 화면 B — 맨 처음 만들었던 판입니다.
 * A 판과 값을 나눠 쓰지 않도록 클래스 이름을 따로 둡니다(cmpb-).
 * 네 화면에 나뉘어 있던 고르기를 한 화면에서 끝냅니다.
 * 값은 12장 목업에서 뽑은 규칙을 그대로 씁니다(여백 15, 잉크 #1d1d1d,
 * 라운드 3·5·알약, 화면 안 버튼 45).
 */

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { useInView } from "@/components/useInView";

/** 고를 수 있는 세트. 첫 번째를 고른 참입니다. */
/* 세트 */
/* 세트마다 상자에 담기는 것이 다릅니다.
   그림은 그 세트의 썸네일을 반으로 잘라 씁니다 — 왼쪽 반, 오른쪽 반. */

/** 제품 종류. holder 는 향을 고르기 전 기본 모습이고,
    scents 는 그 제품에 실제로 있는 향입니다(에셋 폴더 기준). */
const KINDS = {
  room: {
    name: "룸 스프레이",
    holder: "/images/tam/holder-room.png",
    scents: [
      { name: "PINE NEST", file: "room-pinenest", ko: "파인네스트" },
      { name: "PAPYRUS", file: "room-papyrus", ko: "파피루스" },
      { name: "MUMBIRD", file: "room-mumbird", ko: "멈버드" },
      { name: "MUK", file: "room-muk", ko: "먹" },
    ],
  },
  wash: {
    name: "퍼퓸드 핸드워시",
    holder: "/images/tam/holder-wash.png",
    scents: [
      { name: "CHAMO", file: "wash-chamo", ko: "카모" },
      { name: "EVENING GLOW", file: "wash-evening", ko: "이브닝글로우" },
      { name: "SUMMER TALES", file: "wash-summertales", ko: "썸머테일스" },
      { name: "000", file: "wash-000", ko: "000" },
    ],
  },
  egg: {
    name: "에그 퍼퓸",
    holder: "/images/tam/holder-egg.png",
    scents: [
      { name: "CHAMO", file: "egg-chamo", ko: "카모" },
      { name: "EVENING GLOW", file: "egg-evening", ko: "이브닝글로우" },
      { name: "LATE AUTUMN", file: "egg-lateautumn", ko: "레이트어텀" },
      { name: "BLUE HINOKI", file: "egg-bluehinoki", ko: "블루히노키" },
    ],
  },
  lip: {
    name: "에그 립밤",
    holder: "/images/tam/holder-lip.png",
    scents: [
      { name: "ROSE WOODY", file: "lip-rosewoody", ko: "로즈우디" },
      {
        name: "ROSE WOODY GLOW",
        file: "lip-rosewoody-glow",
        ko: "로즈우디 글로우",
      },
      { name: "MILK TEA", file: "lip-milktea", ko: "밀크티" },
      { name: "WOODY GREEN", file: "lip-woodygreen", ko: "우디그린" },
      { name: "UNSCENTED", file: "lip-unscented", ko: "언센티드" },
    ],
  },
  hand: {
    name: "쉘 퍼퓸 핸드",
    holder: "/images/tam/holder-hand.png",
    scents: [
      { name: "CHAMO", file: "hand-chamo", ko: "카모" },
      { name: "EVENING GLOW", file: "hand-evening", ko: "이브닝글로우" },
      { name: "PUMPKINI", file: "hand-pumpkini", ko: "펌키니" },
    ],
  },
  balm: {
    name: "퍼퓸 밤",
    holder: "/images/tam/holder-balm.png",
    scents: [
      { name: "CHAMO", file: "balm-chamo", ko: "카모" },
      { name: "BERGA SANDAL", file: "balm-bergasandal", ko: "버가샌달" },
      { name: "BOTARI", file: "balm-botari", ko: "보타리" },
      { name: "EVENING GLOW", file: "balm-evening", ko: "이브닝글로우" },
    ],
  },
  candle: {
    name: "퍼퓸 캔들",
    holder: "/images/tam/holder-candle.png",
    scents: [
      { name: "LATE AUTUMN", file: "candle-lateautumn", ko: "레이트어텀" },
      { name: "PUMPKINI", file: "candle-pumpkini", ko: "펌키니" },
      {
        name: "BATHER IN THE LAKE",
        file: "candle-bather",
        ko: "베이더인더레이크",
      },
      { name: "HOLY METAL", file: "candle-holymetal", ko: "홀리메탈" },
    ],
  },
} as const;

type KindKey = keyof typeof KINDS;

const shotOf = (kind: KindKey, at: number | null) =>
  at === null
    ? KINDS[kind].holder
    : `/images/tam/${KINDS[kind].scents[at].file}.png`;

/** 제품 낱개 값. 스토어에 적힌 그대로입니다. */
const PRICES: Record<KindKey, number> = {
  room: 53500,
  wash: 34000,
  egg: 48000,
  lip: 28900,
  hand: 18500,
  balm: 46500,
  candle: 39000,
};

const SETS: {
  head: string;
  kinds: [KindKey, KindKey];
  price: number;
  /* 고른 뒤에는 세트 사진 한 장으로 바뀝니다. */
  shot: string;
}[] = [
  {
    head: "룸 스프레이 & 핸드워시",
    kinds: ["room", "wash"],
    price: 93500,
    shot: "/images/tam/set-room-wash.png",
  },
  {
    head: "에그 퍼퓸 & 립밤",
    kinds: ["egg", "lip"],
    price: 81900,
    shot: "/images/tam/set-egg-lip.png",
  },
  {
    head: "쉘 퍼퓸 핸드 & 립밤",
    kinds: ["hand", "lip"],
    price: 52400,
    shot: "/images/tam/set-hand-lip.png",
  },
  {
    head: "에그 퍼퓸 & 퍼퓸 밤",
    kinds: ["egg", "balm"],
    price: 100000,
    shot: "/images/tam/set-egg-balm.png",
  },
  {
    head: "캔들 & 룸 스프레이",
    kinds: ["candle", "room"],
    price: 98500,
    shot: "/images/tam/set-candle-room.png",
  },
  {
    head: "캔들 & 핸드워시",
    kinds: ["candle", "wash"],
    price: 79000,
    shot: "/images/tam/set-candle-wash.png",
  },
];

const won = (n: number) => n.toLocaleString("ko-KR");

/* 손이 닿지 않는 자리에서 스스로 담을 때는, 12장 표지에 쓴 그 제품을 그대로 씁니다.
   자리·비율은 표지의 도면 좌표(663 × 643)를 이 상자(683 × 740)에 옮겨 적은 값입니다.
   가로는 바닥 폭(4.69% ~ 95.31%)에, 세로는 안쪽 바닥선과 앞면 윗선에 맞췄습니다. */
const COVER_GOODS = [
  {
    id: "perfume",
    src: "/images/tamburins-perfume.png",
    left: "26.5%",
    top: "44%",
    width: "26.4%",
    height: "24.6%",
    tilt: "-11deg",
    delay: "0s",
  },
  {
    id: "wash",
    src: "/images/tamburins-handwash.png",
    left: "55.4%",
    top: "20%",
    width: "18%",
    height: "48.5%",
    tilt: "5.5deg",
    delay: "0.34s",
  },
];

/* 고른 표가 켜지는 것을 눈으로 확인할 만큼만 머뭅니다. */
const PICK_HOLD = 620;

/** 향은 두 제품이 같은 목록에서 고릅니다. */
/* 향노트는 스토어에 적힌 그대로, 설명도 그 자리에서 펼쳐 봅니다. */
/** 향노트와 설명은 탬버린즈 스토어에 적힌 그대로입니다.
    열쇠는 에셋 이름(제품-향) — 같은 향이라도 제품이 다르면 노트가 다릅니다. */
const NOTES: Record<
  string,
  {
    notes: string;
    story?: string;
    top?: string;
    middle?: string;
    base?: string;
  }
> = {
  "lip-rosewoody": {
    notes: "자몽 | 우아한 장미 | 머스크",
    story:
      "섬세한 장미향은 시대를 초월하면서도 현대적인 우아함을 간직하고 있습니다. 여기에 자몽의 시트러스함과 유향의 스파이시함이 더해져 매력적이고 모던한 느낌을 경험하게 합니다. 우디한 잔향은 머스크 노트로 따뜻하고 부드럽게 전체 향을 감싸줍니다.",
    top: "자몽",
    middle: "올리바넘, 로즈 아타르",
    base: "머스크",
  },
  "lip-rosewoody-glow": {
    notes: "자몽 | 우아한 장미 | 머스크",
    story:
      "섬세한 장미향은 시대를 초월하면서도 현대적인 우아함을 간직하고 있습니다. 여기에 자몽의 시트러스함과 유향의 스파이시함이 더해져 매력적이고 모던한 느낌을 경험하게 합니다. 우디한 잔향은 머스크 노트로 따뜻하고 부드럽게 전체 향을 감싸줍니다.",
    top: "자몽",
    middle: "올리바넘, 로즈 아타르",
    base: "머스크",
  },
  "lip-milktea": {
    notes: "베르가못 | 은은한 블랙티 | 코코넛",
    story:
      "은은한 꽃내음을 가진 블랙티를 메인으로 사용한 이 향은 따끈한 우유를 한 방울 떨어뜨려 휘저은 블랙티 한 잔을 마실 때 코끝 가득 들어오는 부드러운 향을 상상하게 하고, 그 따뜻한 온기는 온전한 휴식을 취할 때에 느껴지는 편안함을 선사합니다. 상큼하고 신선한 버가못과 레몬이 블랙티의 씁쓸한 느낌과 어우러져 데일리하게 사용할 수 있도록 레이어를 더했습니다. 잔향은 코코넛노트를 더해 부드럽고 달콤하게 마무리됩니다.",
    top: "베르가못, 레몬",
    middle: "블랙티",
    base: "코코넛",
  },
  "lip-woodygreen": {
    notes: "신선한 만다린 과즙 | 아로마틱 허브 | 부쿠",
    story:
      "동이 틀 무렵, 새벽이슬 맺힌 깊은 숲 속을 걸을 때 느껴지는 프레쉬한 풀 내음을 만다린의 상큼한 과즙과 부쿠잎사귀, 바질을 사용하여 짙은 초록의 느낌으로 전합니다. 라벤더, 타임이 보여주는 허벌 노트는 입술에 닿을 때 시원하고 아로마틱한 느낌을 더해 릴렉싱한 감정을 느끼게 하고, 잔향엔 바닐라가 스위트한 우디함을 더해 진득하게 마무리됩니다.",
    top: "만다린, 부쿠, 바질",
    middle: "라벤더, 타임 화이트",
    base: "바닐라",
  },
  "lip-unscented": {
    notes: "언센티드(무향)",
    story:
      "코 끝에 은은한 향기를 전하는 립밤. 풍부한 식물성 오일로 즉각적인 영양을 공급하여 건조한 입술을 촉촉하고 부드럽게 보호해줍니다. 안전한 식향으로 만들어진 향은 달걀의 부드러운 곡선과 질감을 닮은 핸디한 케이스에 담겨 언제 어디서든 기분좋은 느낌을 전합니다.",
  },
  "egg-lateautumn": {
    notes: "비터오렌지 | 사탕수수 풀내음 | 머스크",
    story:
      "바람에 뒤엉켜 느린 군무를 펼치는 사탕수수밭의 아스라한 풀내음이 늦가을의 고요한 정취를 고조시킵니다. 드넓은 대지를 연상시키는 갈바넘과 부쿠는 달콤씁쓸한 비터오렌지와 만나 가을 햇볕같은 따사로움을 선사하고, 끝없이 펼쳐진 빛바랜 녹음의 풍경 끝에 찾아오는 부드러운 머스크향이 우리의 머릿속에 선명한 잔상으로 남겨집니다.",
    top: "갈바넘, 부쿠",
    middle: "사탕수수, 약쑥",
    base: "시더우드, 머스크",
  },
  "egg-chamo": {
    notes: "진득한 카모마일 | 부드러운 나무결 | 머스크",
    story:
      "꿀처럼 진득하고 달콤한 카모마일과 씁쓸한 클라리세이지의 허브 향이 오묘한 조화를 이루어 중독성 있는 향을 선사합니다. 자칫 차갑게 느껴질 수 있는 촉촉한 이끼의 느낌을 우아하고 부드러운 나무결의 블론드 우드와 따뜻한 머스크로 감싸주어 당신의 지친 마음에 특별하고 작은 위안을 선물합니다.",
    top: "클라리세이지, 카모마일",
    middle: "워터, 사이프리올",
    base: "앰버, 머스크, 블론드우드",
  },
  "egg-bluehinoki": {
    notes: "상쾌한 파인오일 | 푸른 히노키 | 드리프트우드",
    story:
      "푸른 물결을 따라 바다로 흘러든 히노키 나무가 상쾌한 파인오일과 베르가못의 서늘한 기류에 실려, 파도를 가르는 바람처럼 경쾌하게 퍼져 나갑니다. 소금기를 머금은 단단한 나뭇결은 오랜 시간 담금질에 파도의 형상으로 부드럽게 조형되고, 내리쬐는 햇볕 아래 풍화되며 뒤틀린 끝에 은은한 울림을 주는 올리바넘과 만나 시원한 바다의 색을 지닌 나무로 다시 태어납니다.",
    top: "파인오일, 베르가못, 히비스커스",
    middle: "워터노트, 히노키",
    base: "시더우드, 드리프트우드, 올리바넘 레지노이드",
  },
  "egg-evening": {
    notes: "노을에 물든 장미 | 라즈베리 | 머스크",
    story:
      "모든 순간에 장미는 장미로써 완벽하게 존재합니다. 씨앗에서 움트어 화려하게 피어지는 매 순간, 끊임없이 변화하는 것처럼 보이지만 본질적으로 장미는 장미의 고아한 아름다움을 내포하고 있습니다. 해질녘 노을이 장미를 라즈베리처럼 발갛게 물들이고, 신선한 딜과 상큼한 레몬껍질로 밝은 빛을 겹쳐내면 살결을 보호하는 견고하고 우아한 가시처럼 얼씨한 패츌리와 사이프리올이 무게감을 더해 또 하나의 완전한 장미를 보여줍니다.",
    top: "레몬, 딜",
    middle: "로즈, 라즈베리",
    base: "머스크, 사이프리올, 패츌리",
  },
  "hand-evening": {
    notes: "노을에 물든 장미 | 라즈베리 | 머스크",
    story:
      "모든 순간에 장미는 장미로써 완벽하게 존재합니다. 씨앗에서 움트어 화려하게 피어지는 매 순간, 끊임없이 변화하는 것처럼 보이지만 본질적으로 장미는 장미의 고아한 아름다움을 내포하고 있습니다. 해질녘 노을이 장미를 라즈베리처럼 발갛게 물들이고, 신선한 딜과 상큼한 레몬껍질로 밝은 빛을 겹쳐내면 살결을 보호하는 견고하고 우아한 가시처럼 얼씨한 패츌리와 사이프리올이 무게감을 더해 또 하나의 완전한 장미를 보여줍니다.",
    top: "레몬, 딜",
    middle: "로즈, 라즈베리",
    base: "머스크, 사이프리올, 패츌리",
  },
  "hand-chamo": {
    notes: "진득한 카모마일 | 부드러운 나무결 | 머스크",
    story:
      "꿀처럼 진득하고 달콤한 카모마일과 씁쓸한 클라리세이지의 허브 향이 오묘한 조화를 이루어 중독성 있는 향을 선사합니다. 자칫 차갑게 느껴질 수 있는 촉촉한 이끼의 느낌을 우아하고 부드러운 나무결의 블론드 우드와 따뜻한 머스크로 감싸주어 당신의 지친 마음에 특별하고 작은 위안을 선물합니다.",
    top: "클라리세이지, 카모마일",
    middle: "워터, 사이프리올",
    base: "앰버, 머스크, 블론드우드",
  },
  "hand-pumpkini": {
    notes: "달콤한 호박 | 차조기잎 | 코코넛밀크",
    story:
      "하얀 호박에서 느껴지는 청초하고 달콤한 향에 차조기잎과 블러드오렌지의 독특한 푸르름이 더해져 기분 좋은 놀라움을 선사합니다. 잘 여물어 진득해진 호박향과 진저의 스파이시함이 교차되어 독특한 조화를 이루고 뒤이어 밀려오는 크리미한 코코넛밀크는 부드러운 샌달우드와 함께 오묘한 잔상을 만들며 깊은 여운을 그려냅니다.",
    top: "베르가못, 페릴라 리프, 블러드 오렌지",
    middle: "펌킨, 진저",
    base: "코코넛 밀크",
  },
  "room-pinenest": {
    notes: "유칼립투스 | 파인니들 | 히노키우드",
    story:
      "비가 내린 후 처마 끝마다 물방울이 맺힌 한옥의 모습을 닮은 향은 청량한 솔잎으로 둘러싸인 유칼립투스의 신선함으로 시작됩니다. 항상 푸른빛을 유지하는 소나무 향기는 신비로운 안젤리카와 만나 은은하게 느껴지는 라벤더의 싱그러운 꽃향기와 함께 전체적인 색감을 더욱 풍부하게 합니다. 잔향은 차분하고 온화한 히노키로 어우러지며 깨끗하고 편안한 공간으로 만들어줍니다.",
    top: "안젤리카, 유칼립투스, 솔잎",
    middle: "소나무, 라벤더",
    base: "히노키 우드",
  },
  "room-muk": {
    notes: "그을린 소나무 | 먹물 | 패출리",
    story:
      "불에 탄 소나무의 진한 그을음으로 만들어진 먹향은 신선한 전나무잎으로 선명하게 머리를 깨우며 시작합니다. 벼루에 검은 먹을 천천히 갈아 낼 때 풍겨오는 먹물과도 같은 이 향은 블랙커런트의 은은한 달콤함과 만나 향긋하게 마음을 이끌어내어 우디한 패출리의 흙내음 그득한 잔향으로 오래도록 지속시켜줍니다.",
    top: "전나무 잎",
    middle: "블랙커런트",
    base: "패출리",
  },
  "room-mumbird": {
    notes: "유자 | 국화 | 머스크",
    story:
      "늦가을 추위를 묵묵히 견디며 꽃을 피워낸 국화에 영감을 받은 이 향은 달콤한 유자와 신비로운 매스틱나무의 날카로움으로 시작합니다. 촉촉한 새벽이슬을 머금은 꽃봉오리에서 풍겨오는 청초한 향과 싱그러운 그린노트가 만나 공간을 신선한 꽃으로 가득 채워냅니다. 뒤이어 따듯한 머스크가 부드러운 흙내음의 베티버와 만나 포근하고 편안한 잔향이 오랜 시간 지속됩니다.",
    top: "유자, 매스틱 오일",
    middle: "국화, 로즈마리, 카시스",
    base: "머스크, 베티버",
  },
  "room-papyrus": {
    notes: "파피루스 | 그린티 | 샌달우드",
    story:
      "부드러운 색감의 하얀 종이가 떠오르는 이 향은 과육의 상큼함을 머금은 비터오렌지로 기분좋게 시작됩니다. 싱그럽게 피어나는 파피루스 꽃과 같은 월계수의 아로마틱한 향은 로즈우드와 만나 깨끗하고 차분한 느낌을 전하고, 씁쓸하고 드라이한 그린 노트가 스모키한 파피루스와 만나 정제되지 않은 종이의 질감을 느껴지게 합니다. 샌달우드는 전체적인 향조를 따듯하게 감싸며 온화한 부드러움을 전합니다.",
    top: "비터 오렌지, 라우렐 노블",
    middle: "그린티, 로즈우드",
    base: "파피루스, 샌달우드",
  },
  "wash-chamo": {
    notes: "진득한 카모마일 | 부드러운 나무결 | 머스크",
    story:
      "꿀처럼 진득하고 달콤한 카모마일과 씁쓸한 클라리세이지의 허브 향이 오묘한 조화를 이루어 중독성 있는 향을 선사합니다. 자칫 차갑게 느껴질 수 있는 촉촉한 이끼의 느낌을 우아하고 부드러운 나무결의 블론드 우드와 따뜻한 머스크로 감싸주어 당신의 지친 마음에 특별하고 작은 위안을 선물합니다.",
    top: "클라리세이지, 카모마일",
    middle: "워터, 사이프리올",
    base: "앰버, 머스크, 블론드우드",
  },
  "wash-000": {
    notes: "샌달우드 | 패츌리 | 흙 내음",
    story:
      "바르는 순간 코 끝을 스치는 베르가못의 시원함, 수분을 머금은 흙을 연상시키는 패츌리와 무겁게 내려앉은 샌달우드는 갓 꺾은 야생화를 품에 가득 안았을 때 느껴지는 대지의 활기를 떠올리게 합니다.",
    top: "시트러스 우디",
    middle: "베르가못, 패츌리",
    base: "샌달우드",
  },
  "wash-evening": {
    notes: "노을에 물든 장미 | 라즈베리 | 머스크",
    story:
      "모든 순간에 장미는 장미로써 완벽하게 존재합니다. 씨앗에서 움트어 화려하게 피어지는 매 순간, 끊임없이 변화하는 것처럼 보이지만 본질적으로 장미는 장미의 고아한 아름다움을 내포하고 있습니다. 해질녘 노을이 장미를 라즈베리처럼 발갛게 물들이고, 신선한 딜과 상큼한 레몬껍질로 밝은 빛을 겹쳐내면 살결을 보호하는 견고하고 우아한 가시처럼 얼씨한 패츌리와 사이프리올이 무게감을 더해 또 하나의 완전한 장미를 보여줍니다.",
    top: "레몬, 딜",
    middle: "로즈, 라즈베리",
    base: "머스크, 사이프리올, 패츌리",
  },
  "wash-summertales": {
    notes: "연두색 하늬바람 | 은방울꽃 | 시더우드",
    story:
      "싱그러운 연두색 잎사귀들 사이로 은방울꽃이 흩날리는 여름의 끝자락, 시원하게 불어오는 바람은 채 식지 않은 여름의 찬란한 열기를 함께 실어 나릅니다. 바람의 궤적을 따라 피어오른 제라늄의 은은한 달콤함은 아니스의 미세한 스파이시함과 만나 반짝이는 생명력을 전하고, 계절이 지나가는 자리에 남은 시더우드와 패츌리의 우디함은 살결에 스치듯 내려앉아 차분하고 정돈된 가죽의 질감과 함께 부드러운 향의 자욱을 남깁니다.",
    top: "여린 초록잎, 아니스",
    middle: "맑은 연둣빛을 머금은 흰 꽃",
    base: "시더우드, 패츌리, 머스크",
  },
  "balm-botari": {
    notes: "시원한 아키갈라우드 | 부드러운 이끼와 버섯 | 앰버 머스크",
    story:
      "보타리는 버섯 포자가 터질 때 느껴지는 폭발적인 생명력을 닮아, 깊고 감각적인 향의 파동으로 주변을 장악합니다. 단단한 매듭 속에 감춰진 것들이 하나씩 모습을 드러내며 호기심을 자아내고, 시원한 아키갈라우드를 가득 머금은 공기가 스치면 젖은 대지 위 부드러운 이끼와 나뭇결의 내음이 뒤따르며 예상치 못한 향의 변주가 시작됩니다. 그리고 마침내 보따리가 완전히 펼쳐지면, 생소한 물건들이 쏟아져 나오듯이 신비로운 앰버그리스와 묵직한 머스크가 만나 폭발하듯 퍼뜨려지며 어두운 하늘에 반짝이는 수천 개의 별처럼 아름다운 형상을 수놓아 공기를 황홀하게 물들입니다.",
    top: "아키갈라우드",
    middle: "암브록산, 암브레트",
    base: "앰버그리스, 머스크, 모스",
  },
  "balm-evening": {
    notes: "노을에 물든 장미 | 라즈베리 | 머스크",
    story:
      "모든 순간에 장미는 장미로써 완벽하게 존재합니다. 씨앗에서 움트어 화려하게 피어지는 매 순간, 끊임없이 변화하는 것처럼 보이지만 본질적으로 장미는 장미의 고아한 아름다움을 내포하고 있습니다. 해질녘 노을이 장미를 라즈베리처럼 발갛게 물들이고, 신선한 딜과 상큼한 레몬껍질로 밝은 빛을 겹쳐내면 살결을 보호하는 견고하고 우아한 가시처럼 얼씨한 패츌리와 사이프리올이 무게감을 더해 또 하나의 완전한 장미를 보여줍니다.",
    top: "레몬, 딜",
    middle: "로즈, 라즈베리",
    base: "머스크, 사이프리올, 패츌리",
  },
  "balm-chamo": {
    notes: "진득한 카모마일 | 부드러운 나무결 | 머스크",
    story:
      "꿀처럼 진득하고 달콤한 카모마일과 씁쓸한 클라리세이지의 허브 향이 오묘한 조화를 이루어 중독성 있는 향을 선사합니다. 자칫 차갑게 느껴질 수 있는 촉촉한 이끼의 느낌을 우아하고 부드러운 나무결의 블론드 우드와 따뜻한 머스크로 감싸주어 당신의 지친 마음에 특별하고 작은 위안을 선물합니다.",
    top: "클라리세이지, 카모마일",
    middle: "워터, 사이프리올",
    base: "앰버, 머스크, 블론드우드",
  },
  "balm-bergasandal": {
    notes: "지중해의 베르가못 | 쌉싸래한 청귤 | 샌달우드",
    story:
      "지중해의 푸릇한 기운을 받고 자란 베르가못의 청량한 향에 라임 카다멈의 신선하고 쌉싸래한 향이 더해져 따사로운 햇볕 아래 서서히 익어가는 청귤을 떠오르게 합니다. 뒤이어 샌달우드가 그려내는 부드러운 곡선의 잔 향은 주위에 은은하게 머물며 햇살 가득한 여름날의 따뜻한 기억을 그려냅니다.",
    top: "베르가못, 라임, 카다멈",
    middle: "사이프리올, 시더 아틀라스, 큐컴버",
    base: "아미리스, 샌달우드, 레더",
  },
  "candle-pumpkini": {
    notes: "달콤한 호박 | 차조기잎 | 코코넛밀크",
    story:
      "하얀 호박에서 느껴지는 청초하고 달콤한 향에 차조기잎과 블러드오렌지의 독특한 푸르름이 더해져 기분 좋은 놀라움을 선사합니다. 잘 여물어 진득해진 호박향과 진저의 스파이시함이 교차되어 독특한 조화를 이루고 뒤이어 밀려오는 크리미한 코코넛밀크는 부드러운 샌달우드와 함께 오묘한 잔상을 만들며 깊은 여운을 그려냅니다.",
  },
  "candle-lateautumn": {
    notes: "비터오렌지 | 사탕수수 풀내음 | 머스크",
    story:
      "바람에 뒤엉켜 느린 군무를 펼치는 사탕수수밭의 아스라한 풀내음이 늦가을의 고요한 정취를 고조시킵니다. 드넓은 대지를 연상시키는 갈바넘과 부쿠는 달콤씁쓸한 비터오렌지와 만나 가을 햇볕같은 따사로움을 선사하고, 끝없이 펼쳐진 빛바랜 녹음의 풍경 끝에 찾아오는 부드러운 머스크향이 우리의 머릿속에 선명한 잔상으로 남겨집니다.",
  },
  "candle-bather": {
    notes: "쑥 | 안개 낀 호수 | 촉촉한 이끼",
    story:
      "초록의 잔상이 짙게 피어오르는 새벽, 싱그러움이 담긴 클라리세이지와 라벤더가 만나 향긋한 허브의 내음을 전합니다. 쌉싸름한 쑥과 포근한 인센스는 안개 낀 숲 속의 고요함 속에 촉촉하고 부드러운 이끼의 잔향을 남기며 아무도 없는 맑고 잔잔한 호수 위를 유영하듯 마음속까지 정갈해지는 경험을 선사합니다.",
  },
  "candle-holymetal": {
    notes: "측백나무잎 | 차가운 금속 | 화이트 머스크",
    story:
      "우연히 발 딛은 신성한 유적지의 성전에서 느껴지는 깨끗하고 차분한 공기를 떠올리게 합니다. 푸른 측백나무 잎가지와 세이지의 조합에 깊이를 더해주는 인센스와 절제된 차가움을 지닌 금속성의 느낌이 어우러져 마치 정지된 시간의 순간을 맞이한 듯 신비한 느낌을 자아내고, 화이트 머스크와 우디노트가 기분 좋은 여운으로 어우러져 오랜 시간 은은하게 머무릅니다.",
  },
};
/** 지금 고른 것 */

/** 한 줄짜리 향 고르개 */
function ScentRow({
  kind,
  picked,
  onPick,
}: {
  kind: KindKey;
  picked: number | null;
  onPick: (i: number) => void;
}) {
  /* 향노트 옆 꺾쇠를 누르면 그 줄에서 설명이 펼쳐집니다. */
  const [told, setTold] = useState<number | null>(null);

  return (
    <ul className="cmpb-pick">
      {KINDS[kind].scents.map((scent, i) => (
        <li key={scent.name} data-told={told === i || undefined}>
          <div
            className="cmpb-pick-row"
            data-on={i === picked || undefined}
            role="button"
            tabIndex={0}
            onClick={() => onPick(i)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onPick(i);
              }
            }}
          >
            <span className="cmpb-pick-shot">
              <Image
                src={`/images/tam/${scent.file}.png`}
                alt=""
                fill
                sizes="4vw"
                className="object-contain"
              />
            </span>
            <span className="cmpb-pick-text">
              <b>
                {KINDS[kind].name} {scent.ko}
                <i className="cmpb-pick-en">{scent.name}</i>
              </b>
              <em>
                {NOTES[scent.file]?.notes}
                {NOTES[scent.file]?.story && (
                  <button
                    type="button"
                    className="cmpb-more"
                    aria-label="향 설명"
                    aria-expanded={told === i}
                    onClick={(event) => {
                      event.stopPropagation();
                      setTold((now) => (now === i ? null : i));
                    }}
                  >
                    <i aria-hidden />
                  </button>
                )}
              </em>
            </span>

            {/* 고른 줄에만 표가 켜집니다. 스토어의 옵션 목록과 같은 자리입니다. */}
            <span className="cmpb-check" data-on={i === picked || undefined} />
          </div>

          {told === i && NOTES[scent.file]?.story && (
            <div className="cmpb-story">
              <p>{NOTES[scent.file].story}</p>
              {NOTES[scent.file].top && (
                <dl className="cmpb-notes">
                  <div>
                    <dt>Top</dt>
                    <dd>{NOTES[scent.file].top}</dd>
                  </div>
                  <div>
                    <dt>Middle</dt>
                    <dd>{NOTES[scent.file].middle}</dd>
                  </div>
                  <div>
                    <dt>Base</dt>
                    <dd>{NOTES[scent.file].base}</dd>
                  </div>
                </dl>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

/** 고르는 순서. 하나를 고르면 그 층이 덮이고 다음 층이 올라옵니다. */
const LAYERS = ["기프트 세트 선택", "향 선택", "향 선택", "기프트 세트 보기"];

export function TamburinsComposeScreenB({
  auto = false,
  dots = false,
  dotRef,
}: {
  /** 아무도 만지지 않는 자리에서는 스스로 한 세트를 담아 보입니다. */
  auto?: boolean;
  /** 판 위 설명과 이을 수 있게 자리마다 번호 점을 얹습니다. */
  dots?: boolean;
  dotRef?: (key: string, el: HTMLSpanElement | null) => void;
} = {}) {
  /* 처음에는 리본이 묶인 상자입니다. 장에 들어서면 포장이 풀리고
     뚜껑이 열려 빈 상자가 드러납니다. 담기는 것은 세트를 고른 뒤입니다. */
  const [stage, inView] = useInView<HTMLDivElement>(0.3);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const open = window.setTimeout(() => setReady(inView), inView ? 900 : 0);
    return () => clearTimeout(open);
  }, [inView]);
  /* 지금 열려 있는 층. 고른다고 바로 넘어가지 않고, 굴려 올리면 다음 층이 열립니다. */
  const [step, setStep] = useState(0);
  const view = useRef<HTMLDivElement>(null);

  /* 고른 표가 켜지는 것을 보여 준 뒤에 다음 층으로 넘어갑니다. */
  const goNext = useCallback((to: number) => {
    window.setTimeout(() => setStep(to), PICK_HOLD);
  }, []);

  /* 세트 줄은 끌어서 넘깁니다. 판 전체가 세로로 딱딱 넘어가는 자리라
     휠은 그쪽으로 먹히고, 손으로 끄는 것만 이 줄에 닿습니다. */
  const drag = useRef({ on: false, held: false, from: 0, at: 0, moved: 0 });

  const onDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = {
      on: true,
      held: false,
      from: event.clientX,
      at: event.currentTarget.scrollLeft,
      moved: 0,
    };
  }, []);

  const onMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.on) return;
    const gone = event.clientX - drag.current.from;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(gone));
    if (drag.current.moved <= 4) return;
    if (!drag.current.held) {
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current.held = true;
    }
    event.currentTarget.scrollTo({ left: drag.current.at - gone });
  }, []);

  /* 휠도 가로로 넘깁니다. 끝에 닿으면 그냥 흘려보내, 판이 다음 장으로 갑니다. */
  const line = useRef<HTMLDivElement | null>(null);

  const onWheel = useCallback((event: WheelEvent) => {
    const row = line.current;
    if (!row) return;
    const by =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;
    const far = row.scrollWidth - row.clientWidth;
    if ((by < 0 && row.scrollLeft <= 0) || (by > 0 && row.scrollLeft >= far)) {
      return;
    }
    event.preventDefault();
    row.scrollTo({ left: Math.max(0, Math.min(far, row.scrollLeft + by)) });
  }, []);

  const bindLine = useCallback(
    (node: HTMLDivElement | null) => {
      line.current?.removeEventListener("wheel", onWheel);
      line.current = node;
      /* 판이 가로채지 못하게 passive 를 끕니다. */
      node?.addEventListener("wheel", onWheel, { passive: false });
    },
    [onWheel],
  );

  const onUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drag.current.on = false;
    drag.current.held = false;
  }, []);

  /* 머리가 상자 아래에 닿는 층을 엽니다. */
  const follow = useCallback(() => {
    const body = view.current;
    if (!body) return;
    const stage = body.querySelector<HTMLElement>(".cmpb-stage");
    const line = (stage?.getBoundingClientRect().bottom ?? 0) + 8;
    const heads = [...body.querySelectorAll<HTMLElement>(".cmpb-layer-head")];
    let at = 0;
    heads.forEach((head, i) => {
      if (head.getBoundingClientRect().top <= line) at = i;
    });
    setStep(at);
  }, []);

  useEffect(() => {
    const body = view.current;
    if (!body) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(follow);
    };
    body.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      body.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [follow]);
  const [set, setSet] = useState<number | null>(null);

  /* 판 위 목업처럼 손이 닿지 않는 자리에서는, 뚜껑이 열린 뒤
     한 세트를 스스로 골라 담습니다. 12장 표지와 같은 흐름입니다. */
  useEffect(() => {
    if (!auto || !ready) return;
    const drop = window.setTimeout(() => setSet(0), 900);
    return () => clearTimeout(drop);
  }, [auto, ready]);
  const [one, setOne] = useState<number | null>(null);
  const [two, setTwo] = useState<number | null>(null);

  useEffect(() => {
    if (inView) return;
    const back = window.setTimeout(() => {
      setSet(null);
      setOne(null);
      setTwo(null);
      setStep(0);
    }, 0);
    return () => clearTimeout(back);
  }, [inView]);

  /* 향 층의 제목. 고르기 전에는 "무엇의 향을 고르는지",
     고른 뒤에는 "무엇을 골랐는지"를 그대로 적습니다. */
  const titleOf = (n: number, fallback: string) => {
    if (set === null) return fallback;
    if (n === 0) return SETS[set].head;
    if (n !== 1 && n !== 2) return fallback;

    const kind = SETS[set].kinds[n - 1];
    const at = n === 1 ? one : two;
    return at === null
      ? `${KINDS[kind].name} 향 선택`
      : `${KINDS[kind].name} | ${KINDS[kind].scents[at].ko}`;
  };

  /* 세트를 다시 고르면 담긴 제품도 고른 향도 처음으로 돌아갑니다.
     앞 세트에서 고른 향이 새 세트의 제품에 그대로 붙으면 엉뚱한 짝이 됩니다. */
  const chooseSet = useCallback(
    (i: number) => {
      setSet(i);
      setOne(null);
      setTwo(null);
      /* 고른 표가 켜지는 것을 보여 준 뒤 첫 향 고르는 층으로 넘어갑니다. */
      goNext(1);
    },
    [goNext],
  );

  return (
    <div className="cmpb-screen">
      {/* 머리 */}
      <header className="cmpb-head">
        <span className="cmpb-back" aria-hidden />
        <h4>COMPOSE GIFT</h4>
        <span className="cmpb-bag" aria-hidden />
      </header>

      <div className="cmpb-body" ref={view}>
        {/* 01 — 담긴 모습. 고르기 전에는 비어 있고, 세트를 고르면 담깁니다. */}
        <section
          className="cmpb-sec cmpb-stage"
          ref={stage}
          data-small={(step > 0 && step < 3) || undefined}
          data-mid={step === 3 || undefined}
        >
          {/* 12장 표지와 같은 볕과 바닥. 상자보다 뒤에 깔립니다. */}
          <div className="tam-floor" aria-hidden />
          <div className="tam-sun" aria-hidden />
          <div className="tam-sun-floor" aria-hidden />

          {dots && (
            <span
              className="store-dot cmpb-dot cmpb-dot-box"
              ref={(el) => dotRef?.("01", el)}
              aria-hidden
            >
              <span>01</span>
            </span>
          )}

          <figure className="cmpb-box" data-open={ready || undefined}>
            {/* 상자는 닫힌 채로 놓여 있습니다. 세트를 고르면 뚜껑이 열리고
                제품이 하나씩 내려앉습니다. 12장 표지와 같은 겹·같은 동작입니다. */}
            <span className="cmpb-base">
              <Image
                src="/images/tamburins-box-base.png"
                alt=""
                fill
                sizes="16vw"
              />
            </span>

            {set !== null &&
              auto &&
              COVER_GOODS.map((good) => (
                <span
                  key={good.id}
                  className="cmpb-good"
                  style={
                    {
                      left: good.left,
                      top: good.top,
                      width: good.width,
                      height: good.height,
                      "--tilt": good.tilt,
                      "--delay": good.delay,
                    } as CSSProperties
                  }
                >
                  <Image src={good.src} alt="" fill sizes="8vw" />
                </span>
              ))}

            {set !== null &&
              !auto &&
              SETS[set].kinds.map((kind, n) => (
                <span
                  key={kind}
                  className="cmpb-item"
                  data-at={n === 0 ? "left" : "right"}
                  style={{ "--delay": `${n * 0.34}s` } as CSSProperties}
                >
                  <Image
                    /* 향이 바뀌면 사진도 새로 답니다. */
                    key={shotOf(kind, n === 0 ? one : two)}
                    src={shotOf(kind, n === 0 ? one : two)}
                    alt=""
                    fill
                    sizes="8vw"
                  />
                </span>
              ))}

            {/* 닫힌 채로 놓인 상자. 열리기 시작하면 흐려지며 물러나고,
                그 아래에서 뚜껑이 열린 상자가 드러납니다. 각도가 서로 달라
                이어 붙이지 않고 겹쳐 두고 바꿉니다. */}
            <span className="cmpb-closed" aria-hidden>
              <Image
                src="/images/tam-box-closed.png"
                alt=""
                fill
                sizes="16vw"
              />
            </span>

            <span className="cmpb-front">
              <Image
                src="/images/tamburins-box-front.png"
                alt=""
                fill
                sizes="16vw"
              />
            </span>

            <span className="cmpb-lid">
              <Image
                src="/images/tamburins-box-lid.png"
                alt=""
                fill
                sizes="16vw"
              />
            </span>
          </figure>
        </section>

        {/* 고르는 층. 하나를 고르면 그 층이 접히고 다음 층이 그 위를 덮습니다. */}
        <div className="cmpb-stack">
          {LAYERS.map((title, n) => (
            <section
              key={`${n}-${title}`}
              className="cmpb-layer"
              data-open={step === n || undefined}
              /* 세트 층만 다 고르고 나면 잉크로 뒤집힙니다. */
              data-done={(n === 0 && step > 0) || undefined}
              style={{ zIndex: n + 1 }}
            >
              <button
                type="button"
                className="cmpb-layer-head"
                onClick={() => setStep(n)}
              >
                <span className="cmpb-layer-no">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <h5>{titleOf(n, title)}</h5>
                <i className="cmpb-layer-arrow" aria-hidden />
              </button>

              {dots &&
                n < 3 &&
                n !== 1 &&
                (() => {
                  const no = n === 2 ? "03" : "02";
                  return (
                    <span
                      className="store-dot cmpb-dot"
                      ref={(el) => dotRef?.(no, el)}
                      aria-hidden
                    >
                      <span>{no}</span>
                    </span>
                  );
                })()}

              <div className="cmpb-layer-body">
                {n === 0 && (
                  <div
                    className="cmpb-cards"
                    ref={bindLine}
                    onPointerDown={onDown}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                  >
                    {SETS.map((item, i) => (
                      <article
                        key={item.head}
                        className="cmpb-card"
                        data-on={set === i || undefined}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          if (drag.current.moved > 4) return;
                          chooseSet(i);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            chooseSet(i);
                          }
                        }}
                      >
                        <b>
                          {item.head.split("&")[0].trim()} &
                          <br />
                          {item.head.split("&")[1].trim()}
                        </b>

                        <span className="cmpb-card-shot">
                          <Image
                            src={item.shot}
                            alt=""
                            width={240}
                            height={240}
                          />
                        </span>
                      </article>
                    ))}
                  </div>
                )}

                {n === 1 && set !== null && (
                  <ScentRow
                    kind={SETS[set].kinds[0]}
                    picked={one}
                    onPick={(i) => {
                      setOne(i);
                      goNext(2);
                    }}
                  />
                )}

                {n === 2 && set !== null && (
                  <ScentRow
                    kind={SETS[set].kinds[1]}
                    picked={two}
                    onPick={(i) => {
                      setTwo(i);
                      goNext(3);
                    }}
                  />
                )}

                {n === 3 && set !== null && (
                  <div className="cmpb-list">
                    <ul>
                      {SETS[set].kinds.map((kind, i) => {
                        const at = i === 0 ? one : two;
                        return (
                          <li key={kind}>
                            <span className="cmpb-list-shot">
                              <Image
                                src={shotOf(kind, at)}
                                alt=""
                                fill
                                sizes="4vw"
                                className="object-contain"
                              />
                            </span>
                            <span className="cmpb-list-text">
                              <b>
                                {KINDS[kind].name}
                                {at === null
                                  ? ""
                                  : ` ${KINDS[kind].scents[at].ko}`}
                              </b>
                              <em>
                                {at === null
                                  ? "향 미선택"
                                  : KINDS[kind].scents[at].name}
                              </em>
                            </span>
                            <span className="cmpb-list-qty">1 ×</span>
                            <span className="cmpb-list-price">
                              {won(PRICES[kind])}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* 값은 목록 끝에 붙습니다. 무엇을 더해 나온 값인지가 바로 위에 있습니다. */}
                    <p className="cmpb-sum">
                      <span>총 금액</span>
                      <b>{won(SETS[set].price)}원</b>
                    </p>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* 바닥에는 담기와 사기 둘만 둡니다.
          세트와 향 둘을 다 고른 뒤라야 담을 것이 정해집니다.
          그 전에는 자리도 두지 않아, 아래 걸음들이 그만큼 넓게 섭니다. */}
      {set !== null && one !== null && two !== null && (
        <div className="cmpb-bar">
          <span className="cmpb-add" data-ghost>
            장바구니
          </span>
          <span className="cmpb-add">구매하기</span>
        </div>
      )}
    </div>
  );
}
