"use client";

/** 12장 — 탬버린즈 케이스 표지 */

import { useEffect, useState } from "react";

import { useInView } from "@/components/useInView";

import { SceneCase } from "@/components/07-SceneCase";
import { TamburinsBox } from "@/components/12-SceneTamburins";

/* 담기는 차례. 향수가 먼저, 핸드워시가 뒤따릅니다.
   고르는 일은 이 표지의 몫이 아니라서, 손으로 누르는 카드는 두지 않습니다. */
const ORDER = ["perfume", "wash"];
/** 상자가 열리기를 기다렸다가 첫 제품이 내려앉기까지 */
const FIRST_AT = 900;
/** 제품과 제품 사이 */
const GAP = 900;

/** 상자 그림의 배율만 다르게 여러 벌을 세워 놓고 고를 수 있게 합니다. */
export function SceneTamburinsCover({ scale = 1 }: { scale?: number }) {
  /* 상자는 비어 있다가 스스로 차례로 담깁니다. */
  const [placed, setPlaced] = useState<string[]>([]);
  /* 장에 들어왔는지는 상자 자리에서 지켜봅니다. */
  const [hold, inView] = useInView<HTMLDivElement>(0.4);

  useEffect(() => {
    if (!inView) {
      const empty = window.setTimeout(() => setPlaced([]), 0);
      return () => clearTimeout(empty);
    }

    const steps = ORDER.map((id, i) =>
      window.setTimeout(
        () => setPlaced((was) => (was.includes(id) ? was : [...was, id])),
        FIRST_AT + i * GAP,
      ),
    );
    return () => steps.forEach(clearTimeout);
  }, [inView]);

  return (
    <SceneCase
      title="Tamburins Compose"
      subtitle="흩어진 선물 구성을, 한 화면으로 모으다"
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
      visual={
        <div className="h-full w-full" ref={hold}>
          <TamburinsBox scale={scale} placed={placed} />
        </div>
      }
    />
  );
}
