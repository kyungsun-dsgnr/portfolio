"use client";

import Image from "next/image";
import { useState } from "react";

import { Knob } from "@/components/Knob";

/** 프레임(5칼럼 × 4행) 안에서 조명이 놓이는 위치. 빛을 여기에 맞춥니다.
 *  불꺼진 조명 이미지(858×1074)를 object-cover 로 채웠을 때의 실제 좌표에서 나온 값입니다. */
const LAMP_X = "50.2%";
const LAMP_Y = "59.9%";
/** 빛(1182px)과 조명(858px)이 같은 배율로 놓이도록: 1182 / 858 ≈ 137.8% */
const GLOW_SIZE = "137.8%";

/** 프레임이 캔버스의 5/8 폭이므로 대략 이 정도로 그려집니다. */
const SIZES = "62vw";

export function LampScene() {
  // 0 = 꺼짐, 1 = 최대 밝기. 우측 노브가 이 값을 움직입니다.
  const [level, setLevel] = useState(0);

  return (
    <>
      <div className="relative col-span-5 row-span-4 overflow-hidden bg-[#d5d2cd]">
        {/* 1. 꺼진 조명 — 항상 보임 */}
        <Image
          src="/images/lamp-off.png"
          alt="천장에 매달린 조명"
          fill
          priority
          sizes={SIZES}
          className="object-cover"
        />

        {/* 2. 빛 — 조명 위치에 맞춰 얹습니다 */}
        <div
          aria-hidden
          className="pointer-events-none absolute aspect-square -translate-x-1/2 -translate-y-1/2"
          style={{ left: LAMP_X, top: LAMP_Y, width: GLOW_SIZE, opacity: level }}
        >
          <Image
            src="/images/glow.png"
            alt=""
            fill
            priority
            sizes={SIZES}
            className="object-contain"
          />
        </div>

        {/* 3. 켜진 조명 */}
        <Image
          src="/images/lamp-on.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes={SIZES}
          className="object-cover"
          style={{ opacity: level }}
        />
      </div>

      <div className="col-span-3 row-span-4 overflow-hidden">
        <Knob value={level} onChange={setLevel} />
      </div>

    </>
  );
}
