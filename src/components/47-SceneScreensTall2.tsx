"use client";

/**
 * 15장의 다른 판.
 * 화면 넷이 모두 3행에서 시작해 마지막 행까지 내려가고,
 * 마디는 그 마지막 행 위에 얹혀 화면이 아래로 갈수록 흰빛에 잠깁니다.
 */

/* 17장을 그대로 복제한 장입니다 — 두 번째 판에서만 서고,
   여기서 판을 흔들어 봅니다. 원본은 건드리지 않습니다. */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { TamburinsGiftScreen } from "@/components/TamburinsGiftScreen";
import { TamburinsProductScreen } from "@/components/TamburinsProductScreen";
import { TamburinsBagScreen } from "@/components/TamburinsBagScreen";
import { TamburinsScentScreen } from "@/components/TamburinsScentScreen";
import { useCopy } from "@/components/copy";
import { useInView } from "@/components/useInView";

const COL = 158.5;
const GAP = 16;
/** 화면 하나. 두 단 폭입니다. */
const SHOT_W = 2 * COL + GAP;
/** 한 걸음 옮길 때마다 오른쪽으로 두 단 */
const STEP_X = 2 * (COL + GAP);
const ROW = 110;
/** 2행부터 6행 끝까지가 이 판입니다 — 원본보다 한 행 위에서 시작합니다. */
const BAND_H = 5 * ROW + 4 * GAP;
/* 이 판에서는 마디가 화면 위에 얹히므로 따로 자리를 잡지 않습니다. */
const SHOT_H = BAND_H;
/* 도는 화면은 다섯 행. 물러났을 때 몇 행을 남길지는 화면마다 따로 정합니다.
   바닥은 어느 쪽이든 마지막 행 끝에 맞춥니다. */
const FULL_ROWS = 5;
const drop = (rows: number) => (FULL_ROWS - rows) * (ROW + GAP);

/* 한 화면이 제 과정을 마친 뒤 다음으로 넘어가기까지 더 두는 사이.
   과정이 끝나자마자 넘어가면 결과를 볼 틈이 없습니다. */
const HOLD = 1800;

/* span 은 그 화면이 제 과정을 마치고 다음으로 넘어가기까지의 시간입니다.
   잇는 선이 그동안 왼쪽에서 오른쪽으로 차오릅니다. */
const SHOTS: {
  screen: string;
  step: string;
  real: "gift" | "product" | "scent1" | "bag";
  span: number;
  /** 물러났을 때 남기는 행 수 */
  idleRows: number;
}[] = [
  {
    screen: "Gift",
    step: "목록에서 세트를 고릅니다",
    real: "gift",
    span: 4300 + HOLD,
    idleRows: 3,
  },
  {
    screen: "Product",
    step: "상세로 들어가 구성을 확인합니다",
    real: "product",
    span: 3200 + HOLD,
    idleRows: 3,
  },
  {
    screen: "Scent 1 / 2",
    step: "제품 수만큼 창을 넘겨 향을 고릅니다",
    real: "scent1",
    span: 8000 + HOLD,
    /* 향 선택 창은 물러나 있어도 한 행 더 보입니다. */
    idleRows: 4,
  },
  {
    screen: "Add to Bag",
    step: "고른 구성을 확인하고 담습니다",
    real: "bag",
    span: 3800 + HOLD,
    idleRows: 3,
  },
];

const px = (value: number) => `calc(${value} * var(--u))`;

export function SceneScreensTall2({
  title,
  still,
  merge,
}: {
  /** 판을 그대로 쓰면서 제목만 바꿔 다는 장이 있습니다. */
  title?: ReactNode;
  /** 넷 다 물러난 채로 세워 둡니다. 아무것도 돌지 않습니다. */
  still?: boolean;
  /** 물러난 넷이 잠시 뒤 첫 자리로 모여 한 장으로 겹칩니다. */
  merge?: boolean;
} = {}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const { c } = useCopy();
  const [scentStep, setScentStep] = useState<1 | 2>(1);
  const onStep = useCallback((step: 1 | 2) => setScentStep(step), []);

  /* 저 혼자 돌지 않습니다. 제목 끝의 재생을 눌러야 첫 화면부터 훑습니다. */
  const [playing, setPlaying] = useState(false);
  /** 손으로 하나만 골라 둔 것. 재생과 따로 놉니다. */
  const [solo, setSolo] = useState<number | null>(null);

  const [active, setActive] = useState(0);
  const at = useRef(0);
  const [plays, setPlays] = useState<number[]>(() => SHOTS.map(() => 0));

  const start = useCallback((to: number) => {
    at.current = to;
    setActive(to);
    if (to === 2) setScentStep(1);
    setPlays((seen) => seen.map((n, i) => (i === to ? n + 1 : n)));
  }, []);

  /** 처음 화면으로 돌려 놓습니다. */
  const rewind = useCallback(() => {
    at.current = 0;
    setActive(0);
    setScentStep(1);
    setPlays((seen) => seen.map((n) => n + 1));
  }, []);

  const play = useCallback(() => {
    setPlaying(true);
    setSolo(null);
    start(0);
  }, [start]);

  const stop = useCallback(() => {
    setPlaying(false);
    setSolo(null);
    rewind();
  }, [rewind]);

  /* 화면을 누르면 처음부터 다시 돌지 않고 그 화면만 섭니다. */
  const pick = useCallback((to: number) => {
    setPlaying(false);
    setSolo((now) => (now === to ? null : to));
    at.current = to;
    setActive(to);
    if (to === 2) setScentStep(1);
    setPlays((seen) => seen.map((n, i) => (i === to ? n + 1 : n)));
  }, []);

  useEffect(() => {
    if (inView) return;
    const back = window.setTimeout(() => {
      setPlaying(false);
      setSolo(null);
      rewind();
    }, 0);
    return () => clearTimeout(back);
  }, [inView, rewind]);

  /* 끝난 화면을 잠시 그대로 두었다가 다음 걸음으로 넘어갑니다. */
  const holdTimer = useRef(0);
  const advance = useCallback(
    (from: number) => {
      if (at.current !== from) return;
      /* 손으로 고른 한 장은 그 자리에 머뭅니다. 이어 넘기지 않습니다. */
      if (!playing) return;
      window.clearTimeout(holdTimer.current);
      holdTimer.current = window.setTimeout(() => {
        if (at.current !== from) return;
        /* 마지막 화면까지 다 보여 주면 멈추고 처음으로 돌아갑니다. */
        if (from + 1 >= SHOTS.length) {
          setPlaying(false);
          rewind();
          return;
        }
        start(from + 1);
      }, HOLD);
    },
    [start, rewind, playing],
  );

  useEffect(() => () => window.clearTimeout(holdTimer.current), []);

  /* 물러난 판에서는 어느 칸도 차례를 갖지 않습니다. */
  const live = still ? -1 : playing ? active : (solo ?? -1);

  /* 넷이 한 자리로 모입니다. 장에 들어서고 한 박자 뒤에 움직입니다. */
  const [merged, setMerged] = useState(false);

  useEffect(() => {
    if (!merge) return;
    const move = window.setTimeout(() => setMerged(inView), inView ? 900 : 0);
    return () => clearTimeout(move);
  }, [merge, inView]);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-6 row-start-1">
        {title ?? c("One gift, across multiple screens")}

        {/* 순서대로 훑어 보여 주는 장치. 제목 바로 아래, 왼쪽 끝에 줄을 맞춰 섭니다.
          도는 동안에는 멈춤 단추가 됩니다. */}
        {still ? null : (
          <button
            type="button"
            className="store-play store-play-block"
            data-playing={playing || undefined}
            aria-label={playing ? "훑기 멈추기" : "화면 훑어 보기"}
            onClick={playing ? stop : play}
          >
            <span className="store-play-key">
              <svg viewBox="0 0 24 24" aria-hidden>
                {playing ? (
                  <rect x="5" y="5" width="14" height="14" />
                ) : (
                  <path d="M8 5 19 12 8 19 Z" />
                )}
              </svg>
            </span>

            <span className="store-play-tip" data-side="right" aria-hidden>
              {playing ? "Stop" : "Play"}
            </span>
          </button>
        )}
      </h2>

      <div className="steps col-start-1 col-span-8 row-start-2 row-span-5">
        {SHOTS.map((shot, i) => (
          <div
            key={`${shot.screen}-${i}`}
            className="steps-shot tall-shot rise"
            /* 재생 전에는 넷 다 또렷하게 둡니다. */
            data-idle={
              ((still || playing || solo !== null) && live !== i) || undefined
            }
            role="button"
            tabIndex={0}
            onClick={still ? undefined : () => pick(i)}
            onKeyDown={(event) => {
              if (still) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                pick(i);
              }
            }}
            style={
              {
                /* 모일 때는 첫 자리로 미끄러지되, 뒤로 갈수록 조금씩 어긋나
                   넉 장이 겹친 자국이 남습니다. */
                left: px(merged ? i * 9 : i * STEP_X),
                top: 0,
                zIndex: merged ? SHOTS.length - i : undefined,
                width: px(SHOT_W),
                "--delay": `${0.16 + i * 0.14}s`,
                transitionDelay: merged ? `${i * 90}ms` : "0ms",
              } as CSSProperties
            }
          >
            <div
              className="steps-frame"
              style={{
                height: px(live === i ? SHOT_H : SHOT_H - drop(shot.idleRows)),
                marginTop: px(live === i ? 0 : drop(shot.idleRows)),
              }}
            >
              {shot.real === "gift" && (
                <TamburinsGiftScreen
                  key={plays[i]}
                  run={inView && live === i}
                  onDone={() => advance(i)}
                />
              )}
              {shot.real === "product" && (
                <TamburinsProductScreen
                  key={plays[i]}
                  run={inView && live === i}
                  onDone={() => advance(i)}
                />
              )}
              {shot.real === "scent1" && (
                <TamburinsScentScreen
                  key={plays[i]}
                  onStep={onStep}
                  run={inView && live === i}
                  onDone={() => advance(i)}
                />
              )}
              {shot.real === "bag" && (
                <TamburinsBagScreen key={plays[i]} run={inView && live === i} />
              )}

              {/* 마디는 화면 아래쪽에 옅은 판으로 얹힙니다 —
                `Already There, Just Not Visible` 의 글판과 같은 결입니다. */}
              <div
                className="steps-cap tall-cap-over"
                /* 재생 전에는 다 또렷하고, 하나가 서면 나머지 글이 물러납니다. */
                data-dim={(live >= 0 && i !== live) || undefined}
              >
                <p className="steps-no">
                  {`STEP ${String(i + 1).padStart(2, "0")}`}
                  {i < SHOTS.length - 1 && (
                    <i
                      /* 다시 볼 때마다 처음부터 차오르도록 새로 답니다. */
                      key={plays[i]}
                      data-run={live === i || undefined}
                      data-gone={
                        !playing || (!still && active > i) || undefined
                      }
                      style={{ "--fill-ms": `${shot.span}ms` } as CSSProperties}
                      aria-hidden
                    />
                  )}
                </p>
                <h3 className="steps-step">
                  {shot.real === "scent1"
                    ? `Scent ${scentStep} / 2`
                    : shot.screen}
                </h3>
                <p className="steps-kind">{shot.step}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p
        className="type-body rise col-start-7 col-span-2 row-start-1"
        style={{ "--delay": "0.24s" } as CSSProperties}
      >
        세트 구성과 향 선택이 서로 다른 화면에 나뉘어 순차적으로 진행됩니다.
      </p>
    </div>
  );
}
