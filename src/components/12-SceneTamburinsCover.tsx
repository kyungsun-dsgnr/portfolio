"use client";

/** 12장 — 탬버린즈 케이스 표지 */

import Image from "next/image";
import { useState, type CSSProperties } from "react";

import { SceneCase } from "@/components/07-SceneCase";
import { TamburinsBox } from "@/components/12-SceneTamburins";

/* 상자에 담기는 두 가지. 로고 윗행에 한 단씩 섭니다.
   fit 은 칸 안에서 제품을 얼마나 채울지입니다. 향수는 낮고 넓어 칸을 가득 채우면
   핸드워시보다 커 보이므로 반으로 줄여 실제 크기 차이에 가깝게 둡니다. */
const GOODS = [
  {
    id: "perfume",
    src: "/images/tamburins-perfume.png",
    name: "Perfume",
    fit: 0.5,
  },
  {
    id: "wash",
    src: "/images/tamburins-handwash.png",
    name: "Hand Wash",
    fit: 0.625,
  },
];

/** 제품 카드 두 장. 누르면 그 제품이 상자에 담기고, 다시 누르면 꺼냅니다. */
function TamburinsGoods({
  placed,
  onPick,
}: {
  placed: string[];
  onPick: (id: string) => void;
}) {
  return (
    <div className="tam-goods">
      {GOODS.map((one) => (
        <button
          type="button"
          className="tam-good"
          key={one.id}
          aria-label={one.name}
          aria-pressed={placed.includes(one.id)}
          onClick={() => onPick(one.id)}
          style={{ "--fit": one.fit } as CSSProperties}
        >
          <Image
            src={one.src}
            alt=""
            fill
            sizes="12vw"
            className="object-contain"
          />
        </button>
      ))}
    </div>
  );
}

/** 상자 그림의 배율만 다르게 여러 벌을 세워 놓고 고를 수 있게 합니다. */
export function SceneTamburinsCover({ scale = 1 }: { scale?: number }) {
  /* 상자는 비어 있고, 카드를 누른 것만 담깁니다. 선물을 꾸리는 이 장의 주제 그대로입니다. */
  const [placed, setPlaced] = useState<string[]>([]);

  const pick = (id: string) =>
    setPlaced((was) =>
      was.includes(id) ? was.filter((one) => one !== id) : [...was, id],
    );

  return (
    <SceneCase
      title="Tamburins Compose"
      logo={{ src: "/images/tamburins-logo.png", alt: "Tamburins" }}
      body={
        <>
          선물을 준비할 때, 무엇을 담을지 선택하고 하나의 구성으로 완성합니다.
          <br />
          <br />이 프로젝트는 그 경험을 바탕으로 Tamburins의 분산된 선물세트
          구성 경험과 선물 선택 과정을 하나의 Gift Composition 경험으로
          재구성합니다.
        </>
      }
      note="좌측 카드를 눌러 제품을 기프트 패키지에 담아보세요"
      aside={<TamburinsGoods placed={placed} onPick={pick} />}
      visual={<TamburinsBox scale={scale} placed={placed} />}
    />
  );
}
