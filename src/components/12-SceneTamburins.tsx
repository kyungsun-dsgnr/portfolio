"use client";

/** 12장 — 탬버린즈 케이스 표지 */

import Image from "next/image";
import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

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
   앞면은 상자 원본의 1022번째 줄부터 잘려 나왔고, 619 폭으로 놓으면 511 아래입니다.
   향수는 상자 앞면보다 아래로 내려와, 밑동이 앞면에 가려집니다. */
const LAYERS: Layer[] = [
  {
    src: "/images/tamburins-box.png",
    left: 32,
    top: 0,
    width: 618.91,
    height: 740,
  },
  {
    src: "/images/tamburins-handwash.png",
    left: 362.33,
    top: 98.16,
    width: 164.61,
    height: 480.06,
  },
  {
    src: "/images/tamburins-box-front.png",
    left: 32,
    top: 511,
    width: 618.91,
    height: 229,
  },
];

/** 아직 오지 않은 향수 자리. 상자 앞면보다 뒤에 놓입니다. */
const PERFUME = { left: 126.38, top: 386.74, width: 213.06, height: 214.43 };

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
 * 두 번째 케이스 표지 — 좌측 네 단이 이미지, 우측 세 단이 글입니다.
 * 앞 케이스와 좌우가 뒤집혀 있어 두 프로젝트가 나란히 놓여도 같은 화면으로 읽히지 않습니다.
 */
export function SceneTamburins() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      {/* 선물 상자에 제품이 담긴 모습. 상자 앞면이 맨 앞에 서서 제품 밑동을 가립니다. */}
      <div className="rise relative col-start-1 col-span-4 row-start-1 row-span-6 overflow-hidden">
        <div className="absolute" style={at(LAYERS[0])}>
          <Image
            alt=""
            src={LAYERS[0].src}
            fill
            sizes="50vw"
            priority
            className="object-contain"
          />
        </div>

        {/* 향수 에셋이 오면 이 자리에 그대로 들어갑니다. */}
        <div
          className="absolute bg-[var(--placeholder)]"
          style={at(PERFUME)}
          aria-hidden
        />

        {LAYERS.slice(1).map((layer) => (
          <div key={layer.src} className="absolute" style={at(layer)}>
            <Image
              alt=""
              src={layer.src}
              fill
              sizes="50vw"
              className="object-contain"
            />
          </div>
        ))}
      </div>

      <h2
        className="type-display rise col-start-6 col-span-3 row-start-1 row-span-2 text-right"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        Tamburins Compose
      </h2>

      {/* 글이 한 줄 정도 넘쳐도 행이 늘어나지 않도록 두 행을 잡고 위에서 시작합니다. */}
      <p
        className="type-body rise self-start col-start-6 col-span-3 row-start-3 row-span-2"
        style={{ "--delay": "0.16s" } as CSSProperties}
      >
        선물을 준비할 때, 무엇을 담을지 선택하고 하나의 구성으로 완성합니다.
        <br />
        <br />이 프로젝트는 그 경험을 바탕으로 Tamburins의 분산된 선물세트 구성
        경험과 선물 선택 과정을 하나의 Gift Composition 경험으로 재구성합니다.
      </p>

      {/* 브랜드 로고. 원본이 이 칸(333×110)에 맞춰 그려져 있어 그대로 채웁니다. */}
      <div
        className="rise relative col-start-7 col-span-2 row-start-6"
        style={{ "--delay": "0.22s" } as CSSProperties}
      >
        <Image
          src="/images/tamburins-logo.png"
          alt="Tamburins"
          fill
          sizes="24vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
