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

/** 배경 사진. 판보다 크게 잡아 왼쪽 위를 잘라 씁니다. */
const SCENE = { left: -326, top: -40, width: 1114, height: 780 };
/** 배경 위에 카드, 그 위에 컵. 둘을 묶어 두면 함께 옮길 수 있습니다. */
const GROUP = { left: 119.63, top: 181, width: 419.25, height: 513 };
const CARD = { left: 152.37, top: 31, width: 268, height: 381 };
const CUP = { left: 0.37, top: 194, width: 267, height: 309 };

/* 카드·컵 컷아웃이 에셋에 들어오면 참으로 바꿉니다.
   파일 이름은 /images/nudake-card.png, /images/nudake-cup.png 입니다. */
const HAS_LAYERS = false;
/* 로고도 마찬가지입니다. /images/nudake-logo.png */
const HAS_LOGO = false;

/** 세 번째 케이스의 첫 장 */
export function SceneNudakeCover() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <div className="nud-scene rise col-start-1 col-span-4 row-start-1 row-span-6">
        <div className="absolute" style={put(SCENE)}>
          <Image
            src="/images/nudake-scene.png"
            alt=""
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
        </div>

        {HAS_LAYERS && (
          <div className="absolute" style={put(GROUP)}>
            <div className="absolute" style={put(CARD)}>
              <Image
                src="/images/nudake-card.png"
                alt=""
                fill
                sizes="25vw"
                className="object-contain"
              />
            </div>

            <div className="absolute" style={put(CUP)}>
              <Image
                src="/images/nudake-cup.png"
                alt=""
                fill
                sizes="25vw"
                className="object-contain"
              />
            </div>
          </div>
        )}
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
        {HAS_LOGO ? (
          <Image
            src="/images/nudake-logo.png"
            alt="Nudake"
            fill
            sizes="24vw"
            className="object-contain object-right"
          />
        ) : (
          <span className="case-wordmark">NUDAKE</span>
        )}
      </div>
    </div>
  );
}
