"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { Knob } from "@/components/Knob";
import { useLight } from "@/components/LightStage";

const LAMP_X = "50.2%";
const LAMP_Y = "59.9%";
const GLOW_SIZE = "137.8%";

const SIZES = "62vw";

export function LampScene() {
  const { level, setLevel } = useLight();

  return (
    <>
      <div
        className="reveal relative isolate col-span-5 row-span-4 overflow-hidden bg-[#d5d2cd]"
        style={{ "--delay": "0.3s" } as CSSProperties}
      >
        {/* 1. 꺼진 조명 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/lamp-off.png"
            alt="천장에 매달린 조명"
            fill
            priority
            sizes={SIZES}
            className="object-cover"
          />
        </div>

        {/* 2. 빛 */}
        <div
          aria-hidden
          className="pointer-events-none absolute z-10 aspect-square -translate-x-1/2 -translate-y-1/2"
          style={{
            left: LAMP_X,
            top: LAMP_Y,
            width: GLOW_SIZE,
            opacity: level,
          }}
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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          style={{ opacity: level }}
        >
          <Image
            src="/images/lamp-on.png"
            alt=""
            fill
            priority
            sizes={SIZES}
            className="object-cover"
          />
        </div>

        {/* 4. 전선 — 맨 위 레이어. 밝기(level)와 무관하게 항상 불투명합니다.
            조명 이미지와 크기가 같아 같은 방식으로 얹으면 정확히 겹칩니다. */}
        <div className="pointer-events-none absolute inset-0 z-30" aria-hidden>
          <Image
            src="/images/lamp-line.png"
            alt=""
            fill
            priority
            sizes={SIZES}
            className="object-cover"
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
