"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

import { Knob } from "@/components/Knob";
import { useLight } from "@/components/LightStage";

const LAMP_X = "50.2%";
const LAMP_Y = "59.9%";
const GLOW_SIZE = "137.8%";

const SIZES = "62vw";

/* 손이 닿기 전에 한 번 보여 줍니다. 노브가 스스로 15° 만 돌아 불이 조금 들어오고
   그대로 멈춥니다. 말로 설명하는 것보다 한 번 보는 편이 빠릅니다. */
const SHOW_AT = 1000;
/** 한 바퀴가 100% 이므로 15° 는 이만큼입니다. */
const SHOW_TO = 15 / 360;
const SHOW_TURN = 900;

export function LampScene() {
  const { level, setLevel } = useLight();

  /* 사람이 한 번이라도 돌렸으면 시연하지 않습니다. */
  const touched = useRef(false);
  const shown = useRef(false);

  const turn = useRef(setLevel);
  useEffect(() => {
    turn.current = setLevel;
  }, [setLevel]);

  useEffect(() => {
    if (shown.current) return;
    let frame = 0;

    /* 0 에서 살짝 돌렸다가 되돌아옵니다. */
    function run(from: number, to: number, ms: number, then?: () => void) {
      const began = performance.now();
      window.clearInterval(frame);
      frame = window.setInterval(() => {
        if (touched.current) {
          window.clearInterval(frame);
          return;
        }
        const gone = Math.min(1, (performance.now() - began) / ms);
        const eased = 1 - Math.pow(1 - gone, 3);
        turn.current(from + (to - from) * eased);
        if (gone >= 1) {
          window.clearInterval(frame);
          then?.();
        }
      }, 16);
    }

    const start = window.setTimeout(() => {
      if (touched.current) return;
      shown.current = true;
      run(0, SHOW_TO, SHOW_TURN);
    }, SHOW_AT);

    return () => {
      clearTimeout(start);
      window.clearInterval(frame);
    };
  }, []);

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
        className="reveal relative col-span-3 row-span-4 overflow-hidden"
        style={{ "--delay": "0.4s" } as CSSProperties}
      >
        <Knob
          value={level}
          onChange={(next) => {
            touched.current = true;
            setLevel(next);
          }}
        />
      </div>
    </>
  );
}
