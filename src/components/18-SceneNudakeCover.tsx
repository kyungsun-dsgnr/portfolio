"use client";

/** 16장 — 누데이크 케이스 표지 */

import Image from "next/image";

import { SceneCase } from "@/components/07-SceneCase";

/** 상자 사진 한 장. 판은 탬버린즈 표지와 같은 톤으로 눌러 둡니다. */
function NudakePackage() {
  return (
    <div className="nud-box relative h-full w-full overflow-hidden">
      <Image
        src="/images/work-nudake.png"
        alt=""
        fill
        sizes="50vw"
        className="object-contain"
      />
    </div>
  );
}

/** 세 번째 케이스의 첫 장 */
export function SceneNudakeCover() {
  return (
    <SceneCase
      title="Nudake Gift"
      wordmark="NUDAKE"
      body={
        <>
          무엇을 고를지 정하고, 상자에 담고, 건네기까지 — 선물에는 몸에 익은
          순서가 있습니다.
          <br />
          <br />이 프로젝트는 그 행동 기억을 바탕으로 Nudake의 디저트를 고르고
          건네는 과정을 하나의 선물 경험으로 설계합니다.
        </>
      }
      visual={<NudakePackage />}
    />
  );
}
