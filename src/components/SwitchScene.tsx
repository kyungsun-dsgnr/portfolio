"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { WallSwitch } from "@/components/WallSwitch";

const LAMP_X = "50.2%";
const LAMP_Y = "59.9%";
const GLOW_SIZE = "137.8%";

const SIZES = "62vw";

/** 스위치를 올리고 조명이 제 밝기에 이르기까지 */
const RISE_MS = 1500;
/** 다 밝아지고 다음 장으로 넘어가기까지 두는 사이 */
const ADVANCE_DELAY = 400;

/**
 * 1장과 같은 조명, 다른 손잡이.
 * 노브가 밝기를 다루는 자리였다면 여기는 켜고 끄는 자리라,
 * 밝기도 이 장 안에서만 씁니다(판 전체의 --light 는 건드리지 않습니다).
 * 스위치를 올리면 불이 천천히 차오르고, 100 에 이르면 다음 장으로 넘어갑니다.
 */
export function SwitchScene() {
  const [on, setOn] = useState(false);
  const [level, setLevel] = useState(0);
  const here = useRef<HTMLDivElement>(null);
  const levelRef = useRef(0);

  /* 켜짐/꺼짐 사이를 시간을 들여 건너갑니다. 미리보기 판에서는 rAF 가
     멎을 때가 있어 타이머로 굴립니다. */
  useEffect(() => {
    const from = levelRef.current;
    const to = on ? 1 : 0;
    if (from === to) return;

    /* 끌 때는 굳이 뜸을 들이지 않습니다. */
    const span = on ? RISE_MS * (1 - from) : 420 * from;
    const began = performance.now();
    const tick = window.setInterval(() => {
      const gone =
        span > 0 ? Math.min(1, (performance.now() - began) / span) : 1;
      const next = from + (to - from) * gone;
      levelRef.current = next;
      setLevel(next);
      if (gone >= 1) window.clearInterval(tick);
    }, 16);

    return () => window.clearInterval(tick);
  }, [on]);

  /* 다 차오르면 다음 장으로 넘깁니다. */
  useEffect(() => {
    if (level < 1) return;
    const go = window.setTimeout(() => {
      const section = here.current?.closest(".section");
      const next = section?.nextElementSibling;
      if (!(next instanceof HTMLElement)) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      next.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }, ADVANCE_DELAY);
    return () => clearTimeout(go);
  }, [level]);

  return (
    <>
      <div
        ref={here}
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
        /* 조명이 꺼져 있는 만큼 이 판도 함께 어둡습니다. */
        style={{ "--delay": "0.4s", "--dim": 1 - level } as CSSProperties}
      >
        <WallSwitch on={on} onChange={setOn} />

        {/* 손이 가야 할 자리를 스위치 바로 아래에서 일러 줍니다.
            한 번 켜고 나면 할 말을 다한 셈이라 물러납니다. */}
        <p className="switch-note" data-gone={on || undefined}>
          Turn on the light
        </p>
      </div>
    </>
  );
}
