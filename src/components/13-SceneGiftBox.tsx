"use client";

/** 13장 — 탬버린즈 표지 (열리는 상자) */

import { SceneCase } from "@/components/07-SceneCase";
import { TamburinsGiftBox } from "@/components/TamburinsGiftBox";

/** 12장과 같은 자리에 같은 글을 두고, 우측 그림만 열리는 상자로 바꾼 장.
    상자 뚜껑에 이름이 찍혀 있어 왼쪽 로고는 두지 않습니다. */
export function SceneGiftBox() {
  return (
    <SceneCase
      title="Tamburins Compose"
      body={
        <>
          선물을 준비할 때, 무엇을 담을지 선택하고 하나의 구성으로 완성합니다.
          <br />
          <br />이 프로젝트는 그 경험을 바탕으로 Tamburins의 분산된 선물세트
          구성 경험과 선물 선택 과정을 하나의 Gift Composition 경험으로
          재구성합니다.
        </>
      }
      visual={<TamburinsGiftBox />}
    />
  );
}
