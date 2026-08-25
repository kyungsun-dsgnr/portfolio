"use client";

/** 12장 — 탬버린즈 케이스 표지 */

import { SceneCase } from "@/components/07-SceneCase";
import { TamburinsBox } from "@/components/12-SceneTamburins";

/** 상자 그림의 배율만 다르게 여러 벌을 세워 놓고 고를 수 있게 합니다. */
export function SceneTamburinsCover({ scale = 1 }: { scale?: number }) {
  return (
    <SceneCase
      title="Tamburins Compose"
      logo={{ src: "/images/tamburins-logo.png", alt: "Tamburins" }}
      body={
        <>
          선물을 준비할 때, 무엇을 담을지 선택하고 하나의 구성으로 완성합니다.
          <br />
          <br />이 프로젝트는 그 경험을 바탕으로 Tamburins의 분산된 선물세트 구성
          경험과 선물 선택 과정을 하나의 Gift Composition 경험으로 재구성합니다.
        </>
      }
      visual={<TamburinsBox scale={scale} />}
    />
  );
}
