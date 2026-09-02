"use client";

/**
 * 18장 — 누데이크 케이스 표지
 *
 * 글이 왼쪽, 큰 그림이 오른쪽에 섭니다.
 * 그림은 지금 브랜드 정물(배경·잔·카드·티백)입니다. 실제 매장 사진이
 * 생기면 `nud-scene` 안의 겹만 사진 한 장으로 갈면 나머지는 그대로 섭니다.
 */

import Image from "next/image";
import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 자리는 682×740 판을 기준으로 한 도면 좌표이고, --u 를 곱해 화면 크기로 옮깁니다. */
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
/* 사진 속 카드가 놓인 자리. 원본 알파 경계(544,424)~(1080,1186)의 절반입니다. */
const CARD = { left: 272, top: 212, width: 268, height: 381 };

/* 카드에 손으로 쓰이는 말. 한 줄로 한 글자씩 그어집니다. */
const HAND = ["Thank you !"];

/* 잔에 담기는 티백 한 장(끈과 라벨이 함께 그려져 있습니다). */
const TEA = { left: 112, top: 356, width: 240, height: 253 };
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
      <div className="nud-scene rise col-start-5 col-span-4 row-start-1 row-span-6">
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

        <div className="nud-card absolute" style={put(CARD)}>
          {/* 처음에는 제품 카드가 서 있다가, 서서히 감사 카드로 바뀝니다. */}
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


      <h2 className="type-display rise col-start-1 col-span-4 row-start-1 row-span-2">
        From Store
        <br />
        to Gift
      </h2>

      <h3
        className="type-title rise self-start col-start-1 col-span-3 row-start-4"
        style={{ "--delay": "0.14s" } as CSSProperties}
      >
        누데이크의 경험을, 장소 밖으로 확장하다
      </h3>

      <p
        className="type-body rise col-start-1 col-span-3 row-start-5 row-span-2"
        style={{ "--delay": "0.2s" } as CSSProperties}
      >
        누데이크의 브랜드 경험은 강렬하지만, 직접 경험할 수 있는 공간은
        제한적입니다.
        <br />
        <br />이 프로젝트는 고급 티 기프트를 새로운 브랜드 접점으로 정의하고,
        누구나 누데이크의 경험을 주고받을 수 있도록 온라인 경험을 재설계합니다.
      </p>

      <div
        className="nud-logo rise relative col-start-1 col-span-2 row-start-6"
        style={{ "--delay": "0.28s" } as CSSProperties}
      >
        <Image
          src="/images/nudake-mark.png"
          alt="Nudake"
          fill
          sizes="24vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
