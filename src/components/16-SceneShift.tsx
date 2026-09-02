"use client";

/**
 * 탬버린즈 04 — From Selection to Composition.
 *
 * 02장과 같은 판에서 시작합니다. 네 걸음이 나란히 서 있다가,
 * 잠시 뒤 뒤의 셋이 첫 자리로 미끄러져 사라지고 한 걸음만 남습니다.
 * 남은 자리에는 넷을 합친 화면이 들어섭니다.
 *
 * 핵심은 단계를 줄였다가 아니라, 구매 절차(Selection)를
 * 선물을 만드는 행동(Composition)으로 바꿨다는 선언입니다.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { TamburinsComposeScreenB } from "@/components/TamburinsComposeScreenB";
import { TamburinsGiftScreen } from "@/components/TamburinsGiftScreen";
import { TamburinsProductScreen } from "@/components/TamburinsProductScreen";
import { TamburinsBagScreen } from "@/components/TamburinsBagScreen";
import { TamburinsScentScreen } from "@/components/TamburinsScentScreen";
import { useInView } from "@/components/useInView";

/* 자리는 02장과 같은 값을 씁니다. 두 장이 같은 판으로 읽혀야 합니다. */
const COL = 158.5;
const GAP = 16;
const ROW = 110;
const SHOT_W = 2 * COL + GAP;
const STEP_X = 2 * (COL + GAP);
const BAND_H = 4 * ROW + 3 * GAP;
const CAP_H = ROW;
const CAP_UP = ROW + GAP;
const IDLE_DROP = 0;
/* 합쳐진 한 화면은 판 한가운데에 섭니다. */
const BAND_W = 8 * COL + 7 * GAP;
const CENTER_X = (BAND_W - SHOT_W) / 2;

/** 지금의 네 걸음 */
const SHOTS = [
  { screen: "Gift", step: "목록에서 세트를 고릅니다", real: "gift" },
  {
    screen: "Product",
    step: "상세로 들어가 구성을 확인합니다",
    real: "product",
  },
  {
    screen: "Scent 1 / 2",
    step: "제품 수만큼 창을 넘겨 향을 고릅니다",
    real: "scent1",
  },
  { screen: "Add to Bag", step: "고른 구성을 확인하고 담습니다", real: "bag" },
] as const;

/** 합쳐진 뒤의 한 걸음 */
const ONE = { screen: "Compose", step: "한 화면에서 고르고 그대로 담습니다" };

/* 장에 들어서고 이만큼 뒤에 합쳐집니다. */
const MERGE_AT = 1400;
/** 한 장씩 붙는 박자. 뒤에서부터 한 장씩 와서 앞장이 맨 나중에 얹힙니다. */
const BEAT = 150;
const beatOf = (i: number) => (SHOTS.length - 1 - i) * BEAT;

/* 마지막 장이 얹히고 한 박자 더 둔 뒤에 흐려집니다. */
const SETTLE_AT = (SHOTS.length - 1) * BEAT + 420 + 380;

/* 모였을 때 쌓이는 모양. 반듯하게 포개지 않고 조금씩 어긋나게 두어야
   넉 장이 겹친 것으로 읽힙니다. 맨 앞장만 반듯합니다. */
const PILE = [
  { x: 0, y: 0, turn: 0 },
  { x: -14, y: -10, turn: -3.2 },
  { x: 16, y: -16, turn: 2.6 },
  { x: 6, y: 12, turn: 5.4 },
];

const px = (value: number) => `calc(${value} * var(--u))`;

export function SceneShift() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  /* 개선 화면을 누르면 그 화면이 통째로 커지는 다음 장으로 넘어갑니다.
     여기서 목업을 만져 보다가 다음 장으로 자연스럽게 이어지게 둔 자리입니다. */
  const frame = useRef<HTMLDivElement>(null);
  const goOn = useCallback(() => {
    const here = frame.current?.closest<HTMLElement>(".section");
    const root = here?.closest<HTMLElement>(".scroll-root");
    const next = here?.nextElementSibling as HTMLElement | null;
    if (!root || !next) return;
    root.scrollTo({ top: next.offsetTop, behavior: "smooth" });
  }, []);

  /* 넷이 한 걸음으로 합쳐졌는지 */
  const [one, setOne] = useState(false);

  useEffect(() => {
    const turn = window.setTimeout(() => setOne(inView), inView ? MERGE_AT : 0);
    return () => clearTimeout(turn);
  }, [inView]);

  /* 넷이 다 모인 뒤에야 한 걸음으로 읽힙니다. 그 전에는 아무 이름도 붙이지 않습니다. */
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const done = window.setTimeout(() => setSettled(one), one ? SETTLE_AT : 0);
    return () => clearTimeout(done);
  }, [one]);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-6 row-start-1">
        From Selection
        <br />
        to Composition.
      </h2>

      <div className="steps col-start-1 col-span-8 row-start-3 row-span-4">
        {SHOTS.map((shot, i) => (
          <div
            key={`${shot.screen}-${i}`}
            className="steps-shot tall-shot merge-shot rise"
            data-gone={settled || undefined}
            style={
              {
                left: px(one ? CENTER_X + PILE[i].x : i * STEP_X),
                /* 마디가 걷히면 화면이 1행 자리까지 올라섭니다. */
                top: px(one ? PILE[i].y : 0),
                rotate: one ? `${PILE[i].turn}deg` : "0deg",
                width: px(SHOT_W),
                zIndex: SHOTS.length - i,
                "--delay": `${0.16 + i * 0.14}s`,
                transitionDelay: one ? `${beatOf(i)}ms` : "0ms",
              } as CSSProperties
            }
          >
            <div
              className="steps-cap tall-cap"
              data-dim={(!one && i > 0) || undefined}
              /* 모이는 동안에는 어느 마디도 붙지 않습니다.
                 다 모인 뒤 첫 칸에만 한 걸음으로 다시 붙습니다. */
              data-gone={one || undefined}
              style={{
                transitionDelay: one ? `${beatOf(i)}ms` : "0ms",
                height: px(CAP_H),
                top: px(IDLE_DROP - CAP_UP),
              }}
            >
              <p className="steps-no">
                {`STEP ${String(i + 1).padStart(2, "0")}`}
              </p>
              <h3 className="steps-step">{shot.screen}</h3>
              <p className="steps-kind">{shot.step}</p>
            </div>

            <div
              className="steps-frame"
              style={{
                transitionDelay: one ? `${beatOf(i)}ms` : "0ms",
                height: px(BAND_H - IDLE_DROP),
                marginTop: px(IDLE_DROP),
              }}
            >
              {/* 합쳐지기 전의 네 화면 */}
              <div className="merge-before" data-gone={settled || undefined}>
                {shot.real === "gift" && <TamburinsGiftScreen run={false} />}
                {shot.real === "product" && (
                  <TamburinsProductScreen run={false} />
                )}
                {shot.real === "scent1" && <TamburinsScentScreen run={false} />}
                {shot.real === "bag" && <TamburinsBagScreen run={false} />}
              </div>
            </div>
          </div>
        ))}

        {/* 넉 장이 흐려진 자리 위로 제안 화면이 올라섭니다.
            네 화면 중 하나가 바뀌는 것이 아니라, 새 화면이 등장합니다. */}
        <div
          className="merge-new"
          ref={frame}
          onClick={goOn}
          data-in={settled || undefined}
          style={{
            left: px(CENTER_X),
            top: 0,
            width: px(SHOT_W),
            height: px(BAND_H),
          }}
        >
          <div
            className="steps-cap tall-cap"
            style={{ height: px(CAP_H), top: px(-CAP_UP) }}
          >
            <p className="steps-no">STEP All</p>
            <h3 className="steps-step">{ONE.screen}</h3>
            <p className="steps-kind">{ONE.step}</p>
          </div>

          <div className="steps-frame">
            <TamburinsComposeScreenB auto />
          </div>
        </div>
      </div>

      <p
        className="type-body rise col-start-7 col-span-2 row-start-1"
        style={{ "--delay": "0.24s" } as CSSProperties}
      >
        여러 화면에 나뉜 선택을 하나의 선물을 구성하는 연속적인 경험으로
        재구성합니다.
      </p>
    </div>
  );
}
