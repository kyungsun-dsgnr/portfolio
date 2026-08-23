"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { Knob } from "@/components/Knob";
import { useLight } from "@/components/LightStage";

const LAMP_X = "50.2%";
const LAMP_Y = "59.9%";
const GLOW_SIZE = "137.8%";

const FRAME_W = 856.5;
const FRAME_H = 488;
const LAMP_W = 1716;
const LAMP_H = 2147;
const LINE_H = 1080;

const LAMP_SCALED = (LAMP_H / LAMP_W) * (FRAME_W / FRAME_H);
const CROP_TOP = (LAMP_SCALED - 1) / 2;

const LINE_STYLE = {
  top: `${-CROP_TOP * 100}%`,
  height: `${(LINE_H / LAMP_W) * (FRAME_W / FRAME_H) * 100}%`,
};

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

        {/* 4. 전선: level, glow, lamp-on opacity와 완전히 분리된 최상단 레이어 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-[999] opacity-100 mix-blend-normal"
          style={LINE_STYLE as CSSProperties}
        >
          <Image
            src="/images/lamp-line.png"
            alt=""
            fill
            priority
            sizes={SIZES}
            className="object-fill opacity-100"
            style={{
              opacity: 1,
              mixBlendMode: "normal",
              filter: "contrast(1.15)",
            }}
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
