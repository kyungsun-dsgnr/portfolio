"use client";

/** 18장 — 누데이크 케이스 표지 */

import Image from "next/image";
import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 앞의 두 케이스와 좌우를 뒤집습니다. 사진이 왼쪽, 글이 오른쪽에 오른쪽맞춤으로 섭니다.
   자리는 682×740 판을 기준으로 한 도면 좌표이고, --u 를 곱해 화면 크기로 옮깁니다. */
const px = (value: number) => `calc(${value} * var(--u))`;

const put = (box: {
  left: number;
  top: number;
  width: number;
  height: number;
}) =>
  ({
    left: px(box.left),
    top: px(box.top),
    width: px(box.width),
    height: px(box.height),
  }) as CSSProperties;

/* 사진 세 겹은 모두 같은 1364×1480 판에서 잘려 나와, 판(682×740)에 그대로 포갭니다.
   배경 → 카드 → 컵 순서라 카드가 배경 앞, 컵이 카드 앞에 섭니다. */
const FULL = { left: 0, top: 0, width: 682, height: 740 };
/* 사진 속 카드가 놓인 자리. 원본 알파 경계(544,424)~(1080,1186)의 절반입니다.
   여기에 우리 카드를 정확히 덮어, 인쇄된 글자 대신 우리 글자가 보이게 합니다. */
const CARD = { left: 272, top: 212, width: 268, height: 381 };

/* 카드에 손으로 쓰이는 말. 한 줄로 한 글자씩 그어집니다. */
const HAND = ["Thank you !"];

/* 잔에 담기는 티백 한 장(끈과 라벨이 함께 그려져 있습니다).
   원본 1222×1287 판에서 주머니가 가로 21.2~74.2%, 세로 37.0~93.9% 자리라,
   주머니가 잔 안쪽 물(가로 120~376, 물 위 440)에 들어가도록 판을 잡았습니다.
   주머니 폭 105 → 115.5 로 1.1배 키운 값입니다. */
/* 주머니 폭 115.5 → 127 로 한 번 더 1.1배 키운 값입니다. */
const TEA = { left: 128, top: 356, width: 240, height: 253 };

const BREW = { left: 126, top: 440, width: 212, height: 182 };

/* 번지는 덩이들. 자리·크기·시작 시각이 모두 달라 가장자리가 일정하지 않습니다. */
const BLOBS = [
  { x: 12, y: 6, w: 74, h: 66, delay: 0, spin: -12 },
  { x: 30, y: 22, w: 66, h: 74, delay: 0.5, spin: 18 },
  { x: -6, y: 30, w: 70, h: 62, delay: 0.9, spin: 6 },
  { x: 18, y: 44, w: 78, h: 56, delay: 1.3, spin: -22 },
];

/** 세 번째 케이스의 첫 장 */
export function SceneNudakeCover() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <div className="nud-scene rise col-start-1 col-span-4 row-start-1 row-span-6">
        <div className="absolute" style={put(FULL)}>
          <Image
            src="/images/nudake-bg.png"
            alt=""
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
        </div>

        {/* 사진 속 카드 자리를 그대로 덮는 우리 카드.
            위에 로고, 가운데 손글씨, 아래 날짜입니다. */}
        <div className="nud-card absolute" style={put(CARD)}>
          {/* 처음에는 제품 카드가 서 있다가, 서서히 감사 카드로 바뀝니다.
              앞면도 같은 종이 위에 로고·그림·품명을 얹어 만듭니다. */}
          <span className="nud-card-front" aria-hidden>
            <span className="nud-front-logo">
              <Image
                src="/images/nudake-card-logo.png"
                alt=""
                fill
                sizes="10vw"
                className="object-contain"
              />
            </span>

            <span className="nud-front-art">
              <Image
                src="/images/nudake-bluemonk.png"
                alt=""
                fill
                sizes="20vw"
                className="object-cover"
              />
            </span>

            <span className="nud-front-foot">
              <em>Blue Monk</em>
              <em>Tea</em>
            </span>

            <span className="nud-front-mark">nudake.com</span>
          </span>

          <span className="nud-card-logo">
            <Image
              src="/images/nudake-card-logo.png"
              alt="Nudake"
              fill
              sizes="10vw"
              className="object-contain"
            />
          </span>

          <p className="nud-card-hand" aria-label={HAND.join(" ")}>
            {HAND.map((line, row) => (
              <span className="nud-card-line" key={line} aria-hidden>
                {[...line].map((letter, i) => (
                  <span
                    key={`${letter}-${i}`}
                    style={
                      {
                        /* 줄이 바뀌어도 쓰는 차례가 이어집니다. */
                        "--i": row * HAND[0].length + i,
                      } as CSSProperties
                    }
                  >
                    {letter}
                  </span>
                ))}
              </span>
            ))}
          </p>

          <span className="nud-card-date">28 June 2026</span>
        </div>

        {/* 컵은 카드보다 앞에 섭니다. */}
        <div className="absolute" style={put(FULL)}>
          <Image
            src="/images/nudake-cup.png"
            alt=""
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>

        {/* 티백이 잔에 내려앉고, 그 자리에서 차가 우러나 번집니다. */}
        <div className="nud-brew absolute" style={put(BREW)} aria-hidden>
          {/* 한 덩이로 고르게 퍼지면 잔 모양 그대로 커지는 것처럼 보입니다.
              크기와 자리가 다른 덩이 넷이 제각각 번져 모양이 일정하지 않게 합니다. */}
          {BLOBS.map((blob, i) => (
            <span
              key={i}
              className="nud-brew-blob"
              style={
                {
                  left: `${blob.x}%`,
                  top: `${blob.y}%`,
                  width: `${blob.w}%`,
                  height: `${blob.h}%`,
                  "--delay": `${blob.delay}s`,
                  "--spin": `${blob.spin}deg`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <div className="nud-tea absolute" style={put(TEA)} aria-hidden>
          <Image
            src="/images/nudake-teabag.png"
            alt=""
            fill
            sizes="30vw"
            className="object-contain"
          />
        </div>
      </div>

      <h2 className="type-display rise col-start-6 col-span-3 row-start-1 row-span-2 text-right">
        Nudake
        <br />
        Gift
      </h2>

      <p
        className="type-body rise col-start-6 col-span-3 row-start-3 text-right"
        style={{ "--delay": "0.12s" } as CSSProperties}
      >
        선물은 무엇을 고르는 것에서 끝나지 않습니다.
        <br />
        마음을 적고, 담아, 누군가에게 건네며 완성됩니다.
        <br />
        <br />
        &lsquo;고르고, 적고, 넣고, 건네는&rsquo; 익숙한 행동을 바탕으로
        <br />
        Nudake의 디지털 선물 경험을 재구성합니다.
      </p>

      {/* 로고는 오른쪽 아래 두 단, 판 오른쪽 끝에 맞춰 섭니다. */}
      <div
        className="nud-logo rise relative col-start-7 col-span-2 row-start-6"
        style={{ "--delay": "0.2s" } as CSSProperties}
      >
        <Image
          src="/images/nudake-logo.png"
          alt="Nudake"
          fill
          sizes="24vw"
          className="object-contain object-right"
        />
      </div>
    </div>
  );
}
