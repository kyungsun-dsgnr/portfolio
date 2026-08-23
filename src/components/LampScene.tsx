"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { Knob } from "@/components/Knob";
import { useLight } from "@/components/LightStage";

/** 프레임(5칼럼 × 4행) 안에서 조명이 놓이는 위치. 빛을 여기에 맞춥니다.
 *  조명 이미지를 object-cover 로 채웠을 때의 실제 좌표에서 나온 값입니다. */
const LAMP_X = "50.2%";
const LAMP_Y = "59.9%";
/** 빛과 조명이 같은 배율로 놓이도록: 2363 / 1716 ≈ 137.8% */
const GLOW_SIZE = "137.8%";

/* ── lamp-line 자리 계산 ────────────────────────────
   lamp-line 은 조명 이미지와 같은 캔버스에서 위쪽 1080px 만 잘라낸 것이라,
   조명과 같은 배율·같은 원점에 놓아야 전선이 어긋나지 않습니다. */
const FRAME_W = 856.5; // 5칼럼
const FRAME_H = 488; // 4행
const LAMP_W = 1716;
const LAMP_H = 2147;
const LINE_H = 1080;

/** 조명은 프레임 폭에 맞춰 커지므로, 프레임 높이 대비 이만큼 커집니다. */
const LAMP_SCALED = (LAMP_H / LAMP_W) * (FRAME_W / FRAME_H);
/** object-cover 가 위아래를 똑같이 잘라내므로 위쪽으로 잘린 양 */
const CROP_TOP = (LAMP_SCALED - 1) / 2;

const LINE_STYLE = {
  top: `${-CROP_TOP * 100}%`,
  height: `${(LINE_H / LAMP_W) * (FRAME_W / FRAME_H) * 100}%`,
};

/** 프레임이 캔버스의 5/8 폭이므로 대략 이 정도로 그려집니다. */
const SIZES = "62vw";

export function LampScene() {
  const { level, setLevel } = useLight();

  return (
    <>
      <div
        className="reveal relative col-span-5 row-span-4 overflow-hidden bg-[#d5d2cd]"
        style={{ "--delay": "0.3s" } as CSSProperties}
      >
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

        {/* 4. 전선 — 빛 위로 올려 선명하게 남깁니다. */}
        <div className="absolute inset-x-0" style={LINE_STYLE}>
          <Image
            src="/images/lamp-line.png"
            alt=""
            aria-hidden
            fill
            priority
            sizes={SIZES}
            className="object-fill"
          />
        </div>
      </div>

      <div
        className="reveal col-span-3 row-span-4 overflow-hidden"
        style={{ "--delay": "0.4s" } as CSSProperties}
      >
        <Knob value={level} onChange={setLevel} />
      </div>
    </>
  );
}
