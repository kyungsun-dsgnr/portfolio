"use client";

/** 12장 — 탬버린즈 케이스 표지에 들어가는 선물 상자 */

import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * 좌측 이미지의 겹 하나. 자리와 크기는 디자인 px 이고, --u 를 곱해 화면 크기에 맞춥니다.
 * 배열 순서가 그대로 앞뒤 순서라, 뒤에 오는 겹이 앞을 덮습니다.
 */
type Layer = {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

/* 상자와 상자 앞면은 같은 사진에서 잘라 낸 것이라 자리가 어긋나면 바로 티가 납니다.
   앞면은 상자 원본의 1022번째 줄부터 잘려 나왔고, 619 폭으로 놓으면 511 아래입니다. */
const BOX: Layer = {
  src: "/images/tamburins-box.png",
  left: 32,
  top: 0,
  width: 618.91,
  height: 740,
};

const FRONT: Layer = {
  src: "/images/tamburins-box-front.png",
  left: 32,
  top: 511,
  width: 618.91,
  height: 229,
};

/* 상자에 담기는 것들. 밑동이 상자 앞면에 가려지도록 앞면보다 뒤에 놓입니다.
   기울기와 시차를 서로 다르게 두어 둘이 한 몸처럼 떨어지지 않게 합니다.
   fall 은 판 위쪽 밖에서 시작하도록 제 자리보다 조금 더 잡은 값입니다. */
const GOODS: (Layer & { tilt: string; delay: string; fall: number })[] = [
  {
    src: "/images/tamburins-perfume.png",
    left: 126.38,
    top: 386.74,
    width: 213.06,
    height: 214.43,
    tilt: "-11deg",
    delay: "0.5s",
    fall: 620,
  },
  {
    src: "/images/tamburins-handwash.png",
    left: 362.33,
    top: 98.16,
    width: 164.61,
    height: 480.06,
    tilt: "5.5deg",
    delay: "0.74s",
    fall: 600,
  },
];

/** 디자인 px 을 화면 크기로 옮깁니다. */
const at = (box: {
  left: number;
  top: number;
  width: number;
  height: number;
}) =>
  ({
    left: `calc(${box.left} * var(--u))`,
    top: `calc(${box.top} * var(--u))`,
    width: `calc(${box.width} * var(--u))`,
    height: `calc(${box.height} * var(--u))`,
  }) as CSSProperties;

/**
 * 선물 상자에 제품이 담긴 모습. 케이스 표지의 비주얼 자리에 그대로 들어갑니다.
 * 자리 값은 682×740 칸을 기준으로 잡혀 있어, 그 크기의 칸이면 어디에 놓아도 맞습니다.
 */
export function TamburinsBox() {
  return (
    <div className="tam-box relative h-full w-full overflow-hidden">
      <div className="absolute" style={at(BOX)}>
        <Image
          alt=""
          src={BOX.src}
          fill
          sizes="50vw"
          priority
          className="object-contain"
        />
      </div>

      {/* 위에서 떨어져 상자에 담기고, 닿은 자리에서 반듯하게 섭니다. */}
      {GOODS.map((one) => (
        <div
          key={one.src}
          className="tam-drop absolute"
          style={
            {
              ...at(one),
              "--tilt": one.tilt,
              "--delay": one.delay,
              "--fall": one.fall,
            } as CSSProperties
          }
        >
          <div className="tam-bob">
            <Image
              alt=""
              src={one.src}
              fill
              sizes="50vw"
              className="object-contain"
            />
          </div>
        </div>
      ))}

      {/* 상자 앞면이 맨 앞에 서서 제품 밑동을 가립니다. */}
      <div className="absolute" style={at(FRONT)}>
        <Image
          alt=""
          src={FRONT.src}
          fill
          sizes="50vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
