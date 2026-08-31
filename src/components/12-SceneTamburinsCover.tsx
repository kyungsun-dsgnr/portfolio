"use client";

/** 12장 — 탬버린즈 케이스 표지 */

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

import { useInView } from "@/components/useInView";

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
    /* 담긴 폭이 핸드워시와 같아지도록 맞춘 값입니다(54.75 × 0.577 = 31.6). */
    fit: 0.535,
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
  hold,
}: {
  placed: string[];
  onPick: (id: string) => void;
  /** 장에 들어왔는지 지켜보는 자리 */
  hold: React.Ref<HTMLDivElement>;
}) {
  return (
    <div className="tam-goods" ref={hold}>
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
  /* 상자는 비어 있다가 차례로 담깁니다. 손으로 눌러 다시 담거나 꺼낼 수도 있습니다. */
  const [placed, setPlaced] = useState<string[]>([]);
  const [hold, inView] = useInView<HTMLDivElement>(0.4);

  useEffect(() => {
    if (!inView) {
      const empty = window.setTimeout(() => setPlaced([]), 0);
      return () => clearTimeout(empty);
    }

    /* 장에 들어서면 향수가 먼저, 핸드워시가 뒤따라 담깁니다. */
    const steps = GOODS.map((one, i) =>
      window.setTimeout(
        () =>
          setPlaced((was) => (was.includes(one.id) ? was : [...was, one.id])),
        900 + i * 900,
      ),
    );
    return () => steps.forEach(clearTimeout);
  }, [inView]);

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
      aside={<TamburinsGoods placed={placed} onPick={pick} hold={hold} />}
      visual={<TamburinsBox scale={scale} placed={placed} />}
    />
  );
}
