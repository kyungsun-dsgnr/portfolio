"use client";

/** 17장 — 고르고, 담고, 완성합니다 */

import Image from "next/image";
import { useState, type CSSProperties } from "react";

import { TamburinsBox } from "@/components/12-SceneTamburins";
import { useInView } from "@/components/useInView";

/* 고를 수 있는 것. 카드를 누르면 그 제품이 상자로 들어갑니다. */
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
    fit: 0.62,
  },
];

/* 세 걸음. 담긴 개수에 따라 지금 어디에 있는지가 저절로 따라옵니다. */
const STEPS = [
  { no: "01", name: "Choose", body: "원하는 구성을 고릅니다." },
  { no: "02", name: "Place", body: "선택한 제품이 상자 안에 놓입니다." },
  {
    no: "03",
    name: "Compose",
    body: "구성을 확인하며 하나의 선물을 완성합니다.",
  },
];

/**
 * 탬버린즈의 대표 장면. 고른 것이 스스로 상자로 들어갑니다.
 * 끌어다 놓게 하지 않는 이유는, 옮기려는 것이 손의 물리 동작이 아니라
 * "고르고 상자에 담는다"는 익숙한 인지 구조이기 때문입니다.
 */
export function SceneCompose() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [placed, setPlaced] = useState<string[]>([]);

  const pick = (id: string) =>
    setPlaced((was) =>
      was.includes(id) ? was.filter((one) => one !== id) : [...was, id],
    );

  /** 지금 서 있는 걸음 */
  const at = placed.length === 0 ? 0 : placed.length < GOODS.length ? 1 : 2;

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1 row-span-2">
        Choose,
        <br />
        Place, Compose.
      </h2>

      <ol className="compose-steps rise col-start-1 col-span-3 row-start-3 row-span-4">
        {STEPS.map((step, i) => (
          <li
            key={step.no}
            className="compose-step"
            data-on={i === at || undefined}
            data-done={i < at || undefined}
            style={{ "--delay": `${0.12 + i * 0.08}s` } as CSSProperties}
          >
            <span className="compose-no">{step.no}</span>
            <div>
              <h3 className="type-title">{step.name}</h3>
              <p className="type-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* 판 넷 × 여섯 행은 상자 도면(682×740)과 정확히 같은 칸입니다. */}
      <div
        className="rise col-start-4 col-span-4 row-start-1 row-span-6"
        style={{ "--delay": "0.2s" } as CSSProperties}
      >
        <TamburinsBox placed={placed} />
      </div>

      <div
        className="tam-goods rise col-start-8 col-span-1 row-start-2 row-span-3"
        data-stack
        style={{ "--delay": "0.28s" } as CSSProperties}
      >
        {GOODS.map((one) => (
          <button
            type="button"
            className="tam-good"
            key={one.id}
            aria-label={one.name}
            aria-pressed={placed.includes(one.id)}
            onClick={() => pick(one.id)}
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
    </div>
  );
}
