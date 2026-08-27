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

/* 카드에 손으로 쓰이는 말. 두 줄로 나누어 한 글자씩 그어집니다. */
const HAND = ["Thank", "you !"];

/* 잔에 담기는 티백. 라벨은 잔 밖에 걸리고, 끈으로 이어진 주머니만 물에 잠깁니다.
   사진 속 잔(가로 120~376, 위쪽 테두리 375)에 맞춘 도면 좌표입니다. */
const TEA = { left: 116, top: 356, width: 212, height: 214 };
/* 라벨은 잔 왼쪽 테두리에 걸칩니다. */
const TAG = { left: 0, top: 0, width: 44, height: 55 };
/* 주머니는 그 안쪽 물에 깊이 잠깁니다. */
const POUCH = { left: 56, top: 74, width: 130, height: 160 };
const BREW = { left: 138, top: 452, width: 220, height: 168 };

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
        <div className="nud-brew absolute" style={put(BREW)} aria-hidden />

        <div className="nud-tea absolute" style={put(TEA)} aria-hidden>
          {/* 라벨에서 주머니로 이어지는 끈. 잔 테두리에 걸쳐 있습니다. */}
          <svg className="nud-tea-string" viewBox="0 0 212 214">
            <path d="M24 52 C 28 82, 82 66, 116 82" />
          </svg>

          <div className="nud-tea-tag absolute" style={put(TAG)}>
            <Image
              src="/images/nudake-teatag.png"
              alt=""
              fill
              sizes="10vw"
              className="object-contain"
            />
          </div>

          <div className="nud-tea-pouch absolute" style={put(POUCH)}>
            <Image
              src="/images/nudake-teabag-pouch.png"
              alt=""
              fill
              sizes="14vw"
              className="object-contain"
            />
          </div>
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
